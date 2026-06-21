# Spark Tasarim Tanimlari (Acik + Koyu Mod)

Bu dokuman, uygulamadaki mevcut tema token'larini tek bir yerde toplar ve yeni tasarim calismasi icin referans verir.

Kaynak kod eslesmesi:
- Renk tokenlari: `src/theme/theme.js`
- Tema secimi ve persist mekanizmasi: `src/context/ThemeContext.js`

## 1. Tasarim Yonelimi

### Acik Mod: "Digital Hearth"
- Hedef hissiyat: sicak, kagit benzeri, uzun okuma odakli.
- Gorsel dil: acik zemin, yumusak kontrast, toprak/altin vurgu.
- Kullanim amaci: gun ici rahat okunabilirlik ve premium ama sakin gorunum.

### Koyu Mod: "Nocturnal Bibliophile"
- Hedef hissiyat: gece kutuphanesi, editoriyal, goz yormayan koyu tonlar.
- Gorsel dil: koyu komur zemin, krem yazi, pas/turuncu vurgu.
- Kullanim amaci: dusuk isikta rahat okuma ve odakli deneyim.

## 2. Renk Token Tanimlari

Asagidaki degerler uygulamanin su an kullandigi resmi token'lardir.

### 2.1 Acik Mod Tokenlari

| Token | Deger | Amac |
|---|---|---|
| `background` | `#fcf9f4` | Ana ekran zemini (kemik beyaz) |
| `backgroundDark` | `#F2EFE8` | Kart/ikincil zemin |
| `surfaceContainerLowest` | `#ffffff` | En yuksek aydinlikta kaldirilmis yuzey |
| `surfaceContainerHigh` | `#EBE6DC` | Derin katman/yuzey farki |
| `text` | `#1A1A1A` | Ana metin |
| `textSecondary` | `#9E9E9E` | Ikincil metin, etiket, metadata |
| `primary` | `#C5A059` | Ana aksiyon vurgu rengi |
| `primaryContainer` | `#D4AF37` | CTA gradyan veya ikincil vurgu |
| `onPrimary` | `#ffffff` | Primary buton uzeri yazi |
| `danger` | `#ba1a1a` | Hata/dikkat durumlari |
| `success` | `#2C4A2E` | Basari/olumlu durumlar |
| `border` | `#E8E3DA` | Ince ayirici/kenar |
| `activeNav` | `#704214` | Aktif alt navigasyon tonu |

### 2.2 Koyu Mod Tokenlari

| Token | Deger | Amac |
|---|---|---|
| `background` | `#131311` | Ana ekran zemini (deep charcoal) |
| `backgroundDark` | `#1E1C18` | Kart/ikincil zemin |
| `text` | `#E8E0D0` | Ana metin (soft cream) |
| `textSecondary` | `#A89A84` | Ikincil metin, etiket, metadata |
| `primary` | `#B55310` | Ana aksiyon vurgu rengi |
| `primaryContainer` | `#9F3C00` | CTA gradyan veya ikincil vurgu |
| `onPrimary` | `#F2E9D8` | Primary buton uzeri yazi |
| `danger` | `#E05A3A` | Hata/dikkat durumlari |
| `success` | `#5A9E5E` | Basari/olumlu durumlar |
| `border` | `#4A3F33` | Ghost border tabani (dusuk opaklikla) |

## 3. Tipografi ve Boyut Sistemi

Su anki global tipografi tokenlari (moddan bagimsiz):

- `heading`: `PlayfairDisplay`
- `headingItalic`: `PlayfairDisplay-Italic`
- `body`: `Inter`

Boyutlar:
- `badge`: `10`
- `ui`: `13`
- `body`: `15`
- `quote`: `18`
- `headingSmall`: `22`
- `headingLarge`: `30`

Okuma ritmi:
- `bodyLineHeight`: `26`
- `badgeLetterSpacing`: `0.5`

## 4. Yerlesim ve Yuvarlatma Sistemi

- `button` radius: `12`
- `card` radius: `15`
- `buttonPrimary` yukseklik: `48`
- `buttonSecondary` yukseklik: `40`
- Yatay padding: `20`
- Dikey padding: `16`
- Kartlar arasi bosluk: `12`
- Standart border kalinligi: `0.5`

## 5. Modlar Arasi Uygulama Kurallari

1. Ana ekran zemini her zaman `colors.background` ile baslamalidir.
2. Kart ve panel gibi ikincil katmanlar `colors.backgroundDark` kullanmalidir.
3. Ana metinler `colors.text`, ikincil metinler `colors.textSecondary` olmalidir.
4. Buton ve onemli aksiyonlar `colors.primary`; gerekiyorsa `primary -> primaryContainer` gradyani kullanilmalidir.
5. `danger` ve `success` sadece durum bildirimi icin kullanilmali, dekoratif kullanilmamalidir.
6. Koyu modda sert beyaz/siyah kullanimi yapilmamali; sadece token degerleri tercih edilmelidir.
7. Acik modda asiri kontrastli siyah metin yerine token tabanli `text` tonu korunmalidir.

## 6. Yeni Tasarim Icin Guncelleme Ceklisti

Bu tanimlar guncellenirken asagidaki sirayla ilerlenmelidir:

1. Ilk olarak sadece token degerleri guncellenmeli (`src/theme/theme.js`).
2. Sert kodlanmis renkler temizlenip token kullanimina cekilmelidir.
3. Her iki modda da ayni bilesen hiyerarsisi korunmalidir (zemin -> katman -> vurgu).
4. Metin kontrastlari manuel kontrol edilmelidir (ozellikle `text` ve `onPrimary`).
5. Profil ekranindaki tema secimi ve sistemden devralma akisi test edilmelidir.
6. Son adimda ekran bazli gorsel ince ayarlar yapilmalidir.

## 7. Uygulama Durumu Notu

Tema secimi su an:
- Sistem temasini varsayilan alir.
- Kullanici secimini `AsyncStorage` icinde `themeMode` anahtari ile saklar.
- `light` ve `dark` modlari global context uzerinden tum ekranlara dagitilir.

Bu nedenle yeni tasarim gecisinde sadece renk/typography/layout tokenlarini degistirmek bile buyuk kisimda otomatik etki uretecektir.