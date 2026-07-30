# Batch Dogrulama — A2-010-sources

- Dosya: `staging/batch-A2-010-sources.json`
- Tur: content_fix · 12 kayit
- Sonuc: **ZATEN INGEST EDILDI** — 2026-07-26 23:02

Bu batch DB'ye uygulanmis. Yeniden dogrulama calistirilmadi.

Tekrar uygulamaya calisirsan `ingest-batch.mjs` seni durdurur:

- `content_fix` -> "content DB ile ayni" hatasi
- `marker_repair` -> invaryant ihlali (sonraki bir batch ayni kaydi degistirmis olabilir;
  yeniden uygulamak o isi geri alirdi)

Icerigi gozden gecirmek istiyorsan dosyayi dogrudan ac.