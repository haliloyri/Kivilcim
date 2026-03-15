# Kıvılcım Uygulaması Geliştirme Yol Haritası

## 📱 1. Okuma Deneyimi (Reading UX)
- [ ] **Okuma İlerleme Çubuğu:** Hikaye detay ekranının üst kısmında okuma miktarını gösteren altın renkli (#C8A96A), 3px kalınlığında dinamik çizgi.
- [ ] **Metin Boyutu Ayarı:** `StoryDetailScreen` ekranında kullanıcının font boyutunu (A- / A+) kendi isteğine göre ayarlayabileceği şık bir kontrol paneli.
- [ ] **Sayfa Sonu "Ders" Kutusu ve Bitiş:** Hikaye bittiğinde çıkan ders bölümünün daha editoryal bir vurguyla tasarlanması, altına premium bir çizgi (separator) eklenmesi.

## 📸 2. Sosyal Paylaşım (Instagram Kartları)
- [ ] **Kare Şablon (1080x1080):** Ekranın arka planında gizli render edilecek, Playfair fontuyla başlık ve italik alıntı içeren estetik kart şablonu.
- [ ] **Görüntü İşleme (react-native-view-shot):** Oluşturulan HTML/View şablonunun resme dönüştürülüp cihazın yerel "Share" (Paylaş) API'siyle entegrasyonu.
- [ ] **Tema Seçenekleri:** Paylaşım öncesinde Kâğıt (Açık) veya Mürekkep (Koyu) teması seçimi sunulması.

## 📰 3. Ana Sayfa Düzeni (Editoryal Grid)
- [ ] **Manşet Kartı:** Günün en önemli veya en yeni hikayesinin ekranın en üstünde tam genişlikte (manşet) gösterilmesi.
- [ ] **İkincil Kartlar (Grid):** Manşet hikayesinin altında 2 kolonlu bir grid yapısıyla diğer günlük okuma hedeflerinin listelenmesi.

## 🏆 4. İlerleme & Oyunlaştırma Sistemi
- [ ] **Okuma Isı Haritası (Heatmap):** Profil veya İlerleme sayfasında GitHub stili yıllık/aylık okuma sıklığını gösteren bir grafik.
- [ ] **Premium Rozet Sistemi:** Kategorilerde (örn: Psikoloji 10 hikaye) kilometre taşlarına gelindiğinde gazete mühürü estetiğinde rozetler (bordo border + altın rank).
- [ ] **Animasyonlar:** `react-native-reanimated` kullanılarak rozet kazanıldığında dikkat çeken ama göz yormayan (0.8 sn süreli) yumuşak pop-up animasyonların gerçekleştirilmesi.

## ⚙️ 5. Kod Mimarisi (Refactoring) & Tema
- [x] **Mürekkep (Koyu) Modu:** `src/theme/theme.js` dosyasındaki `dark` renk tanımlarıyla uygulamanın dinamik olarak gece/gündüz moduna geçmesi.
- [x] **Modüler Klasör Yapısı:** Mevcut `App.js` dosyasındaki tüm kodların profesyonel bir büyüme için klasörlere ayrılması:
  - Ekranlar: `src/screens/`
  - Yeniden Kullanılabilir Bileşenler: `src/components/`
  - Rotalama/Navigasyon (React Navigation / Expo Router): `src/navigation/`
