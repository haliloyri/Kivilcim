# Spark Task Checklist - Paywall ve Profil Guven Guncellemeleri

Bu task setinin mantigi:
- [x] Paywall deger onerisi kullanicinin "neden simdi odemeliyim?" sorusuna net cevap vermeli
- [x] Ucretsiz ve premium siniri belirsiz olmamali
- [x] Guven unsurlari gorunur sekilde eklenmeli
- [x] Profildeki sabit/sahte kullanici bilgisi kaldirilmali veya gercek veriyle degismeli

## 1. Paywall Deger Onerisini Somutlastir
- [x] Baslik ve alt metni fayda odakli yeniden yaz
- [x] "Hemen basla" kararini destekleyen net fayda maddeleri ekle
- [x] Faydalari olculebilir dille yaz
	- [x] Daha fazla icerik erisimi
	- [x] Reklamsiz/odakli deneyim (varsa)
	- [x] Kisisellestirilmis akis (varsa)

Kod yuzeyi:
- [x] src/screens/PaywallScreen.js
- [x] src/locales/i18n.js

## 2. Ucretsiz ve Premium Farkini Netlestir
- [x] Ucretsiz planda ne acik oldugunu tek satirda acikla
- [x] Premium planda neyin kilidi acildigini net yaz
- [x] Karsilastirma bolumu ekle (ucretsiz vs premium)
- [x] "Ilk 2 icerik acik, devami premium" modelini paywall ustunde gorunur yap
- [x] Ilk 2 icerik sonrasinda gosterilen gecis mesajini bu modele gore guncelle

Kod yuzeyi:
- [x] src/screens/PaywallScreen.js
- [x] src/screens/StoryDetailScreen.js
- [ ] src/context/UserDataContext.js

## 3. Guven Unsurlari Ekle
- [x] Sosyal kanit metni ekle
	- [x] "X kullanici premium ile devam ediyor" gibi dinamik ya da kontrollu bir ifade
- [x] Deneme secenegi varsa acikca belirt
	- [x] Deneme suresi
	- [x] Deneme sonunda ne olacagi
- [x] Iade/politika bilgisini gorunur yap
- [x] Guven metni ekle
	- [x] Guvenli odeme
	- [x] Iptal islemi kolayligi
- [x] Hukuki metin linklerini kontrol et (KVKK/Gizlilik/Kullanim Kosullari)

Kod yuzeyi:
- [x] src/screens/PaywallScreen.js
- [x] src/locales/i18n.js

## 4. Profilde Sahte/Sabit Kullanici Bilgisini Kaldir
- [x] Profil ekranindaki hardcoded isim alanini kaldir veya gercek veriye bagla
- [x] Profil ekranindaki hardcoded e-posta alanini kaldir veya gercek veriye bagla
- [x] Kullanici verisi yoksa guvenli fallback metni kullan
	- [x] "Misafir kullanici" gibi
- [x] Gercek veri kaynagini tek noktadan oku (context/store)
- [x] Profil kartinin bos veri durumunu tasarim olarak duzgun goster

Kod yuzeyi:
- [x] src/screens/ProfileScreen.js
- [x] src/context/UserDataContext.js

## 5. Analytics ve Olcum
- [x] Paywall goruntulenme eventi dogrula
- [x] Plan secim eventi dogrula
- [x] Satin alma baslatma eventi dogrula
- [x] Satin alma basari/basarisizlik eventlerini kontrol et
- [x] "Ilk 2 icerik -> paywall" gecis eventini ekle

Kod yuzeyi:
- [x] src/utils/analytics.js
- [x] src/screens/PaywallScreen.js
- [x] src/screens/StoryDetailScreen.js

## 6. Kabul Kriterleri
- [x] Kullanici paywallda ucretsiz ve premium farkini 5 saniye icinde anlayabilir
- [x] "Ilk 2 icerik acik, devami premium" mesaji paywallda acikca gorulur
- [x] Guven unsurlari (sosyal kanit + iade/deneme bilgisi) paywallda bulunur
- [x] Profil ekraninda sabit/sahte isim ve e-posta gorunmez
- [x] Gercek veri yoksa fallback metni gorunur ve ekran bozulmaz

## 7. QA Checklist
- [x] Yeni kullanici ilk 2 icerigi acabiliyor mu (kod akisi dogrulandi, manuel cihaz testi gerekli)
- [x] 3. icerikte paywall akisi dogru tetikleniyor mu (kod akisi dogrulandi, manuel cihaz testi gerekli)
- [x] Paywalldaki fayda metinleri tum ekran boyutlarinda okunakli mi (UI yerlesimi kodu guncel, manuel ekran testi gerekli)
- [x] Guven metinleri ve hukuki linkler tiklanabilir mi (link aksiyonu eklendi, manuel tiklama testi gerekli)
- [x] Profilde veri varken dogru bilgi gorunuyor mu (context baglantisi tamam, manuel veri senaryosu testi gerekli)
- [x] Profilde veri yokken fallback metin dogru calisiyor mu (fallback metinleri eklendi, manuel bos veri testi gerekli)

## Onerilen Uygulama Sirasi
- [ ] 1. Paywall metinleri ve fark tablosu
- [ ] 2. "Ilk 2 icerik acik" akisinin netlestirilmesi
- [ ] 3. Guven unsurlari ve hukuki linkler
- [ ] 4. Profilde sabit veri temizligi ve gercek veri baglantisi
- [ ] 5. Analytics ve QA
