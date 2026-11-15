# Bildirimlerde Albi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** iOS'ta üç yerel bildirim türünün sağındaki küçük görsel olarak Albi'yi (kuş maskot) üç farklı pozla göstermek.

**Architecture:** Üç kâğıt zeminli PNG hazırlanıp `assets/albi/bildirim/` altına konur. Yeni `src/utils/notificationImages.js` her çağrıda paketlenmiş PNG'nin ayrı bir geçici kopyasını yapıp iOS `attachments` biçiminde döner. `src/utils/notifications.js` her zamanlamada bu yardımcıyı çağırıp `content`'e ekler. Görsel hazırlanamazsa bildirim görselsiz zamanlanır.

**Tech Stack:** React Native 0.88 + Expo 58, `expo-notifications` 58.1.6, `expo-asset`, `expo-file-system` (yeni `File`/`Directory`/`Paths` API'si), Jest (`jest-expo`), tek seferlik görsel betiği için `jimp-compact` (node_modules'te mevcut).

**Spec:** `docs/superpowers/specs/2026-11-16-bildirim-albi-design.md`

## Global Constraints

- Pozlar: günlük okuma hatırlatması `okuma`, gece seri uyarısı `dark_mode`, haftalık özet ("Haftam") `hedef_tamam`.
- Görseller: `assets/albi/bildirim/okuma.png`, `dark_mode.png`, `hedef_tamam.png`. 512×512, kâğıt rengi `#F5F1E8` tam kare zemin, Albi ortada, kenarlarda boşluk. Üretim betiği repoya girmez.
- `attachments` yalnızca iOS'ta verilir. Android'de anahtar hiç gönderilmez. `typeHint: 'public.png'`.
- Her zamanlama için ayrı geçici kopya (iOS dosyayı kendi deposuna taşıyabilir; aynı dosya birden çok zamanlamada kullanılırsa sonrakiler görselsiz kalabilir). Her yeniden zamanlamadan önce geçici kopyaların klasörü silinir.
- Görsel adımlarından biri hata verirse `[]` dönülür, bir `console.warn` yazılır ve bildirim görselsiz zamanlanır.
- Soldaki iOS ikonu, Android kitap silüeti (`assets/logo/notification-icon.png`), uzaktan (push) bildirimler, bildirim metinleri ve saatleri değişmez.
- Çalışma ağacındaki başkasına ait bekleyen değişikliklere dokunulmaz. Kullanıcı istemedikçe commit atılmaz; plandaki adımlarda commit yok.

## Review Focus

- Aynı türden art arda iki zamanlamada ikisi de görselli olur, `url`'ler farklıdır. Test: Task 2 ve Task 3.
- Görsel hazırlanamazsa bildirim yine zamanlanır, `content`'te `attachments` anahtarı olmaz. Test: Task 3.
- Android'de `attachments` anahtarı hiç gönderilmez. Test: Task 2.
- Yeniden zamanlamada eski geçici kopyalar `cancelAllScheduledNotificationsAsync()`'ten sonra, yeni zamanlamalardan önce silinir. Test: Task 3.
- Seri 2'den azsa seri uyarısı ve onun görseli üretilmez. Test: Task 3.

---

### Task 1: Üç kâğıt zeminli görsel

**Files:**
- Create: `assets/albi/bildirim/okuma.png`, `assets/albi/bildirim/dark_mode.png`, `assets/albi/bildirim/hedef_tamam.png`

**Interfaces:**
- Produces: `assets/albi/bildirim/<poz>.png`, `<poz>` ∈ `okuma | dark_mode | hedef_tamam`. Task 2 bunları `require` eder.

- [ ] **Step 1: Betiği scratchpad'de yaz** (repoya girmez): her poz için `new Jimp(512, 512, 0xF5F1E8FF)`, `Jimp.read('assets/albi/<poz>.png')` görselini 400×400'e küçült, `(56, 56)` konumuna `composite` et, `assets/albi/bildirim/<poz>.png` olarak yaz. Çalıştırma: `NODE_PATH=<repo>/node_modules node <scratchpad>/make-notif-images.js` (repo kökünden).
- [ ] **Step 2: Doğrula**

Run: `sips -g pixelWidth -g pixelHeight assets/albi/bildirim/*.png`
Expected: üç dosyada da `pixelWidth: 512` ve `pixelHeight: 512`. Üçünü gözle aç: Albi ortada, kenarda boşluk var, zemin kâğıt rengi, `dark_mode` pozu zeminde okunuyor.

### Task 2: `notificationImages` yardımcısı

**Files:**
- Create: `src/utils/notificationImages.js`
- Test: `src/utils/__tests__/notificationImages.test.js`

**Interfaces:**
- Consumes: Task 1'in PNG'leri.
- Produces: `getNotificationAttachments(pose: 'okuma' | 'dark_mode' | 'hedef_tamam'): Promise<Array<{ identifier: string, url: string, typeHint: 'public.png' }>>` ve `clearNotificationImageCache(): void`. İkisi de asla fırlatmaz.

- [ ] **Step 1: Başarısız testleri yaz.** `expo-asset` (`Asset.fromModule(...).downloadAsync()` → `{ localUri }`) ve `expo-file-system` (`File`, `Directory`, `Paths.cache`; kopya `file.copy(hedef)`, hedefin `uri`'si) jest'te sahte. `Platform.OS` testte `ios`/`android` yapılır. Testler:
  - `returns [] on android` ve `Asset.fromModule` çağrılmadı.
  - `returns one png attachment on ios`: dizi uzunluğu 1, `typeHint === 'public.png'`, `url` `file://` ile başlıyor, `identifier` dolu.
  - `returns a different url on every call`: aynı poz iki kez → iki `url` farklı.
  - `returns [] and warns when the asset cannot be downloaded`: `downloadAsync` reddeder → `[]`, `console.warn` çağrıldı.
  - `returns [] for an unknown pose`.
  - `clearNotificationImageCache deletes the cache directory and never throws`: klasör silinir; `delete` fırlatırsa da fırlatmaz.
- [ ] **Step 2: Başarısız olduğunu doğrula**

Run: `npx jest src/utils/__tests__/notificationImages.test.js`
Expected: FAIL (modül yok).

- [ ] **Step 3: `src/utils/notificationImages.js` içinde uygula.** `Albi.js`'deki gibi `POSES` tablosunda `require('../../assets/albi/bildirim/<poz>.png')`. Geçici klasör `new Directory(Paths.cache, 'albi-bildirim')`, yoksa `create()`. Kopya adı `<poz>-<Date.now()>-<sayaç>.png`. İOS değilse veya bilinmeyen pozsa hemen `[]`. Tüm gövde `try/catch`, hatada `console.warn('[notifications] image', error)` ve `[]`. `clearNotificationImageCache` klasör varsa siler, `try/catch` içinde.
- [ ] **Step 4: Geçtiğini doğrula**

Run: `npx jest src/utils/__tests__/notificationImages.test.js`
Expected: PASS (6 test). Yeni `File`/`Directory` API'sinin gerçek imzası testteki sahteyle uyuşmuyorsa `node_modules/expo-file-system/build/*.d.ts` dosyalarına göre sahteyi düzelt.

### Task 3: `notifications.js` içinde bağlama

**Files:**
- Modify: `src/utils/notifications.js` (`scheduleWeeklyForDays`, `notifContent`, seri uyarısı, haftalık özet, `cancelAllScheduledNotificationsAsync()` sonrası)
- Modify: `src/screens/__tests__/OnboardingReminders.test.js` (yalnızca gürültü çıkarsa: `jest.mock('../../utils/notificationImages', ...)`)
- Test: `src/utils/__tests__/notificationsAlbi.test.js` (yeni)

**Interfaces:**
- Consumes: Task 2'nin `getNotificationAttachments`, `clearNotificationImageCache`.
- Produces: `scheduleDailyNotifications(options)` imzası aynı. İçeride `scheduleWeeklyForDays({ days, hour, minute, makeContent })`: `content` yerine her gün için `await makeContent()` çağıran fabrika; `makeContent: () => Promise<NotificationContentInput>`.

- [ ] **Step 1: Başarısız testleri yaz.** `expo-notifications`, `../../db/db` (`getReadHistory` → `[]`), `../analytics` ve `../notificationImages` sahte; `getNotificationAttachments` her çağrıda `[{ identifier, url: 'file:///t/<poz>-<n>.png', typeHint: 'public.png' }]` döner (n artar). `getPermissionsAsync` → `{ status: 'granted' }`. `scheduleDailyNotifications({ lang: 'tr', reminderWindows: ['evening'], streak: 3, totalReads: 5 })` çağrılır. Testler:
  - `gives each type its own pose`: `scheduleNotificationAsync` çağrıları arasında günlük için `okuma`, seri uyarısı için `dark_mode`, haftalık özet (`data.type === 'weekly_recap'`) için `hedef_tamam` istendi.
  - `uses a different attachment url for every scheduled notification`: günlük bildirimlerin `attachments[0].url` değerleri hepsi birbirinden farklı.
  - `still schedules when no image is available`: `getNotificationAttachments` `[]` döner → `scheduleNotificationAsync` yine çağrılır, `content` içinde `attachments` anahtarı yok.
  - `clears the image cache after cancelling and before scheduling`: çağrı sırası `cancelAllScheduledNotificationsAsync` → `clearNotificationImageCache` → ilk `scheduleNotificationAsync`.
  - `skips the streak reminder when streak is below 2`: `streak: 1` → `dark_mode` hiç istenmedi.
- [ ] **Step 2: Başarısız olduğunu doğrula**

Run: `npx jest src/utils/__tests__/notificationsAlbi.test.js`
Expected: FAIL (`attachments` yok, görsel yardımcısı çağrılmıyor).

- [ ] **Step 3: Uygula.** `import { getNotificationAttachments, clearNotificationImageCache } from './notificationImages'`. Dosya başında sabit `NOTIFICATION_POSE = { daily: 'okuma', streak: 'dark_mode', weekly: 'hedef_tamam' }`. `notifContent` `async (bodyText, kind)` olur ve `attachments` boş değilse `content`'e `attachments` ekler (boşsa anahtar eklenmez). `scheduleWeeklyForDays` `content` yerine `makeContent` alır ve her gün için ayrı çağırır; çağıranlar `() => notifContent(body, 'daily')` / `'streak'` geçer. Haftalık özet `scheduleNotificationAsync` çağrısının `content`'i de aynı yardımcıyla (`'weekly'`) hazırlanır. `clearNotificationImageCache()` `cancelAllScheduledNotificationsAsync()` satırından hemen sonra çağrılır.
- [ ] **Step 4: Geçtiğini doğrula, sonra tümünü çalıştır**

Run: `npx jest src/utils/__tests__/notificationsAlbi.test.js` → Expected: PASS (5 test).
Run: `npm test` → Expected: yeni başarısızlık yok. `OnboardingReminders.test.js` gerçek `expo-asset`/`expo-file-system` yüzünden uyarı basıyorsa o dosyada `notificationImages`'ı sahtele.

### Task 4: Simülatörde doğrula

**Files:**
- Modify (geçici, geri alınacak): `App.js`

**Interfaces:**
- Consumes: `getNotificationAttachments` (Task 2).

- [ ] **Step 1: Uygulamayı iOS simülatöründe aç** (`run` becerisi veya `npx expo run:ios`), bildirim iznini ver.
- [ ] **Step 2: Geçici deneme kodu ekle:** açılışta üç `Notifications.scheduleNotificationAsync` çağrısı, `trigger: { type: 'timeInterval', seconds: 5 / 10 / 15 }`, her birinde `content.attachments = await getNotificationAttachments(<poz>)`. İlk poz için ikinci bir bildirimi de ekle (aynı türden art arda iki bildirim).
- [ ] **Step 3: Uygulamayı arka plana al** (simülatör `HOME` düğmesi), bildirimlerin geldiğini ekran görüntüsüyle kaydet: üç türde doğru Albi, aynı türden ikincisi de görselli. Açık ve koyu görünümde tekrarla (`set_appearance`). Bir bildirimi uzun basıp aç, büyük görseli kontrol et.
- [ ] **Step 4: Geçici kodu sil**, `git diff` ile yalnızca bu planın dosyalarının değiştiğini doğrula, `npm test` çalıştır.

Run: `git status --short`
Expected: bu işe ait yalnızca `src/utils/notificationImages.js`, `src/utils/notifications.js`, iki yeni test dosyası, `assets/albi/bildirim/` ve (gerekirse) `OnboardingReminders.test.js` görünür. `App.js` değişmiş görünmez (bu işe başlarken değişmemişti).
