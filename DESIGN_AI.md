
## SPARK – REACT NATIVE UI DESIGN SPEC (2026 MOBILE UI)

1. Genel Tasarım Sistemi
- Premium ama sıcak
- AI üretimi değil insan tasarımı hissi
- Soft glassmorphism + minimal skeuomorphism
- Hafif gölgeler
- Büyük okunabilir tipografi
- iOS benzeri spacing sistemi

2. Ekran Yapısı
SafeAreaView
 ├── Header
 ├── Category Pills Horizontal Scroll
 ├── Featured Story Cards Horizontal Scroll
 ├── Story List Vertical
 └── Bottom Tab Bar

3. Ana Renk Paleti (Light Mode)
Background: #F8F5F0
Primary Gold: #C89B3C
Secondary Gold: #E8D3A8
Text Primary: #1E1E1E
Text Secondary: #6B6B6B
Border: #E7DFD4
Card Background: #FFFDF9

4. Kategori Renkleri
Finans: #C89B3C / #F7E7C1
Psikoloji: #5C8D67 / #DDEBDD
Liderlik: #4E6E9E / #DCE6F5
İletişim: #D9792B / #FCE5D3
Motivasyon: #8C5BD6 / #EADFFD
Alışkanlık: #4AA89A / #D8F2EE

5. Font Sistemi
Premium Font: SF Pro Display
Android Alternatif: Inter

6. Font Boyutları
Header Logo: 36-42
Section Title: 28
Story Card Title: 24
Story Description: 17
Meta Text: 15
Category Pills: 18
Button Text: 18
Minimum okunabilir font: 16px

7. Featured Story Cards
- Horizontal scroll
- width: screenWidth * 0.46
- height: 390
- Aynı anda 2 kart görünür
- radius: 24
- padding: 20
- shadowOpacity: 0.08

8. Anlatılmaya Hazır Hikayeler Kartları
- height: 148-160
- radius: 22
- başlık: 24
- açıklama: 17
- shadowOpacity: 0.05

9. Category Pills
- height: 50
- radius: 25
- aktif kategori: solid background
- pasif kategori: beyaz + border

10. Bottom Navigation
- height: 88-96
- blur background
- icon size: 26
- label size: 15

11. Spacing Sistemi
4pt grid system
Spacing: 8 / 12 / 16 / 20 / 24 / 32

12. Dark Mode
Background: #121212
Secondary Surface: #1C1C1E
Card Background: #202124
Primary Text: #F5F5F5
Secondary Text: #A1A1AA
Border: #2F2F33

13. Dark Mode Kategori Renkleri
Finans: #D9B15F
Psikoloji: #79B98A
Liderlik: #6E91C8
İletişim: #F29B57

14. Animasyonlar
- Kart press: scale 0.98
- Category switch: fade + translateX
- Story entrance: fadeInUp

15. React Native Teknik Yapı
Stack:
- React Native + Expo

Libraries:
- react-native-reanimated
- react-native-gesture-handler
- expo-blur
- react-native-svg

16. Responsive Kurallar
- Küçük telefonlarda 2 kart görünmeli
- Tabletlerde 3-4 kart görünmeli

17. Kritik Tasarım Kuralları
Yap:
- Büyük okunabilir font
- Ferah spacing
- Soft shadow
- Premium renk dengesi

Yapma:
- Küçük font
- Sert siyah
- Ağır neumorphism
- Çok kalın border


## SPARK – DARK MODE UI DESIGN SPEC (2026)

1. Dark Mode Tasarım Hedefi
- Premium görünüm
- Gerçek OLED dostu tema
- Tam siyah yerine yumuşak koyu tonlar
- Göz yormayan kontrast
- Gece kullanımında rahat okunabilirlik
- Hafif glow ve soft shadow

2. Ana Dark Mode Renk Paleti

Primary Background:
#121212

Secondary Background:
#1C1C1E

Card Surface:
#202124

Elevated Surface:
#2A2B2F

Primary Text:
#F5F5F5

Secondary Text:
#A1A1AA

Muted Text:
#7B7B84

Border:
#2F2F33

Divider:
#3A3A3F

3. Dark Mode Kategori Renkleri

Finans:
Primary: #D9B15F
Background: #4A3A18

Psikoloji:
Primary: #79B98A
Background: #1E3A2B

Liderlik:
Primary: #6E91C8
Background: #1D2D44

İletişim:
Primary: #F29B57
Background: #4A2B16

Motivasyon:
Primary: #B58DFF
Background: #34214D

Alışkanlık:
Primary: #63C7B8
Background: #183D39

4. Header Tasarımı

Background:
rgba(18,18,18,0.92)

Blur:
expo-blur medium

Logo Color:
#E5C27A

Notification / Badge:
#D9B15F

5. Featured Story Cards

Card Background:
#202124

Border:
1.5px solid rgba(255,255,255,0.08)

Radius:
24

Shadow:
shadowOpacity: 0.02
shadowRadius: 12

Glow:
Kategori rengine göre hafif outer glow

Padding:
20

6. Story List Cards

Height:
148-160

Background:
#1E1F23

Border:
rgba(255,255,255,0.05)

Radius:
22

Icon Section:
Gradient background + glow

7. Typography

Primary Font:
SF Pro Display

Android Alternative:
Inter

Text Colors:
Başlık: #F5F5F5
Açıklama: #C9C9CE
Metadata: #9B9BA1

Minimum readable font:
16px

8. Buttons

Primary CTA:
Background: #E5C27A
Text: #1A1A1A

Secondary CTA:
Background: rgba(255,255,255,0.06)
Text: #F5F5F5

Button Radius:
16

Button Height:
52

Press Animation:
scale 0.97

9. Category Pills

Active:
Solid kategori rengi
White text

Inactive:
Background: #242529
Border: rgba(255,255,255,0.06)

Height:
50

Radius:
25

10. Bottom Navigation

Background:
rgba(20,20,22,0.88)

Blur:
strong blur

Top Border:
rgba(255,255,255,0.05)

Icon Active:
#E5C27A

Icon Passive:
#8C8C92

Label Size:
15

11. Dark Mode Animasyonlar

Card Press:
scale 0.98

Screen Transition:
fade + slide

Category Change:
spring animation

Card Entrance:
fadeInUp

12. Shadow ve Glow Sistemi

Dark mode'da ağır shadow kullanılmamalı.

Önerilen:
shadowOpacity: 0.02 - 0.04

Glow:
Kategori rengine göre çok hafif

13. Responsive Kurallar

Küçük telefon:
2 featured card görünmeli

Tablet:
3-4 featured card

Bottom navigation safe area desteklemeli

14. Yapılması Gerekenler

- Soft contrast
- Büyük okunabilir text
- Hafif glow
- OLED dostu koyu tema
- Düşük göz yorgunluğu
- Premium spacing

15. Yapılmaması Gerekenler

- Tam siyah background
- Aşırı neon glow
- Çok sert beyaz
- Ağır shadow
- Fazla gradient
- Küçük font
