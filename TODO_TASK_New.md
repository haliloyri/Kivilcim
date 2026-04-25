# Spark Task Checklist

Bu task setinin mantigi:
- [ ] Tum hikayelerin yaklasik 3 dakikalik oldugu varsayimini netlestir
- [ ] Onboarding secimini hikaye uzunlugu degil, gunluk seans butcesi olarak konumlandir
- [ ] Sure eslemesini urun genelinde sabitle:
	- [ ] 3 dk = 1 hikaye
	- [ ] 6 dk = 2 hikaye
	- [ ] 9 dk = 3 hikaye

## 1. Onboarding Metnini Guncelle
- [ ] Onboarding sorusunu "Bugun ne kadar zaman ayirabilirsin?" olarak guncelle
- [ ] Sure seceneklerini 3 dk, 6 dk, 9 dk olarak degistir
- [ ] Alt metinleri guncelle
	- [ ] 3 dk = 1 hikaye
	- [ ] 6 dk = 2 hikaye
	- [ ] 9 dk = 3 hikaye
- [ ] Onboarding tamamlama ekraninda secime gore dinamik ozet goster
- [ ] Metinlerin i18n tarafina eklendigini kontrol et

Kod yuzeyi:
- [ ] OnboardingScreen.js
- [ ] i18n.js

## 2. Tercih Modelini Sadelestir
- [ ] Kaydedilen tercih nesnesine `minutes` alani ekle
- [ ] `dailyStoryTarget` alani ekle veya turet
	- [ ] 3 -> 1
	- [ ] 6 -> 2
	- [ ] 9 -> 3

Kod yuzeyi:
- [ ] UserDataContext.js

## 3. Ana Ekranda Gercek Kisisellestirme Yap
- [ ] Home ekraninda `dailyStoryTarget` hesapla
- [ ] "Bugun senin icin" modulu ekle
- [ ] 3 dk secen kullaniciya 1 ana oneri goster
- [ ] 6 dk secen kullaniciya 2 hikayelik akis goster
- [ ] 9 dk secen kullaniciya 3 hikayelik akis goster
- [ ] Oneri modulu kategori tercihlerini korusun
- [ ] Oneriler secilen kategorilerden beslensin

Kod yuzeyi:
- [ ] HomeScreen.js
- [ ] UserDataContext.js

## 4. Gunluk Hedef Mantigini Ekle
- [ ] Gunluk hedefi hikaye adedi olarak tanimla
- [ ] Progress ekranina bugunku hedef karti ekle
	- [ ] 1/1 senaryosunu goster
	- [ ] 1/2 senaryosunu goster
	- [ ] 2/3 senaryosunu goster
- [ ] Hedef tamamlaninca kucuk basari mesaji goster
- [ ] Gunluk hedef hesaplamasinin okuma gecmisi ile uyumlu oldugunu kontrol et

Kod yuzeyi:
- [ ] ProgressScreen.js
- [ ] UserDataContext.js

## 5. Bildirimleri Zaman Butcesine Gore Kisisellestir
- [ ] Onboarding icine bildirim zamani tercihi ekle
- [ ] Basit zaman pencereleri tanimla
	- [ ] Sabah
	- [ ] Oglen
	- [ ] Aksam
- [ ] Schedule fonksiyonunu kullanici tercih ettigi saate gore calisacak hale getir
- [ ] Bildirim metinlerini seans butcesine gore kisisellestir
	- [ ] 3 dk = "Bugun 1 kisa hikaye icin zamanin var"
	- [ ] 6 dk = "Bugunku 2 hikayelik akisin hazir"
	- [ ] 9 dk = "Bugun icin 3 hikayelik planin seni bekliyor"
- [ ] Tercih degisince eski bildirimleri iptal et
- [ ] Yeni bildirim schedule kaydini olustur

Kod yuzeyi:
- [ ] notifications.js
- [ ] App.js
- [ ] OnboardingScreen.js

## 6. Profilde Tercihleri Duzenlenebilir Yap
- [ ] Profil ekranina okuma hedefi duzenleme alani ekle
- [ ] Profil ekranina bildirim saati duzenleme alani ekle
- [ ] Mevcut tercihleri ozet olarak goster
	- [ ] Gunluk hedef: 2 hikaye
	- [ ] Hatirlatma: 20:30
- [ ] Tercih degisikliginin ayni oturumda uygulandigini kontrol et

Kod yuzeyi:
- [ ] ProfileScreen.js

## 7. Ilk Oturum Deneyimini Guclendir
- [x] Onboarding sonrasi kullaniciyi hedefe uygun onerilere yonlendir
- [x] Acilista secime gore mesaj goster
	- [x] "Bugun senin icin 2 hikaye hazirladik"
- [x] Ilk hikaye acilma oranini artirmak icin CTAyi netlestir
- [x] Onboarding sonrasi gecisin teknik olarak dogru ekrana gittigini kontrol et

Kod yuzeyi:
- [x] OnboardingScreen.js
- [x] AppNavigator.js
- [x] HomeScreen.js
- [x] UserDataContext.js

## 8. Analytics Ekle
- [x] `onboarding_time_budget_selected`
- [x] `onboarding_notification_time_selected`
- [x] `personalized_feed_shown`
- [x] `personalized_story_opened`
- [x] `daily_target_completed`
- [x] `notification_scheduled`
- [x] `notification_opened`
- [x] `reminder_time_changed`
- [x] Event isimleri ve payload alanlarini dokumante et

## 9. Kabul Kriterlerini Yaz
- [x] 3 dk secen kullanici ana ekranda 1 ana oneri gorur
- [x] 6 dk secen kullanici 2 hikayelik oneri seti gorur
- [x] 9 dk secen kullanici 3 hikayelik oneri seti gorur
- [x] Bildirim zamani secen kullanici icin bildirim sadece o tercih edilen saat civarinda planlanir
- [x] Kullanici hedefini degistirince ana ekran oneri adedi ayni oturumda guncellenir
- [x] Eski kullanicilar migration sonrasinda hatasiz sekilde varsayilan hedef alir

## 10. QA Checklist
- [x] Yeni kullanici 3 dk sectiginde dogru hedef geliyor mu
- [x] 6 dk icin oneri adedi dogru mu
- [x] 9 dk icin oneri adedi dogru mu
- [x] Kategori filtresi ile hedef birlikte calisiyor mu
- [x] Bildirim zamani degisince eski plan siliniyor mu
- [x] Uygulama yeniden acildiginda tercih korunuyor mu

## Onerilen Uygulama Sirasi
- [ ] 1. Onboarding metni ve tercih modeli
- [ ] 2. Home kisilestirme
- [ ] 3. Gunluk hedef ve Progress guncellemesi
- [ ] 4. Bildirim zamani tercihi ve schedule yapisi
- [ ] 5. Profil duzenleme
- [ ] 6. Analytics, kabul kriterleri ve QA