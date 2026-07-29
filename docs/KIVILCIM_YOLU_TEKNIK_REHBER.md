# Kıvılcım Yolu — Teknik Rehber

Kıvılcım uygulamanın markasıdır; **Kıvılcım Yolu**, okuma davranışını kalıcı rütbelerle görünür yapan isteğe bağlı gelişim özelliğidir. Kullanıcı arayüzünde “kariyer” sözcüğü kullanılmaz.

## Ürün sözleşmesi

- Toplam 12 düğüm vardır: 3 ortak başlangıç düğümü ve Keşif, Derinlik, Aktarım yollarında üçer düğüm.
- Kullanıcının yalnız bir aktif yolu vardır. Yol değiştirmek ücretsizdir, ilerlemeyi silmez ve diğer yolların metriklerini korur.
- Kazanılan düğüm hem rütbe hem rozet niteliğindedir; ayrı bir mikro-rozet sistemi oluşturulmaz.
- Aktif yolun en yüksek rütbesi profilde görünür. Aktif yolda rütbe yoksa ortak “Yolcu” rütbesi görünür.
- Seçili yolun son düğümü geçerli finaldir; global `12/12` ya da eski `25 rozet` tamamlanma baskısı gösterilmez.

Kredi türleri:

| Kod | Anlam | Temel sınır |
|---|---|---|
| H | Benzersiz, anlamlı tamamlanan hikâye | Yerel günde en çok 3 yeni kredi |
| K | Uygun H olaylarının farklı ana kategorisi | İçerik envanterine göre hedef düşebilir |
| D | Çıkarım kaydetme veya 24 saat sonrası revisit | Hikâye başına en çok 1 |
| U | Sohbette Kullan, prova veya sabit seçenekli özel plan | Yerel günde en çok 1, hikâye başına en çok 1 |
| G | En az bir H/D/U içeren yerel gün | Ardışıklık gerekmez |

İzin verilen event alt türleri, veri modelinin parçasıdır: H için `story_completed`; D için `takeaway_saved`, `insight_saved`, `revisit_24h`; U için `conversation_mark_used`, `practice_completed`, `private_application_plan` ve migration’dan gelen `legacy_mark_used`. U yazısı, istemci durumuna işlenmeden önce sunucudaki günlük/öykü bazlı kota kabulünden geçer.

## Feature flag ve rollout

`src/config/featureFlags.js` tek flag kaynağıdır.

- `careerPathV1`: Yeni Yolum UI, provider ve promotion deneyimini açar.
- `careerEventCaptureV1`: UI kapalıyken H/D/U olaylarının gölge yakalamasını açabilir. `careerPathV1` açık olduğunda olay yakalama otomatik olarak açıktır; görünür ilerlemenin sayılabilmesi için iki bayrağın ayrıca eşleşmesi gerekmez.

Flag kapanınca kariyer verisi silinmez. Bu repoda uzaktan yüzdesel flag ataması yoktur; kontrollü rollout, canlı ortamda ayrı release/staff build ve gerçek flag altyapısıyla yapılmalıdır.

## Kaynak haritası

| Sorumluluk | Kaynak |
|---|---|
| Kalıcı 12 düğüm, path ID ve koşullar | `src/constants/careerPath.js` |
| Düğüm renk/sembol/durum/share kimliği | `src/constants/careerVisuals.js` |
| Saf H/K/D/U/G hesabı ve next action | `src/utils/careerProgress.js`, `src/utils/careerNextAction.js` |
| Yerel gün hesabı | `src/utils/localDate.js` |
| Ayrı kullanıcı SQLite deposu | `src/db/userDb.js` (`kivilcim_user.db`) |
| Davranış event koordinasyonu | `src/services/careerEvents.js` |
| Legacy backfill | `src/services/migrateCareerPath.js` |
| Local-first view model ve award/promotion | `src/context/CareerPathContext.js` |
| Özel paket/çıkarım state’i | `src/context/UserDataContext.js` |
| Yolum UI | `src/components/career/CareerPathExperience.js` |
| Rota seçimi/araçları | `src/screens/CareerPathSelectionScreen.js`, `src/screens/CareerToolkitScreen.js` |

`CareerPathContext` yerel SQLite snapshot’ını birincil kaynak olarak kullanır. Uzak snapshot yalnız tamamlayıcıdır; çevrimdışında cached harita ve kuyruklu yazılar çalışmaya devam eder. Node award yazıları `user_career_nodes` transaction’ında idempotenttir. Kaynaklar `live_event`, `path_switch_backfill` ve `legacy_migration_v1` olarak ayrılır.

## Görsel ve erişilebilirlik kuralları

- `CareerNodeMark`, timeline, node sheet, terfi ve paylaşımda aynı `visualKey` kimliğini kullanır.
- `GuideLight` soyut ve sessizdir; yalnız Kıvılcım Yolu hero’su ile promotion yüzeylerinde kullanılabilir.
- Career modal’ları sistem Reduce Motion tercihini canlı dinler; node sheet kapanınca odak açan timeline düğümüne döner.
- Yeni kullanıcı metinleri `src/locales/i18n.js` içindeki `en`, `tr`, `es`, `de` nesnelerinin tümünde bulunmalıdır.

`assets/career/kivilcim-yolu-hero-v1.png` 941×1672 piksel, yaklaşık 2.1 MB olan tek raster yol arka planıdır. On iki rank için ayrı raster seti yerine `CareerNodeMark` vektör/gradient fallback’i kullanılır; böylece asset bütçesi 12 ayrı arka planla büyütülmez.

## Doğrulama ve canlı çalışma

Repo içi doğrulama:

```bash
npm run test:career
npm test
npm run screenshots
npx expo export --platform web --output-dir /tmp/spark-career-web
```

Senkron sözleşmesi, `user_career_events`, `user_career_state`, `user_career_nodes` ve `user_legacy_badges` tablolarını; kullanıcıya bağlı offline kuyruğu; kimlikli olay/RPC doğrulamasını kapsar. Eski rozetler ilk açılışta yerel depodan okunur, sunucu snapshot’ı ile birleşir ve güvenli biçimde tekrar kuyruğa alınır.

Canlı doğrulama ayrıca gerektirir: Supabase migration/RLS/RPC, iOS VoiceOver, Android TalkBack, %200 font, ağ kesintisi/reconnect, shadow capture ve kontrollü rollout/rollback. Bu adımlar uygulanmadan feature production’da geniş açılamaz.
