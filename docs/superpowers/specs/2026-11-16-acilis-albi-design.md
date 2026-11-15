# Açılış ekranında Albi — kısa tasarım

Tarih: 16 Kasım 2026. Durum: onay bekliyor. Boyut: küçük değişiklik (kısa tasarım).

## Amaç ve neden

Uygulama açılırken yükleme ekranında kitabın ortasında yalnızca doğan bir güneş görünüyor. Maskotumuz Albi (kuş) bu ekranda yok. Albi ilk karşılaşılan yüz olmalı. Güneş fikri kaybolmasın: Albi'nin göğsündeki ışık zaten o güneş.

## Hedefler

- Güneş diskinin yerine Albi, kitabın sayfalarının üstünde ayakta durur. Bütün gövdesi, ayakları ve göğsündeki ışık görünür.
- Parıltı ve ışınlar Albi'nin arkasında kalır, güneş motifi sürer.
- Kitap aynı yerde ve aynı boyutta kalır. Böylece statik açılış ekranından (yalnızca kitap) animasyona geçişte kayma olmaz.
- Giriş: Albi kitabın üstünde hafifçe belirir ve yerine oturur. Sonra yükleme boyunca yavaşça nefes alır gibi oynar.
- "Hareketi azalt" açıksa Albi sabit, son halinde durur.

## Hedef dışı

- Statik açılış görseli (`assets/logo/splash/albor-splash-book.png`, `app.json`). Statik ekran animasyon taşıyamaz, değiştirmek yerel yeniden derleme ve geçişte kayma riski getirir. Kitap-only kalır.
- Uygulama ikonu, "Albor" yazısı, slogan, durum/yeniden dene metinleri.
- Başka ekranlardaki Albi yerleşimleri.
- Commit atmak.

## Yapılmaması gerekenler

- Kitabın yerinin statik ekrana göre kayması.
- Albi'nin petrol zeminde kaybolması. Gövdesi zeminle aynı petrol yeşili (`Albi.js` yorumu da bunu söylüyor).
- Açılışı geciktirmek. Görsel yerel ve küçük (yaklaşık 170 KB), ağ beklemesi yok. İlk karede titreme olmasın diye Albi şeffaftan başlayıp belirir.

## Yaklaşımlar

1. **Albi kitabın üstünde durur (seçilen).** Bütün figür görünür, ayaklar sayfalarda. Ekranda biraz daha yukarı taşar, logo kutusu 200 px kalır, Albi kutunun üstüne taşar.
2. **Albi kitabın arkasından yükselir.** Güneşin şimdiki hareketi birebir korunur. Ama kitap ayaklarını ve göğsündeki ışığın bir kısmını kapatır, maskotun en sevimli yeri gizlenir.
3. **Albi kâğıt renkli bir daire içinde.** Zeminde kaybolma sorunu kendiliğinden çözülür, ama rozet gibi durur, açılış ekranının sahnesine uymaz.

## Tasarım

- **Dosya:** `src/components/AnimatedLogo.js`. `Sun` bileşeni kalkar (bu değişiklikle kullanılmaz olur). `Glow`, `Rays` ve `Book` kalır. `LaunchScreen.js` değişmez, `LOGO_SIZE` 200'de kalır.
- **Albi:** mevcut `Albi` bileşeni, `pose="selamlama"`, yaklaşık 170 px. Ayaklar sayfaların üstüne (kutunun yaklaşık %62'si) denk gelir, görselin üstü kutunun üstüne taşar. Kitap Albi'nin ayaklarının önünde çizilmeye devam eder, yani sıralama: parıltı, ışınlar, Albi, kitap.
- **Parıltı ve ışınlar:** merkezleri Albi'nin gövdesinin arkasına taşınır. Kesin sayılar uygulama sırasında ekranda ayarlanır.
- **Giriş animasyonu:** Albi'nin opaklığı 0'dan 1'e, kitaba doğru yaklaşık 24 px yükselerek (translateY) ve çok hafif ölçekle. Parıltı ve ışınlar mevcut zamanlamayla açılır.
- **Boşta hareket:** mevcut `breath` döngüsü korunur. Albi için yalnızca 2–3 px dikey salınım, ölçekleme yok (görsel bulanmasın).
- **Zeminde görünürlük:** önce altın parıltı yeterli mi diye simülatörde bakılır. Yetmezse iOS'ta Albi görseline altın renkli yumuşak gölge (shadow) ile ince bir halka verilir. Android'de yalnızca parıltı kalır.

## Doğrulama

- Mevcut testler geçer (`npm test`).
- `AnimatedLogo` için küçük bir render testi: Albi görseli çizilir, çökme yok, "hareketi azalt" yolu çalışır.
- iOS simülatöründe açılış ekranının ekran görüntüsü: Albi görünür, kitap statik ekrandaki yerde, "Albor" yazısı ve slogan Albi'ye binmiyor.

## Uygulamaya bırakılanlar

Albi'nin kesin boyutu ve konumu, parıltı merkezi, salınım miktarı. Bunlar ekranda bakılarak ayarlanır.
