# Batch Dogrulama — A2-011-glue

- Dosya: `staging/batch-A2-011-glue.json`
- Tur: content_fix · 6 kayit
- Sonuc: **ZATEN INGEST EDILDI** — 2026-07-26 23:07

Bu batch DB'ye uygulanmis. Yeniden dogrulama calistirilmadi.

Tekrar uygulamaya calisirsan `ingest-batch.mjs` seni durdurur:

- `content_fix` -> "content DB ile ayni" hatasi
- `marker_repair` -> invaryant ihlali (sonraki bir batch ayni kaydi degistirmis olabilir;
  yeniden uygulamak o isi geri alirdi)

Icerigi gozden gecirmek istiyorsan dosyayi dogrudan ac.