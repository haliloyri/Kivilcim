## Mod 3 — Hikâyeleri yaz

Amaç: kuyruktaki `[ ]` başlıklar için P1 formatında hikâye üretmek. Çıktı `staging/p1-writer/`.

**Başlamadan bir kez oku** (atlama, tekrar okuma):

```bash
node batch/08-export-agent-inputs.mjs all <id...> --compact --out staging/p1-writer
```

Komut iki dosya yazar. İkisini de çalışma başında **bir kez** oku:

- `staging/p1-writer/inputs/brief-system.md`: brief adımının sistem talimatı.
- `staging/p1-writer/inputs/story-system.md`: hikâye adımının sistem talimatı, 4 dil için tek dosya. Sonundaki "Language settings" tablosu `{LEN_*}`, `{VOICE_*}`, `{ADDRESS_FORM}`, `{BANNED_PHRASES}` değerlerini dil dil verir. "Reference stories" bölümü onaylı örnek hikâyelerdir: ritmi, hikâye payını ve ders biçimini onlardan al; açılış hamlesini, cümlelerini ve olgularını kopyalama.

`batch/prompts/story-instructions.md`, `lang-config.mjs` veya `story-system.<lang>.md` dosyalarını ayrıca okuma; içerikleri bu iki dosyada. Id'si manifest'te olmayan yeni başlıkta komutu id'siz çalıştır (`all --compact`); brief'i elle yazarsın.

**Seçim:** Kullanıcıya hangi kitap/başlıkların yazılacağını sor. Tek seferde en fazla **10 hikâye**. Daha fazlası için Batch hattını öner.

**Her hikâye için**

1. **Brief.** `brief-system.md`'yi sistem talimatı kabul et. Kaynak: kitabın kendisi (WebSearch/WebFetch ile doğrula). Çıktı `staging/p1-writer/brief/<anahtar>.json` (kod çiti yok, yalnızca JSON). `<anahtar>`: story_id varsa o, yoksa `<kitap-slug>-<nn>`. Doğrulanamayan olayda `confidence` düşük işaretle ve `confidence_note`'a nedenini yaz. Brief'i yazamıyorsan hikâyeyi yazma, nedenini raporla.
2. **Dört dil, bağımsız.** tr → en → es → de sırasıyla, her dili **aynı brief'ten sıfırdan** yaz. Çeviri değil. Her dil farklı açılış hamlesi seçsin. Sistem talimatı her dil için aynı `story-system.md`; yalnızca tablo sütunu değişir.
3. **Çıktılar:** `staging/p1-writer/<lang>/<anahtar>.md` (```story bloğunun gövdesi) ve `staging/p1-writer/<lang>/<anahtar>.variants.json` (```variants bloğunun gövdesi).
4. **Sabit kurallar:**
   - Tam 1 ders (`$$…$$`) + tam 1 soru (`&&…&&`). Reflect maddesi yok.
   - `[[use]]` içinde tam 3 kart; her biri literal `%%context:<meeting|oneonone|family|social|self> | ` ile başlar. `context:` öneki zorunlu. En az 2 farklı bağlam.
   - Tek `@@cep cümlesi@@`, en çok 20 kelime, tek başına paylaşım kartında anlaşılır.
   - Kitapta olmayan anekdot, alıntı, sayı, isim yok. Derste örnek uydurma-ama-sıradan olabilir; kitaptan gerçekmiş gibi sunulamaz.
   - Yasak ifadeler ve makine izleri: `story-system.md` "Keep the prose human" ve tablodaki `{BANNED_PHRASES}`.

**Doğrula — grup başına bir kez, her dil için** (hikâye başına ayrı çalıştırma):

```bash
node scripts/p1/validate-dir.mjs <lang> staging/p1-writer/<lang> <anahtar...>
```

Çıktı `N/N passed` yazmalı. Hata veya uyarı varsa yalnızca işaretlenen cümleyi/bölümü `Edit` ile düzelt; metnin tamamını yeniden yazma. Sonra yeniden çalıştır. Hatalı hikâyeyi sunma. Uyarıyı kapatmak için cümle kırpma; o cümleyi yeniden kur.

**Editör (açıksa):** DB'ye yazma. Raporda editöre gidecek id listesini tek satırda ver: `EDITOR_IDS: <id,id,...>`. Editörü sen çağıramazsın; ana oturum `hikaye-editor` ajanını bu id'lerle çağırır.

Çıktı: kaç hikâye, hangi diller, doğrulama sonucu, düşük güvenli brief'ler, tr `punchline`'lar.
