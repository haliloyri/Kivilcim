# Bildirimlerde Albi — kısa tasarım

Tarih: 16 Kasım 2026. Durum: onay bekliyor. Boyut: küçük değişiklik (kısa tasarım).

## Amaç ve neden

Bildirimlerde şu an maskot yok. iOS'ta bildirimin solunda uygulama ikonu, Android'de tek renkli kitap silüeti görünüyor. Kullanıcı bildirimde de Albi'yi görmek istiyor, üç farklı pozla. Kullanıcı "sağda görsel" seçeneğini seçti: bildirimin sağındaki küçük görsel olarak Albi.

## Hedefler

- iOS'ta her bildirim türünün sağında Albi'nin küçük görseli çıkar, üç türe üç poz:
  - günlük okuma hatırlatması: `okuma` (elinde kitap)
  - gece seri uyarısı: `dark_mode` (uykulu)
  - haftalık özet ("Haftam"): `hedef_tamam` (kanatları açık, kutlama)
- Bildirimi uzun basıp açınca görselin büyük hali görünür (iOS'un kendi davranışı).
- Pozlar benim önerim, kullanıcı değiştirebilir.

## Hedef dışı

- Soldaki iOS ikonu (uygulama ikonu). Bildirim koduyla değişmez, değiştirmek uygulama ikonunu değiştirmek olur ve ayrı bir karar.
- Android. `expo-notifications` 58.1.6'da bildirim başına Android görseli alanı yok (`attachments` yalnızca iOS). Android'deki kitap silüeti (`assets/logo/notification-icon.png`) kalır.
- Uzaktan (push) bildirimler.
- Bildirim metinleri, saatleri, zamanlama kuralları.
- Commit atmak.

## Yapılmaması gerekenler

- Görsel yüzünden bir bildirimin hiç zamanlanmaması. Görsel hazırlanamazsa bildirim görselsiz zamanlanır.
- Albi'nin koyu temada bildirim zemininde kaybolması (gövdesi koyu petrol). Görseller kâğıt renkli zeminle hazırlanır.
- Android'e iOS alanını göndermek. `attachments` yalnızca iOS'ta verilir.

## Yaklaşımlar

1. **Önceden hazırlanmış üç kâğıt zeminli PNG, zamanlama sırasında `attachments` ile verilir (seçilen).** Yerel, küçük, ağ yok. Koyu temada da görünür.
2. **Mevcut şeffaf `assets/albi` dosyalarını doğrudan vermek.** Dosya hazırlamaya gerek yok, ama koyu bildirim zemininde Albi kaybolur.
3. **Uzak bir görsel adresinden vermek.** Ağ gerektirir, bildirim zamanında internet yoksa görsel çıkmaz. Gereksiz.

## Tasarım

- **Görseller:** `assets/albi/bildirim/okuma.png`, `dark_mode.png`, `hedef_tamam.png`. 512×512, kâğıt rengi (`#F5F1E8`) tam kare zemin, Albi ortada, kenarlarda boşluk. Mevcut `assets/albi` PNG'lerinden betikle üretilir, betik repoya girmez.
- **Yardımcı:** `src/utils/notificationImages.js`, `getNotificationAttachments(pose)`. iOS değilse `[]` döner. `expo-asset` ile paketlenmiş PNG'nin yerel dosyasını çözer, `expo-file-system` ile **her çağrıda ayrı bir geçici kopya** yapar, `[{ identifier, url, typeHint: 'public.png' }]` döner. Herhangi bir adım hata verirse `[]` döner ve bir uyarı yazar.
- **Neden her seferinde ayrı kopya:** `expo-notifications` iOS tarafı dosyayı doğrudan `UNNotificationAttachment`'a verir ve hata olursa sessizce atar (`try?`, `compactMap`). iOS bu dosyayı kendi deposuna taşıdığı için aynı dosya birden çok zamanlamada kullanılırsa ilkinden sonrakiler görselsiz kalabilir. Bu varsayımı simülatörde doğrularız.
- **Bağlama:** `src/utils/notifications.js` içinde `notifContent` günlük hatırlatmaya `okuma`, seri uyarısına `dark_mode`, haftalık özete `hedef_tamam` görselini ekler. Şu an `scheduleWeeklyForDays` aynı `content` nesnesini birçok gün için kullanıyor. Her gün için görsel ayrı hazırlanacağı için `content` her zamanlamada ayrı üretilir.
- **Temizlik:** Her yeniden zamanlamadan önce geçici kopyaların klasörü silinir, birikmesin.

## Doğrulama

- Mevcut testler geçer (`npm test`), `OnboardingReminders.test.js` dahil.
- `notificationImages` için küçük test: Android'de `[]`, hata durumunda `[]`, iOS'ta her çağrıda farklı `url`, türe göre doğru poz.
- iOS simülatöründe birkaç saniye sonrasına zamanlanmış üç deneme bildirimi: üçünde de doğru Albi görseli çıkıyor, art arda aynı türden iki bildirimde ikincisi de görselli. Açık ve koyu temada ekran görüntüsü.

## Uygulamaya bırakılanlar

Görsellerdeki Albi'nin tam ölçüsü ve boşluğu, geçici klasör adı, `identifier` biçimi.
