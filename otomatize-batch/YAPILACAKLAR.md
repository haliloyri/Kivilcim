# Otomatize Batch — Yapılacaklar

Bu klasör, `batch/00-run-pipeline.mjs`'i (brief → hikâye+"Sohbette kullan" →
doğrulama → DB'ye yazma) **elle her seferinde tetiklemeden**, arka planda ve
gerekirse günlük olarak kendi kendine çalıştırır. `batch/` klasöründeki
script'leri değiştirmez, sadece onu güvenli şekilde koşturan bir "işletmen"
katmanıdır.

```
otomatize-batch/
  config.sh                     ← tek ayar dosyası (dil, model, limit, apply)
  run-pipeline.sh                ← .env.local'ı yükler, kilitler, loglar, pipeline'ı çalıştırır
  com.spark.storypipeline.plist  ← macOS launchd tanımı (günlük otomatik tetikleme)
  install-launchd.sh             ← plist'i kurar ve etkinleştirir
  uninstall-launchd.sh           ← otomatik tetiklemeyi kaldırır
  logs/                          ← her çalışmanın zaman damgalı logu (git'e girmez)
```

## Yapılacaklar (sırayla)

- [ ] **1. API anahtarı** — `batch/README.md`'deki adımlarla console.anthropic.com'dan
      anahtar alın, `.env.local`'a ekleyin: `ANTHROPIC_API_KEY=sk-ant-...`
      (repoya commit ETMEYİN — `.env.local` zaten `.gitignore`'da).
- [ ] **2. `config.sh`'i gözden geçirin** — özellikle `LIMIT` (ilk denemede
      küçük, ör. `5`-`10`) ve `APPLY` (`true` ⇒ doğrulamadan geçenler otomatik
      yerel SQLite'a yazılır; DB'yi önce siz kontrol etmek isterseniz `false`
      yapıp elle `node scripts/p1/apply-to-db.mjs en` çalıştırın).
- [ ] **3. Elle bir kere deneyin** (launchd'ye güvenmeden önce):
      ```bash
      bash otomatize-batch/run-pipeline.sh
      tail -f otomatize-batch/logs/pipeline-*.log
      ```
      Bittiğinde `staging/p1/en/` altındaki birkaç `.md` dosyasını ve
      `validate.mjs` çıktısını okuyun.
- [ ] **4. Pilot içeriği inceleyin** — `HIKAYE_DONUSUM_PLANI.md` K7'deki 20
      hikâyelik pilot mantığıyla: birkaç hikâyeyi uygulamada (simülatörde)
      açıp okuyun, `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md`'deki "Prova et"
      akışını deneyin.
- [ ] **5. Onaylandıysa `config.sh`'te `LIMIT`'i artırın veya tamamen kaldırın**
      (kalan tüm İngilizce hikâyeler için).
- [ ] **6. Günlük otomasyonu kurun (isteğe bağlı ama işi hızlandırır):**
      ```bash
      bash otomatize-batch/install-launchd.sh
      ```
      Bundan sonra Mac her gün 03:00'te (açıksa) otomatik çalışıp henüz
      işlenmemiş hikâyeleri işler — `--all` mantığı sayesinde her gün
      kaldığı yerden devam eder, tekrar işlemez. İşiniz bitene kadar
      Mac'inizi o saatte kapalı tutmamaya dikkat edin (kapalıysa launchd
      bir sonraki açılışta telafi eder, tamamen kaçırmaz).
- [ ] **7. İlerlemeyi takip edin:**
      ```bash
      tail -f otomatize-batch/logs/pipeline-*.log     # her çalışmanın ayrıntısı
      ls staging/p1/en/*.md | wc -l                    # kaç hikâye üretildi
      grep -L '"errors": \[\]' staging/p1/brief/*.json 2>/dev/null  # (yoksa boş çıkar, sorun yok)
      ```
- [ ] **8. Tüm İngilizce hikâyeler bitince otomasyonu durdurun:**
      ```bash
      bash otomatize-batch/uninstall-launchd.sh
      ```
- [ ] **9. Cihazda son kontrol** — `npm run ios` ile birkaç rastgele hikâyeyi
      açıp okuyun (özellikle `confidence: "low"` çıkan briefler — bkz.
      `batch/README.md` sonundaki grep komutu — bunları elle gözden geçirin).
- [ ] **10. Supabase'e gönderme (V8)** — bu otomasyona **dahil değil**,
      kasıtlı olarak elle onaylanan ayrı bir adım
      (`HIKAYE_DONUSUM_PLANI.md` §5, V8 satırı). Tüm diller bitip siz
      onayladıktan sonra yapılır.
- [ ] **11. TR/ES/DE'ye geçiş** — İngilizce bittiğinde `config.sh`'te
      `LANGS="en,tr,es,de"` yapıp aynı akışı tekrarlayın; brief'ler zaten
      hazır olduğu için sadece yazım adımı (05/06) çalışır.

## Notlar

- `run-pipeline.sh` bir kilit dosyası (`otomatize-batch/.pipeline.lock`)
  kullanır; launchd günlük tetiklese bile önceki çalışma bitmeden ikinci bir
  kopya başlamaz.
- Batch API'nin SLA'sı 24 saate kadar olduğu için bazen bir günlük
  tetiklemede batch bitmeyebilir — script yine de `--max-wait-hours` kadar
  (varsayılan 20 saat) bekler; bittiğinde bir sonraki günün tetiklemesi
  kaldığı yerden devam eder.
- Maliyet ve model seçimi için `batch/README.md`'ye bakın; buradaki
  `config.sh`'teki `MODEL` alanı doğrudan oraya karşılık gelir.
- Bu otomasyon sadece **içerik üretimini** (brief + hikâye + "Sohbette
  kullan" + yerel DB yazımı) kapsar; kod tarafındaki değişiklikler
  (`storyMarkup.js`, `StoryBody.js`, ekranlar) zaten tamamlanmıştı — bkz.
  `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md`.
