# Başka bilgisayarda / başka modelle hikâye üretimi ve DB'ye yazma rehberi

Bu rehber, Albor'daki P1 (podcast tarzı) hikâyelerini ve "Sohbette kullan"
içeriklerini **başka bir bilgisayarda, başka bir modelle** (Codex, GPT, Gemini,
Sonnet vb.) üretmek ve sonra uygulamanın veritabanına (`assets/albor.db`)
yazmak için gereken adımları anlatır.

Ana fikir: üretim (model işi) ile DB'ye yazma (kritik iş) **ayrı ayrı** yapılır.
Model sadece `staging/` altına metin dosyası üretir. DB'ye yazma, dosyalar
kontrol edildikten sonra tek bir bilgisayarda yapılır.

---

## 0. Büyük resim

```
manifest.json ──► [1] girdileri dışa aktar ──► [2] brief üret (model)
                                                    │
                                                    ▼
                      [3] 4 dilde hikâye + variants üret (model)
                                                    │
                                                    ▼
                      [4] doğrula (validate-dir) ──► [5] insan kontrolü
                                                    │
                                                    ▼
          [6] staging/p1/<dil>/ içine taşı ──► [7] publish-local ──► DB + DB_VERSION
                                                    │
                                                    ▼
                                   [8] (isteğe bağlı) Supabase import
```

| Aşama | Nerede yapılır | Kim |
|---|---|---|
| 1–5 | Diğer bilgisayar | Model + sen |
| 6–8 | Ana bilgisayar (önerilir) | Sen, elle |

`assets/albor.db` ikili (binary) bir dosya ve git'te takip ediliyor. İki
bilgisayarda aynı anda DB yazarsan git'te birleştirilemeyen çakışma çıkar,
`DB_VERSION` numarası da çakışır. Bu yüzden diğer bilgisayardan sadece
`staging/` dosyalarını getir; DB'ye yazmayı tek yerde yap.

---

## 1. Diğer bilgisayarın hazırlığı

1. Repoyu klonla ve güncel `main`'i çek. `staging/p1/manifest.json` ve
   `batch/` klasörü repoda olmalı.
2. **Node.js ≥ 22.5** kur. `publish-local.mjs` yerleşik `node:sqlite` kullanır;
   aynı sürümü her yerde kullanmak en güvenlisi.
   ```bash
   node -v
   ```
3. `npm install` gerekmez. Bu script'ler ek paket istemez.
4. Bu aşamada API anahtarı, Supabase anahtarı veya `.env.local` **gerekmez**.
   Model kendi arayüzünde (sohbet/IDE) çalışır. Anahtarları o bilgisayara
   kopyalama.

---

## 2. Hangi hikâyeler eksik?

İlerleme raporu ücretsizdir, API çağırmaz:

```bash
node batch/07-status.mjs en --list      # İngilizce: yazılmış / DB'de / kalan id'ler
node batch/07-status.mjs tr --list
```

Ayrıntı: `staging/p1/status-<dil>.csv`. Başka modele vereceğin id'leri buradan
seç. Bir seferde 5-10 hikâye ver; model uzun listelerde kaliteyi düşürür.

> Kural: `staging/p1/brief/` ve `staging/p1/<dil>/` içinde zaten dosyası olan
> id'yi yeniden üretme. Batch hattı o id'leri atlıyor, sen de atla.

---

## 3. Girdileri dışa aktar

Batch hattının modele gönderdiği girdilerin aynısı üretilir. Hiçbir API'ye
istek atılmaz.

```bash
node batch/08-export-agent-inputs.mjs en 1707 1731 --out staging/p1-<model>
```

`<model>` yerine çalışan modelin adını yaz (ör. `staging/p1-codex`,
`staging/p1-gpt`). Çıktı `staging/p1-<model>/inputs/` içine yazılır:

| Dosya | Ne işe yarar |
|---|---|
| `brief-system.md` | Brief adımının **sistem talimatı** |
| `<id>.brief-user.md` | Brief adımının **kullanıcı mesajı** (kitap, yazar, mevcut kaynak metin) |
| `story-system.<dil>.md` | Hikâye adımının **sistem talimatı** (dil, hitap, yasaklı kalıplar, kelime aralıkları doldurulmuş) |

Her dil için komutu ayrı çalıştır, çünkü `story-system.<dil>.md` dile göre
dolduruluyor:

```bash
for L in en tr es de; do
  node batch/08-export-agent-inputs.mjs $L 1707 1731 --out staging/p1-<model>
done
```

Bu klasörü (`staging/p1-<model>/`) modele gösterebilecek şekilde tut. Model
repoya erişemiyorsa sadece `inputs/` içindeki dosyaları yapıştır.

---

## 4. Brief üret (1. model çağrısı)

Brief, hikâyenin tek doğruluk kaynağıdır: olgular, isimler, tarihler, sayılar.

- **Sistem talimatı:** `inputs/brief-system.md`
- **Kullanıcı mesajı:** `inputs/<id>.brief-user.md`
- **Çıktı:** tek bir JSON nesnesi. Kod bloğu (` ``` `) olmadan.
- **Kaydet:** `staging/p1-<model>/brief/<id>.json`

Modelin elinde kitabın kendisi yok, sadece mevcut kaynak metin var. Brief'e
şu kuralları uygulat:

- Kitapta olmayan anekdot, alıntı, sayı veya isim uydurma.
- `confidence` alanını dürüst doldur. Kitap az bilgi veriyorsa `low` yaz.
- `confidence` değeri `low` olan brief'leri yazım adımından önce **sen oku**:
  ```bash
  grep -l '"confidence": "low"' staging/p1-<model>/brief/*.json
  ```

---

## 5. Hikâye + variants üret (2. model çağrısı)

Her dil için ayrı çağrı (veya modelin kaldırdığı kadarı bir arada):

- **Sistem talimatı:** `inputs/story-system.<dil>.md`
- **Kullanıcı mesajı:** brief JSON'unun kendisi (`brief/<id>.json` içeriği)
- **Diller:** `en`, `tr`, `es`, `de`. Dört dil de tamamlanmadan hikâye bitmiş
  sayılmaz. Her dil o dilin ana konuşuru gibi yazılmalı, kelimesi kelimesine
  çeviri olmamalı.

Model tam olarak iki kod bloğu döndürmeli:

````
```story
[[open]]
...
```

```variants
{"punchline": "...", "thirty_sec": "...", "question": "", "key_contrast": "..."}
```
````

Kaydet:

| Blok | Dosya |
|---|---|
| ` ```story ` içeriği | `staging/p1-<model>/<dil>/<id>.md` |
| ` ```variants ` içeriği | `staging/p1-<model>/<dil>/<id>.variants.json` |

Kod çitlerini (` ``` `) dosyaya yazma, sadece blok gövdesini yaz.

### Format kuralları (kısa özet)

Tam metin: `batch/prompts/story-instructions.md`, özellikle
"Lesson and question rules" bölümü. Model bunları sistem talimatından zaten
alır. Kontrol ederken şunlara bak:

- Bölümler sırayla: `[[open]]`, `[[story]]`, `[[lessons]]`, `[[reflect]]`,
  `[[use]]`, `[[pocket]]`.
- **Tam 1 ders** (`$$...$$`, kalın başlık + 3-4 tam cümle) ve **tam 1 soru**
  (`&&...&&`). Madde işaretli reflect yok.
- **Tam 3 `[[use]]` kartı.** Her kart şu şekilde başlar (`context:` öneki
  harfi harfine olmalı, uygulama ayrıştırıcısı buna bakıyor):
  `%%context:<meeting|oneonone|family|social|self> | durum :: "söylenecek cümle"%%`
- `variants.json` içinde tam olarak dört anahtar: `punchline`, `thirty_sec`,
  `question`, `key_contrast`. `question` değeri boş string `""` olmalı
  (uygulamada artık gösterilmiyor).
- Hikâye, toplam metnin en az %50'si olmalı.
- Kelime aralıkları (İngilizce örnek): hikâye 340-520, toplam 650-950. Diğer
  diller `scripts/p1/validate.mjs` içindeki `RANGES` tablosunda.
- Yapay zekâ kalıpları yasak: "Imagine…" ile açılış, "X değil, Y" kalıbının
  tekrarı, süslü metaforlar, ahlak dersi cümlesiyle bitirmek.

Çıktı örneği için bir mevcut hikâyeye bak:
`staging/p1/en/1059.md` ve `staging/p1/en/1059.variants.json`.

---

## 6. Doğrula

Her dil için çalıştır:

```bash
node scripts/p1/validate-dir.mjs en staging/p1-<model>/en 1707 1731
node scripts/p1/validate-dir.mjs tr staging/p1-<model>/tr 1707 1731
node scripts/p1/validate-dir.mjs es staging/p1-<model>/es 1707 1731
node scripts/p1/validate-dir.mjs de staging/p1-<model>/de 1707 1731
```

Çıktının son satırı `N/N passed` olmalı. `FAIL` veren id'yi modele geri ver,
hata satırlarını (`✗ ...`) olduğu gibi yapıştır.

Makine kokusu (AI-tell) kontrolü, `validate.mjs` içinde zaten çalışır.
`staging/p1/<dil>/` içindeki dosyalar için ayrıca:

```bash
node scripts/p1/ai-tells.mjs en 1707 1731
```

Hedef: 100 kelimede 0.7'nin altında. Yapay zekâ kalıbı **hata**, geri kalanı
**uyarı** sayılır.

---

## 7. İnsan kontrolü (atlama)

Doğrulayıcı biçimi ve kuralları kontrol eder, olguları kontrol etmez. Şunları
kendin oku:

- Sayılar, isimler, tarihler kitaba uyuyor mu? Kitapta olmayan bir şey var mı?
- Başka dillerde anlam kaymış mı? (tr/es/de)
- Ders örneği uydurma ama sıradan mı? Kitaptan alınmış gerçek gibi sunulmuş mu?
- `[[use]]` kartlarından en az birinde hikâyeye özgü bir ayrıntı var mı?
- `thirty_sec` hikâyeyi okumamış biri için de anlaşılır mı?

Repoda bu işi yapan ajanlar var: `quality-reviewer` (olgu ve kalite denetimi,
onay vermez, bulgu raporlar) ve `proofread-stories` skill'i (yazım kontrolü).
Aynı modele kendi işini denetletme; ikinci bir model kullan.

---

## 8. Dosyaları ana bilgisayara taşı

Diğer bilgisayarda yeni bir dal aç ve sadece üretilen klasörü commit'le:

```bash
git checkout -b icerik/<model>-<tarih>
git add staging/p1-<model>/
git commit -m "P1 içerik: <model>, id'ler 1707 1731"
git push -u origin icerik/<model>-<tarih>
```

Git kullanmak istemezsen `staging/p1-<model>/` klasörünü zip'leyip taşı.
**`assets/albor.db` dosyasını taşıma ve commit'leme.** `src/db/db.js` içindeki
`DB_VERSION` satırına da bu bilgisayarda dokunma.

Ana bilgisayarda dalı çek, sonra `brief` ve dil dosyalarını resmi yerlerine
**kopyala** (taşıma). Önce mevcut dosyanın üzerine yazmadığından emin ol:

```bash
for L in en tr es de; do
  for f in staging/p1-<model>/$L/*; do
    [ -e "staging/p1/$L/$(basename $f)" ] && echo "VAR, atlandı: $L/$(basename $f)" || cp "$f" "staging/p1/$L/"
  done
done
cp -n staging/p1-<model>/brief/*.json staging/p1/brief/
```

> `staging/p1/brief/` ve `staging/p1/<dil>/` resmi çıktı klasörleridir. Batch
> hattı bu klasörlerde dosyası olan id'yi atlar. Buraya sadece **senin
> onayladığın** dosyaları kopyala. (Depodaki ajanlara bu klasörlere kendi
> başlarına yazmamaları söylenmiştir; bu adımı sen yapıyorsun.)

---

## 9. Yerel DB'ye yaz

Bu adımı **sen** çalıştır. Ajanlar `assets/albor.db`'ye yazmaz.

Her zaman önce kuru çalıştırma:

```bash
npm run story:publish -- --dry-run --langs en,tr,es,de --ids 1707,1731
```

> Dikkat: `--langs` vermezsen varsayılan sadece `en,tr` olur. es ve de'yi
> yazmak için dört dili açıkça ver.

Çıktıyı oku:

- `N to publish`: yazılacaklar.
- `INVALID (skipped)`: doğrulamadan geçemeyenler.
- `without a DB row (skipped)`: DB'de `story_translations` satırı olmayanlar.
  Aşağıdaki "Yeni hikâye mi, mevcut hikâye mi?" bölümüne bak.

Sorun yoksa gerçek çalıştırma:

```bash
npm run story:publish -- --langs en,tr,es,de --ids 1707,1731 --note "Codex pilot"
```

Bu komut sırayla şunları yapar:

1. `staging/p1/<dil>/<id>.md` ve `.variants.json` dosyalarını okur.
2. Her hikâyeyi `validate.mjs` ile doğrular, geçemeyeni atlar.
3. DB'dekiyle karşılaştırır, değişmeyeni atlar.
4. `assets/_db_backups/albor.db.<zaman>` yedeğini alır (son 10 yedek tutulur).
5. Hikâye metnini, okuma süresini ve sohbet variants'ını **tek transaction**
   içinde yazar. Hata olursa geri alır.
6. `src/db/db.js` içindeki `DB_VERSION`'ı 1 artırır. Uygulama bir sonraki
   açılışta eski yerel kopyayı silip yeni DB'yi `assets/` içinden kopyalar.
7. `staging/p1/publish-log.jsonl` dosyasına bir satır ekler.

Yazılan her hikâyenin `stories.version` alanı varsayılan olarak `Opus55` olur.
Farklı bir koleksiyon adı için `--version <ad>` ver. Ayarlar ekranındaki
koleksiyon listesi bu alana bakar.

Alternatif: `node scripts/p1/apply-to-db.mjs <dil> [id...] [--dry-run]` daha
eski, sadece metin ve variants yazan script'tir. `DB_VERSION` artırmaz ve
`stories.version` değiştirmez. Normalde `story:publish` kullan.

### Yeni hikâye mi, mevcut hikâye mi?

`story:publish` ve `apply-to-db.mjs` sadece **var olan** satırları günceller
(`UPDATE story_translations ...`). `stories` ve `story_translations` tablosunda
satırı olmayan bir id yeni satır olarak eklenmez, `without a DB row` diye
atlanır.

- Mevcut 770 hikâyenin P1 sürümünü yazıyorsan sorun yok.
- Tamamen yeni bir hikâye/kitap ekleyeceksen önce satırların açılması gerekir.
  Örnek: `scripts/add-v2-story-batch-010.mjs`. `book-scout` ajanı yeni kitap
  önerir ve künye hazırlar. `db-migration` skill'i şema değişikliği içindir.
  Yeni satırlar eklendikten sonra bu rehberin 9. adımı aynen geçerli.

### Yazma sonrası kontrol

```bash
git diff src/db/db.js          # DB_VERSION bir arttı mı?
tail -n 1 staging/p1/publish-log.jsonl
```

Uygulamayı yeniden derle/aç. Açılışta log'da `DB version mismatch` benzeri
bir satır ve yeni DB kopyalama görülmeli. İlgili hikâyeyi dört dilde aç,
bölümler (özet, hikâye, ders, soru, cep notu) ve Sohbette kullan ekranındaki
üç kart + 30 saniyelik anlatım görünmeli.

Bir şey ters giderse yedekten dön:

```bash
cp assets/_db_backups/albor.db.<zaman> assets/albor.db
git checkout src/db/db.js
```

---

## 10. Supabase'e gönderme (isteğe bağlı, elle)

Uygulama içeriği Supabase'ten de senkronlayabiliyor. Bu adım ayrı ve
**sen onaylayarak** yapılır. Önce kuru çalıştırma (ağ yok, sadece sayım):

```bash
node scripts/supabase/import-content.mjs
```

Sayılar mantıklıysa:

```bash
node scripts/supabase/import-content.mjs --apply
```

Notlar:

- `--apply` service role anahtarı ister (`scripts/supabase/lib.mjs`). Anahtar
  sadece ana bilgisayarda, `.env.local` içinde dursun. Sohbete yapıştırma,
  repoya yazma.
- Script yalnızca `stories.version = ACTIVE_VERSION` olan hikâyeleri
  (şu an `Opus55`) ve onların çevirilerini/variants'ını yükler. Farklı bir
  `--version` adıyla yazdıysan, `ACTIVE_VERSION` değerini kontrol et; yoksa
  hikâyeler Supabase'e gitmez.
- `--apply` sonunda `content_seed_versions('catalog')` otomatik artırılır ve
  cihazlar yeniden senkronlanır. Geri alması zor bir işlemdir; önce
  `node scripts/supabase/backup-public.mjs` ile yedek almayı düşün.

---

## 11. Model ve maliyet notu

- Aynı hikâye için farklı modeller kıyaslanacaksa her modelin çıktısı kendi
  klasöründe kalsın: `staging/p1-codex/`, `staging/p1-gpt/`, ... Böylece
  karışmaz ve kıyaslanabilir.
- Pilot: ilk çalışmada 3-5 hikâye üret, 4 dilde doğrula, kendin oku, sonra
  toplu işe geç.
- Alternatif olarak Anthropic Batch hattı (otomatik, yarı fiyat) için
  `batch/README.md`'ye bak. O yol ayrı bir API anahtarı ister
  (`ANTHROPIC_API_KEY`) ve `staging/p1/` altına doğrudan yazar.

---

## 12. Kontrol listesi

Diğer bilgisayarda:

- [ ] Repo güncel, Node ≥ 22.5
- [ ] id'ler `07-status.mjs` ile seçildi, zaten üretilmiş id yok
- [ ] `08-export-agent-inputs.mjs` her dil için çalıştırıldı
- [ ] Brief'ler `staging/p1-<model>/brief/` içinde, `low` olanlar okundu
- [ ] Hikâye + variants 4 dilde üretildi, kod çiti dosyaya girmedi
- [ ] Her dilde `validate-dir.mjs` çıktısı `N/N passed`
- [ ] Olgu ve çeviri kontrolü yapıldı (insan veya ikinci model)
- [ ] Sadece `staging/p1-<model>/` commit'lendi, `albor.db` ve `db.js` dışarıda

Ana bilgisayarda:

- [ ] Dosyalar `staging/p1/brief/` ve `staging/p1/<dil>/` içine kopyalandı (üzerine yazmadan)
- [ ] `npm run story:publish -- --dry-run --langs en,tr,es,de --ids ...` temiz
- [ ] Gerçek `story:publish` çalıştı, `DB_VERSION` arttı
- [ ] Uygulamada dört dilde hikâye ve Sohbette kullan ekranı kontrol edildi
- [ ] (İsteğe bağlı) `import-content.mjs` kuru çalıştırma, sonra `--apply`
- [ ] `assets/albor.db`, `src/db/db.js`, `staging/` commit'lendi

---

## Hızlı başvuru: dosya ve komut haritası

| İş | Dosya / komut |
|---|---|
| Format ve yazım kuralları | `batch/prompts/story-instructions.md` |
| Brief kuralları | `batch/prompts/brief-instructions.md` |
| Kaynak envanteri | `staging/p1/manifest.json` (~1.3 MB, sadece gereken id'leri oku) |
| İlerleme | `node batch/07-status.mjs <dil> --list` |
| Girdi dışa aktarma | `node batch/08-export-agent-inputs.mjs <dil> <id...> --out staging/p1-<model>` |
| Doğrulama | `node scripts/p1/validate-dir.mjs <dil> <klasör> <id...>` |
| AI-tell raporu | `node scripts/p1/ai-tells.mjs <dil> [id...]` |
| DB'ye yazma | `npm run story:publish -- [--dry-run] --langs en,tr,es,de --ids ...` |
| Supabase | `node scripts/supabase/import-content.mjs [--apply]` |
| Plan ve bağlam | `HIKAYE_DONUSUM_PLANI.md`, `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md` |
| Otomatik Batch hattı | `batch/README.md` |
