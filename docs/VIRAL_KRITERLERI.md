# Viral Puanlama Kriterleri

Kaynak: `Hikaye_Viral_Puanlari.xlsx` Rubrik sayfası (`build.mjs`), `scripts/score-viral-root-chunk.mjs`.
Puanlar editoryal tahmindir. Gerçek beğeni, paylaşım, kaydetme ve ses kaydı verisi değildir.

## Kriterler (toplam 100) — Instagram ağırlıkları

Instagram'ın açıkladığı ana sıralama sinyalleri: izlenme süresi, erişim başına beğeni, erişim başına DM gönderimi (takipçi olmayanlara ulaşmada en güçlüsü). Kaydetme ikincil sinyal. Ağırlıklar buna göre ayarlandı. Bunlar tahmindir, Instagram insight verisiyle kalibre edilmelidir.

| Kriter | Azami (yeni) | Eski | Tam puan ölçütü |
|---|---|---|---|
| Dikkat / Hook | 15 | 15 | İlk 3 saniyede izleyiciyi tutar (görsel veya sesli hook); dürüst bir merak veya ters köşe yaratır. |
| Duygusal Bağ / Beğeni | 10 | 10 | Şaşkınlık, umut, empati veya "bu tam ben" hissi oluşturur. |
| Paylaşma Dürtüsü (DM) | 20 | 15 | Okur hikâyeyi hemen bir arkadaşına DM ile göndermek ister. |
| Kaydetme Değeri | 10 | 15 | Sonra kullanılacak bir fikir, soru, yöntem veya çerçeve verir. Carousel için önemli. |
| Sesli Not / Sohbet | 5 | 10 | Kullanıcı kendi örneğini 30–60 saniyede anlatabilir (Albor'a özgü, Instagram sinyali değil). |
| Hikâye Akışı | 10 | 10 | Sahne, gerilim, dönüş ve tatmin edici sonuç içerir. |
| Kısa Video Uygunluğu | 25 | 20 | 30–45 saniyeye sığar; 3–5 görsel sahne ve net final sunar; sonuna kadar izlenir, tekrar izletir. |
| Güven / Doğruluk | 5 | 5 | Ana iddia doğrulanabilir, dikkatli ifade edilmiş ve marka güvenlidir. |

CSV sütun eşleşmesi: `hook`, `emotion`, `share`, `save`, `voice`, `arc`, `video`, `trust`.

Yeni toplam, eski alt puanlar yeni azami değere oranlanarak hesaplanır: `yeni_toplam = Σ (alt_puan / eski_azami × yeni_azami)`. Alt puanlar yeniden puanlanmadı. Yeniden hesaplanmış liste: [viral_puanlari_ig_agirlik.csv](viral_puanlari_ig_agirlik.csv).

Etki: ilk 27'nin 22'si, ilk 93'ün 85'i aynı kaldı. Öncelikli video 27'den 24'e, Düşük öncelik 170'ten 206'ya çıktı (eşikler aynı tutuldu).

Bilinen açıklar: tek toplam Reel ve carousel'i ayrı ölçmüyor; hikâye akışı ile video uygunluğu kısmen aynı şeyi sayıyor; `voice` anlamı yorum tetikleyiciye çevrilirse o sütun yeniden puanlanmalı.

## Karar eşikleri (toplam puana göre)

| Toplam | Karar | Eylem |
|---|---|---|
| 90–100 | Öncelikli video | Doğruluk kontrolü sonrası üret |
| 85–89 | Video kuyruğu | 2–3 hook ile test et |
| 78–84 | Revize et | Zayıf alt puanı güçlendir |
| 70–77 | Kartla test | Carousel/kart verisi topla |
| 0–69 | Düşük öncelik | Şimdilik bütçe ayırma |

## Önerilen format (sütun `recommended_format`)

Sırayla ilk uyan kural geçerlidir (R=toplam, P=video, M=save, L=share, N=voice):

1. R ≥ 85, P ≥ 16, M ≥ 12, L ≥ 12: **Reel + Carousel**
2. R ≥ 85, P ≥ 16, N ≥ 8: **Soru odaklı Reel**
3. R ≥ 85, P ≥ 16: **Reel / Short**
4. M ≥ 11: **Carousel**
5. Diğer: **Kart testi**

## Doğrulama notu (sütun `fact_check_note`)

- trust ≤ 3: Kaynak kontrolü şart
- trust = 4: Kaynak kontrolü önerilir
- trust ≥ 5: Standart doğrulama

## Hazırlık (sütun `readiness`)

- Zengin: hook, punchline, 30 saniye, soru ve karşıtlık alanlarının hepsi dolu.
- Temel: içerik puanlandı, video metni ayrıca hazırlanmalı.

## Puanlama yöntemi

- Kapsam: Türkçe hikâyeler, story_id 1059–1808 (750 hikâye).
- Sıralama: toplam puana göre; eşitlikte video, sonra paylaşım puanına göre.
- Ham puanlar `raw/score_*.json` dosyalarında. Dört parça: 1059–1245, 1246–1432, 1433–1619, 1620–1808.
- **1620–1808 aralığı kural tabanlı betikle puanlandı** (`scripts/score-viral-root-chunk.mjs`, yalnızca bu aralığı okur). Diğer üç parçanın nasıl üretildiği bu dosyalardan belli değil.

### Betiğin kuralları (1620–1808)

Her puan bir taban değerden başlar, metindeki sinyallere göre artar, sonra üst sınıra kırpılır.

| Kriter | Taban | Artış sinyalleri |
|---|---|---|
| hook | 6 | zengin alanlar +1, soru +2, sayı +1, karşıtlık +1, somut nesne +1, başlık 20–70 karakter +1 |
| emotion | 3 | duygu kelimeleri (en çok +3), evrensel konu ≥2 +1, yüksek risk kelimesi +1, umut/dönüş kelimesi +1 |
| share | 5 | zengin +1, evrensel konu (en çok +2), karşıtlık +2, kısa açıklama (35–185 karakter) +1, soru +1, sayı veya somut nesne +1 |
| save | 5 | uygulama kelimeleri (en çok +3), zengin ve soru +1, sayı +1, evrensel konu ≥2 +1, eylem kelimesi +1 |
| voice | 4 | zengin ve soru +1, hook'ta kişisel hitap +1, duygu ≥2 +1, karşıtlık +1, somut nesne +1 |
| arc | 3 | zengin +1, özel ad veya sayı +2, olay kelimesi +1, çatışma kelimesi +1, sonuç kelimesi +1 |
| video | 7 | zengin +2, somut nesne +3, özel ad veya sayı +2, karşıtlık +2, kısa açıklama +1, görsel eylem fiili +1 |
| trust | 4 | sayı ve özel ad ve sağlık riski yok +1; sağlık riski kelimesi −1 |

Kelime listeleri betikte tanımlıdır (`emotional`, `universal`, `practical`, `contrast`, `visual`, `stakes`, `action`, `healthRisk`). Bazı hikâyelere elle ayar eklenmiştir (`manualBoosts`, 25 hikâye, 1693–1807).

Betik üst sınırları eski ağırlıklarla kırpar: hook 15, emotion 10, share 15, save 15, voice 10, arc 10, video 20, trust 5. Yeni ağırlıklar bu çıktıdan sonra oranlanarak uygulanır.

## Sınırlar

- Puanlar gerçek performansla doğrulanmadı. Yayın verisi geldikçe (paylaşım/okuma, kaydetme/okuma, ses kaydı/okuma oranları) ağırlıklar güncellenmeli.
- Video üretiminden önce ana iddia ve görsel hakları kontrol edilmeli.
