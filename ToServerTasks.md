# ToServerTasks — Local'den Server'a (Supabase) Taşıma Planı

> Amaç: Şu an yalnızca cihazda (SQLite `kivilcim.db` + AsyncStorage) tutulan kullanıcı verisini, davranışlarını ve aksiyonlarını Supabase'e taşımak. Böylece cihaz değişiminde/yeniden kurulumda veri kaybı olmaz, çoklu cihaz senkronizasyonu, yedekleme ve analitik mümkün hale gelir.

Son güncelleme: 2026-07-01

---

## Mevcut Durum (Özet)

**Zaten Supabase'de olanlar** (`supabase/schema.sql`):
- `profiles` — id, display_name, lang, is_premium
- `push_tokens` — Expo push token / cihaz
- `stories` — server tarafı içerik kaynağı (RLS: aktif hikâyeler herkese okunur)

**Yalnızca cihazda olan — taşınacak** içerik iki yerde:
1. **SQLite (`src/db/db.js` → `kivilcim.db`)**: `user_reads`, `user_likes`, `user_selected_categories(_new)`, `user_streak_freezes`
2. **AsyncStorage (`src/context/*`, `src/screens/*`)**: favoriler, geçmiş, tercihler, profil, premium durumu, streak freeze kredileri, varyant kullanımı, rozet durumları vb.

İçerik tabloları (`categories`, `subcategories`, `books`, `stories` çevirileri) cihazda asset olarak bundle'lanıyor — bunlar **cache** niteliğinde, server (`stories`) zaten kaynak. Kullanıcı verisinden ayrı değerlendirilmeli.

---

## 1. Taşınacak Kullanıcı Verisi (SQLite → Supabase)

Her biri için `user_id = auth.uid()` ile RLS uygulanacak. Şu an `userId = 'default'` (tek kullanıcı) varsayımı var — gerçek auth user'a bağlanmalı.

| Local tablo / kaynak | İçerik | Server'da olması gerekçe | Yeni Supabase tablosu |
|---|---|---|---|
| `user_reads` | Hikâye okuma kayıtları (storyId, tarih) | Streak, istatistik, analitik; cihaz değişiminde korunmalı | `user_reads` |
| `user_likes` | Beğeniler | Çoklu cihaz senkron, sosyal sinyal | `user_likes` |
| `user_streak_freezes` | Streak dondurma günleri | Streak hesabı server'da doğrulanmalı | `user_streak_freezes` |
| `user_selected_categories(_new)` | Seçili kategoriler (onboarding) | Profil tercihi; öneri motoru server'da kullanacak | `user_selected_categories` |

### İlgili fonksiyonlar (taşınacak / server RPC'ye dönüşecek)
`src/db/db.js` içinde:
- `recordRead`, `getTotalReads`, `getTodayReadsCount`, `getReadHistory`, `getReadsPerCategory`, `getReadCountsByStory`
- `getStreak`, `getLongestStreak`, `recordStreakFreeze`, `getStreakFreezes`, `clearStreakFreezes`, `clearUserReads`
- `getSelectedCategories`, `setSelectedCategories`, `toggleSelectedCategory`

> Not: Streak ve istatistik hesapları şu an client-side SQL ile yapılıyor. Server'a taşırken bunlar Postgres view / RPC (`get_streak`, `get_stats`) olarak yeniden yazılmalı ki tek doğruluk kaynağı server olsun.

---

## 2. Taşınacak Uygulama Durumu (AsyncStorage → Supabase)

Kaynak: `src/context/UserDataContext.js`, `ThemeContext.js`, ekranlar.

| AsyncStorage anahtarı | İçerik | Öneri |
|---|---|---|
| `@kivilcim_favorites` / `FAVORITE_COLLECTIONS_STORAGE_KEY` | Favoriler ve koleksiyonlar | `user_favorites` + `user_collections` tablosu |
| `@kivilcim_history` / `COMPLETED_STORIES_STORAGE_KEY` | Okuma geçmişi / tamamlanan hikâyeler | `user_reads` ile birleştirilebilir |
| `@kivilcim_preferences` | Kullanıcı tercihleri | `profiles`'a JSONB kolon ya da `user_preferences` |
| `@kivilcim_onboarded` / `PROFILE_INFO_PROMPT_SEEN_KEY` | Onboarding tamamlandı bayrağı | `profiles.onboarded` |
| `@kivilcim_premium` | Premium durumu | **Server kaynaklı olmalı** — RevenueCat webhook → `profiles.is_premium` (cihazdaki kopya yalnız cache) |
| `@kivilcim_share_count` | Paylaşım sayacı | `profiles` / analitik tablo |
| `USER_PROFILE_STORAGE_KEY` | Kullanıcı profili (isim vb.) | Zaten `profiles` var → senkronla |
| `STREAK_FREEZE_CREDITS_STORAGE_KEY` | Streak freeze kredisi | `user_streak_credits` (premium ile bağlı) |
| `VARIANT_USAGE_STORAGE_KEY` | "Sohbette kullan" varyant kullanımı / kota | `user_variant_usage` — kota kötüye kullanımı server'da denetlenmeli |
| `SEEN_BADGES_STORAGE_KEY` | Görülen rozetler | `user_badges` |
| `RECENT_SEARCHES_KEY` | Son aramalar | Cihazda kalabilir (UX cache, taşımaya gerek yok) |
| `THEME_MODE` / `LANGUAGE` | Tema, dil | Cihazda kalabilir; dil zaten `profiles.lang`'da |

---

## 3. Önerilen Yeni Supabase Şeması (taslak)

```sql
-- Okuma kayıtları
create table if not exists public.user_reads (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  story_id    bigint not null,
  read_at     timestamptz not null default now()
);
create index on public.user_reads(user_id, read_at);

-- Beğeniler
create table if not exists public.user_likes (
  user_id     uuid not null references auth.users(id) on delete cascade,
  story_id    bigint not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, story_id)
);

-- Seçili kategoriler
create table if not exists public.user_selected_categories (
  user_id      uuid not null references auth.users(id) on delete cascade,
  category_id  int not null,
  primary key (user_id, category_id)
);

-- Streak freeze günleri
create table if not exists public.user_streak_freezes (
  user_id    uuid not null references auth.users(id) on delete cascade,
  freeze_date date not null,
  primary key (user_id, freeze_date)
);

-- Favoriler
create table if not exists public.user_favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  story_id   bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

-- Profil genişletmeleri
alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists streak_freeze_credits int not null default 0,
  add column if not exists share_count int not null default 0;
```

Her tablo için RLS: `using (auth.uid() = user_id)` (select/insert/update/delete).

---

## 3b. Cihaz-Token Anonim Üyelik (UYGULANDI)

Kullanıcıya kayıt zorunluluğu olmadan her cihaza online üyelik açan akış eklendi. Mantık: Supabase **anonymous sign-in** ile gerçek bir `auth.uid()` üretilir; kalıcı oturum (AsyncStorage'da) cihaz token'ı görevi görür. Böylece bölüm 1–2'deki tüm `user_id = auth.uid()` RLS tabloları zorunlu kayıt olmadan çalışır.

**Eklenenler:**
- `src/services/supabase.js`
  - `getDeviceId()` — kararlı cihaz kimliği (Android ID / iOS idForVendor, `expo-application`), AsyncStorage'da `device_id` olarak cache. OS kimliği yoksa UUID fallback.
  - `ensureDeviceSession()` — açılışta oturum varsa kullanır, yoksa `signInAnonymously()` ile anonim üyelik açar ve `device_id`'yi profile yazar. Veriyi cihazla eşleştirme buradan olur.
  - `linkEmailToDeviceAccount(email, password)` — anonim üyeliği aynı `user_id`'yi koruyarak kalıcı hesaba yükseltir (veri kaybı olmaz).
- `App.js` — startup içinde `ensureDeviceSession()` non-blocking çağrılır; offline/Supabase kapalıyken yerel veri çalışmaya devam eder.
- `supabase/schema.sql` — `profiles.device_id` kolonu + index.

**Gereken manuel adım:** Supabase panelinde **Authentication → Providers → Anonymous** açılmalı (yoksa `signInAnonymously` hata döner).

**Akış (app açılışı):**
1. Oturum var mı? → varsa o `user_id` ile devam (dönen kullanıcı, veriler zaten eşli).
2. Yoksa → `device_id` üret/oku → `signInAnonymously` → `profiles`'a `device_id` yaz.
3. Sonraki tüm okuma/yazma `auth.uid()` ile bölüm 1–2 tablolarına gider.

> Not: AsyncStorage temizlenirse (örn. uygulama silinip kurulursa) iOS'ta idForVendor aynı kaldığı sürece `device_id` korunur; ancak oturum sıfırlanacağı için yeni bir anonim user oluşur. Aynı cihazdaki eski veriyi bağlamak için `device_id` üzerinden eşleştiren bir sunucu fonksiyonu (claim) sonraki fazda eklenebilir. Kalıcı çözüm için kullanıcıyı `linkEmailToDeviceAccount` ile e-postaya yükseltmek önerilir.

---

## 4. Senkronizasyon Stratejisi

1. **Auth gerekliliği**: Kullanıcı verisini server'a bağlamak için aktif `auth.uid()` şart. Misafir (anonim) kullanıcı akışı varsa Supabase anonymous auth ile her cihaza bir kullanıcı atanmalı.
2. **Çift yazma → server-first geçiş**: İlk fazda hem SQLite hem Supabase'e yaz (offline güvenliği), okumayı server'dan yap. Kararlı olunca SQLite'ı yalnız offline cache'e indir.
3. **İlk açılışta migrasyon**: Mevcut kullanıcıların cihazındaki SQLite/AsyncStorage verisini bir kez Supabase'e push eden `migrateLocalToServer()` fonksiyonu (idempotent, `local_migrated` bayrağı ile bir kez çalışsın).
4. **Çakışma çözümü**: Reads/likes için union (en geniş küme). Sayaçlar için `max`. Streak server'da yeniden hesaplanır.
5. **Offline**: Ağ yokken kuyruğa al, bağlanınca flush et.

---

## 5. Aksiyon Listesi (sıralı)

- [x] Supabase'de yukarıdaki tabloları + RLS politikalarını oluştur (`supabase/schema.sql`'e ekle) — canlıya da uygulandı (`lyhrmjmaffazoayrurls`)
- [x] Cihaz-token anonim üyelik akışı (`ensureDeviceSession`, `getDeviceId`, `linkEmailToDeviceAccount`) — bkz. bölüm 3b
- [ ] Supabase panelinde Anonymous provider'ı aç (manuel, zorunlu — hâlâ sizin yapmanız gerekiyor)
- [x] `src/services/supabase.js`'e CRUD fonksiyonları ekle: reads, likes, selected categories, streak freezes, favorites, collections, variant usage, badges
- [x] Streak/istatistik için Postgres RPC yaz — `get_user_stats()` (tek RPC, total/today/streak/longest/kategori/hikaye bazlı sayılar)
- [x] `UserDataContext` ve `db.js` çağrılarını server fonksiyonlarına yönlendir (çift yazma fazı) — `refreshStats()` server'dan okuyor (local fallback'li), tüm mutasyonlar server'a da yazıyor
- [x] Premium durumunu RevenueCat webhook → `profiles.is_premium` ile server kaynaklı yap — `supabase/functions/revenuecat-webhook` deploy edildi + `protect_is_premium` trigger'ı ile client'ın kendi kendine premium vermesi engellendi (bkz. §10 test notları)
- [x] Varyant kullanım kotasını server'da denet (kötüye kullanım/jailbreak'e karşı) — `record_variant_usage` RPC'si (günlük 3 ücretsiz `mark_used`, premium sınırsız)
- [x] `migrateLocalToServer()` tek seferlik migrasyonu yaz ve test et — `src/services/migrateLocalToServer.js`, `App.js`'te `ensureDeviceSession()` sonrası çağrılıyor
- [x] Offline kuyruk + flush mekanizması — `src/services/offlineQueue.js` (AsyncStorage'da kalıcı kuyruk, uygulama açılışında + foreground'a geçişte flush; NetInfo/expo-network yok, foreground tetiklemesi proxy olarak kullanıldı)
- [x] Cihaz değişimi / yeniden kurulum senaryosunu uçtan uca test et — canlı projede iki anonim test kullanıcısıyla RLS izolasyonu, `get_user_stats` doğruluğu, kota RPC'si ve premium-trigger'ı doğrulandı; bulunan güvenlik açığı (`is_premium` self-grant) düzeltildi

---

## 6. Cihazda Kalacaklar (taşınmayacak)

- Hikâye/kategori/kitap içeriği bundle'ı (`kivilcim.db` asset) — offline okuma cache'i; kaynak zaten server `stories`.
- `RECENT_SEARCHES_KEY` (son aramalar) — yerel UX.
- `THEME_MODE` (tema) — cihaz tercihi. Dil (`LANGUAGE`) ise `profiles.lang` ile senkronlanabilir ama yerelde de tutulabilir.

---

## 7. Kalan Manuel Adımlar / Bilinen Açık Noktalar

- **Anonymous provider**: Supabase panelinde Authentication → Providers → Anonymous hâlâ açılmalı (bölüm 5'te işaretli, tek manuel adım).
- **RevenueCat webhook secret**: `supabase secrets set REVENUECAT_WEBHOOK_SECRET=<değer> --project-ref lyhrmjmaffazoayrurls` çalıştırılmalı, sonra RevenueCat panelinde Project Settings → Integrations → Webhooks → URL `https://lyhrmjmaffazoayrurls.supabase.co/functions/v1/revenuecat-webhook` + aynı secret'i Authorization header'ına eklemek gerekiyor.
- **RevenueCat `appUserID` boşluğu**: `src/services/billing.js`, `Purchases.configure({ apiKey })`'i `appUserID` vermeden çağırıyor — RevenueCat kendi anonim id'sini üretiyor, bu da Supabase `auth.uid()` ile eşleşmiyor. Webhook, profile'ı `app_user_id = profiles.id` üzerinden bulduğu için bu satır `Purchases.configure({ apiKey, appUserID: <supabase auth.uid()> })` olacak şekilde güncellenmeden webhook hiçbir profili bulamaz. `BILLING_LIVE` şu an `false` (test key'ler var) — canlıya geçmeden önce bu satır düzeltilmeli.
- **Kota UI entegrasyonu**: `record_variant_usage` kotası aşıldığında (`quota_exceeded`) şu an sadece `console.warn` ile loglanıyor (`UserDataContext.recordVariantUsage`) — kullanıcıyı paywall'a yönlendirme gibi bir UX henüz bağlanmadı.
- **Offline flush tetikleyicisi**: Gerçek bir connectivity-change dinleyicisi (NetInfo / expo-network) yok; şu an sadece app açılışı + foreground'a dönüşte flush deneniyor. Bağlantı kesilip anında geri gelen senaryoda flush biraz gecikebilir — ihtiyaç olursa `expo-network` eklenip native rebuild gerekir.
- **Güvenlik düzeltmesi (§10'da bulundu)**: `profiles.is_premium` öncesinde client tarafından direkt `update` ile kendi kendine set edilebiliyordu (RevenueCat webhook'u bypass ederek). `protect_is_premium` trigger'ı ile kapatıldı — sadece `service_role` (webhook) değiştirebiliyor.
