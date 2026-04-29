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

## 10. New Design
1. Ana Sayfa (Keşfet) Tasarımı
• [x] Mesh Gradient Uygulaması: Hero kartındaki düz gradyanı, daha derinlikli bir "mesh gradient" (altın, krem, kehribar tonları) ile değiştir.
• [x] Tipografi Hiyerarşisi: Başlıklarda yüksek kontrastlı serif (Playfair Display vb.), kullanıcı arayüzü metinlerinde ise temiz bir sans-serif (SF Pro, Inter) kullan.
• [x] "Sohbette Kullan" Butonu: İlk hikaye kartının hemen altına, kartla bütünleşik ama görsel olarak ayrışan (ince kontürlü) bir buton ekle.
• [x] Kategori Hapları (Pills): Kategori butonlarına hafif bir dış gölge ve daha fazla yuvarlatılmış köşeler ekleyerek "Apple-level" yumuşaklığına ulaştır.
• [x] Say This Today (Kart Destesi): Kartlar arası geçişe hafif bir 3D rotasyon veya üst üste binme (stacking) efekti ekle.
2. Hikaye Detay ve Sohbet Kiti Sayfaları
• [x] "Conversation Toolkit" Sayfa Tasarımı: Kullanıcıyı "Punchline", "Conversation Starter" ve "Key Contrast" gibi farklı anlatım formatlarının olduğu yeni bir sayfaya yönlendir.
• [x] Anlattım (Mark as Used) Özelliği: Her formatın yanına veya hikaye sonuna "Bunu gerçek hayatta kullandım ✅" butonu ekle.
• [x] Bağlamsal Varyasyonlar: Kartların üzerine "Toplantı", "Sosyal Ortam", "1:1 Görüşme" gibi minik etiketler ekleyerek kullanım alanını belirt.
• [x] Kopyalama Deneyimi: Metne tıklandığında ekranın altında beliren zarif, pastel tonlarda bir onay mesajı (toast) tasarla.
• [x] Shared Element Transition: Ana sayfadaki hikaye başlığının, detay sayfasına geçerken süzülerek yerine oturduğu bir geçiş animasyonu kurgula.
3. İlerleme (Progress) Sayfası
• [x] Reading Habit (Takvim) Revizesi: Takvimdeki kareleri daha yuvarlak köşeli yap veya dairesel bir form kullan; boş günlerin rengini arka planla daha uyumlu (neredeyse transparan) hale getir.
• [x] Rozet (Badge) Tasarımları: Rozetleri daha değerli hissettirmek için üzerlerine hafif bir cam efekti (glassmorphism) veya 3D dokunuş ekle.
• [x] İlerleme Çubukları: Kilitli rozetlerin altına, kullanıcının hedefe ne kadar yaklaştığını gösteren (örn: 22/25) çok ince progress bar'lar ekle.
• [x] Sohbet İstatistikleri: Sayfaya sadece "okuma" değil, "kaç hikaye anlatıldığına" dair yeni bir sayaç veya kart ekle.
• [x] Boş Durum (Empty State) Tasarımı: "Active Stories" alanı boşken görünecek daha ilham verici bir ikon ve metin (örn: "İlk kıvılcımı çakmaya hazır mısın?") hazırla.
4. Genel UX ve Oyunlaştırma (Gamification)
• [x] Yeni Rozet Tanımları: Sadece okumaya değil, anlatmaya dayalı "Storyteller" (10 Anlatım), "Icebreaker" (İlk Sohbet Başlatıcı) gibi yeni başarımlar oluştur.
• [x] Kullanım Sonrası Geri Bildirim: "Anlattım" butonuna basıldıktan sonra, çok kısa bir mikro-anketle ("Nasıl geçti? ⭐") deneyimi puanlat.
• [x] Kilit Mekanizması: Bazı üst düzey rozetleri (örn: Sage/Bilge) almak için "en az 3 farklı kategoriden hikayeyi gerçek hayatta kullanmış olma" şartını koda ekle.

## 11.New Design V2
1. Ana Ekran (Keşfet) Temizliği ve Hiyerarşi
• [x] Rozet Kartını Kaldır: Ekranın en tepesindeki o büyük, hantal rozet kartını sil.
• [x] Progress Ring (Halka) Ekle: Sağ üst köşeye, "Profil" veya "Bildirim" alanının yakınına, günlük hedefini gösteren %'li ve zarif bir ilerleme halkası ekle. (Dokunulduğunda Progress sayfasına gitsin).
• [x] Hero Section'ı Odakla: "Günün Odak Noktası" kartını en tepeye al. İçindeki gereksiz ikonları temizle, sadece vurucu başlık ve "3 Dakikada Öğren" butonu kalsın.
• [x] Editorial Liste Düzeni: Hikaye listesini, yan yana kartlar yerine, aşağı doğru akan, geniş beyaz alanlı (whitespace) ve büyük tipografili bir "dergi" düzenine geçir.
• [x] Aksiyon Butonu: Her hikaye kartının altına "Sohbette Kullan" butonunu, ince bir kontür ve sade bir ikonla standart hale getir.
2. Görsel Cila (Apple-Level UI)
• [x] Mesh Gradient: Hero kartın arka planını düz renk yerine, altın, bal rengi ve krem tonlarının birbirine karıştığı "mesh gradient" yap.
• [x] Tipografi Eşleşmesi: Başlıklarda mutlaka yüksek kontrastlı bir Serif font (Playfair Display vb.) kullan. UI metinleri (dakika, kategori) için SF Pro veya Inter kullan.
• [x] Glassmorphism: "Pratik Yap" mikrofonunu ve alt navigasyon çubuğunu, arkadaki içeriği hafifçe flulaştıran (blur) şeffaf bir yüzey haline getir.
• [x] Floating Action Button (FAB): Sağ alt köşeye "Pratik Yap" mikrofonunu, dairesel ve cam efektli bir buton olarak yerleştir.
3. İlerleme (Progress) Sayfası Dönüşümü
• [x] GitHub Grid Revizesi: "Reading Habit" takvimindeki karelerin köşelerini maksimum seviyede yuvarlat (neredeyse daire olsun) ve boş günleri arka plan rengine çok yakın bir tona çek.
• [x] "Sıradaki Hedef" Spotlight: Sayfanın üst kısmına, kullanıcının kazanmaya en yakın olduğu rozeti (örn: "Bilge Rozeti için 2 hikaye kaldı") gösteren özel bir kart ekle.
• [x] Mücevher Estetiği: Rozet ikonlarını düz çizim yerine, hafif gölgeli ve derinliği olan "dijital madalyon" gibi tasarla.
• [x] İstatistik Ayrıştırması: Sadece "Okuma" değil, "Sohbette Kullanma" (anlatım) sayısını da ayrı bir sayaç olarak ekle.
4. Mikro-Etkileşimler (UX)
• [x] Hızlı Kopyala: "Hemen Kullan" (Punchline) kartlarına uzun basıldığında (haptic touch) metni kopyalayan ve ekranda zarif bir "Kopyalandı ✨" mesajı çıkaran akışı kur.
• [x] Bildirim Noktası: İlerleme sayfasında yeni bir rozet veya başarı olduğunda, alt menüdeki ikonun üzerine çok küçük, altın rengi bir bildirim noktası ekle.

## Onerilen Uygulama Sirasi
- [ ] 1. Paywall metinleri ve fark tablosu
- [ ] 2. "Ilk 2 icerik acik" akisinin netlestirilmesi
- [ ] 3. Guven unsurlari ve hukuki linkler
- [ ] 4. Profilde sabit veri temizligi ve gercek veri baglantisi
- [ ] 5. Analytics ve QA

## Görsel İyileştirmeler
[] 23. İlerleme ekranında Sıradaki en iyi adımlar dinamik olsun. Bu kısmı analiz edelim. ***
[] 11. Spark logosu ekranda şu an baklava dilimi gibi. Ateşli bir S şeklinde kitap ayracı olsun.
[] 12. Rozet görsellerini gözden geçir.
[] 13. Kategori görsellerini gözden geçir.

## Onerilen Uygulama Sirasi
- [ ] 1. Onboarding metni ve tercih modeli
- [ ] 2. Home kisilestirme
- [ ] 3. Gunluk hedef ve Progress guncellemesi
- [ ] 4. Bildirim zamani tercihi ve schedule yapisi
- [ ] 5. Profil duzenleme
- [ ] 6. Analytics, kabul kriterleri ve QA