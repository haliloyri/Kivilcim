# App Store görselleri

Tasarım: `docs/superpowers/specs/2026-11-17-app-store-gorselleri-design.md`
Plan: `docs/superpowers/plans/2026-11-17-app-store-gorselleri.md`

## Klasörler

| Yol | İçerik |
|---|---|
| `raw/<dil>/01..06.png` | Simülatör ham çekimleri, 1320×2868 |
| `screenshots/<dil>/6.9/` | ASC'ye yüklenecek kareler, 1320×2868 |
| `screenshots/<dil>/6.5/` | Aynı kareler, 1284×2778 (ASC 6.5" isterse) |
| `screenshots/<dil>/6.3/` | Aynı kareler, 1206×2622 (orta Dynamic Island) |
| `preview/<dil>/albor-preview.mp4` | Önizleme videosu, 886×1920 |
| `build/` | Ara dosyalar (şerit PNG, şablon verisi); git'e girmez |

Başlıklar: `scripts/store-shots/captions.json`. Şablon: `scripts/store-shots/strip.html`.

## Ekran görüntüsü üretimi

1. iPhone 17 Pro Max simülatörünü aç, uygulamayı bayrakla kur (geliştirici "Yolu önizle" kontrolü gizlenir):

   ```bash
   EXPO_PUBLIC_STORE_SHOTS=1 RCT_METRO_PORT=8081 npx expo run:ios --device "iPhone 17 Pro Max" --port 8081
   ```

2. Hazır durum: onboarding tamam, Profil → Geliştirici → Premium açık, tema Aydınlık, ad boş, kütüphanede 6+ okunan hikâye.
3. Her kareyi uygulamada aç ve çek:

   ```bash
   bash scripts/store-shots/capture.sh tr 01
   ```

   | Kare | Ekran |
   |---|---|
   | 01 | Keşfet, en üst |
   | 02 | Ana hikâye, "Bu hikâyeden ne çıkarıyoruz?" bölümü en üstte |
   | 03 | Sohbette Kullan, "Tek cümle" |
   | 04 | Sohbette Kullan → paylaş simgesi → Kart Oluştur |
   | 05 | Okuma Yolu, unvan kartı |
   | 06 | Kütüphane |

4. Şeridi üret ve dilimle:

   ```bash
   npm run store:shots -- tr
   ```

5. Bitince durum çubuğunu geri al: `xcrun simctl status_bar booted clear`.

Ana hikâye: **1456 — Ayna kutusu** (4 dilde metin ve sohbet varyantı var). Kullanılmayacak id'ler: 1300-1302, 1438-1440, 1480-1482, 1651.

Her karede başlık (`frames`) ve alt başlık (`subs`) vardır; `tagline` kare 1'in üstünde durur. Başlıkta `*yıldız arası*` metin vurgulanır. Bir başlık 2 satırı aşarsa ya da metin, öne çıkan kart, Albi kare sınırını geçerse betik durur: metni kısalt, punto küçültme. Öne çıkan kartların kesim alanları `strip.html` içindeki `POPS` dizisindedir; bir dilde ekran düzeni kayarsa orayı güncelle.
