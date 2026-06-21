Spark – Üst Yatay Kategori Barı Tasarım Dokümanı
## Genel Yapı
- Bileşen tipi: Horizontal Scrollable Category Pills
- Kullanım amacı: İçerikleri kategoriye göre filtrelemek
- Stil: Soft glassmorphism + premium rounded pills
- Tasarım dili: Calm luxury / modern learning app
- Yükseklik: `40px`
- Border radius: `20px`
- İç padding:
 - Horizontal: `16px`
 - Vertical: `8px`
- İkon boyutu: `18px`
- İkon ile yazı arası boşluk: `8px`
- Font:
 - Family: `SF Pro Text / Inter`
 - Weight: `600`
 - Size: `16px`
---
# Light Mode Kategori Sistemi
| Kategori | Gradient | Border | Text | Icon | SF Symbol |
|---|---|---|---|---|---|
| Finans | `#D8A53A → #B97A16` | `#C58B22` | `#FFFFFF` | `#FFF4D6` | `dollarsign.circle.fill` |
| Psikoloji | `#7DBB87 → #4F8C5A` | `#5F9C68` | `#FFFFFF` | `#E8FFF0` | `brain.head.profile` |
| Liderlik | `#4D82C3 → #2F5F9C` | `#3D6EA8` | `#FFFFFF` | `#EAF3FF` | `person.3.fill` |
| Sağlık | `#3CCB9B → #1C9C73` | `#29B487` | `#FFFFFF` | `#E9FFF7` | `heart.fill` |
| Büyüme | `#8B6DFF → #6448D9` | `#7456E8` | `#FFFFFF` | `#F0EBFF` | `chart.line.uptrend.xyaxis` |
| Bilim | `#3FA7D6 → #2176AE` | `#2F8CC3` | `#FFFFFF` | `#EAF8FF` | `atom` |
| Felsefe | `#8C6A4A → #5F4530` | `#77553B` | `#FFFFFF` | `#FFF1E5` | `book.closed.fill` |
| İletişim | `#F39C34 → #D87400` | `#E38716` | `#FFFFFF` | `#FFF4E8` | `bubble.left.and.bubble.right.fill` |
| Verimlilik | `#5C6BC0 → #3949AB` | `#4C5AB8` | `#FFFFFF` | `#EEF1FF` | `checkmark.seal.fill` |
| Tarih | `#A76B3C → #7A4B27` | `#925A31` | `#FFFFFF` | `#FFF2E7` | `clock.arrow.circlepath` |
---
# Dark Mode Kategori Sistemi
## Genel Dark Mode Arkaplanları
| Element | Renk |
|---|---|
| Ana Background | `#121212` |
| Secondary Surface | `#1B1B1D` |
| Card Surface | `#202124` |
| Border | `#2C2C30` |
| Primary Text | `#F5F5F7` |
| Secondary Text | `#B0B3B8` |
---
## Dark Mode Kategori Renkleri
| Kategori | Gradient | Border | Text | Icon |
|---|---|---|---|---|
| Finans | `#8E6513 → #6E4C0A` | `#B9852C` | `#FFF8EC` | `#FFD978` |
| Psikoloji | `#356B42 → #24492D` | `#4F8A5E` | `#F1FFF5` | `#9AE6B4` |
| Liderlik | `#2D4E7C → #1D3352` | `#537AB5` | `#F2F7FF` | `#8CB8FF` |
| Sağlık | `#17785B → #0D5741` | `#29A17D` | `#F0FFF9` | `#7DFFD0` |
| Büyüme | `#5A46B8 → #3C2F7C` | `#826FFF` | `#F7F4FF` | `#C1B4FF` |
| Bilim | `#215E7D → #14384B` | `#4095C7` | `#F2FAFF` | `#84D8FF` |
| Felsefe | `#5E4734 → #3D2D20` | `#8E6B4D` | `#FFF6EF` | `#D9B08C` |
| İletişim | `#A45700 → #733B00` | `#D97A15` | `#FFF8F2` | `#FFBE78` |
| Verimlilik | `#3E4D9E → #29326B` | `#6677E0` | `#F4F6FF` | `#A7B6FF` |
| Tarih | `#714423 → #4D2E17` | `#A56A3A` | `#FFF7F0` | `#E1A97A` |
---
# Pasif Kategori Stili
## Light Mode
| Element | Renk |
|---|---|
| Background | `#F8F5F1` |
| Border | `#E8DDD0` |
| Text | `#8A7E72` |
| Icon | `#9C8F83` |
---
## Dark Mode
| Element | Renk |
|---|---|
| Background | `#232326` |
| Border | `#34343A` |
| Text | `#B7B9BE` |
| Icon | `#8E9197` |
---
# Glow ve Shadow
## Light Mode
```css
box-shadow:
0px 2px 8px rgba(0,0,0,0.08),
0px 0px 12px rgba(255,255,255,0.25) inset;
```
## Dark Mode
```css
box-shadow:
0px 2px 12px rgba(0,0,0,0.35),
0px 0px 16px rgba(255,255,255,0.04) inset;
```
---
# React Native Stil Yapısı
```js
{
 height: 40,
 borderRadius: 20,
 paddingHorizontal: 16,
 flexDirection: 'row',
 alignItems: 'center',
}
```
---
# UX Notları
- Aynı anda maksimum 1 kategori aktif olmalı
- Horizontal scroll indicator gizli olmalı
- Hafif scale animasyonu:
 - Press in → `0.97`
 - Release → `1.0`
- Geçiş süresi:
 - `180ms`
- Haptic feedback önerilir