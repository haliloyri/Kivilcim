## Mod 4 — Mevcut hikâyeleri göster, Sürüm ver, hepsini yeniden üret

Kaynak **yerel DB** (`assets/albor.db`, salt okunur). Envanter dosyası kaynak değildir. DB'de Sürüm sayı değil etikettir: `1`, `2`, `OH`, `Opus55`, `Opus55-2`, `SON55` gibi. Etiketi olduğu gibi kullan, yorumlama.

**1. Önce Sürüm özetini göster:**

```bash
node scripts/p1/list-stories.mjs
```

Çıktı: `Sürüm | Koleksiyon sayısı | Hikâye sayısı`.

**2. Kullanıcı bir Sürüm verince tablosunu göster** (Koleksiyon / Sürüm / Hikâye, ID yardımcı sütun):

```bash
node scripts/p1/list-stories.mjs --version <Sürüm>
```

Kullanıcı Sürüm vermeden tablo isterse özeti göster ve hangi Sürüm olduğunu sor. 706 satırı tek seferde dökme.

**3. Sürüm verilince o Sürümdeki tüm hikâyeleri üret.** Kullanıcı sadece Sürüm etiketini söylese yeter; tek tek seçim isteme. Önce onay al: "`<Sürüm>`: N hikâye, M koleksiyon, 4 dil, model `<ID>`. Başlayayım mı?" Sonra ID listesini al:

```bash
node scripts/p1/list-stories.mjs --version <Sürüm> --ids
```

**4. Yeniden üret.** Önce `mod-3-yaz.md`'yi oku; adımlar aynı, farklar:

- Girdi: `node batch/08-export-agent-inputs.mjs all <id...> --compact --out staging/p1-writer`. `<id>.brief-user.md` eski metni içerir; yalnızca referans, **kitaba sadık kal**, eski metni cümle cümle yeniden yazma.
- **Kitaba göre grupla.** Id listesini `node scripts/p1/list-stories.mjs --version <Sürüm> --by-book` ile al; bir kitabın bütün hikâyeleri aynı gruba girer, kitap iki gruba bölünmez. Grup ~10 hikâye (3–4 kitap). Grup bitince tek satır ilerleme yaz (`40/200`). Arada durma, kullanıcı durdurursa dur.
- **Önce araştırma, sonra yazım (iki aşama).**
  1. *Araştırma (kitap başına bir kez):* `staging/p1-writer/facts/<book_no>.json` zaten varsa ve bu Sürümün id'leri `stories` içinde ise araştırmayı atla, dosyayı kullan; eksik id varsa yalnızca onlar için ekle. Web'de doğrula (yayıncı, alıntılar, Google Books, varsa archive.org tam metin, güvenilir özetler). Çıktı `staging/p1-writer/facts/<book_no>.json`: `{"book_no","title","authors","year","sources":[url...],"facts":[{"id":"f1","claim","source","confidence":"high|medium|low"}],"rejected":[{"claim","reason"}],"stories":{"<story_id>":{"verdict":"keep|delete","fact_ids":[...],"note"}}}`. Eski metindeki her iddiayı ya `facts`'e (kaynaklı) ya `rejected`'e koy. Merkez konusu kitaba bağlanamayan hikâye `delete`.
  2. *Yazım:* Brief, 4 dil, variants ve meta **yalnızca** o kitabın facts dosyasından yazılır; yazım sırasında web'e çıkma. Bir olgu eksikse facts dosyasına kaynağıyla ekle, sonra kullan.
- **Kurallar en baştan, tek geçişte.** Yeniden yazım turu çıkmasın diye ilk yazımda uygula:
  - *Çeviri yok:* her dil brief'ten bağımsız yazılır; tr/es/de yazarken en metnine bakma. Her dilin kendi açılış hamlesi, paragraf sırası, hook'u ve variants'ı olur.
  - *AI izi yok:* em-dash, "not X. It's Y.", "sadece X değil Y", üçlü liste, retorik soru zinciri, şişkin kelime yok.
  - *Meta aynı geçişte:* her yazılan id için `staging/p1-writer/meta/<id>.json` = `{"story_id","verdict","verify_note","title_changed":{tr,en,es,de},"tr":{"title","description","hook","one_minute_summary"},"en":{…},"es":{…},"de":{…}}`. title 2–6 kelime, em-dash yok, yeni içeriğe uyar; description 1–2 cümle; hook okura tek soru; one_minute_summary 60–90 kelime, o dilin kendi md'sinden, uyarı varsa taşır. Almanca her yerde "du". `delete` için yalnızca verdict + verify_note.
- Çok büyük Sürümde (ör. 50+ hikâye) başta bir kez söyle: Batch hattı yarı fiyatta ve toplu çalışır. Komutu ver, çalıştırma: `node batch/00-run-pipeline.mjs --langs tr,en,es,de --model <Model ID>`. Kullanıcı yine de elle yazımı seçerse devam et.
- Çıktı önce `staging/p1-writer/`. `staging/p1/`'e yazma. DB'ye yazma kuralı `db-yazma.md`'de (editör açıksa DB'ye sen yazmazsın).
- Sürüm etiketi `SON55`. Kullanıcı başka etiket verirse onu kullan.
- Eski `legacy` hikâyeler P1'e geçer (1 ders + 1 soru, madde yok). Raporda söyle.

**5. Doğrula** (`mod-3-yaz.md`'deki `validate-dir.mjs`) ve sonuçla birlikte sun. Editör açıksa raporda editöre gidecek id listesini ver.
