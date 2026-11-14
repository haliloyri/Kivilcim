## Mod 5 — Editörden geçenleri DB'ye yaz

Amaç: `hikaye-editor`'ün `N/N passed` raporladığı id'leri yerel DB'ye yazmak. Yazım, araştırma, web yok. Bu mod için en ucuz model yeterli (`haiku`).

1. Id listesini kullanıcıdan veya editör raporundaki `DB_READY_IDS:` satırından al.
2. Yeniden doğrula, her dil için:

```bash
node scripts/p1/validate-dir.mjs <lang> staging/p1-writer/<lang> <id...>
```

   `N/N passed` olmayan id'yi listeden çıkar ve raporla.
3. `db-yazma.md`'deki komutları çalıştır (önce `--dry-run`).

Çıktı: yazılan id sayısı, atlanan id'ler ve nedeni, yedek dosyası.
