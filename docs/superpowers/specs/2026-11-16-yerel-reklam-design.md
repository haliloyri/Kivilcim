# Yerel (native) reklam yerleşimi — kısa tasarım

Tarih: 16 Kasım 2026. Durum: onay bekliyor. Boyut: küçük-orta değişiklik (kısa tasarım).

## Amaç ve neden

Albor ücretsiz kullanıcılara reklam gösteren, Premium'da reklamsız bir uygulama. Yeni AdMob hesabında yerel reklam birimi açıldı: `ca-app-pub-8522119154117548/5447996622`. Amaç, bu birimi okuma akışını bozmadan dört yerde göstermek ve ek gelir sağlamak.

## Hedefler

- Hikâye okumasında, metnin içinde, iki bölümün arasında bir yerel reklam.
- Ana sayfada, "Daha fazla hikâye" listesinde her 5 kartta bir yerel reklam.
- Kütüphane ana listesinde her 6 satırda bir yerel reklam.
- Yolum'da "Öğrendiklerim" ve "Ritim" sekmelerinin altında birer yerel reklam. "Harita" sekmesinde reklam yok (rütbe ve ödül anı).
- Mevcut kurallar aynen geçerli: Premium, onboarding bitmemiş, AB/İngiltere/İsviçre ve onay verilmemiş kullanıcıda reklam yok.

## Hedef dışı

- Interstitial ve banner birimlerini kurmak (interstitial yer tutucuda kalır).
- Android yerel birimi: ID verilmedi, Android'de yer tutucu kalır ve reklam çıkmaz.
- Reklam önyükleme havuzu, yeni analitik olayı, eski (p1 olmayan) hikâye biçimine reklam.
- Commit atmak.

## Yapılmaması gerekenler

- Reklamın hikâye içeriği gibi görünmesi. "Reklam" rozeti her zaman görünür, kart içerikten ayrışır.
- Reklamın bir butonun hemen yanında durması (yanlış dokunuş, AdMob politikası).
- Reklam yokken boşluk bırakmak. Yüklenmeyen reklam hiçbir şey çizmez.
- Expo Go ve web'de çökme.

## Yaklaşımlar

1. **Her yerleşim kendi reklamını yükler (seçilen).** Tek `NativeAdCard` bileşeni, takıldığı yerde reklamı kendi ister, ekrandan çıkınca `destroy()` eder. Bir `NativeAd` aynı anda yalnızca bir görünümde kullanılabildiği için her yuva kendi reklamını alır. Ekran başına en fazla 3 reklam yuvası olur (Ana sayfa ve Kütüphane). Basit, mevcut koda en az dokunan yol.
2. **Paylaşılan havuz, açılışta N reklam önyükleme.** Reklam daha hızlı görünür, ama havuz yönetimi, süre dolumu ve yuva eşleştirmesi gerekir. Bu boyutta fazla iş.
3. **Yerel reklam yerine uyarlanabilir banner.** Kolay, ama kullanıcının oluşturduğu yerel birimi kullanmaz. Kullanıcı yerel birim istedi.

## Tasarım

- **Birim ve kapı:** `app.json` `extra.admob.ios.native` gerçek birim, `android.native` yer tutucu. `ads.js` içinde `AD_UNITS.native` (demo build'de `TestIds.NATIVE`), `NATIVE_CONFIGURED` ve `shouldShowAd({ kind: 'native' })`. Aynı bölgeden-kapatma ve onay kontrolleri kullanılır. `ads.web.js` aynı dışa aktarımları boş döndürür.
- **Bileşen:** `src/components/NativeAdCard.js`. `NativeAd.createForAdRequest(AD_UNITS.native, adRequestOptions())` ile yükler. `NativeAdView` içinde başlık, gövde, ikon, görsel/medya ve eylem butonu SDK varlıkları olarak kaydedilir. "Reklam" rozeti `t('adLabel', lang)` ile dört dilde (Ad, Reklam, Anuncio, Anzeige). Renkler tema belirteçlerinden. Yükleme sürerken ve hata durumunda `null` döner.
- **Yuva yardımcıları:** `src/utils/adSlots.js`, saf fonksiyonlar. `insertAdSlots(items, every, max)` her `every` öğeden sonra en çok `max` reklam yuvası ekler. `pickReaderAdIndex(segments)` metnin ortasına en yakın "bölüm başlığı" sınırını bulur, yoksa `-1`.
- **Hikâye okuması:** `StoryBody` yeni bir `adSlotIndex` ve `renderAdSlot` prop'u alır. Reklam, seçilen bölüm başlığından hemen önce çizilir. Reklam bölüm sınırına girer. Düzeltme (inceleme sonrası): bazı hikâyelerde sınır, 1. dersin hemen ardındaki `[[reflect]]` başlığıdır; orada dersin "kaydet" butonu reklamın yaklaşık 44 px üstünde kalır. Bu bilinen, ertelenmiş bir sorundur.
- **Ana sayfa:** `storyGrid` içindeki tüm kartlar (hazır, haftalık bonus, teaser, kilitli) sırayla tek listede toplanır ve `insertAdSlots(kartlar, 5, 3)` uygulanır. Ücretsiz kullanıcıda hazır kart sayısı günlük kotayla sınırlı olduğundan yalnızca hazır kartları saymak reklamı neredeyse hiç göstermezdi. Kartların sırası ve görünümü değişmez. (Plan yazarken netleşti.)
- **Kütüphane:** `FlatList` verisi `insertAdSlots(visibleArchive, 6, 3)`; reklam öğesi `renderItem` içinde `NativeAdCard` çizer. "Devam et" kaydırıcısı değişmez.
- **Yolum:** `CareerPathExperience` içinde `learned` ve `rhythm` bölümlerinin altına birer `NativeAdCard`.

## Başarı ölçütü

- Premium kullanıcı hiçbir ekranda reklam görmez.
- Demo build'de dört yerde Google test yerel reklamı görünür. Gerçek build'de gerçek birim istenir.
- Reklam yüklenmezse ekranda boşluk veya hata yok.
- Jest: `adSlots` yardımcıları ve `shouldShowAd({ kind: 'native' })` için testler geçer; mevcut `monetizationModes` testi bozulmaz.

## Builder'a bırakılanlar

- Kart görünümü (köşe, gölge, boşluk) mevcut `StoryCard` ve `DESIGN.md` diline uydurulur.
- Okuyucuda reklam geç gelirse içerik kayabilir. Başlangıç kararı: boşluk ayırmadan, ekran açılışında yüklemeye başla. Gerçek cihazda kayma sorun olursa sabit yükseklik düşünülür.
- Dört dildeki `adLabel` metni `src/locales/i18n.js` içinde `en`, `tr`, `es`, `de` bloklarına eklenir.
- Doğrulama: Jest + iOS simülatöründe development build. Expo Go'da yerel modül yok, orada reklam görünmez.
