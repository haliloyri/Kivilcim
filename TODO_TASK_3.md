# Spark Task Checklist - Minimum Prompt Surumu

## 1. Arama 2.0 (Tek Task)
- [x] Aramayi tek seferde gelistir

Kapsam:
- Govde + alinti + ders + kaynak kitap alanlarinda arama
- Son aramalar
- Bos durumda onerilen aramalar veya populer kategoriler

Beklenen etki:
- Kesif kalitesi ve bulunabilirlik artar

Kod yuzeyi:
- [x] src/screens/SearchScreen.js
- [x] src/db/db.js

## 2. Kutuphane Etkilesimini Artir (Tek Task)
- [x] Kutuphane ekranina filtreleme ve siralama sistemi ekle

Kapsam:
- Siralama: Son eklenenler, En cok okunanlar
- Filtre: Kategoriye gore filtreleme
- Favoriler icin basit koleksiyon mantigi

Beklenen etki:
- Kutuphane tekrar ziyaret edilen aktif bir alana donusur

Kod yuzeyi:
- [x] src/screens/LibraryScreen.js
- [x] src/context/UserDataContext.js

## 3. Ilerleme ekraninda aksiyon odakli yonlendirme ekle
Aciklama: Rozetler ve heatmap guzel ama kullaniciya bir sonraki en mantikli adim net gosterilmiyor.
Yapilacaklar:
- [x] "Bugun 1 hikaye daha oku"
- [x] "Su kategoriden 2 hikaye daha okuyarak rozet kazan"
- [x] "3 gunluk seri icin yarin geri gel"
Beklenen etki: Oyunlastirma daha yonlendirici olur.

Durum:
- [x] Ilerleme ekranina aksiyon odakli yonlendirme kartlari eklendi

Kod yuzeyi:
- [x] src/screens/ProgressScreen.js
- [x] src/locales/i18n.js

## 4. Ana ekranda ucretsiz kullanici icin daha dengeli freemium deneyimi test et
Aciklama: Ilk 2 icerikten sonra sert kilit, bazi kullanicilar icin erken kopus yaratabilir.
Yapilacaklar:
- [x] Gunluk 3. icerik reklamsiz teaser
- [x] Kilitli kartlarda premium fayda anlatimi
- [x] Haftalik 1 bonus acik icerik testi
Beklenen etki: Hem paywall gorunurlugu hem de urun sevgisi dengelenir.

Durum:
- [x] Home ekraninda dengeli freemium akisi uygulandi

Kod yuzeyi:
- [x] src/screens/HomeScreen.js
- [x] src/components/StoryCard.js
- [x] src/locales/i18n.js

## 5. Tema tercihini kalici hale getir
Aciklama: Dark mode davranisi kullanici beklentisine gore daha kalici ve tutarli olmali.
Beklenen etki: Ayarlar ekrani daha guvenilir hissedilir.

Durum:
- [x] Tema tercihi kalici hale getirildi

Kod yuzeyi:
- [x] src/context/ThemeContext.js
- [x] src/screens/ProfileScreen.js

## 6. Profil ekranini gercek "ayarlar merkezi" haline getir
Aciklama: Su an temel ayarlar var ama hesap ve tercih yonetimi sinirli.
Yapilacaklar:
- [x] Bildirim tercihleri
- [x] Okuma hedefi
- [x] Dil ve tema ozeti
- [x] Veri sifirlama ile cikis aksiyonlarini ayristi

Durum:
- [x] Profil ekrani ayarlar merkezi olarak genislestirildi

Kod yuzeyi:
- [x] src/screens/ProfileScreen.js
- [x] src/context/ThemeContext.js
- [x] src/context/UserDataContext.js
- [x] src/locales/i18n.js