# GPT-5.5 UX Tasks

Bu dosya, Spark / Kivilcim mobil uygulamasi icin yapilan UX ve kullanici akisi analizindeki gorusleri uygulanabilir is paketlerine cevirir. Gorevler kritik etki, kullanici riski ve gelistirme maliyetine gore fazlara ayrilmistir.

## Genel Hedefler

- Kullaniciya uygulamanin takildigi hissini veren launch/loading risklerini azaltmak.
- Ilk kullanim deneyimini daha guven veren, temiz ve standart mobil UX'e uygun hale getirmek.
- Kesif, okuma, kaydetme, kutuphane ve ilerleme dongulerini daha anlasilir yapmak.
- Premium/paywall akisini daha guvenilir, net ve daha az agresif hale getirmek.
- Lokalizasyon, erisilebilirlik ve tema tutarliligini temel kalite seviyesi olarak guclendirmek.

---

## Faz 0 - Kritik Stabilite ve Guven Duzeltmeleri

Bu faz, kullanicinin uygulamayi acamama, bozuk ekran gorme veya satin alma/ads kaynakli guven kaybi yasama risklerini hedefler. Once bunlar cozulmeden UI cilasi yapmak verimli olmaz.

### 0.1 Launch / Loading Deneyimini Kurtarilabilir Hale Getir

**Oncelik:** Kritik  
**Etkilenen alanlar:** App.js, LaunchScreen, AppNavigator, UserDataContext, StoriesContext  
**Problem:** Uygulama launch ekraninda spinner ile bekliyor ancak kullaniciya ne oldugunu, ne kadar surecegini veya hata durumunda ne yapabilecegini anlatmiyor. DB, font, AsyncStorage veya story seed akisi gecikirse kullanici uygulamanin dondugunu dusunuyor.

**Yapilacaklar:**

- Launch ekranina kisa durum metinleri ekle:
  - `Kutuphane hazirlaniyor...`
  - `Hikayeler yukleniyor...`
  - `Kisisel planin hazirlaniyor...`
- 5-8 saniye sonrasi icin sakin bir gecikme mesaji ekle:
  - `Biraz uzun surdu, devam ediyoruz...`
- 12-15 saniye sonrasi icin kurtarma durumu ekle:
  - `Yukleme tamamlanamadi.`
  - `Tekrar dene` butonu
- `StoriesContext` ve `UserDataContext` hata durumlarini LaunchScreen'e tasiyabilecek basit bir readiness/status modeli degerlendir.
- Startup hatalarini sadece console'a yazmak yerine kullaniciya genel ve zarar vermeyen bir durum mesaji gosterecek sekilde ele al.

**Neden:** Standart mobil UX'te uzun beklemelerde kullaniciya geri bildirim ve kurtarma yolu verilir. Sessiz spinner, donma algisini guclendirir.

**Beklenen sonuc:**

- Kullanici launch ekraninda uygulamanin calistigini anlar.
- Gercek hata veya gecikmede uygulamayi kapatip acmaya zorlanmaz.
- `launch ekraninda kaldi` tipi destek/bug geri bildirimleri azalir.

**Kabul kriterleri:**

- Font, DB veya stories yukleme gecikmesi simule edildiginde launch ekrani durum metni gosterir.
- Uzun gecikmede retry/tekrar dene aksiyonu gorunur.
- Normal acilis akisi ekstra bekleme yaratmadan ana ekrana gecer.

### 0.2 Onboarding Ikon / Encoding Bozulmalarini Duzelt

**Oncelik:** Kritik  
**Etkilenen alanlar:** OnboardingScreen, ProfileScreen, ilgili translation/copy alanlari  
**Problem:** Onboarding icinde kahve, kitap, roket, gun/ay gibi ikonlar garbled karakter olarak gorunuyor. Bu ilk izlenimde uygulamanin bozuk oldugu hissini verir.

**Yapilacaklar:**

- Bozuk emoji stringlerini UTF-8 uyumlu karakterler veya Unicode escape ile duzelt.
- Onboarding zaman secimi, reminder secimi ve profil ayarlarindaki ayni ikon setini kontrol et.
- Android cihazda ikonlarin dogru gorundugunu dogrula.
- Gerekirse emoji yerine Ionicons/lucide benzeri icon library kullanarak platform farkini azalt.

**Neden:** Ilk ekranlarda gorunen encoding hatasi kullanici guvenini hemen dusurur ve premium/guven akisini zedeler.

**Beklenen sonuc:**

- Onboarding profesyonel ve temiz gorunur.
- Kullanici daha ilk dakikada `bozuk uygulama` algisina kapilmaz.

**Kabul kriterleri:**

- Onboarding tum adimlarda ikonlar okunabilir/gorunur.
- TR/EN/ES/DE dil degisiminde bozuk karakter olusmaz.
- Android debug APK'da bozuk karakter gorunmez.

### 0.3 AdMob Native Startup Riskini Kapat

**Oncelik:** Kritik  
**Etkilenen alanlar:** app.json, src/utils/ads.js, App.js, android build config  
**Problem:** Build ciktisinda `react-native-google-mobile-ads requires android_app_id` uyarisi var. SDK dogru configure edilmezse native startup'ta crash riski var. Bu, kullanicinin launch ekranindan ilerleyememesine benzer bir semptom yaratabilir.

**Yapilacaklar:**

- `app.json` icinde `react-native-google-mobile-ads` config plugin ayarlarini dogrula.
- Android app id degerinin debug ve release icin dogru oldugunu netlestir.
- Gerekirse test AdMob app id ile debug build'i guvenli hale getir.
- `initAds()` hata verse bile app boot akisini bloklamayacak yapinin korundugunu dogrula.
- Ad yuklenememe durumunda `AdOrPremiumSheet` icin kullanici dostu fallback davranisini kontrol et.

**Neden:** Native SDK crash'leri JS tarafindaki try/catch ile yakalanamaz. Startup crash veya splash'te kalma algisinin en riskli kaynaklarindan biridir.

**Beklenen sonuc:**

- Ads SDK app acilisini bozmaz.
- Debug ve release build'lerde startup guvenilir hale gelir.
- Reklam yuklenemese bile kullanici net bir sonraki aksiyona yonlendirilir.

**Kabul kriterleri:**

- Android debug APK warning kritik seviyede kalmaz veya bilincli olarak dokumante edilir.
- Uygulama temiz install sonrasi launch ekranindan ana akisa gecer.
- Ads kapali/yuklenemiyor senaryosunda app crash olmaz.

---

## Faz 1 - Ilk Kullanim ve Temel Akis UX'i

Bu faz, kullanicinin ilk 5 dakikadaki deneyimini guclendirir: onboarding, ilk hikaye, ilk kaydetme ve ana kesif akisi.

### 1.1 Onboarding Akisini Daha Net ve Daha Az Agresif Hale Getir

**Oncelik:** Yuksek  
**Etkilenen alanlar:** OnboardingScreen, AppNavigator, PaywallScreen  
**Problem:** Onboarding iyi kurgulanmis ancak bitisinden hemen sonra trial/paywall gosterimi kullanici henuz deger deneyimlemeden fazla agresif algilanabilir.

**Yapilacaklar:**

- Onboarding sonunda kullaniciyi once ilk hikaye/deger deneyimine yonlendirmeyi degerlendir.
- Early trial paywall'i asagidaki tetiklerden birine tasimayi degerlendir:
  - Ilk hikaye tamamlandiktan sonra
  - 2 ucretsiz hikaye limiti dolduktan sonra
  - Kullanici premium ozellige dokundugunda
- Onboarding son adiminda plan ozeti + `Ilk hikayemi ac` CTA'sini daha belirgin yap.
- Skip akisini daha net hale getir: skip eden kullanici yine anlamli default planla baslamali.

**Neden:** Mobil onboarding'de kullanici once degeri hissetmek ister. Erken paywall, ozellikle yeni uygulamada guven ve retention kaybi yaratabilir.

**Beklenen sonuc:**

- Ilk session'da hikaye acma orani artar.
- Paywall daha baglama uygun gorunur.
- Kullanici onboarding bitince ne yapacagini daha net anlar.

**Kabul kriterleri:**

- Yeni kullanici onboarding bittikten sonra dogrudan anlamli bir sonraki adim gorur.
- Paywall tetigi kullanici davranisi ile iliskili ve anlasilir olur.
- Onboarding skip/default plan akisi hatasiz calisir.

### 1.2 Home / Discover Ekraninda Birincil Aksiyonu Netlestir

**Oncelik:** Yuksek  
**Etkilenen alanlar:** HomeScreen, StoryCard  
**Problem:** Home ekrani zengin moduller iceriyor ancak cok fazla modulu olan feed'lerde kullanici `bugun ne yapmaliyim?` sorusuna hizli cevap bulamayabilir.

**Yapilacaklar:**

- Ana ekranda gunluk hedefe bagli tek bir guclu CTA belirginlestir:
  - `Bugunun ilk hikayesini ac`
  - `Planima devam et`
  - `Hedefi tamamla`
- Daha once okunmus hikayeler icin `Devam et`, `Tekrar oku`, `Tamamlandi` durumlarini tutarli kullan.
- Daily progress ring'in dokunulabilir oldugu daha anlasilir hale getir.
- Empty/error durumunda Home kullaniciyi kategori secimi veya aramaya yonlendirsin.

**Neden:** Standart mobil UX'te ana ekran kullanicinin en muhtemel niyetini tek bakista desteklemelidir.

**Beklenen sonuc:**

- Kullanici uygulamayi acinca ilk aksiyonu daha hizli secer.
- Gunluk okuma dongusu guclenir.
- Home daha az karmasik algilanir.

**Kabul kriterleri:**

- Yeni ve geri donen kullanici icin ana CTA farkli ve baglama uygun gorunur.
- StoryCard durumlari tutarlidir.
- Hikaye yok/hata durumunda kullanici bos ekranda kalmaz.

### 1.3 Search Deneyimini Lokalize ve Standart Hale Getir

**Oncelik:** Yuksek  
**Etkilenen alanlar:** SearchScreen, i18n  
**Problem:** Search icinde default oneriler Turkce hard-coded. Back butonu metin oku olarak kullaniliyor ve platform standardi zayif.

**Yapilacaklar:**

- DEFAULT_SUGGESTIONS'i dil bazli translation key'lerine tasi.
- Arama bos durumunda `Son aramalar`, `Populer kategoriler`, `Onerilen aramalar` hiyerarsisini koru ama copy'yi tum dillerde dogrula.
- Back butonunu Ionicons ile standart hale getir ve accessibility label ekle.
- Arama sonuc yok durumunda daha aksiyonlu CTA ekle:
  - kategori onerisine dokun
  - ana ekrana don
- Search input icin `returnKeyType="search"`, clear button ve erisilebilir label degerlendir.

**Neden:** Arama kesif akisinin kalbidir. Dil uyumsuzlugu ve standart olmayan kontroller kullaniciyi yavaslatir.

**Beklenen sonuc:**

- EN/ES/DE kullanicilar arama onerilerini kendi dilinde gorur.
- Arama ekrani daha platform-native hisseder.
- Sonucsuz aramalar cikis yolu sunar.

**Kabul kriterleri:**

- Her dilde default suggestion listesi dogru gorunur.
- Back butonu ikon + accessibility label ile calisir.
- Sonuc yok ekraninda en az bir anlamli devam aksiyonu vardir.

---

## Faz 2 - Library, Progress ve Habit Dongusu

Bu faz, kullanicinin uygulamaya geri donme nedenlerini guclendirir: kaydetme, gecmise donme, ilerleme ve streak.

### 2.1 Library Bos Durumlarini Daha Aksiyonlu Hale Getir

**Oncelik:** Orta-Yuksek  
**Etkilenen alanlar:** LibraryScreen, StoryCard, i18n  
**Problem:** Library koleksiyonlari mantikli ancak bos durum metinleri tek basina yeterli olmayabilir. Kullanici `burayi nasil doldururum?` sorusuna net cevap almali.

**Yapilacaklar:**

- Her koleksiyon icin title + subtitle + CTA kullan:
  - Read: `Ilk hikayeni oku`
  - Favorites: `Hikayelerde kalp ikonuna dokun`
  - Used: `Sohbette kullan ekranindan bir varyanti isaretle`
- CTA'lar ilgili ekrana yonlendirsin.
- Kategori filtresi aktifken bos sonuc varsa `Filtreyi temizle` aksiyonu ekle.
- Sort modal seceneklerinde aktif secimi daha gorunur hale getir.

**Neden:** Bos durumlar sadece bilgi degil, kullaniciyi bir sonraki degerli aksiyona tasiyan UX noktalaridir.

**Beklenen sonuc:**

- Library ilk kullanimda `bos/dead-end` hissettirmez.
- Kullanici kaydetme ve tekrar okuma dongusunu daha iyi anlar.

**Kabul kriterleri:**

- Tum library koleksiyonlari bosken CTA gosterir.
- Filtreli bos durumda filtre temizleme vardir.
- CTA navigasyonlari dogru calisir.

### 2.2 Progress Ekraninda Sonraki En Iyi Aksiyonu One Cikar

**Oncelik:** Orta-Yuksek  
**Etkilenen alanlar:** ProgressScreen, UserDataContext  
**Problem:** Progress ekrani zengin ama rozetler, heatmap, streak ve hedefler arasinda birincil sonraki aksiyon kaybolabilir.

**Yapilacaklar:**

- Ekranin ust bolumunde tek `next best action` kartini belirginlestir:
  - Bugunku hedef eksikse: `1 hikaye daha oku`
  - Streak riskteyse: `Bugunku streak'i koru`
  - Badge yakinsa: `Rozete yaklastin`
- Streak freeze bilgisini kullaniciya baski yaratmadan anlat:
  - `Bugun mola hakkini kullanabilirsin`
  - `Streak'in korunuyor`
- Badge modal kapandiktan sonra ilgili Progress bolumune geri baglam ver.

**Neden:** Habit UX'i sadece istatistik gostermek degil, kullanicinin bir sonraki davranisini kolaylastirmaktir.

**Beklenen sonuc:**

- Kullanici Progress ekranindan ne yapacagini net anlar.
- Streak mekanigi motive edici olur, cezalandirici hissettirmez.
- Rozet sistemi daha anlasilir ve davranisa bagli hale gelir.

**Kabul kriterleri:**

- Progress ekrani her durumda baglama uygun bir ana aksiyon gosterir.
- Streak freeze premium/free durumlari net ayrilir.
- Gunluk hedef tamamlandiysa ekran bunu kutlar ve asiri tekrar aksiyon istemez.

### 2.3 Story Detail Okuma Akisini Daha Standart Hale Getir

**Oncelik:** Orta  
**Etkilenen alanlar:** StoryDetailScreen, StoryCard, UseInConversationScreen  
**Problem:** Story detail cok fazla ozellik tasiyor: okuma, ses, favori, read later, paylasim, sonraki hikaye, sohbette kullan. Bu guclu ama kalabalik olabilir.

**Yapilacaklar:**

- Ust aksiyonlari gruplandir:
  - geri
  - kaydet/read later
  - ses
  - paylas/sohbette kullan
- Hikaye sonunda daha net completion alani olustur:
  - `Tamamlandi olarak isaretle`
  - `Sonraki hikaye`
  - `Sohbette kullan`
- Free limit/paywall veya ad sheet gelmeden once kullanicinin neden durdugunu net acikla.
- Font size ayarinin erisilebilirlik ve okunabilirlik etkisini kontrol et.

**Neden:** Okuma ekrani uygulamanin ana deger anidir. Fazla aksiyon varsa kullanici okuma deneyiminden kopabilir.

**Beklenen sonuc:**

- Okuma deneyimi daha odakli olur.
- Hikaye bitirme ve sonraki hikayeye gecme orani artar.
- Premium/ad kesintileri daha az ani hissedilir.

**Kabul kriterleri:**

- Hikaye detay ekraninda ana aksiyonlar tutarli ve kolay bulunur.
- Completion alani hikaye sonunda net gorunur.
- Free limit durumunda kullanici neden paywall/ad gordugunu anlar.

---

## Faz 3 - Premium, Reklam ve Guven Akisi

Bu faz, gelir akisini kullanici guveniyle uyumlu hale getirir.

### 3.1 Paywall Mesajlarini Gercek Urun Durumuyla Esitle

**Oncelik:** Yuksek  
**Etkilenen alanlar:** PaywallScreen, UserDataContext, app store billing entegrasyonu  
**Problem:** Paywall fiyat, trial, restore ve premium faydalarini gosteriyor. Bunlar gercek IAP/billing davranisi ile birebir uyusmazsa kullanici guveni ve store uyumlulugu riske girer.

**Yapilacaklar:**

- Static fiyatlar yerine mumkunse store product bilgisinden fiyat cek.
- `Try 7 days free` mesaji gercek trial tanimi varsa gosterilsin.
- `Restore purchase` gercek restore akisi ile baglansin; placeholder ise farkli copy kullan.
- Satin alma basarili olunca sadece `goBack` yerine kisa confirmation state goster:
  - `Premium aktif`
  - `Tum hikayeler acildi`
- Basarisiz satin alma icin daha yardimci error state ekle.

**Neden:** Paywall UX'inde guven, donusum kadar onemlidir. Yanlis vaat iade, sikayet ve store review riski yaratir.

**Beklenen sonuc:**

- Kullanici odeme once/sonra ne aldigini net anlar.
- Restore/purchase deneyimi standart mobil beklentilere yaklasir.
- Premium donusum kalitesi artar.

**Kabul kriterleri:**

- Fiyat/trial/restoration copy'si gercek billing durumuyla uyumludur.
- Purchase success sonrasi premium state gorunur sekilde dogrulanir.
- Restore aksiyonu calisir veya placeholder olmadigi netlesir.

### 3.2 Ad veya Premium Secim Noktalarini Daha Acik Hale Getir

**Oncelik:** Orta-Yuksek  
**Etkilenen alanlar:** AdOrPremiumSheet, StoryDetailScreen, UseInConversationScreen, ads.js  
**Problem:** Ucretsiz kullanici bazi noktalarda ad veya premium secimine gider. Reklam yuklenemezse veya neden reklam istendigi net degilse akisin kesilmis hissi dogar.

**Yapilacaklar:**

- Sheet basliginda kullaniciya sebep anlat:
  - `Bugunku ucretsiz limit doldu`
  - `Bu araci reklam izleyerek deneyebilirsin`
- Reklam yuklenemedi durumunda net fallback:
  - `Reklam su an hazir degil`
  - `Premium'a bak` veya `Sonra tekrar dene`
- Premium kullaniciya ad sheet hic gorunmemeli.
- Ad event analytics'i basarili/basarisiz durumlari ayirmali.

**Neden:** Reklam temelli monetization, kullaniciya kontrol hissi vermezse sinir bozucu olur.

**Beklenen sonuc:**

- Kullanici neden durdugunu ve hangi secenekleri oldugunu anlar.
- Reklam hatalari dead-end yaratmaz.
- Premium deger onerisi daha dogal baglamda gorunur.

**Kabul kriterleri:**

- Reklam yuklenemezse crash veya sessiz kapanma olmaz.
- Sheet copy'si kaynak ekrana gore anlamlidir.
- Analytics ad choice, ad load failed, ad completed ayrimini yapar.

### 3.3 Premium Ozellik Tutarliligi Denetimi Yap

**Oncelik:** Orta  
**Etkilenen alanlar:** StoryDetailScreen, LibraryScreen, ProgressScreen, UseInConversationScreen, copy.en/tr  
**Problem:** Bazi copy dosyalarinda favori, history, share veya stats premium olarak anlatiliyor; kodda ise bazi ozellikler ucretsiz calisiyor olabilir. Bu tutarsizlik guveni azaltir.

**Yapilacaklar:**

- Premium kapilarini tek tablo halinde dokumante et:
  - Hangi ozellik free?
  - Hangi ozellik premium?
  - Hangi ozellik reklamla gecici acilir?
- UI copy'sini bu tabloya gore guncelle.
- Library/Progress/UseInConversation ekranlarinda free/premium davranisi ayni mantiga otursun.

**Neden:** Kullanici `bunu neden gorebiliyorum/goremiyorum?` sorusuna takildiginda conversion yerine guvensizlik olusur.

**Beklenen sonuc:**

- Free ve Premium deneyim net ayrilir.
- Paywall daha adil ve anlasilir algilanir.
- Copy ile davranis arasinda celiski kalmaz.

**Kabul kriterleri:**

- Premium feature matrix dokumante edilmis olur.
- Tum ilgili ekran copy'leri matrix ile uyumludur.
- Free/Premium test senaryolari tutarli sonuc verir.

---

## Faz 4 - Lokalizasyon, Tema ve Erisilebilirlik Kalitesi

Bu faz, uygulamayi daha olgun ve standart mobil kaliteye yaklastirir.

### 4.1 Lokalizasyon Kapsamini Tamamla

**Oncelik:** Orta-Yuksek  
**Etkilenen alanlar:** i18n.js, copy.en.json, copy.tr.json, ekranlar  
**Problem:** Cogu metin `t(...)` ile geliyor ancak hard-coded kalan yerler var. Dil degisiminde bazi alanlar dogal veya yerel hissettirmeyebilir.

**Yapilacaklar:**

- Hard-coded user-facing text taramasi yap.
- Search default suggestions, language display names, fallback CTA'lar translation key'e tasinsin.
- TR/EN/ES/DE dil bloklari eksiksiz kontrol edilsin.
- Turkish locale casing (`toLocaleLowerCase('tr-TR')`) sadece gerekli alanlarda kullanilsin; diger dillerde yan etki olmasin.

**Neden:** Cok dilli uygulamada yari cevrilmis deneyim kalite algisini dusurur.

**Beklenen sonuc:**

- Dil degisiminde ekranlar tutarli ve dogal gorunur.
- Yeni copy ekleme kurali netlesir.

**Kabul kriterleri:**

- Kullaniciya gorunen yeni/eski metinler translation key uzerinden gelir.
- Dillerde eksik key yoktur.
- Search ve Profile dil uyumlulugu dogrulanir.

### 4.2 Tema Tokenlari ve Kontrast Denetimi

**Oncelik:** Orta  
**Etkilenen alanlar:** theme.js, StoryCard, LaunchScreen, PaywallScreen, ortak componentler  
**Problem:** Bazi ekranlarda hard-coded renkler var. Dark/light mode ve kategori temalariyla birlikte kontrast sorunlari cikabilir.

**Yapilacaklar:**

- Hard-coded renkleri tarayip tema tokenlarina tasinabilecekleri belirle.
- Kritik text/button kontrast oranlarini kontrol et.
- LaunchScreen arka plan ve loader rengi light/dark tema ile uyumlu hale getir.
- StoryCard icindeki sabit text renklerini kategori temasiyla birlikte test et.

**Neden:** Tema tutarliligi sadece estetik degil, okunabilirlik ve erisilebilirlik icin de gereklidir.

**Beklenen sonuc:**

- Dark/light modda metinler okunabilir kalir.
- Marka gorselligi korunurken sistem tutarliligi artar.

**Kabul kriterleri:**

- Ana ekranlar light/dark modda okunabilir.
- Kritik CTA'lar yeterli kontrasta sahiptir.
- Hard-coded renkler sadece bilincli istisna olarak kalir.

### 4.3 Accessibility Baseline Ekle

**Oncelik:** Orta  
**Etkilenen alanlar:** Tum screenler, StoryCard, CategoryPill, tab/navigation, modal/sheetler  
**Problem:** Custom TouchableOpacity/Pressable kullanimi yaygin. Accessibility label/role yoksa screen reader ve motor erisilebilirlik zayiflar.

**Yapilacaklar:**

- Ana aksiyonlara `accessibilityRole="button"` ve anlamli `accessibilityLabel` ekle.
- Icon-only butonlara mutlaka label ekle:
  - geri
  - ara
  - kaydet
  - favori
  - sesli oku
  - paylas
- Modal/sheet acildiginda focus davranisini kontrol et.
- Minimum tap target: 44x44 dp hedefle.
- Dynamic type / font scaling etkisini kritik ekranlarda test et.

**Neden:** Standart mobil UX, sadece gorsel kullanicilar icin degil; erisilebilirlik varsayilan kalite beklentisidir.

**Beklenen sonuc:**

- Screen reader kullanicisi ana akislari tamamlayabilir.
- Icon-only UI anlam kazanir.
- App store kalite algisi artar.

**Kabul kriterleri:**

- Ana navigasyon, story aksiyonlari, paywall CTA'lari label/role tasir.
- 44x44 altinda kritik tap target kalmaz veya bilincli istisna dokumante edilir.
- VoiceOver/TalkBack temel smoke test yapilir.

---

## Faz 5 - Bilgi Mimarisi ve Uzun Vadeli UX Iyilestirmeleri

Bu faz, mevcut sistemi yeniden yazmadan daha olgun bir urun deneyimine yaklastirir.

### 5.1 Search Girisini Daha Gorunur Hale Getir

**Oncelik:** Orta  
**Etkilenen alanlar:** HomeScreen, AppNavigator, SearchScreen  
**Problem:** Search stack ekran olarak var ancak kullanicinin aramaya nasil gidecegi Home uzerinde yeterince standart veya belirgin olmayabilir.

**Yapilacaklar:**

- Home header'da standart arama ikonu veya search bar benzeri entry point ekle.
- Search'e gecis animasyonu ve back davranisi platform standardina uygun olsun.
- Search gecmisini temizleme secenegi eklemeyi degerlendir.

**Neden:** Icerik uygulamalarinda kesif sadece feed ile sinirli kalmamali; arama kolay bulunmali.

**Beklenen sonuc:**

- Kullanici belirli konu/hikaye bulmak istediginde aramayi daha hizli kesfeder.
- Discovery derinligi artar.

**Kabul kriterleri:**

- Home'dan Search'e tek dokunusla gidilir.
- Search back davranisi dogaldir.
- Recent search privacy/kontrol secenegi degerlendirilir.

### 5.2 Use In Conversation Akisini Daha Ogrenilebilir Yap

**Oncelik:** Orta  
**Etkilenen alanlar:** UseInConversationScreen, MicroVariantCard, StoryDetailScreen  
**Problem:** `Use in Conversation` guclu bir farklilastirici ozellik ancak kullanici ilk bakista bunun ne ise yaradigini anlamayabilir.

**Yapilacaklar:**

- StoryDetail sonunda `Sohbette kullan` CTA'sinin degerini netlestir.
- UseInConversation ekraninda ilk acilista kisa, non-intrusive bir ipucu degerlendir:
  - `Kopyala, paylas veya kullandim olarak isaretle`
- `Marked as used` davranisinin Library ve Progress ile bagini daha gorunur hale getir.
- Premium storyteller mode varsa kapisi ve faydasi net ayrilsin.

**Neden:** Ozgun ozellikler iyi anlatilmazsa kullanici tarafindan kesfedilmeden kalir.

**Beklenen sonuc:**

- Kullanici bu ekranin pratik faydasini daha hizli anlar.
- Copy/share/mark-used dongusu daha cok kullanilir.

**Kabul kriterleri:**

- StoryDetail'ten UseInConversation'a gecis nedeni net gorunur.
- Ilk kullanimda ekranin amaci anlasilir.
- Mark-used aksiyonu Library/Progress'te gorunur sonuc uretir.

### 5.3 Analitik Olaylari UX Kararlarina Bagla

**Oncelik:** Orta-Dusuk  
**Etkilenen alanlar:** analytics.js, docs/ANALYTICS_EVENTS.md, tum flowlar  
**Problem:** Bir cok event var ancak UX iyilestirmelerinin etkisini olcmek icin flow bazli metrikler netlesmeli.

**Yapilacaklar:**

- Asagidaki funnel eventlerini dogrula veya ekle:
  - launch_started
  - launch_ready
  - launch_timeout_shown
  - onboarding_started/completed/skipped
  - first_story_opened
  - first_story_completed
  - first_save_action
  - search_started/result_opened/no_results
  - paywall_viewed/purchase_started/purchase_succeeded/restore_started
- `docs/ANALYTICS_EVENTS.md` dokumanini guncelle.
- Faz 0-3 degisiklikleri icin basari metrikleri belirle.

**Neden:** UX iyilestirmeleri hissiyatla baslar ama urun kararina donusmesi icin olcum gerekir.

**Beklenen sonuc:**

- Launch stuck, onboarding drop, paywall conversion ve search basarisi takip edilebilir.
- Sonraki tasarim kararlarinda veri kullanilir.

**Kabul kriterleri:**

- Kritik funnel eventleri dokumante edilir.
- Event payload'lari tutarlidir.
- Yeni UX degisiklikleri icin en az 3 temel metrik izlenebilir.

---

## Onerilen Uygulama Sirasi

1. Faz 0.1 - Launch/loading kurtarma UX'i
2. Faz 0.2 - Onboarding encoding/icon duzeltmesi
3. Faz 0.3 - AdMob startup config dogrulama
4. Faz 1.3 - Search lokalizasyonu ve standart back/search kontrolleri
5. Faz 1.1 - Onboarding sonrasi paywall zamanlamasi
6. Faz 1.2 - Home ana CTA netlestirme
7. Faz 3.1 - Paywall billing/copy uyumlulugu
8. Faz 2.1 - Library empty states
9. Faz 2.2 - Progress next-best-action
10. Faz 4.3 - Accessibility baseline

---

## Basari Metrikleri

- Launch ekraninda 10+ saniye kalan session orani azalir.
- Ilk session'da ilk hikaye acma orani artar.
- Onboarding tamamlama sonrasi uygulamadan cikis orani azalir.
- Search kullanimi ve search sonucundan hikaye acma orani artar.
- Library bos ekranindan Home/Story aksiyonuna gecis artar.
- Paywall goruntulemeden satin alma/restore aksiyonuna gecis daha tutarli hale gelir.
- Premium veya reklam akisi kaynakli hata/geri bildirim azalir.

---

## Notlar

- Bu dosya mevcut kod tabani uzerinden uygulanabilir, kademeli iyilestirmeler icin hazirlandi; komple yeniden tasarim onermiyor.
- Yeni kullaniciya deger gostermeden erken paywall gosterimi dikkatle test edilmeli.
- Tum yeni user-facing metinler `src/locales/i18n.js` veya mevcut copy dosyalari uzerinden yonetilmeli.
- Android build icin JDK 17 kullanimi korunmali.
