## Mod 2 — Kitapların hikâye başlıklarını bul

Amaç: seçilen kitaplar için hikâye başlıklarını bulup `KITAP_HIKAYE_ENVANTERI.md` kuyruğuna `[ ]` satırı olarak eklemek.

1. Hangi kitaplar? Kullanıcıya sor: Mod 1'de eklenen son 10 kitap mı, yoksa kendi seçtikleri mi.
2. Kitap başına hedef **10 hikâye.** Önce kitabın kuyrukta ne kadar başlığı olduğuna bak:

```bash
grep -n "^## " KITAP_HIKAYE_ENVANTERI.md | grep -i "<kitap adı>"
```

3. Her başlık kitabın **içinde gerçekten geçen** bir olay, deney, vaka veya somut örnekten çıkar. Kitap özetinden tahmin yürütme; kaynakla doğrula (WebSearch/WebFetch). Doğrulanamayan olay için başlık önerme.
4. Başlıklar birbirinden farklı olsun: aynı olayın iki yüzü yok, aynı kalıpta jenerik başlık yok (örn. "Bir Liderin Kriz Anında Verdiği Karar" tarzı kitaptan bağımsız başlık yasak). Başlık o kitaba özgü olmalı.
5. Süre ata: 1 dk / 3 dk / 5 dk. Kelime hedefleri mevcut satırlardaki gibi kalsın (örn. `3 dk · 475 ±75`). Sayıları elle uydurma: `scripts/p1/lang-config.mjs` ve mevcut satırlar neyse onu kopyala.
6. Kitap envanterde yoksa `# Sisteme Eklenmemis Kitaplar` bölümünün altına yeni `## <Kitap>` bloğu aç (Yazar / Kategori / Yil / Durum satırlarıyla, mevcut bloklardaki biçimle). Satırlar şu biçimde:

```md
1. [ ] **URETILECEK** — <Başlık> — <Kitap> — **Sure:** 3 dk · **Kelime:** 475 ±75
```

7. Sayaçlar (`Uretim kuyrugu`, `Sisteme eklenmemis kitap`) `sync-inventory.mjs` ile yenilenir; elle düzenleme. Kullanıcıya bunu hatırlat.

Çıktı: kitap başına başlık listesi + her başlığın dayandığı kaynak.
