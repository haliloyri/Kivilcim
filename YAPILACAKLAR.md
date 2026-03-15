# 📝 Kıvılcım Uygulaması - Eksik Özellikler ve Yapılacaklar (TODO)

Bu liste, uygulamanın MVP (Minimum Değerli Ürün) aşamasından tam sürüme geçmesi için gereken eksiklikleri ve iyileştirmeleri içerir.

## 📺 1. Eksik Ekranlar (Screens)
- [x] **Kütüphane (LibraryScreen):** Kullanıcının daha önce okuduğu veya "Sevdiği" hikayeleri görebileceği ekran.
- [x] **Profil (ProfileScreen):** Kullanıcı ayarları, abonelik durumu ve "İlerleme" istatistiklerine hızlı erişim.
- [x] **Arama/Keşfet Sonuçları:** Kategorilere tıklandığında açılacak liste ekranı.

## 🛠 2. Eksik Fonksiyonaliteler (Features)
- [x] **Kalıcı Veri Depolama (Persistence):** 
  - `AsyncStorage` veya `SQLite` kullanarak favorilerin ve okuma geçmişinin kaydedilmesi.
  - Onboarding seçimlerinin (kategoriler, süre) kaydedilmesi.
- [x] **Sesli Anlatım Modu (Audio Mode):** Hikayelerin sesli okunması için `expo-av` veya `expo-speech` entegrasyonu.
- [x] **Gelişmiş Paylaşım:** Paylaşım kartlarına daha fazla tasarım teması eklenmesi.
- [x] **Abonelik Entegrasyonu:** Paywall ekranının gerçek bir ödeme akışına (örn. RevenueCat) bağlanması.
- [x] **Arama Çubuğu:** Ana ekranda hikaye başlığına veya içeriğine göre arama yapabilme.

## 🎨 3. UI/UX İyileştirmeleri
- [x] **Bildirim Sistemi:** Kullanıcıya her gün seçtiği saatte "Günün Kıvılcımı" bildirimi gönderilmesi.
- [x] **Ayarlar Menüsü:** Koyu/Açık mod anahtarı, yazı boyutu sıfırlama vb.
- [x] **Skeleton Loaders:** Veriler yüklenirken (veya emüle edilirken) boş beyaz ekran yerine yükleme animasyonları.

## ⚙️ 4. Teknik/Mimari İşler
- [x] **Navigation Refactoring:** `App.js` içindeki manuel `if/else` yapısının `React Navigation` veya `Expo Router` ile değiştirilmesi.
- [x] **Merkezi State Yönetimi:** `Context API`'nin sadece tema için değil, kullanıcı verileri (streak, read_stories) için de genişletilmesi.

---
> [!NOTE]
> Bu liste `ROADMAP.md` ile paralel olarak güncellenmeli ve her tamamlanan madde için ekran görüntüsü/kaydı alınmalıdır.
