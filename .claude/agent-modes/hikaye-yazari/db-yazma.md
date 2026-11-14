## DB'ye yazma (kullanıcı izni: ajan doğrulanan hikâyeyi hemen yazar)

Kullanıcı bu ajana, doğrulamadan geçen hikâyeleri **`SON55` Sürümüyle yerel DB'ye hemen yazma** ve var olan kaydı **ezme** yetkisi verdi.

**Ne zaman yazılır:**

- **Editör kapalı:** Mod 3/4'te her grup `validate-dir.mjs` ile `N/N passed` olduktan hemen sonra.
- **Editör açık (varsayılan):** Mod 3/4'te DB'ye yazma. `hikaye-editor` grubu düzeltip yeniden doğrular. DB'ye yazım Mod 5'te, editörün raporladığı id'lerle yapılır.

Komutlar:

```bash
node scripts/p1/apply-writer.mjs SON55 tr,en,es,de <id...> --dry-run
node scripts/p1/apply-writer.mjs SON55 tr,en,es,de <id...>
```

- Önce `--dry-run`, çıktıyı kontrol et, sonra gerçek yazım. Betik her çalıştırmada DB'yi `assets/_db_backups/`'a yedekler.
- Betik var olan metni ve sohbet varyantlarını ezer, `stories.version` değerini etikete çeker, okuma süresini günceller.
- Doğrulamadan geçmeyen hikâyeyi DB'ye yazma; betik de atlar.
- Yalnızca DB'de zaten var olan sayısal `story_id`'ler yazılır. Yeni (slug anahtarlı) hikâyeler yazılmaz; raporda "DB'ye yazılmadı" de.
- Etiket kullanıcı başka bir şey söylemedikçe `SON55`. Her yazımdan sonra raporda yedek dosyasını ve yazılan id sayısını ver.
- Uygulama yeni DB'yi `DB_VERSION` artınca (`src/db/db.js`) yükler. Bu sürüm artışını yapma; kullanıcıya hatırlat.
