## Gorev: Ana ekrana kisielestirilmis geri donus modulu ekleme
Aciklama: Su an kategori ve gunun icerigi guclu, ama kullanicinin son davranisina gore "geri don" deneyimi yok.
Hedef: Ana sayfada kullanicinin en olasi sonraki aksiyonunu tek bakista sunmak.

- [x] 1) Moduller ve kurallar
Detay:
- "Senin Icin Secildi": kullanicinin favori kategori + son 7 gun okunma davranisina gore 1-3 hikaye oner.
- "Devam Et": yarim kalan veya son acilan hikayeye hizli donus karti ver.
- Oncelik kurali: once "Devam Et", veri yoksa "Senin Icin Secildi".
Cikti:
- Net karar akisi (if/else kurali) ve kullanilacak veri alanlari listesi.

Uygulanan karar akisi:
- if `history[0]` varsa: modul tipi `continue`, ilk onerilen hikaye son acilan hikaye.
- else if son 7 gecmiste baskin kategori varsa: modul tipi `picked`, o kategoriden 1-3 hikaye.
- else: modul tipi `fallback`, mevcut siralamadan 1-3 hikaye.

Kullanilan veri alanlari:
- `history[0]`
- `history[0..6]`
- `story.parent_cat`
- `preferences.time.dailyStoryTarget`
- `sortedStories`

- [x] 2) Ana ekran UI + etkileşim
Detay:
- Home ekraninda ust bolume tek bir kisielestirilmis modul alani ekle.
- Kartta baslik, kisa aciklama, CTA ve kapatma/erteleme aksiyonu olsun.
- CTA tipleri: "Devam Et", "Bugunun onerisi", "3 dakikada basla".
Cikti:
- Modulun gorunmesi, tiklanmasi, kapatilmasi ve tekrar gosterim davranisi tamamlanmis olsun.

Uygulama notu:
- Home ust bolume tek kisielestirilmis modul karti eklendi.
- Kartta dinamik baslik/aciklama + CTA + kapat + ertele (yarina kadar gizle) aksiyonu aktif.
- Kapatilan modul ayni oturumda tekrar gosterilmiyor.

- [x] 3) Olcumleme ve dogrulama
Detay:
- Eventler: module_shown, module_clicked, module_dismissed.
- Basit acceptance check:
	- Son hikaye varsa "Devam Et" gorunur.
	- Son hikaye yoksa "Senin Icin Secildi" gorunur.
	- Kapatilan modul ayni oturumda tekrar acilmaz.
Cikti:
- Event payload alanlari dokumante ve test senaryolari calisir durumda.

Event payload alanlari:
- `module_shown`: `moduleType`, `storyId`, `dominantCategory`, `ctaLabel`, `dailyStoryTarget`, `filter`, `lang`
- `module_clicked`: `moduleType`, `storyId`, `dominantCategory`, `ctaLabel`, `dailyStoryTarget`, `filter`, `lang`
- `module_dismissed`: `moduleType`, `storyId`, `dominantCategory`, `dismissReason`, `snoozeUntil?`, `dailyStoryTarget`, `filter`, `lang`

Dogrulama notu:
- Modul gorundugunde `module_shown` eventi atiliyor.
- CTA tiklandiginda `module_clicked` eventi atiliyor.
- Kapat ve ertele aksiyonlari `module_dismissed` eventi ile ayrisiyor.
- Kapatilan modul ayni oturumda state bazli tekrar gosterilmiyor.

Beklenen etki: Kisiye ozel deneyim hissi artar, ana ekrandan hikaye acma orani yukselir.