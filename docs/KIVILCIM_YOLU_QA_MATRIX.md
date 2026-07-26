# Kıvılcım Yolu — QA ve rollout matrisi

## Repo içinde doğrulanır

- [x] `npm run test:career` — 14 suite, 48 test başarılı (2026-07-25)
- [x] `npm test` — 14 suite, 48 test başarılı (2026-07-25)
- [x] 2.000 olay career engine fixture’ı — view-model testi başarılı, bu ortamda 4 ms (2026-07-25)
- [x] Expo web bundle smoke — `expo export --platform web` geçici dizine başarılı (1.649 modül, 2026-07-25)
- [ ] iOS compile smoke — `Albor` simulator Debug build’i başlatıldı; üretilen geçici paket eksik `Info.plist` içerdiği için simulator kurulumu başarısız oldu. Tam native build sonucu yeniden doğrulanmalı
- [ ] Android compile smoke — JDK 17 ve Gradle 9.3.1 doğrulandı; Gradle build-logic yapılandırması bu ortamda uzun süreli kilitte kaldığından APK üretimi fiziksel Android/lab ortamında tekrarlanmalı
- [x] Dört dilde i18n key/placeholder parity
- [x] Local-date, H/D/U idempotency ve next-action fixture’ları
- [x] Offline queue: event, state, award, seen işleyicileri; ağ hatasında owner damgası ve başka session write’ının replay edilmemesi
- [x] Kill switch: varsayılan control, bozuk build-time değerinde güvenli fallback ve UI’dan bağımsız shadow capture
- [x] Story completion guard: %90 scroll; kısa hikâyede foreground 5 saniye dwell; tam audio completion idempotent H yolunu kullanır
- [x] U guard: tamamlanmamış hikâyede Sohbette Kullan/prova başlamaz; `conversation_mark_used` ve `practice_completed` sunucu kota kabulünden sonra yerel duruma yazılır
- [x] Event alt türü sözleşmesi: `revisit_24h`, `conversation_mark_used` ve `practice_completed` migration/bootstrap statik testinde doğrulanır
- [x] Babel/Expo bundle smoke: Home, StoryDetail, UseInConversation, Yolum, Profile
- [x] Kıvılcım Yolu 12 düğüm görsel sözleşmesi: light/dark, completed/future fallback ve share kimliği
- [x] Local/server merge: immutable credit key, monotonic seen node ve son path seçimi
- [x] Context: yerel snapshot önce yayınlanır; geç gelen server snapshot eski yüklemeyi ezemez
- [x] Supabase migration/bootstrap schema/RLS/RPC ve owner-bound queue statik sözleşmesi
- [ ] Flag kapalıyken legacy Progress/rozet akışı; flag açıkken Yolum akışı

## Manuel cihaz matrisi

| Alan | Varyant |
|---|---|
| Platform | iOS, Android, web smoke |
| Dil/tema | tr/en/es/de; açık/koyu; Almanca uzun metin |
| Kullanıcı | yeni, ortak yol, seçim ertelenmiş, üç aktif yol, capstone, legacy |
| Ağ | online, cold-start offline, offline event, reconnect, stale snapshot |
| Zaman | İstanbul gece yarısı, timezone, DST |
| Erişilebilirlik | VoiceOver, TalkBack, %200 font, Reduce Motion |
| Yaşam döngüsü | cold start, background/foreground, app kill, reset |

Bu çalışma ortamında iOS simulator SDK derleme denemesi yapıldı; ancak üretilen geçici paket kurulabilir değildi. Çalıştırma, VoiceOver ve gerçek cihaz denetimi hâlâ lab ortamı gerektirir. Android için JDK 17 hazırdır, fakat Gradle build-logic yapılandırması APK üretimini bu ortamda tamamlamadı; Android cihaz/lab smoke’u hâlâ gereklidir.

## Kritik kabul kayıtları

- [ ] %90 scroll ve kısa story H üretimi
- [ ] audio tamam/erken bırakma; takeaway save-delete; 24 saat revisit
- [ ] copy/share/mark-used ayrımı ve günlük H/U sınırları
- [ ] Yolcu sonrası seçim erteleme, yol değişimi, çoklu unlock, promotion/share/paywall çakışması
- [ ] capstone; legacy migration + restart; reset user data

## Canlı ortamda ayrıca yapılır

- [ ] Supabase migration uygulanır ve RLS/RPC sorguları gerçek kullanıcıyla doğrulanır.
- [ ] Shadow mode: `careerEventCaptureV1=true`, `careerPathV1=false`; duplicate/mismatch/timezone raporu alınır.
- [ ] Kademeli rollout: internal → düşük yüzdeli → metrik/rollback kontrolü → genişleme.
- [ ] P0/P1 açıkken `careerPathV1` production’da açılmaz.

Bu belge cihaz/lab sonuçlarını kaydetmek içindir; checkbox’ların tamamı canlı doğrulama kanıtı olmadan `done` sayılmaz.
