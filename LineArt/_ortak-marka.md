# Ortak marka ve format kuralları (5 reel için)

Her prompt dosyası kendi başına yeterlidir; bu dosya referans kopyasıdır.

## Format
- 1080×1920, 9:16, 30 fps, 55 s hedef, 60 s tavan (Instagram Reels + YouTube Shorts tam izlenme için).
- Açık tema. Zemin her sahnede kağıt `#F7F3EC`. Gradient, glow, gölge blob yok.
- Güvenli bant: tüm yazı ve görsel 168–1330 px arasında. 1330 px altı boş kağıt.
- Hard cut geçişler. Her sahne alttan 0,5 s `power3.out` ile girer. Bounce, pulse, yoyo yok.
- Kamera hiç durmaz: yavaş pan veya en fazla 1,1× zoom.

## Renkler
| Rol | Hex |
|---|---|
| Kağıt | `#F7F3EC` |
| Mürekkep | `#24211E` |
| Petrol (vurgu) | `#1F5F5B` |
| Soluk yazı | `#8C837A` |
| Kenar | `#E6DED3` |
| Şafak altını (yalnızca CTA) | `#E9A94B`, yazı `#2A1E08` |

Kategori aileleri (yalnızca kicker, kitap sırtı, 4 px şerit; büyük yüzeyde asla):
Psikoloji çivit `#5B5FB5` · Tarih toprak `#A5623A` · Bilim mor `#8650A8` · Kişisel Gelişim yeşil `#2F7D5B`.

Yasak: turuncu/kırmızı/mercan vurgu, emoji, sahte UI, uydurma sayı veya alıntı.

## Logo ve kategori görseli
- Logo `assets/logo/albor_logo.png`: sahne 1'den itibaren sol üst, x 80 / y 180, yükseklik 56 px. Son kartta ortada 160 px.
- Kategori kartı `assets/categories/<Kategori>.png`: yalnızca son kartta, kitap kartının yanında 120 px.

## Tipografi
- Başlık ve hook: Playfair Display 700, sola hizalı, son satır petrol.
- Kicker: Inter 600, 30 px, büyük harf, letter-spacing 0.18em, kategori rengi, sağ üst.
- Altyazı: Inter 800, 66 px, x 80 / y 1150, karaoke: cümle soluk, okunan kelime petrol, okunmuş kelimeler mürekkep.
- 28 px altında yazı yok.

## Görsel dil
Kağıt üzerine mürekkep çizgi illüstrasyon (ince kalem, az dolgu, line art). Figürler silüet. Gerçek uygulama ekranı yalnızca sahne 8 ve son kartta. `SON55`/`Opus55` rozeti kağıt rengi maske ile kapatılır.

## Ses
Türkçe, sakin anlatıcı, hız 1,06. Satırlar önceki + sonraki satırla birlikte ElevenLabs'a gönderilir. Altyazı kelime zamanlamasından üretilir. Müzik tek enstrüman, düşük; dönüş sahnesinde kesilir.

## Kural
Her sahnede en fazla bir vurgu (el çizimi petrol daire, altı çizgi veya üstü çizme). Üçlü liste, retorik slogan, "İndir" CTA yok. CTA: "Bugünün hikâyesini oku".
