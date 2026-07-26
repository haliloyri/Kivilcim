# Kıvılcım Yolu — Uygulama Durumu

Bu dosya, `.github/agents/kivilcim-phase-runner.agent.md` için kalıcı checkpoint’tir.
Durumlar kod ve test kanıtına göre güncellenir:

- `todo`: başlanmadı
- `partial`: bir kısmı kodlandı veya harici doğrulama bekliyor
- `done`: kabul kriterleri ve doğrulama tamam
- `blocked`: repo içinde güvenli biçimde ilerlemek mümkün değil

## Faz durumu

| Faz | Durum | Not |
|---|---|---|
| 0 — Sözleşme, flag, test | partial | Flag, 12 node sözleşmesi ve Jest iskeleti mevcut; control fallback ve görünür UI’dan bağımsız shadow capture testli. Canlı şema/env doğrulaması ayrıca denetlenmeli. |
| 1 — Domain ve ilerleme motoru | done | Yerel tarih, repository, H/K/D/U/G motoru, öneri ve next-action testleri mevcut. |
| 2 — Supabase, offline sync, migration | partial | RLS tabloları/RPC migration’ı ile bootstrap schema testli olarak eşleşiyor; event/state/node/legacy queue owner-bound, server snapshot ve local legacy migration mevcut. Context önce yerel snapshot’ı yayınlar, sonra stale sonucu geçersiz kılan arka plan server merge’i uygular. Queue, ağ hatasında owner damgasını gerçekten saklıyor ve başka session’daki write’ı replay etmiyor; event/node/state merge saf testlerle monotonic. Canlı Supabase migration doğrulaması eksik. |
| 3 — Davranış olayları | partial | H, audio, takeaway D, 24 saat revisit, mark-used/prova U ve serbest metin toplamayan özel uygulama planı bağlı. U yalnız tamamlanmış hikâyede başlar; yerel kullanım durumu ve U olayı, sunucunun günlük/öykü kotasını kabul etmesinden sonra yazılır. Scroll %90 ve kısa hikâyede foreground 5 saniye kuralı merkezi completion helper ile testli; tam audio `onDone` aynı idempotent H yolunu kullanır. Canlı event doğrulaması eksik. |
| 4 — Context ve promotion | partial | View-model, local transaction award, global promotion ve profil unvanı mevcut; server/local çatışma merge’i testli, award kaynakları `live_event`/`path_switch_backfill` olarak sözleşmeli. Capstone queue cihaz denetimi eksik. |
| 5 — Görsel sistem | partial | `careerVisuals` 12 düğümün light/dark, durum ve share kimliğini tek kaynaktan sağlıyor; timeline, düğüm sheet’i, promotion ve share aynı sembolü kullanıyor. Yeni görsel yol hero’su ve seçim/ilerleme ekranlarının UX turu uygulandı; cihazda görsel QA eksik. |
| 6 — Yolum ekranı | partial | Yol görselli hero, next card, timeline, node sheet, özet, sekiz haftalık okuma ritmi/heatmap, risk/koruma durumundaki streak-freeze ve miras mevcut. Loading/error retry/offline cached state uygulandı; kapsamlı state/motion cihaz denetimi eksik. |
| 7 — Seçim ve capstone | partial | KY-700 tam ekran ilk seçim, KY-704 capstone finali ve KY-705 geriye uyumlu rank/path paylaşımı tamam. KY-706 legacy cleanup rollout sonrası yapılacağından güvenli biçimde flag arkasında korunuyor. |
| 8 — Home ve yardımcı deneyimler | partial | CareerToolkit artık yol kimlikli görsel hero, kategori illüstrasyonları, haftaya göre deterministik/free-safe rota, Atlas, Sentez/Dosya, sohbet kısayolları ve cihazda saklanan beş hikâyelik özel Kıvılcım Paketi sunuyor. Araçlar ilgili 1/2/3. yol node’u kazanılmadan route üzerinden de açılmıyor. Home career treatment’ta legacy earned/total hesapları çalışmıyor; legacy kodun fiziksel temizliği rollout sonrası KY-1005 kapsamındadır. |
| 9 — i18n, analytics, a11y, performans | partial | Dört dil key/placeholder parity testi, genişletilmiş kariyer analytics kataloğu/call-site’ları, 2.000 olay engine performans fixture’ı, merkezi runtime Reduce Motion dinleme, node/switch/share/migration modal ilk-focus, node-sheet focus dönüşü ve 44 px kontroller mevcut; ekranların tam a11y/perf cihaz denetimi eksik. |
| 10 — QA ve rollout | partial | QA matrisi ve yeni Yolum statik preview’ları eklendi: yeni kullanıcı, ortak yol, aktif yol, capstone, legacy, dark/uzun Almanca ve okuma ritmi. Teknik rehber/README/analytics sözleşmesi güncel; cihaz ve canlı Supabase/shadow/rollout kanıtı bekliyor. |

## Son doğrulama

- `npm run test:career`: 14 test paketi, 48 test başarılı.
- `npm test`: 14 test paketi, 48 test başarılı.
- Expo web bundle smoke: 1.649 modül başarılı.
- Kapsam: domain, next action, yerel tarih, haftalık rota/free guard, event kimliği/guard ve dört dil copy.

## Kalan harici doğrulama kapıları

Repo içi uygulama kontrol listesi kod ve tekrarlanabilir testler için günceldir. Planın gerçekten `done` olabilmesi için şu dış ortam adımları gerekir: `KY-004` canlı Supabase/içerik şema doğrulaması; `KY-1001` fiziksel cihaz/manuel QA; `KY-1002` iOS ve Android build/rota smoke’u; `KY-1003` staff build shadow capture; `KY-1004` kontrollü rollout; rollout penceresi sonrasında `KY-1005` eski core rozet temizliği. iOS simulator Debug build’i başlatıldı, ancak geçici `Albor.app` paketinde `Info.plist` bulunmadığından kurulamadı; tam native sonuç tekrar doğrulanmalıdır. Android’de OpenJDK 17 ve Gradle 9.3.1 doğrulandı; APK build’i Gradle build-logic yapılandırmasında takılı kaldığı için fiziksel Android/lab ortamında tamamlanmalıdır.
