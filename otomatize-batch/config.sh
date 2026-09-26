#!/usr/bin/env bash
# otomatize-batch/config.sh — tek yerden ayar. Kodu değil, bu dosyayı düzenleyin.

# Hangi dil(ler) işlensin, sırayla. Plan gereği ilk pazar İngilizce olduğu
# için varsayılan sadece "en". TR/ES/DE'yi eklemeye hazır olunca buraya
# "en,tr,es,de" yazmanız yeterli.
LANGS="en"

# scripts/p1 ve batch/ komutlarının kullandığı model.
MODEL="claude-opus-5-5"

# Bir seferde en fazla kaç hikâye işlensin. Boş bırakırsanız (kaldırırsanız)
# kalan her şeyi işler. İlk denemede küçük tutun (ör. 5-10).
LIMIT="10"

# Doğrulamadan geçen hikâyeleri otomatik olarak yerel SQLite'a yazsın mı?
# "true" ya da "false".
APPLY="true"

# Batch durumunu kaç saniyede bir yoklasın.
POLL_SECONDS="30"

# Bir batch'in bitmesi için en fazla kaç saat beklensin.
MAX_WAIT_HOURS="20"
