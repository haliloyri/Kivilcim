# Yerel Reklam Yerleşimi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Albor'da yerel (native) AdMob reklamını hikâye okumasında, Ana sayfada, Kütüphane'de ve Yolum'da göstermek.

**Architecture:** `src/utils/ads.js` yerel birimi, kapıyı (`shouldShowAd`) ve yükleyiciyi (`loadNativeAd`) sağlar. Tek bir `NativeAdCard` bileşeni her yuvada kendi reklamını yükler, hata veya bekleme durumunda hiçbir şey çizmez. `src/utils/adSlots.js` saf yardımcılarla yuva yerlerini hesaplar; ekranlar yalnızca `useNativeAdsEnabled()` true ise yuva ekler.

**Tech Stack:** React Native 0.88 + Expo 58, `react-native-google-mobile-ads` 16.5 (`NativeAd`, `NativeAdView`, `NativeAsset`, `NativeMediaView`), Jest (`jest-expo`) + `react-test-renderer`.

**Spec:** `docs/superpowers/specs/2026-11-16-yerel-reklam-design.md`

## Global Constraints

- Yerel reklam birimi (iOS): `ca-app-pub-8522119154117548/5447996622`. Android yerel birimi yer tutucu kalır: `REPLACE_WITH_ANDROID_NATIVE_UNIT`.
- Ana sayfa: her 5 kartta bir, ekran başına en çok 3 reklam. Kütüphane: her 6 satırda bir, en çok 3. Okuyucu: tek reklam. Yolum: yalnızca `learned` ve `rhythm` sekmeleri, `journey` (harita) sekmesinde yok.
- Rozet metni anahtarı `adLabel`: en `Ad`, tr `Reklam`, es `Anuncio`, de `Anzeige`. Kullanıcıya görünen metin `src/locales/i18n.js` içinde `en`, `tr`, `es`, `de` bloklarına eklenir ve `t(key, lang)` ile okunur; koda sabit yazılmaz.
- Renkler `useTheme().colors` belirteçlerinden (`cardBackground`, `border`, `text`, `textSecondary`, `primary`, `onPrimary`); sabit renk yok.
- Premium, onboarding bitmemiş, AB/İngiltere/İsviçre ve onay verilmemiş kullanıcıda reklam yok (`shouldShowAd`). Demo build'ler `TestIds.NATIVE` kullanır. Expo Go ve web'de çökme yok.
- Interstitial ve banner yer tutucularına dokunulmaz. `app.json` içindeki başkasına ait bekleyen değişikliklere (örn. RevenueCat `testStoreApiKey`) dokunulmaz.
- Kullanıcı istemedikçe commit atılmaz; plandaki adımlarda commit yok.
- Hata ayıklama günlükleri yalnızca `__DEV__` ve mevcut `console.warn('[ads] …')` kalıbıyla.

## Review Focus

- Reklam yüklenemezse (`loadNativeAd` → `null`) kart hiçbir şey çizmez, boşluk bırakmaz. Test: Task 3.
- Reklam yüklenmeden ekran kapanırsa, geç gelen reklam `destroy()` edilir (bellek ve yetim görünüm sızıntısı olmaz). Test: Task 3.
- Uygun bölüm başlığı olmayan veya çok kısa hikâyede okuyucuya reklam girmez, metin normal çizilir. Test: Task 2 ve Task 4.
- Liste `every` öğeden kısaysa veya tam katında bitiyorsa reklam eklenmez, sonda kalan reklam olmaz. Test: Task 2.
- Canlı build'de yerel birim yer tutucuysa yalnızca yerel reklam kapanır, ödüllü reklam çalışmaya devam eder; kısıtlı bölgede yerel reklam kapalı. Test: Task 1.

---

### Task 1: Birim yapılandırması ve kapı

**Files:**
- Modify: `app.json` (`extra.admob.ios`, `extra.admob.android`)
- Modify: `src/utils/ads.js`
- Modify: `src/utils/ads.web.js`
- Test: `src/services/__tests__/monetizationModes.test.js`

**Interfaces:**
- Produces (`src/utils/ads.js`, aynı dışa aktarımlar `ads.web.js` içinde de):
  - `AD_UNITS.native: string`
  - `shouldShowAd({ isPremium, isOnboarded, kind }): boolean` — `kind` artık `'rewarded' | 'interstitial' | 'native'`
  - `loadNativeAd(): Promise<NativeAd | null>`
  - `NativeAdView`, `NativeAsset`, `NativeAssetType`, `NativeMediaView` (Expo Go ve web'de `null` / `{}`)

- [ ] **Step 1: Testleri yaz.** `monetizationModes.test.js` içinde `EXTRA.admob.ios.native = 'ca-app-pub-1/8'`, `android.native = 'ca-app-pub-1/9'` ekle; `react-native-google-mobile-ads` taklidindeki `TestIds` içine `NATIVE: 'test-native'` ekle. `describe('ad units per build')` altına dört test ekle:
  - `demo builds use Google's test native unit`: `AD_UNITS.native` `'test-native'`, `shouldShowAd({ isPremium: false, isOnboarded: true, kind: 'native' })` `true`.
  - `live builds use the real native unit`: `AD_UNITS.native` `'ca-app-pub-1/8'`, native `true`, `isPremium: true` ile `false`.
  - `live build with a placeholder native unit shows no native ad but keeps rewarded`: native birimi `'REPLACE_WITH_IOS_NATIVE_UNIT'`; native `false`, varsayılan (`rewarded`) `true`.
  - `native ads are off in restricted regions`: `regionCode: 'DE'` ile native `false`.

- [ ] **Step 2: Başarısızlığı doğrula.** Run: `npx jest src/services/__tests__/monetizationModes.test.js` — Expected: yeni dört test FAIL (`AD_UNITS.native` undefined).

- [ ] **Step 3: `src/utils/ads.js` içinde uygula.**
  - Expo Go/web dalında `NativeAd = null`, `NativeAdView = null`, `NativeAsset = null`, `NativeAssetType = {}`, `NativeMediaView = null`, `TestIds.NATIVE = ''`; yerel dalda aynı adları `require('react-native-google-mobile-ads')` sonucundan al.
  - `AD_UNITS.native = useTest ? TestIds.NATIVE : platformUnits.native`; `NATIVE_CONFIGURED = useTest || isRealUnitId(AD_UNITS.native)`; `ANY_AD_CONFIGURED` buna dahil.
  - `shouldShowAd` içinde `configured` seçimi üç türü kapsar.
  - `export const loadNativeAd = async () => …`: bölge kısıtlıysa veya `!NATIVE_CONFIGURED` ise `null`; aksi halde `NativeAd.createForAdRequest(AD_UNITS.native, adRequestOptions())` sonucunu döner; hata olursa `console.warn('[ads] native load error:', e?.message)` yazıp `null` döner.
  - Mevcut `export { BannerAdSize }` satırına dört yerel bileşeni ekle; dosya başlığındaki kullanım listesine `loadNativeAd()` ekle.

- [ ] **Step 4: `src/utils/ads.web.js` içinde aynı dışa aktarımları ekle.** `AD_UNITS.native: ''`, `loadNativeAd = async () => null`, dört bileşen `null`/`{}`. `shouldShowAd` zaten `false` döner; `kind` parametresini yok sayması yeterli.

- [ ] **Step 5: `app.json` içine birimleri yaz.** `extra.admob.ios.native`: `"ca-app-pub-8522119154117548/5447996622"`, `extra.admob.android.native`: `"REPLACE_WITH_ANDROID_NATIVE_UNIT"`. JSON'un geçerli kaldığını doğrula: `node -e "JSON.parse(require('fs').readFileSync('app.json','utf8'))"`.

- [ ] **Step 6: Testleri çalıştır.** Run: `npx jest src/services/__tests__/monetizationModes.test.js` — Expected: tüm testler PASS (önceki 10 + yeni 4).

---

### Task 2: Yuva yardımcıları

**Files:**
- Create: `src/utils/adSlots.js`
- Test: `src/utils/__tests__/adSlots.test.js`

**Interfaces:**
- Produces:
  - `insertAdSlots<T>(items: T[], every: number, max: number): Array<T | { adSlot: true, key: string }>` — her `every` öğeden sonra, en çok `max` yuva; son öğeden sonra yuva eklemez; yuva anahtarları sırayla `'ad-1'`, `'ad-2'`, …; `every < 1` veya `max < 1` ise girdiyi aynen döner.
  - `isAdSlot(entry: unknown): boolean`
  - `pickReaderAdIndex(segments: Array<{ type: string, section?: string }>): number` — adayları `type === 'section'`, `section` değeri `'open'` ve `'use'` dışında ve indeksi ≥ 2 olan segmentler; `segments.length / 2` noktasına en yakın aday indeksini döner, eşitlikte küçük olanı; aday yoksa `-1`.

- [ ] **Step 1: Testleri yaz.**
  - `inserts a slot after every Nth item`: `insertAdSlots([1..12], 5, 3)` → `[1,2,3,4,5,{adSlot:true,key:'ad-1'},6,7,8,9,10,{adSlot:true,key:'ad-2'},11,12]`.
  - `adds no trailing slot when the list ends on a multiple`: `[1..10], 5, 3` → sonda yuva yok (tek yuva, 5. öğeden sonra).
  - `adds nothing to a list shorter than every`: `[1,2,3], 5, 3` → girdiyle aynı.
  - `caps the number of slots`: 30 öğe, `5, 2` → tam 2 yuva.
  - `returns the input unchanged for every < 1 or max < 1 and for an empty list`.
  - `isAdSlot` yuva için `true`, sayı ve story nesnesi için `false`.
  - `pickReaderAdIndex picks the heading closest to the middle`: segmentler `[section story, text, text, text, section lessons, lesson, lesson, section reflect, text, text]` → `4`.
  - `ignores open and use sections and headings before index 2`: yalnızca `[section open, text, section story(idx 2)…]` gibi bir dizide `open` atlanır; `section use` atlanır; idx 1'deki başlık atlanır.
  - `returns -1 with no eligible heading` (boş dizi ve başlıksız dizi için).
  - `prefers the earlier heading on a tie`.

- [ ] **Step 2: Başarısızlığı doğrula.** Run: `npx jest src/utils/__tests__/adSlots.test.js` — Expected: FAIL (modül yok).

- [ ] **Step 3: `src/utils/adSlots.js` içinde üç fonksiyonu uygula.** Saf fonksiyonlar, bağımlılık yok.

- [ ] **Step 4: Testleri çalıştır.** Run: `npx jest src/utils/__tests__/adSlots.test.js` — Expected: PASS.

---

### Task 3: `NativeAdCard`, `useNativeAdsEnabled`, `adLabel`

**Files:**
- Create: `src/components/NativeAdCard.js`
- Create: `src/hooks/useNativeAdsEnabled.js`
- Modify: `src/locales/i18n.js` (`en`, `tr`, `es`, `de` blokları; `adSheetTitle` anahtarlarının yanına)
- Test: `src/components/__tests__/NativeAdCard.test.js`

**Interfaces:**
- Consumes (Task 1): `loadNativeAd`, `NativeAdView`, `NativeAsset`, `NativeAssetType`, `NativeMediaView` — `'../utils/ads'` içinden.
- Produces:
  - `default NativeAdCard({ lang: string, style?: StyleProp<ViewStyle> }): ReactElement | null`
  - `default useNativeAdsEnabled(): boolean` — `useUserData()` içinden `isPremium`, `isOnboarded` okur, `shouldShowAd({ isPremium, isOnboarded, kind: 'native' })` döner.
  - i18n anahtarı `adLabel`.

- [ ] **Step 1: Testi yaz.** `ReaderPanels.test.js` ile aynı `jest.mock` kalıbı: `ThemeContext` (`useTheme: () => ({ colors: colors.light, isDark: false })`), `@expo/vector-icons`. `../../utils/ads` taklidi: `loadNativeAd: jest.fn()`, `NativeAdView`/`NativeAsset` çocuğu aynen döner, `NativeMediaView: () => null`, `NativeAssetType: { HEADLINE: 'headline', BODY: 'body', ICON: 'icon', CALL_TO_ACTION: 'callToAction', ADVERTISER: 'advertiser' }`. Sahte reklam: `{ headline: 'Örnek reklam', body: 'Gövde metni', callToAction: 'Yükle', advertiser: 'Marka', icon: { url: 'https://example.com/i.png' }, mediaContent: { aspectRatio: 1.5 }, destroy: jest.fn() }`. Testler:
  - `renders nothing while the ad is loading and when loading fails`: `loadNativeAd` bekleyen/`null` → `tree.toJSON()` `null`.
  - `shows the Reklam label, headline and call to action once loaded` (`lang="tr"`): çıktı metinleri `'Reklam'`, `'Örnek reklam'`, `'Yükle'` içerir.
  - `destroys the ad on unmount`: unmount sonrası `ad.destroy` bir kez çağrıldı.
  - `destroys an ad that arrives after unmount`: `loadNativeAd` unmount'tan sonra çözülür → `ad.destroy` çağrıldı ve render edilmedi.

- [ ] **Step 2: Başarısızlığı doğrula.** Run: `npx jest src/components/__tests__/NativeAdCard.test.js` — Expected: FAIL (modül yok).

- [ ] **Step 3: `adLabel` anahtarını dört dile ekle** (önce `grep -n "adLabel" src/locales/i18n.js` ile çakışma olmadığını doğrula): `Ad`, `Reklam`, `Anuncio`, `Anzeige`.

- [ ] **Step 4: `useNativeAdsEnabled` yaz** (`src/hooks/useNativeAdsEnabled.js`).

- [ ] **Step 5: `NativeAdCard` yaz.** `useEffect` içinde `loadNativeAd()` çağır; sonuç geldiğinde bileşen hâlâ takılıysa `state`e koy, değilse `ad.destroy()`; temizlikte mevcut reklamı `destroy()` et. Reklam yoksa `null` dön. Düzen: `NativeAdView` içinde kart (`cardBackground`, `border`, 16 yarıçap); üst satırda "Reklam" rozeti (`t('adLabel', lang)`, küçük çerçeveli etiket) ve `advertiser`; `ICON` (varsa), `HEADLINE`, `BODY` (en çok 3 satır) `NativeAsset` ile kayıtlı; `NativeMediaView` (`resizeMode="cover"`, yuvarlak köşe); `CALL_TO_ACTION` `NativeAsset` içinde `primary` zeminli buton görünümlü `Text`. `style` dış `View`e uygulanır. Piksel düzeyi ayrıntılar `StoryCard` ve `DESIGN.md` diline uydurulur.

- [ ] **Step 6: Testi çalıştır.** Run: `npx jest src/components/__tests__/NativeAdCard.test.js` — Expected: PASS.

---

### Task 4: Hikâye okuması

**Files:**
- Modify: `src/components/story/StoryBody.js`
- Modify: `src/screens/StoryDetailScreen.js` (`StoryBody` çağrısı, ~1919; en üstteki hook bölümü)
- Test: `src/components/story/__tests__/StoryBodyAdSlot.test.js`

**Interfaces:**
- Consumes: `pickReaderAdIndex` (Task 2), `NativeAdCard`, `useNativeAdsEnabled` (Task 3).
- Produces: `StoryBody` iki yeni prop alır: `adSlotIndex?: number` (varsayılan `-1`), `renderAdSlot?: () => ReactNode`.

- [ ] **Step 1: Testi yaz.** `ReaderPanels.test.js` mock kalıbıyla `StoryBody` çiz. Segmentler: `[{type:'section',section:'story'}, {type:'text',section:'story',content:'Bir'}, {type:'text',section:'story',content:'İki'}, {type:'section',section:'lessons'}, {type:'text',section:'lessons',content:'Üç'}]`. Testler:
  - `renders the ad slot right before the chosen section heading`: `adSlotIndex={3}`, `renderAdSlot={() => <Text>AD</Text>}` → `'AD'` tam bir kez, `'İki'` metninden sonra ve ders başlığından önce.
  - `renders no ad slot when adSlotIndex is -1 or renderAdSlot is missing`.

- [ ] **Step 2: Başarısızlığı doğrula.** Run: `npx jest src/components/story/__tests__/StoryBodyAdSlot.test.js` — Expected: FAIL (`AD` bulunamadı).

- [ ] **Step 3: `StoryBody` içinde uygula.** Mevcut `segments.map` geri çağrısını değiştirmeden `renderSegment(seg, idx)` olarak çıkar; haritada `idx === adSlotIndex && renderAdSlot` ise `<React.Fragment key={`ad-${idx}`}>{renderAdSlot()}{node}</React.Fragment>` dön, değilse `node`.

- [ ] **Step 4: `StoryDetailScreen` içinde bağla.** Diğer hook'larla birlikte, erken `return`'lerden önce: `const adsOn = useNativeAdsEnabled();` ve `parsedBody` değiştikçe `readerAdIndex = adsOn && parsedBody.format === 'p1' ? pickReaderAdIndex(parsedBody.segments) : -1` (`useMemo`). `StoryBody`ya `adSlotIndex={readerAdIndex}` ve `renderAdSlot={() => <NativeAdCard lang={localLang} style={{ marginVertical: 16 }} />}` ver.

- [ ] **Step 5: Testleri çalıştır.** Run: `npx jest src/components/story` — Expected: `StoryBodyAdSlot` ve mevcut `ReaderPanels` testleri PASS.

---

### Task 5: Ana sayfa

**Files:**
- Modify: `src/screens/HomeScreen.js` (`storyGrid` bloğu ~3128-3181; `teaserStory` türetmesinin yanı ~948)

**Interfaces:**
- Consumes: `insertAdSlots`, `isAdSlot` (Task 2), `NativeAdCard`, `useNativeAdsEnabled` (Task 3).

- [ ] **Step 1: Kart girdilerini tek listeye topla.** `free`, `weeklyBonusStory`, `teaserStory`, `locked` değerlerinden sırayla (`free…`, bonus, teaser, `locked…`) `{ key, kind: 'free' | 'bonus' | 'teaser' | 'locked', story }` girdileri üreten bir `useMemo` yaz; anahtarlar bugünkü `key` değerleri (`story.story_id`, `bonus-<id>`, `teaser-<id>`). `const adsOn = useNativeAdsEnabled();` ile `gridEntries = adsOn ? insertAdSlots(entries, 5, 3) : entries`.

- [ ] **Step 2: `storyGrid` içindeki beş ayrı çizimi tek `gridEntries.map` ile değiştir.** `isAdSlot(entry)` ise `<NativeAdCard key={entry.key} lang={lang} />`; aksi halde `kind`'a göre bugünkü `StoryCard` çağrılarını prop'larıyla birebir koru (`free`: `onPress → openStory(story, { source: 'home_feed_locked' })` ve `onUseInConversation`; `bonus`: `supportText` ve `bypassQuota`; `teaser`: `locked` ve `openPaywallFromFreeLimit('home_feed_teaser', …)`; `locked`: `locked`, `supportText` ve `openPaywallFromFreeLimit('home_feed_locked', …)`). `{false && free.length > 0 && …}` hero bloğuna dokunma.

- [ ] **Step 3: Doğrula.** Run: `npx jest` — Expected: tüm mevcut testler PASS. Görsel doğrulama Task 8'de.

---

### Task 6: Kütüphane

**Files:**
- Modify: `src/screens/LibraryScreen.js` (`FlatList` ~701-705)

**Interfaces:**
- Consumes: `insertAdSlots`, `isAdSlot` (Task 2), `NativeAdCard`, `useNativeAdsEnabled` (Task 3).

- [ ] **Step 1: `FlatList` verisini sar.** `const adsOn = useNativeAdsEnabled();` ve `listData = useMemo(() => (adsOn ? insertAdSlots(visibleArchive, 6, 3) : visibleArchive), [adsOn, visibleArchive])`; yalnızca `FlatList data={listData}` kullansın, `visibleArchive` diğer yerlerde (sayım, boş durum) olduğu gibi kalsın.

- [ ] **Step 2: `keyExtractor` ve `renderItem`'i yuvaya göre dallandır.** `isAdSlot(item)` ise anahtar `${activeCollection}-${item.key}` ve satır `<NativeAdCard lang={lang} style={{ marginBottom: 10 }} />`; değilse bugünkü kod. `ItemSeparatorComponent`'i `({ leadingItem }) => (isAdSlot(leadingItem) ? null : <View style={{ height: 10 }} />)` yap, böylece reklam yüklenmediğinde çift boşluk oluşmaz. "Devam et" kaydırıcısına dokunma.

- [ ] **Step 3: Doğrula.** Run: `npx jest` — Expected: PASS. Görsel doğrulama Task 8'de.

---

### Task 7: Yolum

**Files:**
- Modify: `src/components/career/CareerPathExperience.js` (`learned` ve `rhythm` satırları ~487-488)

**Interfaces:**
- Consumes: `NativeAdCard`, `useNativeAdsEnabled` (Task 3).

- [ ] **Step 1: Reklamı iki sekmenin altına ekle.** `const adsOn = useNativeAdsEnabled();` ve `segment === 'learned'` ile `segment === 'rhythm'` bölümlerinin hemen altına, `adsOn && !isPreviewing` iken `<NativeAdCard lang={lang} style={{ marginTop: 16 }} />`. `journey` sekmesine ekleme yok. Mevcut çizimleri tek ifadeden fragment'e çevirmek dışında değiştirme.

- [ ] **Step 2: Doğrula.** Run: `npx jest src/components/career` — Expected: mevcut career testleri PASS.

---

### Task 8: Uçtan uca doğrulama

**Files:** yok (yalnızca doğrulama).

- [ ] **Step 1: Tüm testler.** Run: `npx jest` — Expected: tüm suite'ler PASS, yeni suite'ler dahil (`adSlots`, `NativeAdCard`, `StoryBodyAdSlot`).

- [ ] **Step 2: `app.json` geçerliliği ve eski kimlik kalmadığı.** Run: `node -e "JSON.parse(require('fs').readFileSync('app.json','utf8')); console.log('ok')"` — Expected: `ok`; `grep -rn "1087148522890227" app.json ios/Albor.xcodeproj/project.pbxproj src` — Expected: çıktı yok.

- [ ] **Step 3: iOS simülatöründe development build.** Run: `npx expo run:ios` (veya simülatör `build` aracı). Demo build `TestIds.NATIVE` kullanır. Beklenen: (a) bir hikâyede metnin ortasında bölüm başlığından önce "Reklam" rozetli kart, (b) Ana sayfada 5. karttan sonra ve en çok 3 kart, (c) Kütüphane'de 6. satırdan sonra, (d) Yolum'da "Öğrendiklerim" ve "Ritim" altında, "Harita"da yok, (e) Premium kullanıcıda dört yerde de yok. Reklam gelmezse boşluk kalmaması da kontrol edilir.
