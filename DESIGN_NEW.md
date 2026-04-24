# Spark Tasarım Tanımları (Açık + Koyu Mod) — Güncellenmiş

Bu versiyon, mevcut yapıyı bozmadan daha premium, daha modern ve daha bağımlılık yaratan bir okuma deneyimi hedefler.

---

## 1. Tasarım Yönelimi (Revize)

### Açık Mod: "Digital Hearth+"

* Daha az sarı, daha dengeli krem tonları
* Okuma odaklı minimal kontrast
* Premium editorial hissi

### Koyu Mod: "Nocturnal Bibliophile+"

* Daha derin siyah yerine soft charcoal
* Göz yormayan kontrast
* Vurgu renkleri daha kontrollü

---

## 2. Renk Token Güncellemeleri

### 2.1 Açık Mod (Revize)

| Token                    | Yeni Değer | Not                       |
| ------------------------ | ---------- | ------------------------- |
| `background`             | `#F7F3ED`  | Daha temiz, daha az sarı  |
| `backgroundDark`         | `#EFE9DF`  | Kart kontrastı artırıldı  |
| `surfaceContainerLowest` | `#FFFFFF`  | Aynı                      |
| `surfaceContainerHigh`   | `#E6DFD4`  | Hafif derinlik            |
| `text`                   | `#181716`  | Daha doğal siyah          |
| `textSecondary`          | `#8F8A80`  | Daha okunabilir secondary |
| `primary`                | `#C29B4C`  | Altın daha sofistike      |
| `primaryContainer`       | `#E0B95B`  | Gradient için optimize    |
| `onPrimary`              | `#FFFFFF`  | Aynı                      |
| `danger`                 | `#B3261E`  | Material uyumlu           |
| `success`                | `#3A5F3C`  | Daha doğal yeşil          |
| `border`                 | `#E4DED4`  | Daha soft border          |
| `activeNav`              | `#6B3E1E`  | Biraz daha modern kahve   |

---

### 2.2 Koyu Mod (Revize)

| Token              | Yeni Değer | Not                      |
| ------------------ | ---------- | ------------------------ |
| `background`       | `#12110F`  | Daha soft siyah          |
| `backgroundDark`   | `#1A1814`  | Kart ayrımı arttı        |
| `text`             | `#E6DCC8`  | Daha sıcak krem          |
| `textSecondary`    | `#9C8F78`  | Daha net secondary       |
| `primary`          | `#D06A1B`  | Daha canlı ama abartısız |
| `primaryContainer` | `#A94E10`  | Gradient uyumu           |
| `onPrimary`        | `#F4EBDD`  | Kontrast iyileştirildi   |
| `danger`           | `#F06A4A`  | Daha görünür             |
| `success`          | `#6FBF73`  | Daha canlı yeşil         |
| `border`           | `#3F362C`  | Daha görünür border      |

---

## 3. Yeni Eklenen Tokenlar (Önerilir)

| Token              | Değer              | Amaç             |
| ------------------ | ------------------ | ---------------- |
| `quoteHighlight`   | `#FFD166`          | Alıntı vurguları |
| `overlaySoft`      | `rgba(0,0,0,0.03)` | Açık mod depth   |
| `overlayDark`      | `rgba(0,0,0,0.4)`  | Koyu mod depth   |
| `ctaGradientStart` | `#C29B4C`          | CTA başlangıç    |
| `ctaGradientEnd`   | `#E0B95B`          | CTA bitiş        |

---

## 4. Tipografi (İyileştirme)

* Heading: aynı (Playfair Display doğru seçim)
* Body: Inter → **Inter var ama weight kullanımı optimize edilmeli**

Yeni öneri:

* Body normal: 400
* Body emphasis: 500
* Quote: 500 + italic

Ek iyileştirme:

* `letterSpacing`: body için `0.2`
* Quote line-height: `30` (daha nefesli)

---

## 5. Yerleşim (Refinement)

| Alan          | Güncelleme |
| ------------- | ---------- |
| Card radius   | 15 → 18    |
| Button radius | 12 → 14    |
| Spacing       | 12 → 14    |

Sebep:
Daha modern ve "premium app" hissi

---

## 6. Kritik UX Kuralları (Yeni)

1. Uzun metin ekranlarında maksimum satır genişliği sınırlandırılmalı
2. Quote blokları her zaman görsel olarak ayrılmalı
3. Her ekranda en fazla 1 ana CTA olmalı
4. Scroll deneyimi "kesintisiz" olmalı (hard divider azaltılmalı)
5. Micro-interaction (fade / scale) eklenmeli

---

## 7. En Kritik İyileştirme (Net)

Şu an sistem iyi ama şunu yapmazsan sıradan kalır:

👉 Quote deneyimini özel yap

* Arka plan hafif farklı ton
* Sol çizgi (altın)
* Daha büyük font

Bu tek değişiklik bile uygulamayı "premium" yapar.

---

## 8. Sonuç

Bu güncelleme:

* Daha az yoran
* Daha premium
* Daha modern
* Daha okunabilir

bir deneyim üretir.

Kod tarafında minimum değişiklikle maksimum etki alırsın çünkü yapı zaten doğru kurulmuş.
