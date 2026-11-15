# Açılış Ekranında Albi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yükleme ekranında kitabın ortasında doğan güneş diskinin yerine, kitabın sayfalarının üstünde duran Albi'yi (kuş maskot) göstermek.

**Architecture:** Yalnızca `AnimatedLogo` değişir. `Sun` katmanı kalkar, yerine mevcut `Albi` bileşeni (`selamlama` pozu) gelir. `Glow` ve `Rays` Albi'nin gövdesinin arkasına kaydırılır. `Book` ve `LaunchScreen` aynı kalır, böylece statik açılış ekranından (yalnızca kitap) animasyona geçişte kayma olmaz.

**Tech Stack:** React Native 0.88 + Expo 58, `react-native-svg`, `Animated`, Jest (`jest-expo`) + `react-test-renderer`.

**Spec:** `docs/superpowers/specs/2026-11-16-acilis-albi-design.md`

## Global Constraints

- Kitap aynı yerde ve aynı boyutta kalır: `LOGO_SIZE` 200, `LaunchScreen.js` değişmez, `AnimatedLogo` kök kutusu `size × size`.
- Albi: mevcut `Albi` bileşeni, `pose="selamlama"`, boyut `size` değerinin %85'i (200'de 170 px). Ayaklar sayfaların üstünde (kutunun yaklaşık %55–62'si), görselin üstü kutunun üstüne taşar.
- Sıralama: parıltı, ışınlar, Albi, kitap. Ayaklar kitabın arkasında kalıp görünmüyorsa Albi kitabın önüne alınır (ölçüt: ayaklar görünür).
- Giriş: Albi opaklığı 0→1, kitaba doğru ~24 px yükselme, çok hafif ölçek. Boşta: yalnızca 2–3 px dikey salınım, ölçekleme yok. Parıltı ve ışınlar mevcut zamanlamayla açılır.
- "Hareketi azalt" açıksa animasyon başlamaz, Albi son halinde sabit durur.
- Statik açılış görseli, `app.json`, uygulama ikonu, "Albor" yazısı, slogan ve durum metinlerine dokunulmaz.
- Çalışma ağacındaki başkasına ait bekleyen değişikliklere (reklam işi, `app.json`, `ios/` vb.) dokunulmaz. Kullanıcı istemedikçe commit atılmaz; plandaki adımlarda commit yok.

## Review Focus

- "Hareketi azalt" açıkken hiçbir `Animated.timing` başlamaz. Test: Task 1.
- Küçük `size` (120) verilince Albi orantılı küçülür (102 px). Test: Task 1.
- Animasyon sürerken bileşen kaldırılırsa hata veya uyarı çıkmaz. Test: Task 1.
- Kök kutu `size × size` kalır (kitap kayması yok). Test: Task 1, ekranda Task 2.
- Albi petrol zeminde ayırt edilir. Testle sabitlenemez, ekran görüntüsüyle bakılır: Task 2.

---

### Task 1: `AnimatedLogo` içinde güneşin yerine Albi

**Files:**
- Modify: `src/components/AnimatedLogo.js`
- Test: `src/components/__tests__/AnimatedLogo.test.js` (yeni)

**Interfaces:**
- Consumes: `Albi` (default export, `src/components/Albi.js`), prop'lar `{ pose: string, size: number, disc?: boolean, style? }`.
- Produces: `AnimatedLogo({ size?: number })` (default export, imza aynı), `LOGO_BACKGROUND`, `LOGO_NAVY`, `Book` dışa aktarımları aynı kalır. `Sun` kalkar (başka yerde kullanılmıyor).

- [ ] **Step 1: Başarısız testleri yaz** — `AnimatedLogo.test.js`. `jest.mock('../Albi', () => 'Albi')` ile Albi ana makine öğesi olur; `TestRenderer.create(<AnimatedLogo size={200} />)` ve `await act(async () => {})` ile bekle. Testler:
  - `renders Albi with the selamlama pose at 85% of size`: `root.findByType('Albi').props` → `pose === 'selamlama'`, `size === 170`.
  - `scales Albi with size`: `size={120}` → Albi `size === 102`.
  - `keeps the root box size x size`: ilk `View` stili `width === 200` ve `height === 200`.
  - `starts no animation when reduce motion is on`: `jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true)`, `jest.spyOn(Animated, 'timing')` → çağrılmadı.
  - `starts animations when reduce motion is off`: `mockResolvedValue(false)` → `Animated.timing` çağrıldı.
  - `unmounting mid-animation does not throw`: `act(() => tree.unmount())`.
- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `npx jest src/components/__tests__/AnimatedLogo.test.js`
Expected: FAIL (`Albi` türünde öğe bulunamıyor).

- [ ] **Step 3: `AnimatedLogo.js` içinde uygula**
  - Başa adlandırılmış başlangıç sabitleri: `ALBI_SCALE = 0.85`, `ALBI_FEET = 0.58` (ayakların kutu yüksekliğine oranı), `LIGHT_SHIFT = 0.275` (parıltı ve ışınların yukarı kayması, `size` oranı). Sayılar Task 2'de ekranda ayarlanır.
  - `Sun` bileşenini sil. `sunRise` değerini `albiIn` olarak yeniden adlandır (aynı zamanlama: gecikme 150, süre 1100).
  - Albi katmanı: mutlak konumlu `Animated.View`, genişlik/yükseklik `albiSize = size * ALBI_SCALE`, `left = (size - albiSize) / 2`, `top = size * ALBI_FEET - albiSize`, içinde `<Albi pose="selamlama" size={albiSize} />`. Opaklık `albiIn` ile `[0, 0.3, 1] → [0, 1, 1]`; `translateY` = `albiIn` `[0,1] → [24, 0]` artı `breath` `[0,1] → [0, -3]`; `scale` = `albiIn` `[0,1] → [0.96, 1]`.
  - `Glow` ve `Rays` katmanlarını `translateY: -size * LIGHT_SHIFT` ile yukarı kaydır (mevcut `glowStyle`/`raysStyle` dönüşümleriyle birlikte).
  - Çizim sırası: `Glow`, `Rays`, Albi, `Book`.
  - Bu değişikliğin kullanılmaz bıraktığı değişken/import'ları sil (örn. `unit`). Dosya başındaki açıklamayı ("the sun rises from behind the pages") yeni davranışa göre güncelle.
- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `npx jest src/components/__tests__/AnimatedLogo.test.js`
Expected: PASS (6 test). `react-native-svg` jest'te hata verirse yalnızca bu test dosyasında `jest.mock('react-native-svg', ...)` ile ana makine bileşenlerine çevir.

- [ ] **Step 5: Tüm testleri çalıştır**

Run: `npm test`
Expected: yeni bir başarısızlık yok. Önceden başarısız olan bir test varsa `git stash` ile değil, çıktıyı karşılaştırarak ayırt et ve rapora yaz.

### Task 2: Simülatörde doğrula ve ayarla

**Files:**
- Modify: `src/components/AnimatedLogo.js` (yalnızca Task 1'deki üç sabit ve gerekirse çizim sırası)

**Interfaces:**
- Consumes: Task 1'in `ALBI_SCALE`, `ALBI_FEET`, `LIGHT_SHIFT` sabitleri.

- [ ] **Step 1: Uygulamayı iOS simülatöründe aç** (`run` becerisi veya `npx expo run:ios`). Açılış ekranını yeterince uzun görmek için `AppNavigator.js` içindeki `launchHold` değerini geçici olarak `true` yap; iş bitince geri al.
- [ ] **Step 2: Ekran görüntüsü al ve kontrol et**
  - Albi'nin ayakları sayfaların üstünde ve görünür, göğsündeki ışık görünür.
  - Albi petrol zeminde ayırt ediliyor (parıltı yetmezse Spec'teki iOS gölge halkasını ekle: `Albi` görseline altın `shadowColor`, `shadowRadius`, `shadowOpacity`).
  - Kitap, statik açılış ekranındaki yerinde: iki ekran görüntüsünü (statik ve animasyonlu) karşılaştır, kitap kaymıyor.
  - "Albor" yazısı ve slogan Albi'ye veya kitaba binmiyor.
- [ ] **Step 3: Sabitleri ayarla**, Step 2'yi tekrarla. Gerekirse sıralamayı değiştir (Albi kitabın önünde).
- [ ] **Step 4: `launchHold` değişikliğini geri al ve `npm test` çalıştır**

Run: `git diff src/navigation/AppNavigator.js`
Expected: boş çıktı (`AppNavigator.js` bu işe başlarken değişmemişti).
