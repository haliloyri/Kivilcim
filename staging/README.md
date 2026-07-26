# staging/

Hikâye üretim hattının ara alanı. **Burada duran hiçbir şey DB'de değildir.**

| Dosya | Ne |
|---|---|
| `batch-NNN.json` | `story-producer` çıktısı. Şema: `.claude/skills/hikaye-pipeline/references/batch-semasi.md` |
| `batch-example.json` | Çalışan örnek (`variants_only`). Şablon olarak durur, ingest edilmez. |
| `reports/gap-report.md` | Son `gap-report.mjs` çıktısı |
| `reports/validate-*.md` | Batch doğrulama raporları |

`reports/` üretilmiş dosyalardır, git'te tutulmaz.

## Akış

```bash
# 1. Ne bekliyor?
node scripts/story-pipeline/gap-report.mjs

# 2. Envanteri DB ile senkronla
node scripts/story-pipeline/sync-inventory.mjs

# 3. story-producer batch-NNN.json üretir, sonra:
node scripts/story-pipeline/validate-batch.mjs staging/batch-NNN.json

# 4. Dry-run — DB'ye dokunmaz
node scripts/story-pipeline/ingest-batch.mjs staging/batch-NNN.json

# 5. Onay — yedek alır, DB'ye yazar
node scripts/story-pipeline/ingest-batch.mjs staging/batch-NNN.json --confirm

# 6. ZORUNLU: envanteri tekrar senkronla
node scripts/story-pipeline/sync-inventory.mjs
```

`npm run story:gap` / `story:sync` / `story:validate` / `story:ingest` kısayolları da var.

## Güvenlik

- `ingest-batch.mjs` `--confirm` olmadan hiçbir şey yazmaz.
- `--confirm` verilse bile önce `validate-batch.mjs` çalışır; hata varsa iptal eder.
- Yazma öncesi `assets/kivilcim.db.bak_<zaman>` alınır.
- Agent'ların hiçbiri `--confirm` çalıştırmaya yetkili değildir; bu komut kullanıcıya aittir.
