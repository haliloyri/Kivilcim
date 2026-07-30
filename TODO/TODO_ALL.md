# Albor Birleşik TODO Planı

Bu dosya, aşağıdaki kaynaklarda tamamlanmamış görünen işleri tek bir fazlı
backlog altında toplar:

- `TODO_TASK.md`
- `TODO_TASK_New.md`
- `TODO_TASK_NEW_DESIGN.md`
- `TODO_PRODUCT_MARKETING.md`

Kaynak dosyalar geçmişi ve tamamlanmış maddeleri korumak için bu klasörde
saklanır. Bu planda tekrar eden maddeler birleştirilmiş, birbiriyle çelişen eski
kararlar ise uygulama işi olmadan önce doğrulanacak ürün kararlarına çevrilmiştir.

> Açık checkbox tek başına kodun eksik olduğunu kanıtlamaz. Özellikle Faz 0,
> daha eski dosyalarda açık bırakılmış ancak daha yeni kabul kriterlerinde
> tamamlanmış görünen işleri kod ve cihaz davranışıyla doğrulamak içindir.

## Faz 0 — Mevcut Durumu Doğrula ve Ürün Kararlarını Kilitle

### 0.1 Zaman bütçesi ve kişiselleştirme denetimi

- [ ] Tüm hikâyelerin yaklaşık üç dakika olduğu ürün varsayımını netleştir.
- [ ] Onboarding seçimini hikâye uzunluğu yerine günlük seans bütçesi olarak
  konumlandır.
- [ ] `3 dk → 1 hikâye`, `6 dk → 2 hikâye`, `9 dk → 3 hikâye` eşlemesini
  onboarding, profil, Home, Progress ve bildirimlerde uçtan uca doğrula.
- [ ] Onboarding sorusunun, seçeneklerin, alt metinlerin ve dinamik tamamlanma
  özetinin dört dilde doğru olduğunu doğrula.
- [ ] Tercih modelindeki `minutes` ve `dailyStoryTarget` alanlarının migration,
  persistence ve aynı oturumdaki güncellemelerle doğru çalıştığını doğrula.
- [ ] Home önerilerinin hedef adedine ve seçili kategorilere göre üretildiğini
  doğrula.
- [ ] Günlük hedefin okuma geçmişiyle uyumunu; `1/1`, `1/2` ve `2/3`
  görünümlerini ve hedef tamamlanma mesajını doğrula.
- [ ] Sabah/öğle/akşam bildirim tercihini, seans bütçesine göre metinleri, eski
  schedule iptalini ve yeni schedule kaydını doğrula.
- [ ] Profilde okuma hedefi ve hatırlatma zamanının düzenlenebildiğini, mevcut
  değerlerin özetlendiğini ve değişikliklerin aynı oturumda uygulandığını doğrula.

### 0.2 Çelişen ürün kararları

- [ ] Home kartlarında `Sohbette Kullanılabilir` etiketinin kaldırılmış olarak
  mı kalacağına, yoksa yeniden ekleneceğine karar ver.
- [ ] Temel başarı sinyalinin hikâye tamamlama mı, `Sohbette Kullan` ekranına
  geçiş mi olacağına karar ver.
- [ ] Sohbet varyantlarının tamamının ücretsiz mi olacağına, yoksa yalnız tek
  cümlenin ücretsiz olup diğerlerinin Premium ile kilitleneceğine karar ver.
- [ ] Ücretsiz kullanıcıların geçmiş ve favorilere erişip erişemeyeceğini
  kararlaştır; mevcut veri koruma ve kullanıcı güveniyle uyumunu değerlendir.
- [ ] “İlk iki içerik açık” sert kapısı ile günlük/reklam destekli freemium
  modelinden hangisinin geçerli olacağını kesinleştir.
- [ ] Eski `Kıvılcım Premium` metinlerini güncel `Albor` markasıyla nasıl
  kullanacağını belirle.

### Faz 0 çıkış kriteri

- [ ] Yukarıdaki davranışlar kod ve mümkünse cihaz kanıtıyla sınıflandırıldı:
  gerçekten eksik, tamamlanmış veya ürün kararıyla iptal.
- [ ] Çelişen ürün kararları tek bir geçerli ürün sözleşmesine bağlandı.

## Faz 1 — Ana Akış ve Sohbette Kullan Deneyimi

- [ ] Home ekranının birincil CTA’sını güncel ürün kararına göre
  `Bugün Ne Söyleyeceksin?` odağında netleştir.
- [ ] Hikâye kartlarında okuma süresi ile sohbet aksiyonunun görsel önceliğini
  ürün kararına göre düzenle.
- [ ] Story Detail ekranında okuma ve ders içeriğini korurken
  `Sohbette Kullan` CTA’sını ve “Bu hikâyeyi gerçek hayatta nasıl söylersin?”
  açıklamasını belirginleştir.
- [ ] Ücretsiz kullanıcının completion davranışını Faz 0’da seçilen başarı
  sinyaline göre uygula.
- [ ] `Sohbette Kullan` ekranını ikincil araç yerine temel ürün akışı olarak
  tanımla ve giriş noktalarını tutarlı hale getir.
- [ ] Varyant sırasını ve adlarını kesinleştir: tek cümle, 30 saniye, vurucu
  ders, sohbet açan soru ve kapanış/kontrast.
- [ ] Premium varyant kararı seçilirse kilitli alanlarda bulanık önizleme ve
  “Bu versiyon Premium’da” açıklaması göster.
- [ ] Kısa hikâye adını ve `Nasıl Kullanılır` alanını ürün akışına ekle veya
  mevcut karşılığını doğrula.

### Faz 1 çıkış kriteri

- [ ] Home → Story Detail → Sohbette Kullan akışı tek ve anlaşılır bir başarı
  döngüsü oluşturuyor.
- [ ] Dört dilde metin ve erişilebilirlik etiketleri mevcut.

## Faz 2 — Kullanım Sinyali, Hafıza ve Kişisel Değer

- [ ] Copy, share ve `Bunu kullandım` aksiyonlarından hangilerinin gerçek
  “kullanım” sayılacağını kesinleştir.
- [ ] `story_variant_used` olayını ve mevcut analytics karşılığını denetle;
  yinelenen veya çelişen event üretimini temizle.
- [ ] Kullanım sinyalini local-first ve server senkronizasyonuyla kalıcı hale
  getir.
- [ ] Premium kullanıcı için `Son kullandıkların` listesini oluştur veya mevcut
  Kütüphane karşılığını doğrula.
- [ ] Bağlam etiketlerini karara göre ekle: toplantı, bire bir görüşme, arkadaş
  sohbeti ve sunum açılışı.
- [ ] Premium kullanıcıya haftalık ve toplam sohbet/kullanım metriklerini göster.
- [ ] Hikâye detayında altını çizme, kişisel not ve özel liste/koleksiyona alma
  seçeneklerini tasarla ve uygula.

### Faz 2 çıkış kriteri

- [ ] Kullanım aksiyonu Kütüphane, ilerleme ve analytics tarafında aynı anlamı
  taşıyor.
- [ ] Offline, hesap değişimi ve veri sıfırlama senaryoları doğrulandı.

## Faz 3 — Premium Yetkileri ve Paywall Tetikleri

Bu faz yalnız Faz 0’daki ücretsiz/Premium sınırı kararı varyant kilitlemeyi
onaylarsa uygulanır.

- [ ] Derinlik sınırını uygula: ücretsiz tek cümle, Premium tüm varyantlar.
- [ ] Bağlam sınırını uygula: ücretsiz açıklamasız içerik, Premium bağlam
  etiketleri.
- [ ] Copy/paylaş sınırını uygula: ücretsiz davranış ve açıklama ile Premium tek
  dokunuş aksiyonunu belirginleştir.
- [ ] Hafıza sınırını uygula: favori varyantlar ve kullanım geçmişi için geçerli
  ücretsiz/Premium davranışı.
- [ ] Özel metriklerin yalnız uygun entitlement ile gösterildiğini doğrula.
- [ ] Okuma ekranındaki paywall konumunu gözden geçir; paywall’u kilitli varyant
  veya copy gibi değer anlarına bağla.
- [ ] Paywall başlığını “Okumak değil, kullanmak fark yaratır” değer önerisiyle
  test et.
- [ ] Paywall fark tablosunu gerçek entitlement ve ürün özellikleriyle eşleştir.
- [ ] “İlk iki içerik açık” davranışını seçilen freemium sözleşmesine göre uygula
  veya backlog’dan kaldır.

### Faz 3 çıkış kriteri

- [ ] Kod, paywall metni ve mağaza abonelik açıklaması aynı Premium sınırlarını
  anlatıyor.
- [ ] Restore, entitlement kaybı, çevrimdışı cache ve reklam alternatifi
  senaryoları doğrulandı.

## Faz 4 — Fiyatlandırma, Güven ve İptal Deneyimi

- [ ] Aylık paket için “Bir ay boyunca sohbetlerinde dene” mesajını değerlendir.
- [ ] Yıllık paketi alışkanlık ve süreklilik diliyle çerçevele; “Bu yıl
  söylediklerin rastgele olmayacak” mesajını değerlendir.
- [ ] Paywall’a gerekli güven unsurlarını ve çalışan gizlilik, kullanım koşulları,
  iade/iptal bağlantılarını ekle.
- [ ] Profilde kalan sabit/sahte verileri kaldır ve gerçek profil kaynağına bağla.
- [ ] İptal ekranında favoriler ve kullanılan varyant sayısını etik, açık ve veri
  kaybı davranışıyla tutarlı biçimde göster.
- [ ] “Premium kapanırsa bu liste silinir” benzeri kayıp mesajını yalnız veri
  gerçekten siliniyorsa kullan; aksi durumda doğru erişim açıklamasını yaz.
- [ ] Güncel marka gerçeğini uygulamanın iki veya üç kritik noktasında tutarlı
  biçimde göster.

### Faz 4 çıkış kriteri

- [ ] Kullanıcı satın alma, yenileme, iptal ve veri erişimi sonuçlarını doğru
  anlayabiliyor.
- [ ] Uygulama içi metinler mağaza ve RevenueCat davranışıyla çelişmiyor.

## Faz 5 — Görsel Sistem ve İçerik Sunumu

- [ ] Progress ekranındaki `Sıradaki en iyi adımlar` bölümünü gerçek kullanıcı
  durumuna göre dinamik hale getir veya mevcut Kıvılcım Yolu karşılığını doğrula.
- [ ] Güncel Albor logosunu gözden geçir; eski “ateşli S biçimli kitap ayracı”
  talebinin marka sistemiyle hâlâ geçerli olup olmadığına karar ver.
- [ ] Rozet/Kıvılcım Yolu görsellerini açık-koyu tema, farklı durumlar ve paylaşım
  yüzeylerinde gözden geçir.
- [ ] Kategori görsellerini ve ikonlarını dört dilde, açık-koyu temada ve
  erişilebilirlik açısından gözden geçir.
- [ ] Her hikâye için görsel adı ve arka plan rengi metadata ihtiyacını belirle;
  gerekiyorsa tek doğruluk kaynağı oluştur.
- [ ] Her kategorinin renk ve görsel eşlemesini tek merkezi kaynaktan yönet.

### Faz 5 çıkış kriteri

- [ ] Logo, rozet, kategori ve hikâye görselleri merkezi token/metadata
  kaynaklarına bağlı.
- [ ] Statik ekran görüntüleri ve en az bir iOS/Android cihaz turu tamamlandı.

## Faz 6 — Marka, ASO ve Mağaza Mesajları

- [ ] Uygulamanın güncel ana değer önerisini tek cümlede kesinleştir.
- [ ] App Store ve Google Play listing metinlerini gerçek ekranlar, ücretsiz
  sınırlar ve Premium özelliklerle birebir eşleştir.
- [ ] Premium mesajlaşmada yalnız içerik miktarı yerine gerçek kullanım, rutin ve
  yaşam değerini anlat.
- [ ] Ana değer önerisini paywall, onboarding, web sitesi ve mağaza metinlerinde
  tutarlı hale getir.

### Faz 6 çıkış kriteri

- [ ] Dört dilde mağaza metni gerçek ürün davranışıyla uyumlu.
- [ ] Ekran görüntüleri ve mağaza vaatleri aynı özellikleri gösteriyor.

## Faz 7 — Analytics, Deneyler ve Nihai QA

- [ ] Onboarding tamamlama oranını ölç.
- [ ] İlk hikâye açma/tamamlama oranını ölç.
- [ ] Üç ve yedi günlük retention raporlarını kur.
- [ ] Favoriye ekleme oranını ölç.
- [ ] Paylaşım oranını ölç.
- [ ] Paywall görülmeden önce terk oranını ölç.
- [ ] Paywall görüntüleme → Premium satın alma dönüşümünü ölç.
- [ ] Bildirimden geri dönüş oranını ölç.
- [ ] Analytics olay adlarını, payload’ları, dashboard’ları ve gizlilik
  gereksinimlerini uçtan uca doğrula.
- [ ] Ücretsiz kullanıcının ürünü anlayıp değer gördüğünü, Premium kullanıcının
  ek değeri açıkça algıladığını kullanıcı testiyle doğrula.
- [ ] Onboarding, Home, Progress, bildirim, profil, paywall ve Sohbette Kullan
  akışlarının kabul kriterlerini iOS ve Android’de çalıştır.

### Faz 7 çıkış kriteri

- [ ] Sekiz temel ürün metriği dashboard’da gerçek olaylarla çalışıyor.
- [ ] Kritik akışlarda açık P0/P1 hata kalmadı.
- [ ] Açık işler sonuçlarına göre kapatıldı, yeniden yazıldı veya bilinçli olarak
  sonraki sürüme taşındı.
