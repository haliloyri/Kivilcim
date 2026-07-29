# Albor Website AI Brief

Bu metni `alborapp.com` sitesinin AI site kurucusuna ver. Site, Albor mobil uygulamasının resmi sitesi olmalı; Türkçe birincil dil olmalı ve mobilde kusursuz çalışmalıdır.

## Marka ve Ürün

- Marka adı: **Albor**.
- Kısa tanım: Günlük hayata uygulanabilir fikirleri, güçlü kitaplar ve gerçek hikayeler üzerinden kısa ve etkili okuma deneyimlerine dönüştüren mobil uygulama.
- Hedef kitle: Her gün birkaç dakika ayırarak düşünme, öğrenme ve konuşma becerisini geliştirmek isteyen yetişkinler.
- Ton: Sakin, düşünceli, güven veren, rafine. Aşırı iddialı başarı veya sağlık vaadi kullanma.
- Görsel yön: Koyu mürekkep/siyah arka plan, kırık beyaz metin, sıcak sarı-altın vurgu. Gerçek uygulama ekranları ve hikaye kartları ana görsel malzeme olsun. Stok fotoğraf, dekoratif gradyan ve pazarlama kartı yığını kullanma.
- Ana CTA: `Uygulamayı indir`. Mağaza bağlantıları hazır değilse düğmeleri görünür bırak ama geçici olarak devre dışı göster; uydurma mağaza URL'si kullanma.

## Zorunlu Rotalar

Bu rotaları, sonlarında slash olmadan oluştur ve kalıcı yap:

| Rota | Amaç |
| --- | --- |
| `/` | Ana ürün sayfası |
| `/privacy` | Gizlilik Politikası |
| `/terms` | Kullanım Koşulları |
| `/refund` | İade ve İptal Politikası |
| `/support` | Destek ve iletişim |
| `/tr`, `/en`, `/de`, `/es` | Uygulamanın paylaşılan hikaye kartlarından gelen dil bazlı giriş sayfaları |

Tüm sayfalarda alt bilgi içinde `/privacy`, `/terms`, `/refund` ve `/support` bağlantıları yer almalı. Bağlantılar `https://alborapp.com/...` mutlak adreslerini kullanmalı. Üst menüde `Albor`, `Nasıl çalışır?`, `Özellikler`, `Destek` ve `Uygulamayı indir` bulunmalı.

## Ana Sayfa `/`

### Hero

- Başlık: **Her gün bir fikir, daha açık bir bakış.**
- Destek metni: **Albor, güçlü kitaplardan ve gerçek hikayelerden gelen fikirleri birkaç dakikada okuyup düşünebileceğin kısa deneyimlere dönüştürür.**
- Birincil CTA: `Uygulamayı indir`
- İkincil CTA: `Nasıl çalışır?`
- Yanında veya arka planında gerçek Albor uygulama ekranları, hikaye kartları ve marka işareti kullan.

### Nasıl çalışır?

Üç kısa adım:

1. **Konunu seç:** Finans, psikoloji, felsefe, liderlik, tarih, bilim, iletişim, üretkenlik, iş dünyası ve gelişim gibi kategorilerden keşfet.
2. **Kısa bir hikaye oku veya dinle:** Fikrin özünü dakikalar içinde al; sesli anlatım ile dinlemeye devam et.
3. **Düşün ve hayata taşı:** Önemli fikrini sakla, kendi notunu ekle, sohbet içinde kullanmak için anlatımını hazırla veya paylaşılabilir karta dönüştür.

### Özellikler

- **Günün seçkisi:** Her güne uygun, kısa ve odaklı hikayeler.
- **Sesli anlatım:** Okumak yerine dinleme seçeneği.
- **Kişisel kütüphane:** Kaydedilen hikayeler, okuma geçmişi ve kişisel notlar.
- **Kıvılcım Yolu:** Okuma, derinleşme ve uygulama davranışlarını kalıcı ilerleme adımlarına dönüştüren gelişim deneyimi.
- **Sohbette Kullan:** Bir fikri toplantıda, bire bir konuşmada, aile içinde veya sosyal ortamda daha doğal anlatmak için anlatım varyasyonları ve pratik.
- **Paylaşılabilir kartlar:** Hikayeleri estetik dikey kartlarla paylaşma.
- **Premium:** Sınırsız hikaye, tüm kategoriler, sesli anlatım, kişisel öğrenme araçları ve reklamsız deneyim.

### Güven ve kapanış

- "Albor, düşünmek için daha çok zaman değil, daha iyi bir başlangıç sunar." mesajını kullan.
- Sık sorulan sorular: Albor nedir, ücretsiz kullanım var mı, Premium neleri açar, sesli anlatım var mı, abonelik nasıl iptal edilir, destekle nasıl iletişime geçilir.
- En altta tekrar `Uygulamayı indir` CTA'sı olsun.

## Dil Sayfaları `/tr`, `/en`, `/de`, `/es`

- Bu sayfalar paylaşılmış içerikten gelen ziyaretçileri karşılayan hafif giriş sayfaları olmalı.
- İlgili dilde Albor'un kısa tanımı, uygulamayı indirme CTA'sı, ana sayfa bağlantısı ve hukuki sayfa bağlantıları sunulmalı.
- Türkçe, İngilizce, Almanca ve İspanyolca arayüz/metadata kullanılmalı. Kullanıcıyı otomatık olarak başka bir dile yönlendirme.

## Gizlilik Politikası `/privacy`

Bu sayfa uygulama mağazası incelemesi için açık, tarihli ve kolay okunur olmalı. Aşağıdaki bölümleri içermeli:

1. Politikanın yürürlük tarihi ve son güncelleme tarihi.
2. Veri sorumlusu: **[Şirket/gerçek kişi unvanı]**, **[posta adresi]**, **[destek e-postası]**.
3. Toplanan veri kategorileri: isteğe bağlı profil bilgileri (ad/e-posta), uygulama tercihleri, okuma/kaydetme/ilerleme verileri, uygulama içi satın alma durumu, teknik tanılama verileri ve izin verilmişse reklam ölçüm verileri.
4. Verilerin kullanım amaçları: uygulamayı sunmak, kişiselleştirmek, hesabı ve satın alma erişimini yönetmek, destek sağlamak, güvenliği sağlamak ve hizmeti iyileştirmek.
5. Hizmet sağlayıcıları: Apple App Store, Google Play, RevenueCat (abonelik), Supabase (uygulama verisi), PostHog (ürün analitiği), Expo/Expo push bildirimleri, Google AdMob (reklam gösterimi). Yalnızca gerçekten kullanılan hizmetleri yayın öncesi doğrula.
6. Saklama süresi, güvenlik önlemleri ve verilerin aktarılabileceği ülkeler.
7. Kullanıcı hakları ve veri silme/erişim talep yöntemi; KVKK ve GDPR kapsamındakiler için ilgili başvuru kanalı.
8. Çocukların gizliliği: hedef yaş grubunu ve yaklaşımı gerçek ürün politikasına göre belirt.
9. Çerezler: web sitesi analitik/çerez kullanıyorsa açıklama ve tercihler; kullanmıyorsa bunu açıkça belirt.
10. Politika değişiklikleri ve iletişim.

Kesin olmayan yasal iddialar yazma. Bu sayfayı yayına almadan önce Türkiye/KVKK ve hedef ülkeler için hukuk uzmanına kontrol ettir.

## Kullanım Koşulları `/terms`

Şu başlıkları içeren, okunabilir bir koşullar sayfası oluştur:

1. Sözleşmenin tarafları, kabulü ve yürürlük tarihi.
2. Albor hizmetinin tanımı; içeriğin genel bilgi ve düşünme/öğrenme amaçlı olduğu, profesyonel finansal, tıbbi, hukuki veya psikolojik tavsiye olmadığı.
3. Hesap, yaş şartı ve kullanıcının doğru bilgi verme sorumluluğu.
4. Fikri mülkiyet: uygulama, marka, metinler, sesler, tasarımlar ve içerik hakları; izinsiz çoğaltma/yeniden dağıtım yasağı.
5. Kullanıcının kendi notları ve paylaşımlarına ilişkin sorumluluğu.
6. Kabul edilemez kullanım, hizmetin güncellenmesi veya sonlandırılması.
7. Premium aboneliği: ücretler mağazada gösterilir, ödeme Apple App Store veya Google Play üzerinden alınır, otomatik yenilenme ve yönetim mağaza hesap ayarlarından yapılır.
8. Sorumluluğun hukuken izin verilen ölçüde sınırlandırılması, uygulanacak hukuk ve uyuşmazlık iletişimi.
9. İletişim: **[destek e-postası]**.

## İade ve İptal Politikası `/refund`

- Başlık: **İade ve İptal Politikası**.
- Açık ifade: Albor abonelikleri Apple App Store veya Google Play üzerinden satın alınır; ödeme, iptal ve iade süreçleri ilgili mağazanın kurallarına tabidir.
- Kullanıcının aboneliği mağaza hesap ayarlarından iptal edebileceğini; iptalin sonraki yenilemeyi durduracağını, mevcut erişimin dönem sonuna kadar devam edebileceğini belirt.
- İade başvurusu için Apple ve Google Play'in resmi süreçlerine yönlendiren güncel bağlantılar ekle.
- Destek gerektiğinde **[destek e-postası]** kanalına yönlendir; mağaza kararlarını Albor'un veremeyeceğini netleştir.
- Deneme süresi veya özel kampanya varsa yalnızca gerçek koşulları ekle. Yoksa uydurma deneme/iade sözü verme.

## Destek `/support`

- Başlık: **Albor Destek**.
- Kısa açıklama: Hesap, abonelik, içerik ve teknik sorunlar için yardım.
- İletişim e-postası: **[destek e-postası]**.
- Form alanları: ad, e-posta, konu, mesaj, uygulama sürümü, cihaz/işletim sistemi ve isteğe bağlı ekran görüntüsü.
- Formda gizlilik politikasına bağlantı ve "hassas kişisel bilgi göndermeyin" uyarısı olsun.
- SSS: satın alımı geri yükleme, Premium iptali, veri silme talebi, uygulama açılmıyor, bildirim ayarları.

## Yayın Öncesi Doldurulacak Bilgiler

AI'nin uydurmaması gereken aşağıdaki alanları site sahibi sağlamalıdır:

- Yasal unvan veya gerçek kişi adı
- Ticari/adres bilgisi
- Destek e-postası ve varsa veri koruma iletişim adresi
- Apple App Store ve Google Play indirme bağlantıları
- Vergi/fatura bilgileri gerekiyorsa ilgili metin
- Hedef yaş grubu
- Gerçekte kullanılan analiz, reklam ve altyapı hizmetlerinin kesin listesi
- Gizlilik/koşullar/iade sayfalarının yürürlük tarihi

## Teknik ve SEO Gereksinimleri

- HTTPS, hızlı mobil yükleme, erişilebilir kontrast, klavye ile gezinme ve anlamlı başlık hiyerarşisi kullan.
- Her rota için özgün Türkçe title ve meta description yaz; `/tr`, `/en`, `/de`, `/es` için uygun `hreflang` etiketleri ekle.
- `sitemap.xml`, `robots.txt`, Open Graph görseli ve sayfa başına canonical URL oluştur.
- Gizlilik, koşullar ve iade sayfaları giriş gerektirmeden herkese açık olmalı.
- Analitik ve çerezler için onay gereksinimlerini site hedef pazarlarına göre uygula.
