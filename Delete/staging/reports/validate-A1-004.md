# Batch Dogrulama — A1-004

- Dosya: `staging/batch-A1-004.json`
- Tur: variants_only · 10 kayit
- Sonuc: **ZATEN INGEST EDILDI** — 2026-07-25 22:34

Bu batch DB'ye uygulanmis. Yeniden dogrulama calistirilmadi.

Tekrar uygulamaya calisirsan `ingest-batch.mjs` seni durdurur:

- `content_fix` -> "content DB ile ayni" hatasi
- `marker_repair` -> invaryant ihlali (sonraki bir batch ayni kaydi degistirmis olabilir;
  yeniden uygulamak o isi geri alirdi)

Icerigi gozden gecirmek istiyorsan dosyayi dogrudan ac.