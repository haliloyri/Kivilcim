# Hikâye etiketleme (Öncelik 1: Reels skoru + tema)

Amaç: tüm hikâyeleri her seferinde aynı ölçütle, çevrimdışı ve sıfır maliyetle etiketlemek.
Önce 80 hikâyeyi elle etiketle, sonra yerel model (Laya) aynı kararları veriyor mu ölç.
Uyum yeterliyse tüm veritabanına çalıştır.

Şema, rubrik ve tema listesi tek yerde: [scripts/tagging/schema.mjs](../../scripts/tagging/schema.mjs).
Bir şeyi değiştireceksen orada değiştir; prompt ve değerlendirme oradan okur.

## Akış

```bash
npm run tag:export                     # 1. örneklemi çıkar -> staging/tagging/gold/
                                       # 2. reading.md'yi oku, labels.csv'yi doldur
npm run tag:check                      # 3. doldurulan satırları doğrula
npm run tag:laya -- --dump             # 4a. Laya'nın ham çıktısını 1 hikâyede gör
npm run tag:laya                       # 4b. 80 hikâyeyi etiketle -> gold/predictions.laya.jsonl
npm run tag:eval -- --pred laya        # 5. uyumu ölç -> gold/report.laya.md
```

Laya kurulumu (bir kez, repo kökünde; ilk çalıştırmada model Hugging Face'ten iner):

```bash
python3 -m venv .venv-laya && .venv-laya/bin/pip install laya
```

- `tag:export` aynı `--seed` ile hep aynı hikâyeleri seçer; kitap kategorisine göre orantılı.
  Var olan `labels.csv` dosyasının üzerine yazmaz (`--force` hariç).
- Laya ([convaiinnovations/laya](https://huggingface.co/convaiinnovations/laya)) sohbet modeli değil,
  yazı üretmez. Tipli sorulara olasılıkla cevap verir. Sorular `gold/laya-questions.json` içinde
  (kaynağı `schema.mjs` → `LAYA_QUESTIONS`):
  - `fit_45s`, `hook`, `visual`: `score` sorusu, 5 seviye → 1-5.
  - `primary_theme`: `choice` sorusu, 14 tema.
  - `secondary_themes`: Laya çoklu etiket vermez; ana temadan sonraki en olası 2 tema,
    olasılığı `--secondary-min` (0.15) üstündeyse.
- Türkçe için `multilingual` (mmBERT, 322M) checkpoint'i kullanılır. Hikâyeler uzun olduğu için
  `--max-len 2048`; kesilen hikâye sayısı çıktıda yazar.
- Her soru ayrı çalışır; seçenek metinleri kısa ve İngilizce, çünkü Laya'da seçeneklerin token bütçesi küçük.
- `tag:run-chat` aynı işi OpenAI uyumlu bir sohbet modeliyle yapar (karşılaştırma için).
- Tüm veritabanı için: `npm run tag:export -- --all --set full`, sonra `npm run tag:laya -- --set full`.

## Laya'dan beklenti

Model kartına göre temel checkpoint'ler, ince ayar yapılmadan tipli kararlarda şansa yakın
(0.36 doğruluk), en zayıf soru tipi de `score` (sıralı). İlk ölçüm büyük ihtimalle NO-GO çıkar;
bu beklenen sonuç. Sonraki adım ince ayar (`laya.train.finetune`, `{state, questions, expected}`
JSONL). Bunun için el etiketi sayısını ~300'e çıkar, ölçümü ince ayarda görülmemiş 80 hikâyede yap.

## İnce ayar (fine-tune)

Hazır Laya bu işte NO-GO çıktı (gold/report.laya.md). İnce ayar akışı:

```bash
npm run tag:export -- --n 300 --seed 2 --set train --exclude gold   # 1. gold ile çakışmayan 300 hikâye (hazır)
                                       # 2. train/labels.csv dosyasını doldur (gold ile aynı kurallar)
npm run tag:finetune -- --dry-run      # 3. veri kontrolü, eğitim yok
npm run tag:finetune                   # 4. eğitim -> models/laya-albor/ (git dışı)
npm run tag:laya -- --model models/laya-albor --subfolder '' --name laya-albor
npm run tag:eval -- --pred laya-albor  # 5. gold'da (eğitimde görülmemiş 80 hikâye) ölç
```

- Hedefler yumuşak: skorlarda etiketli seviyeye 0.7, komşulara 0.15; temada ana temaya 0.7,
  yan temalara toplam 0.3. Model böylece sırayı ve ikinci tercihleri de öğrenir.
- Apple M5, 24 GB: `micro_batch 1`, `grad_accum 16`, `max_len 1536`, gradient checkpointing.
  `micro_batch 4` MPS belleğini aştı. Hikâyelerin %90'ı 1386 token altında.
- Süre: deneme ~3,3 sn/öğe ölçüldü. 300 hikâye × 4 soru × 4 epoch ≈ 4 saat; geceye bırak.
- GO çıkarsa: `npm run tag:laya -- --set full --model models/laya-albor --subfolder '' --name laya-albor`,
  sonra `npm run tag:build -- --pred laya-albor`.

## Kalibrasyon önerisi

Modelin tutarlılığını yorumlamak için insan-insan uyumunu bil. İkinci bir kişi (ya da sen, bir hafta sonra)
`labels.csv` kopyasını (`labels.second.csv`) doldurursa:

```bash
npm run tag:eval -- --pred staging/tagging/gold/labels.second.csv
```

Model, insan-insan uyumuna yakınsa yeterince iyidir. Çıta değerleri `evaluate.mjs` içinde (`BARS`).

## labels.csv sütunları

| Sütun | Değer |
|---|---|
| `fit_45s`, `hook`, `visual` | 1-5 tam sayı |
| `primary_theme` | aşağıdaki anahtarlardan tam olarak 1 |
| `secondary_themes` | 0-2 anahtar, `;` ya da `,` ile ayrılmış |
| `note` | serbest, değerlendirmeye girmez |

`words` ve `est_sec` (tahmini okuma süresi) sadece ipucu; `fit_45s` metnin uzunluğu değil,
ana fikrin 45 saniyelik videoya sığıp sığmadığıdır.

## Rubrik

### fit_45s — 45 saniyeye sığar mı
1. Ana fikir birden çok adım/kavram ister; 45 sn'de anlam kaybolur.
2. Ancak ağır kırpmayla sığar; bağlam eksik kalır.
3. Tek ana fikir var ama giriş/bağlam 10-15 sn yer.
4. Tek fikir + tek örnek, küçük kırpmayla sığar.
5. Tek çarpıcı fikir; 30-45 sn'de eksiksiz anlatılır.

### hook — güçlü açılış kancası
1. İlk 3 sn'ye konacak merak/şaşırtma yok (tanım, genel giriş).
2. Konu ilginç ama açılış cümlesi düz.
3. Bir soru ya da karşıtlık var, yeniden yazınca işe yarar.
4. Şaşırtıcı iddia, rakam ya da sahne; neredeyse hazır.
5. İlk cümle tek başına kaydırmayı durdurur.

### visual — görselleştirilebilir mi
1. Tamamen soyut; ekranda sadece metin olur.
2. Soyut, bir benzetmeyle zorlanarak görselleşir.
3. Bir nesne/kişi/yer var ama hikâyenin merkezinde değil.
4. Somut sahne ya da deney; 2-3 planla anlatılır.
5. Hikâye bir sahne dizisi; sesi kapatsan da anlaşılır.

Birleşik Reels skoru kodla hesaplanır: `0.4·hook + 0.3·visual + 0.3·fit_45s`.

### Temalar
Kitabın kategorisine değil, okurun bu hikâyeden geliştireceği beceriye bak.

| Anahtar | Tema | İpucu |
|---|---|---|
| `leadership` | Liderlik | ekip yönetme, yetki devri, vizyon, kültür kurma |
| `communication` | İletişim | dinleme, anlatma, geri bildirim, zor konuşma |
| `influence` | İkna ve müzakere | pazarlık, ikna, satış, etki |
| `relationships` | İlişkiler ve empati | aile, partner, arkadaşlık, güven |
| `decision_making` | Karar verme | seçim, risk, önyargılar, olasılık |
| `thinking` | Düşünme ve zihinsel modeller | mantık, sistem düşüncesi, öğrenme |
| `resilience` | Direnç | zorluk, başarısızlık, toparlanma, cesaret |
| `emotions` | Duygular ve öz farkındalık | öfke, kaygı, stres, öz şefkat |
| `habits` | Alışkanlık ve disiplin | irade, rutin, davranış değişimi |
| `focus` | Odak ve verimlilik | derin çalışma, zaman, dikkat |
| `creativity` | Yaratıcılık ve yenilik | fikir üretme, deneme, icat |
| `money_career` | Para ve kariyer | finans, girişim, iş hayatı, strateji |
| `health` | Sağlık ve beden | uyku, beslenme, beyin, egzersiz |
| `meaning` | Anlam ve değerler | amaç, felsefe, etik, mutluluk |
