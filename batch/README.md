# batch/ — Anthropic Batch API ile hikâye üretim hattı

Bu klasör, `HIKAYE_DONUSUM_PLANI.md`'deki içerik özeti (brief) + dil başına
yazım adımlarını **Anthropic Batch API** üzerinden çalıştırır. Batch,
standart API fiyatının **yarısına** çalışır ve sonuç birkaç dakika ile
24 saat arasında hazır olur (aciliyet yoksa maliyet için en iyi seçenek).
Claude Pro/Max aboneliği (sohbet arayüzü) burada **kullanılamaz** — Batch
API, ayrı bir API anahtarı ve kullanım başına ödeme gerektirir.

## API anahtarını nereden alırım?

1. https://console.anthropic.com adresine girin (Claude.ai hesabınızdan
   farklı, ayrı bir "Console" hesabı — aynı e-postayla açabilirsiniz).
2. Sol menüden **Settings → API Keys** → **Create Key**.
3. Ödeme için **Settings → Billing**'den kredi kartı ekleyip bakiye
   yükleyin (Batch API kullanım başına faturalandırılır, abonelik değil).
4. Oluşan anahtar `sk-ant-...` ile başlar. Bir daha gösterilmez, hemen
   kopyalayıp saklayın.

## Anahtarı nasıl kullanırım?

Anahtarı repoya **asla commit etmeyin**. İki yol var:

**A) Ortam değişkeni (tek oturumluk):**
```bash
export ANTHROPIC_API_KEY="sk-ant-...siz-yapıştırın..."
node batch/02-submit-briefs.mjs --all
```

**B) `.env.local`'a ekleyip Node'un kendi `--env-file` desteğiyle okutun**
(proje zaten `.env.local` kullanıyor, `.gitignore`'da):
```bash
echo 'ANTHROPIC_API_KEY=sk-ant-...' >> .env.local
node --env-file=.env.local batch/02-submit-briefs.mjs --all
```
(B) yolunu seçerseniz her komutun başına `node --env-file=.env.local` yazın.
Aşağıdaki örneklerde kısalık için düz `node` yazıldı — siz B'yi kullanıyorsanız
`node --env-file=.env.local ...` olarak çalıştırın.

## Otomatik çalıştırma — tek komut

Her adımı elle tetikleyip "bitti mi" diye bakmak yerine, **`00-run-pipeline.mjs`**
hepsini kendisi yapar: brief batch'ini gönderir, bitene kadar bekler (30 sn'de
bir yoklar), indirir; sonra her dil için hikâye+variants batch'ini gönderir,
bekler, indirir, doğrular; `--apply` verirseniz sonunda yerel DB'ye de yazar.

```bash
export ANTHROPIC_API_KEY="sk-ant-..."

# Önce küçük bir grupla deneyin (ör. 5 hikâye, sadece İngilizce):
node batch/00-run-pipeline.mjs --langs en --limit 5 --apply

# Pilot onaylandıktan sonra kalan her şey (İngilizce, otomatik DB yazımıyla):
node batch/00-run-pipeline.mjs --langs en --apply
```

Bu komut hikâye başına dakikalarca sürebilecek bekleme içerdiği için (Batch
API'nin SLA'sı 24 saate kadar), **terminali kapatınca durmaması** için arka
planda başlatın:

```bash
nohup node batch/00-run-pipeline.mjs --langs en --apply > batch.log 2>&1 &
tail -f batch.log          # ilerlemeyi izlemek için
```

Bilgisayarınızı kapatırsanız `nohup` da durur — o durumda batch Anthropic
tarafında çalışmaya devam eder, siz sadece bekleme döngüsünü kaçırırsınız.
Kaldığı yerden devam etmek için: batch'in durumuna
`node batch/03-check-batch.mjs <batch_id>` ile bakın (log'da veya
`staging/p1/.last-*-batch*.json` dosyalarında `id` yazar); bitmişse ilgili
`04-` veya `06-fetch-*.mjs` komutunu elle çalıştırıp `apply-to-db.mjs`'e
geçin, ya da `00-run-pipeline.mjs`'i tekrar çalıştırın — `--all` mantığı
zaten üretilmiş kayıtları atladığı için kaldığı yerden devam eder.

`--limit N` (test için az sayıda hikâye), `--model claude-sonnet-5`
(varsayılan `claude-opus-5-5`), `--poll-seconds 60` ve `--max-wait-hours 24`
seçenekleri de var.

## Kullanım (adım adım, elle kontrol etmek isterseniz)

```bash
# 0) Kaynak envanteri DB'den çıkar (770 hikâye → staging/p1/manifest.json)
node batch/01-build-manifest.mjs

# 1) İçerik özetini (brief) toplu üret — önce küçük bir grupla deneyin
node batch/02-submit-briefs.mjs 1707 1731        # ya da: --all
node batch/03-check-batch.mjs <batch_id>          # "ended_at" çıkana kadar tekrar çalıştırın
node batch/04-fetch-briefs.mjs <batch_id>         # staging/p1/brief/<id>.json yazar

# 2) Bir dilde hikâye + "Sohbette kullan" metnini AYNI istemde üret
node batch/05-submit-stories.mjs en --all         # ya da: 1707 1731
node batch/03-check-batch.mjs <batch_id>
node batch/06-fetch-stories.mjs <batch_id> en     # staging/p1/en/<id>.md + <id>.variants.json yazar, sonra validate.mjs'i otomatik çalıştırır

# 3) Doğrulamadan geçenleri yerel DB'ye yaz (yedekli)
node scripts/p1/apply-to-db.mjs en --dry-run
node scripts/p1/apply-to-db.mjs en
```

`--all` her adımda **daha önce üretilmemiş** kayıtları bulur (zaten var olan
`brief/<id>.json` ya da `<lang>/<id>.md` dosyalarını atlar), o yüzden bir
batch yarıda kalsa veya bazı hikâyeler doğrulamadan geçmese bile güvenle
tekrar çalıştırabilirsiniz — `00-run-pipeline.mjs` da dahil.

Model seçmek isterseniz her `02-`, `05-` ve `00-` komutuna
`--model claude-sonnet-5` ekleyin (varsayılan `claude-opus-5-5`).

## Maliyet (Batch fiyatı, standart fiyatın yarısı)

| Model | Girdi $/MTok | Çıktı $/MTok |
|---|---:|---:|
| Opus 5.5 | 2 | 10 |
| Sonnet 5 | 1 | 5 |
| Fable 5.1 | 5 | 25 |
| Haiku 4.5 | 0.5 | 2.5 |

`HIKAYE_DONUSUM_PLANI.md` §6'daki tahmine göre (İngilizce, 750 hikâye,
Opus 5.5, brief + yazım + "Sohbette kullan" metni aynı pas'te): toplamda
~35-40M token, kabaca **$90-120** aralığında. Sonnet 5 ile bu bedel yarıdan
azına iner ama doğallık/sadakat kalitesi biraz düşebilir — önce 20 hikâyelik
pilotu Opus'la, kalanı isterseniz Sonnet'le deneyip `validate.mjs` + kendi
okumanızla karşılaştırmanızı öneririm.

## Bu klasördeki dosyalar

| Dosya | İş |
|---|---|
| `00-run-pipeline.mjs` | **Hepsini otomatik yapan tek komut** — aşağıdaki 01-06 adımlarını sırayla çalıştırır, batch bitene kadar bekler, isterseniz DB'ye de yazar. |
| `lib/anthropic.mjs` | Batch API'ye ham `fetch` ile istek atan yardımcı (ek paket kurulumu gerekmez). |
| `01-build-manifest.mjs` | DB'den kitap/yazar/mevcut TR metni çekip `staging/p1/manifest.json` yazar. |
| `prompts/brief-instructions.md` | Brief üretim talimatı (K3/K4 kuralları, JSON şeması). |
| `02-submit-briefs.mjs` | Brief batch'ini gönderir. |
| `03-check-batch.mjs` | Herhangi bir batch'in durumunu sorgular (brief ya da hikâye batch'i fark etmez). |
| `04-fetch-briefs.mjs` | Bitmiş brief batch'ini indirip `staging/p1/brief/<id>.json` yazar. |
| `prompts/story-instructions.md` | P1 yazım kuralları + "Sohbette kullan" metni talimatı (dil başına doldurulur). |
| `05-submit-stories.mjs` | Belirli bir dil için hikâye+variants batch'ini gönderir. |
| `06-fetch-stories.mjs` | Bitmiş batch'i indirir, `.md` + `.variants.json` yazar, `validate.mjs`'i otomatik çalıştırır. |

Sonrası zaten var olan hat: `scripts/p1/validate.mjs` (kural kontrolü) →
`scripts/p1/apply-to-db.mjs` (yerel SQLite'a yedekli yazım). Supabase'e
gönderme (V8) planın son adımı — ayrı, elle onaylanan bir iş.

## Sınırlar / bilinecekler

- Bu ortam macOS/Xcode içermiyor; batch script'leri herhangi bir yerden
  (bu VM, Mac'iniz, CI) çalıştırılabilir — API çağrısı olduğu için sadece
  internet ve anahtar gerekir.
- `--model` ile Fable veya Haiku de denenebilir ama plan Opus 5.5'i esas
  alıyor (kitaba sadakat ve doğallık için en güçlü seçenek).
- Confidence "low" çıkan briefler otomatik reddedilmiyor (K3'te öngörülen
  "review/" akışı henüz otomatikleştirilmedi) — `staging/p1/brief/*.json`
  içindeki `confidence` alanını yazım batch'ini göndermeden önce elle
  taramanız önerilir: `grep -l '"confidence": "low"' staging/p1/brief/*.json`
