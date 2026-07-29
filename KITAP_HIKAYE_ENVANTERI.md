# Kitap ve Hikâye Envanteri

> **Bu dosya pipeline'in tek kuyrugudur.** `[x]` satirlar DB'den otomatik uretilir,
> elle degistirilmez. `[ ]` satirlar uretim kuyrugudur; elle eklenip cikarilabilir.
> Yeniden uretmek icin: `node scripts/story-pipeline/sync-inventory.mjs`

- Senkron: **2026-07-27 00:07**
- Kuyruk kaynagi: KITAP_HIKAYE_ENVANTERI.md
- DB'de kitap: **278**
- DB'de hikaye: **770**
- 4 dili tam hikaye: **750**
- Sohbet varyanti tam hikaye: **152**
- Uretim kuyrugu: **2305** (2065 kayitli kitapta + 240 sistemde olmayan kitapta)
- Incelemede: **0**
- Sisteme eklenmemis kitap: **24**

## Durum etiketleri

- `[x] **DB'DE KAYITLI**` — Hikaye DB'de var. Satir DB'den uretilir.
- `[ ] **URETILECEK**` — Kuyrukta. Kitapla iliskisi, olgulari ve kaynaklari dogrulanmali.
- `[ ] **INCELEMEDE**` — Staging'de uretildi, insan onayi bekliyor.
- `**Diller:**` ana metin cevirisi olan diller · `**Varyant:**` sohbet varyanti olan diller

---

# DB'de Kayitli Kitaplar

## 1. Atomic Habits

**Yazar:** James Clear  
**Kategori:** Sağlık  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:1` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Britanya bisiklet takımının yüzde iki felsefesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1059` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kimlik temelli alışkanlık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1060` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Fotoğraf öğrencilerinin kalite vs miktar deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1061` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Çevre tasarımı ile alışkanlık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1062` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — İki dakika kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1063` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Bir Kaza James Clear’ın Alışkanlık Fikrini Nasıl Değiştirdi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1703` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [ ] **URETILECEK** — James Clear Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Atomic Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Atomic Habits İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Atomic Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Atomic Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 2. Dürüst Olmak

**Yazar:** Kim Scott  
**Kategori:** Liderlik  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:2` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir yürüyüşte söylenen tek cümle — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1064` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aynı sert cümle, iki farklı yer — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1065` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Neden kimse bana söylemedi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1066` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Kim Scott Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Radical Candor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Radical Candor İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Radical Candor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Radical Candor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Radical Candor Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Radical Candor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 3. Şimdi Başla

**Yazar:** Neil Fiore  
**Kategori:** Verimlilik  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:3` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ertelemenin gerçek kökü: korku — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1067` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İtalyan ressam ve gevşeme paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1068` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Karşı konulmaz bir güç olarak 'şimdi' — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1069` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — The Now Habit: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
5. [ ] **URETILECEK** — The Now Habit İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Now Habit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Now Habit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — The Now Habit Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Now Habit — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 4. Derin Çalışma

**Yazar:** Cal Newport  
**Kategori:** Verimlilik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:4` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Carl Jung'un taş kulesi inzivası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1070` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Adam Grant'in toplu e-posta stratejisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1071` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — J.K. Rowling'in otel odası sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1072` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Newport'un sosyal medyasız akademik kariyeri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1073` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Cal Newport Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Deep Work — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
6. [ ] **URETILECEK** — Deep Work İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Deep Work — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Deep Work — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Deep Work Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 5. Düşün ve Zengin Ol

**Yazar:** Napoleon Hill  
**Kategori:** Motivasyon  
**Yil:** 1937  
**Durum:** DB'DE KAYITLI · `list_no:5` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Andrew Carnegie'nin çelik imparatorluğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1074` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Edison'ın 10.000 başarısızlığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1075` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Barnes'ın Edison ortaklığı hayali — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1076` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — 500 dolarlık karar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1077` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Think and Grow Rich: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Think and Grow Rich İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Think and Grow Rich — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Think and Grow Rich — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Think and Grow Rich Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 6. Influence

**Yazar:** Robert Cialdini  
**Kategori:** Psikoloji  
**Yil:** 1984  
**Durum:** DB'DE KAYITLI · `list_no:6` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kapıya ayak koyma tekniği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1078` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Restoran garsonunun bahşiş sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1079` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sosyal kanıt ve otel havluları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1080` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Kıtlık ve sınırlı üretim yanılsaması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1081` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — İyi Niyetli Bir Tabela Hırsızlığı Nasıl Artırdı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1704` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Influence: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Robert Cialdini Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Influence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Influence İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Influence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Influence Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## 7. Good to Great

**Yazar:** Jim Collins  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:7` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kirpi Konsepti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1082` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Volan etkisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1083` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Önce kim, sonra ne — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1084` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Darwin Smith Neden Şirketinin Fabrikalarını Sattı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1724` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Good to Great: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
6. [ ] **URETILECEK** — Good to Great İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Good to Great — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Good to Great Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Good to Great — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100

## 8. Başlangıç Noktası

**Yazar:** Simon Sinek  
**Kategori:** Liderlik  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:8` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dokuz gün arayla iki uçuş denemesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1085` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Notları bıraktığı an — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1086` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Altın Çember ve tartışmalı gerekçesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1087` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Start with Why: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Simon Sinek Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Start with Why — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Start with Why İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Start with Why — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Start with Why — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Start with Why Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Start with Why — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 9. Büyük Sıçrayış

**Yazar:** Eric Ries  
**Kategori:** Girişimcilik  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:9` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zappos'un sıfır stoklu ilk satışı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1088` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — IMVU'nun yanlış yolda koşması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1089` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Build-Measure-Learn döngüsü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1090` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Lean Startup: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
5. [ ] **URETILECEK** — Eric Ries Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Lean Startup — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Lean Startup İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Lean Startup — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — The Lean Startup Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Lean Startup — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 10. Odaklanma Gücü

**Yazar:** Jack Canfield  
**Kategori:** Verimlilik  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:10` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jack Canfield'ın 100 dolarlık banknot hedefi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1091` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bir yıl 101 hedef deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1092` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Odak sistemi ve kurbağayı yemek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1093` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Power of Focus: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Jack Canfield Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Power of Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — The Power of Focus İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Power of Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Power of Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — The Power of Focus Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Power of Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 11. The 7 Habits of Highly Effective People

**Yazar:** Stephen Covey  
**Kategori:** Büyüme  
**Yil:** 1989  
**Durum:** DB'DE KAYITLI · `list_no:11` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Büyük taşlar ve kavanoz dersi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1094` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Cenaze töreni egzersizi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1095` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Tepki verme özgürlüğü — Viktor Frankl'dan öğrenilen ders — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1096` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Hesap empati ve önce anlamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1097` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Metroda Bir Cümle Bütün Hikâyeyi Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1707` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — The 7 Habits of Highly Effective People: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Stephen Covey Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 7 Habits of Highly Effective People — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — The 7 Habits of Highly Effective People İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The 7 Habits of Highly Effective People — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
10. [ ] **URETILECEK** — The 7 Habits of Highly Effective People Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 12. Zihin Gücü

**Yazar:** Carol Dweck  
**Kategori:** Psikoloji  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:12` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabit ve büyüme zihniyeti farkı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1098` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Michael Jordan'ın kesim hikayesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1099` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Övgünün tehlikeli iki yüzü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1100` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Mindset: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Carol Dweck Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Mindset — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Mindset İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Mindset — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Mindset — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Mindset Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Mindset — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 13. Sabah Rutini

**Yazar:** Hal Elrod  
**Kategori:** Alışkanlıklar  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:13` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hal Elrod'un ölümden dönüşü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1101` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — SAVERS — altı alışkanlığın bilimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1102` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Beş saniyelik kural ve erken kalkma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1103` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Miracle Morning: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Hal Elrod Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Miracle Morning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — The Miracle Morning İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Miracle Morning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — The Miracle Morning Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Miracle Morning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 14. Güç Yasaları

**Yazar:** Robert Greene  
**Kategori:** Strateji  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:14` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bismarck'ın savaşmadan kazanma sanatı — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1104` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
2. [x] **DB'DE KAYITLI** — Beş rejim, tek diplomat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1105` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İtibar yasasının söylemediği sanılan kısmı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1106` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Soytarıyı koruyan şey espri değildi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1107` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The 48 Laws of Power: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Robert Greene Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 48 Laws of Power — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — The 48 Laws of Power İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
8. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The 48 Laws of Power — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The 48 Laws of Power — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — The 48 Laws of Power Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 15. Emotional Intelligence

**Yazar:** Daniel Goleman  
**Kategori:** Psikoloji  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:15` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dört yaşında marshmallow testi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1108` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — IQ'yu geçen EQ deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1109` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Öfke döngüsü ve nörolojik kaçırılma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1110` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Bir Gazete Haberi Zekâ Tanımını Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1708` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Daniel Goleman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Emotional Intelligence İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Emotional Intelligence Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 16. Purple Cow

**Yazar:** Seth Godin  
**Kategori:** Finans  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:16` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mor inek metaforu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1111` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Michelin rehberinin doğuşu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1112` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Boya kutusunu değiştirdiler, reklamı değil — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1113` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — En iyi olmak kimin için? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1114` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Seth Godin Neden Mor Bir İnek Aradı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1739` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Purple Cow İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Purple Cow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Purple Cow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Purple Cow Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 17. The Psychology of Money

**Yazar:** Morgan Housel  
**Kategori:** Finans  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:17` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ronald Read'in görünmez serveti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1115` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Şans ve risk — Bill Gates'in okul arkadaşı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1116` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yeterince zengin olmak — tatminsizlik tuzağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1117` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Servet Neden Genellikle Görünmezdir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1709` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The Psychology of Money: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Morgan Housel Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Psychology of Money — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — The Psychology of Money İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
8. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Psychology of Money — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Psychology of Money — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — The Psychology of Money Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 18. Beyin Fırtınası

**Yazar:** David Eagleman  
**Kategori:** Nörobilim  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:18` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — H.M.'nin sonsuz şimdi'si — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1118` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kör nokta ve beynin uydurma sanatı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1119` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bölünmüş beyin ve iki ben — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1120` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Brain Storm: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — David Eagleman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Brain Storm — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Brain Storm İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Brain Storm — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Brain Storm — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Brain Storm Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Brain Storm — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100

## 19. Alışkanlıkların Gücü

**Yazar:** Charles Duhigg  
**Kategori:** Alışkanlıklar  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:19` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Alcoa'nın beklenmedik dönüşümü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1121` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Craving döngüsü ve diş macunu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1122` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Michael Phelps'in görselleştirme rutini — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1123` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Keystone alışkanlık ve koşu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1124` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [ ] **URETILECEK** — Charles Duhigg Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Power of Habit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — The Power of Habit İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Power of Habit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Power of Habit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — The Power of Habit Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 20. Liderlik Sanatı

**Yazar:** Simon Sinek  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:20` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Subaylar en son yer — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1125` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Soyut lider mi, somut lider mi? — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1126` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
3. [x] **DB'DE KAYITLI** — Şirketi mi bırakıyorlar, yöneticiyi mi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1127` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Leaders Eat Last: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Simon Sinek Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Leaders Eat Last — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
6. [ ] **URETILECEK** — Leaders Eat Last İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Leaders Eat Last — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Leaders Eat Last — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Leaders Eat Last Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Leaders Eat Last — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 21. Büyüme Zihniyeti

**Yazar:** Carol Dweck  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:21` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 'Henüz' kelimesinin gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1128` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beynin plastikliği ve yeniden yazılma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1129` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Şampiyonların sırrı: zorluğu sevmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1130` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Growth Mindset: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Carol Dweck Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Growth Mindset — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Growth Mindset İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Growth Mindset — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Growth Mindset — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Growth Mindset Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Growth Mindset — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## 22. Şimdi ve Burada

**Yazar:** Eckhart Tolle  
**Kategori:** Farkındalık  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:22` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bankta oturan adam — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1131` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ağrı ile acının farkı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1132` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Şimdiki anın kapısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1133` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Power of Now: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Eckhart Tolle Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Power of Now — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Power of Now İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Power of Now — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Power of Now — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — The Power of Now Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Power of Now — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 23. Sosyal Hayvan

**Yazar:** David Brooks  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:23` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bilinçdışının gizli gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1134` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bağlanma ve başarı ilişkisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1135` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Karakter ve ahlakın kökeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1136` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — David Brooks Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Social Animal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
5. [ ] **URETILECEK** — The Social Animal İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Social Animal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Social Animal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — The Social Animal Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Social Animal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 24. Hız ve Güven

**Yazar:** Stephen M. R. Covey  
**Kategori:** Liderlik  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:24` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki saatlik toplantı, tek el sıkışma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1137` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Görünmez vergi, görünmez temettü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1138` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Dördünden biri eksikse olmuyor — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1139` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — The Speed of Trust: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — Stephen M. R. Covey Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Speed of Trust — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — The Speed of Trust İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Speed of Trust — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Speed of Trust — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — The Speed of Trust Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Speed of Trust — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 25. Cesaret Vermek

**Yazar:** Brené Brown  
**Kategori:** Kişisel Gelişim  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:25` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Savunmasızlığın paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1140` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Yeterlilik ve utanç kıskacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1141` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Arenada dövüşmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1142` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Daring Greatly: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Daring Greatly — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Daring Greatly İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Daring Greatly — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Daring Greatly — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Daring Greatly Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Daring Greatly — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 26. Fark Yaratmak

**Yazar:** William H. McRaven  
**Kategori:** Motivasyon  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:26` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her sabah yatağını topla — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1143` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Köpekbalığı havuzu ve korku — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1144` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kolay olmayacak, devam et — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1145` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Make Your Bed: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — William H. McRaven Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Make Your Bed — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Make Your Bed İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Make Your Bed — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Make Your Bed — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — Make Your Bed Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Make Your Bed — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 27. Sınırlar

**Yazar:** Nedra Tawwab  
**Kategori:** Kişisel Gelişim  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:27` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayır diyememek ve tükenişin bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1146` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sınırların üç türü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1147` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sınır koymak ilişkileri yıkmaz, güçlendirir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1148` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Set Boundaries: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Nedra Tawwab Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Set Boundaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Set Boundaries İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Set Boundaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Set Boundaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Set Boundaries Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Set Boundaries — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 28. Azim

**Yazar:** Angela Duckworth  
**Kategori:** Motivasyon  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:28` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — West Point'in 'Dayanma' testi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1149` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Başarının formülü: Yetenek x Çaba² — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1150` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Tutkuyu bulmak: Bilmek değil keşfetmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1151` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Grit: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Angela Duckworth Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Grit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Grit İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Grit — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Grit — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
9. [ ] **URETILECEK** — Grit Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Grit — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 29. Büyük Soru

**Yazar:** Viktor Frankl  
**Kategori:** Felsefe  
**Yil:** 1946  
**Durum:** DB'DE KAYITLI · `list_no:29` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Toplama kampında anlam arayışı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1152` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Boş zaman ve varoluş kaygısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1153` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sorumluluk özgürlüğün diğer yüzü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1154` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Man's Search for Meaning: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
5. [ ] **URETILECEK** — Viktor Frankl Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Man's Search for Meaning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Man's Search for Meaning İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Man's Search for Meaning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Man's Search for Meaning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Man's Search for Meaning Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Man's Search for Meaning — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 30. Olumlu Zeka

**Yazar:** Shirzad Chamine  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:30` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabotaj zihninin beş sesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1155` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — PQ — olumlu zeka kası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1156` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Zorlukları hediyeye çevirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1157` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Positive Intelligence: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Shirzad Chamine Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Positive Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — Positive Intelligence İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Positive Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Positive Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Positive Intelligence Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Positive Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 31. Dürüst Konuşmak

**Yazar:** Kerry Patterson  
**Kategori:** İletişim  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:31` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uçak kazası ve söylenmeden kalan söz — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1158` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ortak zemin yaratma sanatı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1159` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hikayelerden gerçeklere dönmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1160` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Crucial Conversations: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Kerry Patterson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Crucial Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Crucial Conversations İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Crucial Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Crucial Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — Crucial Conversations Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Crucial Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 32. Sezgi Gücü

**Yazar:** Malcolm Gladwell  
**Kategori:** Psikoloji  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:32` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İtfaiyecinin ölümcül sezgisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1161` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sahte antika ve uzman gözü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1162` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İlk izlenim ve Warren Harding hatası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1163` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Blink: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
5. [ ] **URETILECEK** — Malcolm Gladwell Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Blink — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Blink İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Blink — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Blink — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
9. [ ] **URETILECEK** — Blink Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Blink — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 33. 10.000 Saat Kuralı

**Yazar:** Malcolm Gladwell  
**Kategori:** Başarı  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:33` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hamburg'da geçen saatler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1164` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Lakeside ve bit pazarından çıkan terminal — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1165` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Ocak doğanların ligi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1166` · `v:A2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Outliers: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Malcolm Gladwell Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Outliers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Outliers İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Outliers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Outliers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Outliers Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Outliers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 34. Flow

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Psikoloji  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:34` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rock tırmanıcısının zaman kaybı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1167` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Cerrahın ameliyathanede kaybolması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1168` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Otomatik pilot ve bilinçli seçim — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1169` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Akış Rahatken Değil, Sınırdayken Neden Gelir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1705` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Flow: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
6. [ ] **URETILECEK** — Mihaly Csikszentmihalyi Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Flow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
7. [ ] **URETILECEK** — Flow İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
8. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Flow — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Flow — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
10. [ ] **URETILECEK** — Flow Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 35. Karar Verme Sanatı

**Yazar:** Daniel Kahneman  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:35` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sistem 1 ve Sistem 2 — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1170` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Çapalama etkisi ve müzayede — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1171` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Linda problemi ve konjunksiyon hatası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1172` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Thinking, Fast and Slow: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Daniel Kahneman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Thinking, Fast and Slow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Thinking, Fast and Slow İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Thinking, Fast and Slow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Thinking, Fast and Slow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Thinking, Fast and Slow Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Thinking, Fast and Slow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 36. İkna Sanatı

**Yazar:** Dale Carnegie  
**Kategori:** İletişim  
**Yil:** 1936  
**Durum:** DB'DE KAYITLI · `list_no:36` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Köpek çalınan adam — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1173` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Roosevelt'in isim hafızası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1174` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Eleştiri yerine soru sormak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1175` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Köpek çalan komşuya farklı yaklaşım — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1240` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Roosevelt'in isim ezberleyen dehası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1241` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Eleştiri yapmadan değiştirme sanatı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1242` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
7. [ ] **URETILECEK** — How to Win Friends and Influence People: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
8. [ ] **URETILECEK** — Dale Carnegie Bu Kitabı Yazmaya Hangi Soruyla Başladı? — How to Win Friends and Influence People — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — How to Win Friends and Influence People İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — How to Win Friends and Influence People — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 37. Pareto İlkesi

**Yazar:** Richard Koch  
**Kategori:** Verimlilik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:37` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bahçedeki bezelye — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1176` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — 80/20 ve zaman yönetimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1177` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Az ama öz ilişkiler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1178` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Bahçedeki bezelyenin sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1243` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Koch'un çalışma saatlerini yarıya indirmesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1244` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Mutluluğun yüzde yirmi kaynağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1245` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
7. [ ] **URETILECEK** — The 80/20 Principle: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Richard Koch Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 80/20 Principle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — The 80/20 Principle İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The 80/20 Principle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 38. Yaratıcı Olmak

**Yazar:** Elizabeth Gilbert  
**Kategori:** Yaratıcılık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:38` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İlham perisinin ziyareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1179` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Korkuyla dans etmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1180` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yaratıcılık bir sorumluluk — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1181` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — İlham perisi kapıya geldiğinde — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1246` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Korkunun yolcu olması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1247` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Merak yaratıcılığın pusulası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1248` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
7. [ ] **URETILECEK** — Big Magic: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
8. [ ] **URETILECEK** — Elizabeth Gilbert Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Big Magic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Big Magic İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Big Magic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 39. Money: Master the Game

**Yazar:** Tony Robbins  
**Kategori:** Finans  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:39` · 7/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bileşik faizin sihri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1182` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Finansal özgürlüğün beş adımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1183` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Risk asimetrisi ve kayıptan kaçınma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1184` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Theodore Johnson'ın taze meyve tasarrufu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1249` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Serbest piyasanın en güçlü kuvveti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1250` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Zenginliğin gerçek tanımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1251` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
7. [x] **DB'DE KAYITLI** — 2008 Krizi Tony Robbins’in Sorusunu Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1725` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
8. [ ] **URETILECEK** — Tony Robbins Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Money: Master the Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
9. [ ] **URETILECEK** — Money: Master the Game İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Money: Master the Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 40. Zihin Haritası

**Yazar:** Tony Buzan  
**Kategori:** Öğrenme  
**Yil:** 1993  
**Durum:** DB'DE KAYITLI · `list_no:40` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Einstein'ın görsel düşünce sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1185` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bir sayfada bir kitap — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1186` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Einstein'ın görsel düşünme sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1252` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Hafıza şampiyonlarının tekniği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1253` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Her iki beyin yarımküresini birlikte kullanmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1254` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — The Mind Map Book: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Tony Buzan Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Mind Map Book — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — The Mind Map Book İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Mind Map Book — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Mind Map Book — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 41. Korkusuzluk

**Yazar:** Susan Jeffers  
**Kategori:** Motivasyon  
**Yil:** 1987  
**Durum:** DB'DE KAYITLI · `list_no:41` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Paraşütle atlayan kadın — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1187` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hayır deme korkusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1188` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Paraşütle atlayan kadın — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1255` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Acının kaçınılmazlığı ve acıdan kaçma bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1256` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Sorumluluk ve güç arasındaki bağ — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1257` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — Feel the Fear and Do It Anyway: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Susan Jeffers Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Feel the Fear and Do It Anyway — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Feel the Fear and Do It Anyway İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Feel the Fear and Do It Anyway — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Feel the Fear and Do It Anyway — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 42. Stillness Is the Key

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:42` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Büyük İskender'in hareketsizliği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1189` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Epiktetos'un özgürlüğü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1190` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Büyük İskender'in hareketsizlik dersi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1258` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Çınar ağacı ve fırtına — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1259` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Napoleon'ın e-posta kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1260` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Ryan Holiday Neden Sakinliği Bir Performans Gücü Saydı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1741` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [ ] **URETILECEK** — Stillness Is the Key: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Stillness Is the Key İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Stillness Is the Key — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Stillness Is the Key — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 43. Ego Is the Enemy

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:43` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Howard Hughes'un çöküşü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1191` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Öğrenci zihniyeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1192` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Howard Hughes'ın çöküşü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1261` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [x] **DB'DE KAYITLI** — Genç askerin kibri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1262` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Şu an yapıyor olmak, olmak değildir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1263` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Ryan Holiday’nin Başarısı Neden Bir Uyarıya Dönüştü? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1713` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [ ] **URETILECEK** — Ryan Holiday Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Ego Is the Enemy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Ego Is the Enemy İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Ego Is the Enemy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Ego Is the Enemy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 44. Engel Yolu Açar

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:44` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Edison'ın fabrika yangını — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1193` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Marcus Aurelius'un mektupları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1194` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Edison'ın fabrika yangını — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1264` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Marcus Aurelius'un taht zorunluluğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1265` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Amor fati — kaderi sevmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1266` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — The Obstacle Is the Way: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
7. [ ] **URETILECEK** — Ryan Holiday Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Obstacle Is the Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — The Obstacle Is the Way İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Obstacle Is the Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Obstacle Is the Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 45. Neden Uyuyoruz

**Yazar:** Matthew Walker  
**Kategori:** Sağlık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:45` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uyku ve beyin temizliği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1195` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Roger Federer'in 12 saati — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1196` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Roger Federer'in 12 saat uyku sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1267` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Uyku yoksunluğu ve tıbbi hatalar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1268` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — REM uykusu ve duygusal iyileşme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1269` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — Why We Sleep: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Matthew Walker Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Why We Sleep — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Why We Sleep İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Why We Sleep — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Why We Sleep — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 46. Bedenin Sesi

**Yazar:** Bessel van der Kolk  
**Kategori:** Sağlık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:46` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vietnam gazilerinin dondurulmuş anları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1197` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Güvenli beden ve iyileşme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1198` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Vietnam gazilerinin dondurulmuş bedenleri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1270` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Güvenli beden — iyileşmenin temeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1271` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Çocukluk ihmalinin iz bıraktığı beyin — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1272` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — The Body Keeps the Score: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
7. [ ] **URETILECEK** — Bessel van der Kolk Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Body Keeps the Score — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — The Body Keeps the Score İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Body Keeps the Score — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Body Keeps the Score — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 47. Saatlerin Efendisi

**Yazar:** Daniel Pink  
**Kategori:** Verimlilik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:47` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hemingway'in sabah ritmi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1199` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öğle sarhoşluğu ve dinlenme bilimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1200` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hemingway'in biyolojik saat ritmi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1273` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Öğleden sonra çöküşü ve şekerleme sırrı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1274` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
5. [x] **DB'DE KAYITLI** — Son adım etkisi ve bitiş gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1275` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — When: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Daniel Pink Bu Kitabı Yazmaya Hangi Soruyla Başladı? — When — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — When İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — When — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — When — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 48. Sıfır'dan Bir'e

**Yazar:** Peter Thiel  
**Kategori:** Girişimcilik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:48` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Monopol mu rekabet mi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1201` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Gizli sırlar ve kontrarian düşünce — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1202` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — PayPal mafyasının gizemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1276` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Rekabetten kaçış ve monopol gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1277` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Gizler ve sırları aramak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1278` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — Zero to One: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Peter Thiel Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Zero to One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Zero to One İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Zero to One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Zero to One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100

## 49. Karanlığın Ötesi

**Yazar:** Brené Brown  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:49` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Güvenlik alanından çıkmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1203` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Zırh ve liderlik — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1204` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
3. [x] **DB'DE KAYITLI** — Zırh kuşanmak ve yalnızlık — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1279` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [x] **DB'DE KAYITLI** — Cesur liderliğin bedeli — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1280` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
5. [x] **DB'DE KAYITLI** — Değerler ve değer çatışması — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1281` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
6. [ ] **URETILECEK** — Dare to Lead: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Dare to Lead — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Dare to Lead İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Dare to Lead — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Dare to Lead — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 50. Kaybedilen Cennet

**Yazar:** Paulo Coelho  
**Kategori:** İlham  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:50` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hazinenin geri dönüşü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1205` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kişisel efsane ve kader — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1206` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Santiago'nun tekrarlayan rüyası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1282` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Evrenin dili ve işaretler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1283` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Hazine hep başladığın yerde — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1284` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — The Alchemist: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Paulo Coelho Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Alchemist — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — The Alchemist İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Alchemist — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Alchemist — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100

## 51. İnsan Nasıl Düşünür

**Yazar:** James Allen  
**Kategori:** Felsefe  
**Yil:** 1903  
**Durum:** DB'DE KAYITLI · `list_no:51` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bahçıvan ve zihin — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1207` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Karakter ve koşullar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1208` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bahçıvan ve zihin toprağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1285` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Koşullar değil karakter belirler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1286` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Sessizliğin içindeki bilgelik — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1287` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — As a Man Thinketh: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — James Allen Bu Kitabı Yazmaya Hangi Soruyla Başladı? — As a Man Thinketh — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — As a Man Thinketh İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — As a Man Thinketh — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — As a Man Thinketh — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 52. Can't Hurt Me

**Yazar:** David Goggins  
**Kategori:** Büyüme  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:52` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayatta kalma zihni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1209` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Aklın rahatlama dürtüsü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1210` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Çocukluğun en karanlık gecesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1288` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Yüzde kırk kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1289` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Hesap defteri ve zihinsel güç — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1290` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — David Goggins Aynadaki Adamla Neden Konuştu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1728` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [ ] **URETILECEK** — David Goggins Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Can't Hurt Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Can't Hurt Me İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Can't Hurt Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Can't Hurt Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100

## 53. Zengin Baba Fakir Baba

**Yazar:** Robert Kiyosaki  
**Kategori:** Finans  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:53` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki babanın iki farklı dersi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1211` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — McDonald's'ın gerçek işi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1212` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İki babanın iki dersi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1291` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — McDonald's aslında ne satıyor? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1292` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Vergi sistemi ve şirket stratejisi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1293` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
6. [ ] **URETILECEK** — Rich Dad Poor Dad: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
7. [ ] **URETILECEK** — Robert Kiyosaki Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Rich Dad Poor Dad — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Rich Dad Poor Dad İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Rich Dad Poor Dad — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Rich Dad Poor Dad — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 54. The 4-Hour Workweek

**Yazar:** Tim Ferriss  
**Kategori:** Verimlilik  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:54` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 80/20 ve işi silmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1213` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Korkular listesi ve olumsuz canlandırma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1214` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Muse ve ürün testi deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1294` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Korkular listesi ve felsefeyi tersine çevirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1295` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Dışarıdan çalışma ve konum bağımsızlığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1296` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Tim Ferriss Şirketinden Uzaklaşınca Neden İşler Düzelmeye Başladı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1730` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [ ] **URETILECEK** — The 4-Hour Workweek: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
8. [ ] **URETILECEK** — Tim Ferriss Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 4-Hour Workweek — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — The 4-Hour Workweek İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The 4-Hour Workweek — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100

## 55. Minimalizm

**Yazar:** Greg McKeown  
**Kategori:** Verimlilik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:55` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Daha az, daha odaklı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1215` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Tek gemi filosu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1216` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Tek gemi filosunun zafer sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1297` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Fırsatın maliyeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1298` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Dinlenmenin üretkenlik paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1299` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
6. [ ] **URETILECEK** — Essentialism: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Greg McKeown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Essentialism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Essentialism İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
9. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Essentialism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Essentialism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 56. Hiçbir Şeye Bakmamak

**Yazar:** Cal Newport  
**Kategori:** Teknoloji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:56` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir aylık e-posta yasağı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1217` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Dijital minimalizm felsefesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1218` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [ ] **URETILECEK** — Digital Minimalism: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
4. [ ] **URETILECEK** — Cal Newport Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Digital Minimalism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Digital Minimalism İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Digital Minimalism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Digital Minimalism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Digital Minimalism Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Digital Minimalism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Digital Minimalism — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100

## 57. The Good Life

**Yazar:** Robert Waldinger  
**Kategori:** Psikoloji  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:57` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Harvard'ın 85 yıllık mutluluk araştırması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1219` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bir Telefon Görüşmesi Neden Mutluluk Araştırmasına Dönüştü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1742` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [ ] **URETILECEK** — The Good Life: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
4. [ ] **URETILECEK** — Robert Waldinger Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — The Good Life İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
6. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — The Good Life Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Good Life — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Good Life — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
10. [ ] **URETILECEK** — Bugün Hâlâ Geçerli Olan Tarihsel Ders — The Good Life — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 58. Şükran Günlüğü

**Yazar:** Janice Kaplan  
**Kategori:** Mutluluk  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:58` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şükranın beyin kimyası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1220` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Karşılaştırmanın tuzağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1221` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — The Gratitude Diaries: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
4. [ ] **URETILECEK** — Janice Kaplan Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Gratitude Diaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — The Gratitude Diaries İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Gratitude Diaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Gratitude Diaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — The Gratitude Diaries Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Gratitude Diaries — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Gratitude Diaries — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100

## 59. Karizmatik Olmak

**Yazar:** Olivia Fox Cabane  
**Kategori:** İletişim  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:59` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Marilyn Monroe'nun soyunma odası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1222` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Varlık — karizmanın temeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1223` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — The Charisma Myth: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
4. [ ] **URETILECEK** — Olivia Fox Cabane Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Charisma Myth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — The Charisma Myth İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Charisma Myth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Charisma Myth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — The Charisma Myth Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Charisma Myth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Charisma Myth — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100

## 60. İnsan Beyninin Gücü

**Yazar:** Jim Kwik  
**Kategori:** Öğrenme  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:60` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jim Kwik'in beyin hasarı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1224` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hız okuma ve anlama — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1225` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Limitless: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 94/100
4. [ ] **URETILECEK** — Jim Kwik Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Limitless — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
5. [ ] **URETILECEK** — Limitless İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Limitless — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Limitless — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
8. [ ] **URETILECEK** — Limitless Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Limitless — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Limitless — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 61. Cesur Olmak

**Yazar:** Ichiro Kishimi  
**Kategori:** Felsefe  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:61` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Onay ihtiyacı ve özgürlük — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1226` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Geçmiş ve şimdiki an — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1227` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — The Courage to Be Disliked: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
4. [ ] **URETILECEK** — Ichiro Kishimi Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Courage to Be Disliked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — The Courage to Be Disliked İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Courage to Be Disliked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Courage to Be Disliked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — The Courage to Be Disliked Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Courage to Be Disliked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Courage to Be Disliked — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100

## 62. Yüksek Performans

**Yazar:** Brendon Burchard  
**Kategori:** Kişisel Gelişim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:62` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ambulanstaki uyanış — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1228` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Enerji yönetimi ve niyet — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1229` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — High Performance Habits: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
4. [ ] **URETILECEK** — Brendon Burchard Bu Kitabı Yazmaya Hangi Soruyla Başladı? — High Performance Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — High Performance Habits İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — High Performance Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — High Performance Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — High Performance Habits Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — High Performance Habits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — High Performance Habits — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100

## 63. Savaş Sanatı

**Yazar:** Sun Tzu  
**Kategori:** Strateji  
**Yil:** -500  
**Durum:** DB'DE KAYITLI · `list_no:63` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Su gibi olmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1230` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Kazanmak savaşmadan — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1231` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
3. [ ] **URETILECEK** — The Art of War: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
4. [ ] **URETILECEK** — Sun Tzu Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Art of War — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — The Art of War İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Art of War — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Art of War — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — The Art of War Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Art of War — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Art of War — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100

## 64. Değişimin Gücü

**Yazar:** Chip Heath  
**Kategori:** Değişim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:64` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Fil ve kazık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1232` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Akıl ve kalp — değişimin iki motoru — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1233` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Switch: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
4. [ ] **URETILECEK** — Chip Heath Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Switch — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Switch İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Switch — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Switch — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
8. [ ] **URETILECEK** — Switch Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Switch — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Switch — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 65. Yapışkan Fikirler

**Yazar:** Chip Heath  
**Kategori:** İletişim  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:65` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jared ve Subway diyeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1234` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sürpriz ve merak boşluğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1235` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Made to Stick: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
4. [ ] **URETILECEK** — Chip Heath Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Made to Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Made to Stick İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Made to Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Made to Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Made to Stick Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Made to Stick — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Made to Stick — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100

## 66. Hikaye Anlatıcısı

**Yazar:** Donald Miller  
**Kategori:** Pazarlama  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:66` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kahraman ve rehber — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1236` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — BrandScript ve basit mesaj — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1237` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Building a StoryBrand: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Donald Miller Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Building a StoryBrand — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Building a StoryBrand İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Building a StoryBrand — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Building a StoryBrand — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Building a StoryBrand Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Building a StoryBrand — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Building a StoryBrand — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100

## 67. Doğrusal Olmayan Gelecek

**Yazar:** Ray Kurzweil  
**Kategori:** Teknoloji  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:67` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Katlanarak büyüme paradoksu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1238` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — İnsan-makine entegrasyonu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1239` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [ ] **URETILECEK** — The Singularity Is Near: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
4. [ ] **URETILECEK** — Ray Kurzweil Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Singularity Is Near — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — The Singularity Is Near İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Singularity Is Near — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Singularity Is Near — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — The Singularity Is Near Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Singularity Is Near — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Singularity Is Near — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100

## 68. Akıl Yürütme

**Yazar:** Hans Rosling  
**Kategori:** Düşünme  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:68` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şempanze testi ve insan yanılgısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1300` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dünya dört gelir düzeyinde — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1301` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Korkuyla değil veriyle düşünmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1302` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Factfulness: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Hans Rosling Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Factfulness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Factfulness İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Factfulness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Factfulness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Factfulness Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Factfulness — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 69. Siyah Kuğu

**Yazar:** Nassim Taleb  
**Kategori:** Düşünme  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:69` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hindinin yanlış öğrenimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1303` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Uzman tahmini yanılgısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1304` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kırılganlık ve siyah kuğuya hazırlık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1305` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Black Swan: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Nassim Taleb Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Black Swan — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — The Black Swan İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Black Swan — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Black Swan — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — The Black Swan Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Black Swan — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 70. Antikırılgan

**Yazar:** Nassim Taleb  
**Kategori:** Düşünme  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:70` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ormanın yangın ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1306` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Barbell stratejisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1307` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Stres ve kas büyümesi — antikırılganlığın bedeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1308` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Antifragile: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
5. [ ] **URETILECEK** — Nassim Taleb Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Antifragile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — Antifragile İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Antifragile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Antifragile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Antifragile Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Antifragile — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 71. Thinking in Systems

**Yazar:** Donella Meadows  
**Kategori:** Verimlilik  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:71` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Salıncak ve sistem düşüncesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1309` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Geri bildirim döngüleri ve kendi kendini besleyen kısır döngüler — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1310` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Gecikme ve sabırsızlık tuzağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1311` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Bir Gölü Kurtarmak Neden Musluğu Kapatmak Kadar Hızlı Değildir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1723` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Thinking in Systems: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Donella Meadows Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Thinking in Systems — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Thinking in Systems İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Thinking in Systems — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — Thinking in Systems Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Thinking in Systems — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 72. İşin Özü

**Yazar:** Michael Gerber  
**Kategori:** Girişimcilik  
**Yil:** 1986  
**Durum:** DB'DE KAYITLI · `list_no:72` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Pasta dükkanı sahibinin hatası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1312` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — McDonald's ve işletme prototipi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1313` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Olgunluk aşaması ve sistematik büyüme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1314` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The E-Myth Revisited: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Michael Gerber Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The E-Myth Revisited — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
6. [ ] **URETILECEK** — The E-Myth Revisited İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The E-Myth Revisited — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The E-Myth Revisited — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — The E-Myth Revisited Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The E-Myth Revisited — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 73. Müşteriyi Anlamak

**Yazar:** Nir Eyal  
**Kategori:** Ürün  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:73` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Instagram'ın pivot mucizesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1315` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Tetikleyiciler ve alışkanlık tasarımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1316` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Değişken ödül ve kumar psikolojisi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1317` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Hooked: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Nir Eyal Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Hooked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — Hooked İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Hooked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Hooked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Hooked Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Hooked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 74. Indistractable

**Yazar:** Nir Eyal  
**Kategori:** Verimlilik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:74` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rahatsızlıktan kaçma dürtüsü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1318` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Zaman kutulaması ve taahhüt — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1319` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Çevre tasarımı ve sürtüşme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1320` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Nir Eyal’i Kendi Kızıyla Kaçırdığı An Durdurdu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1715` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Indistractable: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
6. [ ] **URETILECEK** — Indistractable İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Indistractable — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Indistractable — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — Indistractable Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Indistractable — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 75. Güçlü Sorular

**Yazar:** Warren Berger  
**Kategori:** Yaratıcılık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:75` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Polaroid'in anlık cevabı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1321` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Soru hiyerarşisi — neden, nasıl, ne — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1322` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Naif soru ve uzman körlüğü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1323` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — A More Beautiful Question: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Warren Berger Bu Kitabı Yazmaya Hangi Soruyla Başladı? — A More Beautiful Question — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — A More Beautiful Question İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — A More Beautiful Question — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — A More Beautiful Question — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — A More Beautiful Question Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — A More Beautiful Question — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 76. Yaratıcı Beyin

**Yazar:** Julia Cameron  
**Kategori:** Yaratıcılık  
**Yil:** 1992  
**Durum:** DB'DE KAYITLI · `list_no:76` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabah sayfaları ritüeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1324` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — İçsel eleştirmenin sesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1325` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sanatçı buluşması ve ilham besleme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1326` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Artist's Way: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Julia Cameron Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Artist's Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — The Artist's Way İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Artist's Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Artist's Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — The Artist's Way Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Artist's Way — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 77. The Success Principles

**Yazar:** Jack Canfield  
**Kategori:** Büyüme  
**Yil:** 2004  
**Durum:** DB'DE KAYITLI · `list_no:77` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 101 hedef listesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1327` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ayna ilkesi ve dış yansıma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1328` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Geri bildirim döngüsü ve sürekli iyileşme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1329` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Beş Küçük Rica Chicken Soup’u Nasıl Fenomene Dönüştürdü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1733` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The Success Principles: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Jack Canfield Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Success Principles — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
7. [ ] **URETILECEK** — The Success Principles İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Success Principles — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — The Success Principles Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Success Principles — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 78. Özgür Olmak

**Yazar:** Mark Manson  
**Kategori:** Kişisel Gelişim  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:78` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Değerlerin hiyerarşisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1330` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Çaresizlik döngüsü ve sorumluluk — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1331` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Belirsizliği kucaklamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1332` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Subtle Art of Not Giving a F*ck: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — Mark Manson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Subtle Art of Not Giving a F*ck — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Subtle Art of Not Giving a F*ck İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Subtle Art of Not Giving a F*ck — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Subtle Art of Not Giving a F*ck — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — The Subtle Art of Not Giving a F*ck Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Subtle Art of Not Giving a F*ck — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 79. Her Şey Yolunda

**Yazar:** Mark Manson  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:79` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Umut paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1333` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ölüm ve anlam arasındaki bağ — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1334` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Özgürlük ve seçimin bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1335` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Everything Is F*cked: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Mark Manson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Everything Is F*cked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Everything Is F*cked İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Everything Is F*cked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Everything Is F*cked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — Everything Is F*cked Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Everything Is F*cked — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 80. Beden Dili

**Yazar:** Joe Navarro  
**Kategori:** İletişim  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:80` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — FBI ajanının gözlem sanatı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1336` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Rahat ve rahatsız beden — temel çizgi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1337` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Güven ve otoriteyi yansıtan duruş — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1338` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — What Every Body Is Saying: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Joe Navarro Bu Kitabı Yazmaya Hangi Soruyla Başladı? — What Every Body Is Saying — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — What Every Body Is Saying İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — What Every Body Is Saying — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — What Every Body Is Saying — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — What Every Body Is Saying Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — What Every Body Is Saying — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 81. Uyku Devrimi

**Yazar:** Arianna Huffington  
**Kategori:** Sağlık  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:81` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Huffington'ın çöküşü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1339` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Uyku ritueli ve ortam tasarımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1340` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Başarının yeni tanımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1341` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Sleep Revolution: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Arianna Huffington Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Sleep Revolution — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — The Sleep Revolution İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Sleep Revolution — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Sleep Revolution — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — The Sleep Revolution Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Sleep Revolution — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 82. Meditasyon

**Yazar:** Dan Harris  
**Kategori:** Farkındalık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:82` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Panik atağından meditasyona — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1342` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Yüzde on daha mutlu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1343` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Egonun sesi ve gözlemci — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1344` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — 10% Happier: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
5. [ ] **URETILECEK** — Dan Harris Bu Kitabı Yazmaya Hangi Soruyla Başladı? — 10% Happier — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — 10% Happier İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — 10% Happier — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — 10% Happier — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — 10% Happier Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — 10% Happier — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 83. The Paradox of Choice

**Yazar:** Barry Schwartz  
**Kategori:** Psikoloji  
**Yil:** 2004  
**Durum:** DB'DE KAYITLI · `list_no:83` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kot pantolon ve felç edici özgürlük — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1345` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Maksimizer ve satisficer — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1346` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Beklenti ve hayal kırıklığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1347` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — 24 Reçel Neden 6 Reçelden Daha Az Sattı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1720` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The Paradox of Choice: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Barry Schwartz Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Paradox of Choice — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Paradox of Choice — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Paradox of Choice — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — The Paradox of Choice Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Paradox of Choice — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 84. Öğrenmeyi Öğrenmek

**Yazar:** Peter Brown  
**Kategori:** Öğrenme  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:84` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uyku ve hafıza pekiştirme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1348` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Geri çağırma pratiği ve illüzyon bilgisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1349` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Aralıklı tekrar ve unutma paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1350` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Make It Stick: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Peter Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Make It Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Make It Stick İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Make It Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Make It Stick — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Make It Stick Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Make It Stick — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## 85. Bir Sonraki Seviye

**Yazar:** Robin Sharma  
**Kategori:** Alışkanlıklar  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:85` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabah 5 kulübü ve beynin altın saatleri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1351` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — 1-3-5 kuralı ve günlük odak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1352` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İkiz döngüsü — kazanma ve öğrenme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1353` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The 5 AM Club: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Robin Sharma Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 5 AM Club — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 95/100
6. [ ] **URETILECEK** — The 5 AM Club İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The 5 AM Club — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The 5 AM Club — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
9. [ ] **URETILECEK** — The 5 AM Club Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The 5 AM Club — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 86. Lider Yok Köle Yok

**Yazar:** Robin Sharma  
**Kategori:** İlham  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:86` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ferrari sahibinin manastır ziyareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1354` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beş büyük pişmanlık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1355` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kaizen ilkesi ve sürekli küçük iyileştirme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1356` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Monk Who Sold His Ferrari: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Robin Sharma Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Monk Who Sold His Ferrari — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — The Monk Who Sold His Ferrari İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Monk Who Sold His Ferrari — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Monk Who Sold His Ferrari — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — The Monk Who Sold His Ferrari Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Monk Who Sold His Ferrari — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 87. Unutulmaz Markalar

**Yazar:** Seth Godin  
**Kategori:** Pazarlama  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:87` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Müşteri kim sorusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1357` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kabile ve liderlik — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1358` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Pazarlama empati işidir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1359` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — This Is Marketing: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
5. [ ] **URETILECEK** — Seth Godin Bu Kitabı Yazmaya Hangi Soruyla Başladı? — This Is Marketing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — This Is Marketing İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — This Is Marketing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — This Is Marketing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — This Is Marketing Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — This Is Marketing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 88. Niyet

**Yazar:** Lynne McTaggart  
**Kategori:** Farkındalık  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:88` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Princeton mühendislik anomalileri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1360` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Uzak iyileşme deneyleri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1361` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Topluluk niyeti ve dalgalanma etkisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1362` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Intention Experiment: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Lynne McTaggart Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Intention Experiment — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — The Intention Experiment İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Intention Experiment — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Intention Experiment — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — The Intention Experiment Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Intention Experiment — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 89. Zihinsel Dayanıklılık

**Yazar:** Sheryl Sandberg  
**Kategori:** Dayanıklılık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:89` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dave Goldberg'i kaybetmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1363` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — 3P tuzağı — kalıcılık, yaygınlık, kişiselleştirme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1364` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Travma sonrası büyüme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1365` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Option B: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — Sheryl Sandberg Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Option B — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Option B İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Option B — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Option B — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Option B Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Option B — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 90. Kendi Patronun Ol

**Yazar:** Paul Jarvis  
**Kategori:** Girişimcilik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:90` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Freelancer'ın fatura şoku — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1366` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Tek kişilik şirketin gücü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1367` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Direnç ve yavaş büyümenin avantajı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1368` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Company of One: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Paul Jarvis Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Company of One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Company of One İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Company of One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Company of One — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Company of One Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Company of One — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 91. İnsanı Anlamak

**Yazar:** Chris Voss  
**Kategori:** Müzakere  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:91` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — FBI rehine müzakeresi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1369` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hayır'ın gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1370` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yansıtma ve derin dinleme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1371` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Never Split the Difference: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Chris Voss Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Never Split the Difference — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Never Split the Difference İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Never Split the Difference — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Never Split the Difference — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Never Split the Difference Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Never Split the Difference — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 92. The Life-Changing Magic of Tidying Up

**Yazar:** Marie Kondo  
**Kategori:** Felsefe  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:92` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Neşe tetikleyici yöntemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1372` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kategori sırasının önemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1373` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Eşyaların enerjisi ve ev farkındalığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1374` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Marie Kondo Neden “Bu Bana Neşe Veriyor mu?” Diye Sordu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1737` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The Life-Changing Magic of Tidying Up: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — The Life-Changing Magic of Tidying Up İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Life-Changing Magic of Tidying Up — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Life-Changing Magic of Tidying Up — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — The Life-Changing Magic of Tidying Up Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Life-Changing Magic of Tidying Up — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 93. Stoacılık

**Yazar:** Marcus Aurelius  
**Kategori:** Felsefe  
**Yil:** 180  
**Durum:** DB'DE KAYITLI · `list_no:93` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Marcus Aurelius'un gizli günlüğü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1375` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kontrol edilebilen ve edilemeyen — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1376` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Olumsuz görselleştirme — en kötüyü hayal etmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1377` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Meditations: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Marcus Aurelius Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Meditations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Meditations İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Meditations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Meditations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Meditations Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Meditations — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## 94. İyimserlik Öğrenmek

**Yazar:** Martin Seligman  
**Kategori:** Psikoloji  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:94` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Öğrenilmiş çaresizlik deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1378` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Açıklama tarzı ve geleceğin şekli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1379` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — ABCDE modeli — düşünceyi yeniden yapılandırma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1380` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Learned Optimism: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Martin Seligman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Learned Optimism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Learned Optimism İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Learned Optimism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Learned Optimism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Learned Optimism Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Learned Optimism — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 95. Mutluluğun Peşinde

**Yazar:** Shawn Achor  
**Kategori:** Mutluluk  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:95` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Tetris etkisi ve beyin yeniden programlama — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1381` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sosyal yatırım ve bağlantı kalkanı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1382` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Başarı mutluluğu getirmez — tersine çalışır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1383` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Happiness Advantage: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Shawn Achor Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Happiness Advantage — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Happiness Advantage İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Happiness Advantage — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Happiness Advantage — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — The Happiness Advantage Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Happiness Advantage — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 96. Sağlıklı Olmak

**Yazar:** James Clear  
**Kategori:** Sağlık  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:96` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Küçük sağlık kazanımlarının bileşimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1384` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Çevre ve sağlık kararları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1385` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hiçbir zaman iki gün üst üste atla — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1386` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Atomic Habits for Health: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — James Clear Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Atomic Habits for Health — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Atomic Habits for Health İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Atomic Habits for Health — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Atomic Habits for Health — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Atomic Habits for Health Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Atomic Habits for Health — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 97. İçsel Güç

**Yazar:** Tony Robbins  
**Kategori:** Motivasyon  
**Yil:** 1991  
**Durum:** DB'DE KAYITLI · `list_no:97` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ateş üzerinde yürümek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1387` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Altı insan ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1388` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kaynak durumu ve performans zirvesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1389` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Awaken the Giant Within: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — Tony Robbins Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Awaken the Giant Within — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Awaken the Giant Within İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Awaken the Giant Within — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Awaken the Giant Within — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Awaken the Giant Within Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Awaken the Giant Within — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 98. Hedeflere Ulaşmak

**Yazar:** Brian Tracy  
**Kategori:** Hedefler  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:98` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hedefin netliği ve beyin aktivasyonu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1390` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Hedefin altı P'si — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1391` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — En büyük hedef ve günlük adım — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1392` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Goals!: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — Brian Tracy Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Goals! İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Goals! Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 99. Yeme Bozukluğu

**Yazar:** Brian Tracy  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:99` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kurbağayı sabah yemek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1393` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — 80/20 ve kritik görevler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1394` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Odaklanma ve tek görev ilkesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1395` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Eat That Frog!: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Brian Tracy Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Eat That Frog! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Eat That Frog! İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Eat That Frog! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Eat That Frog! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Eat That Frog! Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Eat That Frog! — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## 100. Sonsuz Oyun

**Yazar:** Simon Sinek  
**Kategori:** Strateji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:100` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sonsuz ve sonlu oyun farkı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1396` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sadık rakip — öğreten düşman — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1397` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Sonsuz liderler ve güven kültürü — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1398` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [ ] **URETILECEK** — The Infinite Game: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Simon Sinek Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Infinite Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — The Infinite Game İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Infinite Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Infinite Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — The Infinite Game Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Infinite Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 101. Zeki Kalabalıklar

**Yazar:** Howard Rheingold  
**Kategori:** Teknoloji  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:101` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Japonya'da cep telefonuyla koordinasyon — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1399` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Wikipedia ve kolektif bilgi üretimi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1400` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Flash mob ve anlık koordinasyon — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1401` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Smart Mobs: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Howard Rheingold Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Smart Mobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Smart Mobs İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Smart Mobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Smart Mobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Smart Mobs Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Smart Mobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 102. Devrilme Noktası

**Yazar:** Malcolm Gladwell  
**Kategori:** Sosyoloji  
**Yil:** 2000  
**Durum:** DB'DE KAYITLI · `list_no:102` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hush Puppies'in gizemli dirilişi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1402` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — New York'ta suç salgını ve kırık cam teorisi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1403` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Bağlayıcılar, Bilgeler ve Satıcılar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1404` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Tipping Point: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Malcolm Gladwell Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Tipping Point — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — The Tipping Point İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Tipping Point — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Tipping Point — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — The Tipping Point Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Tipping Point — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 103. Nasıl Başarılı Olunur

**Yazar:** David Allen  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:103` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki dakikada karar ver — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1405` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — İki dakika kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1406` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Haftalık gözden geçirme ritüeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1407` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Getting Things Done: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — David Allen Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Getting Things Done — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Getting Things Done İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Getting Things Done — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Getting Things Done — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Getting Things Done Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Getting Things Done — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 104. Dört Anlaşma

**Yazar:** Don Miguel Ruiz  
**Kategori:** Felsefe  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:104` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sözcüklerin büyüsü — birinci anlaşma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1408` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kişisel almama sanatı — ikinci anlaşma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1409` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Varsayımda bulunmamak — üçüncü anlaşma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1410` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Four Agreements: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Don Miguel Ruiz Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Four Agreements — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — The Four Agreements İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Four Agreements — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Four Agreements — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — The Four Agreements Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Four Agreements — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 105. Sessizlik

**Yazar:** Susan Cain  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:105` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İçe dönükler ve dışa dönükler arasındaki fark — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1411` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Harvard Business School paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1412` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sert satış ve empatin gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1413` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Quiet: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
5. [ ] **URETILECEK** — Susan Cain Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Quiet — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — Quiet İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Quiet — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Quiet — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
9. [ ] **URETILECEK** — Quiet Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Quiet — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 106. Liderlik 21 Yasası

**Yazar:** John C. Maxwell  
**Kategori:** Liderlik  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:106` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Tavan yasası — kim olduğun neye ulaşabileceğini belirler — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1414` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Etkinin yasası — asıl para birimi ilişki — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1415` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Zemin yasası — güven liderliğin temelidir — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1416` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [ ] **URETILECEK** — The 21 Irrefutable Laws of Leadership: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — John C. Maxwell Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The 21 Irrefutable Laws of Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
6. [ ] **URETILECEK** — The 21 Irrefutable Laws of Leadership İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The 21 Irrefutable Laws of Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The 21 Irrefutable Laws of Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
9. [ ] **URETILECEK** — The 21 Irrefutable Laws of Leadership Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The 21 Irrefutable Laws of Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 107. Mavi Okyanus Stratejisi

**Yazar:** W. Chan Kim  
**Kategori:** Strateji  
**Yil:** 2004  
**Durum:** DB'DE KAYITLI · `list_no:107` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Cirque du Soleil ve yeni pazar yaratma — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1417` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Dört eylem çerçevesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1418` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Stratejik tuval ve görsel strateji — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1419` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Blue Ocean Strategy: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — W. Chan Kim Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Blue Ocean Strategy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Blue Ocean Strategy İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Blue Ocean Strategy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Blue Ocean Strategy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Blue Ocean Strategy Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Blue Ocean Strategy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 108. Mucize Sabah 2

**Yazar:** Hal Elrod  
**Kategori:** Alışkanlıklar  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:108` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Beyin kimyası ve sabah saati — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1420` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beş saniyelik kural ve momentum — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1421` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Vizyon ve kimlik netliği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1422` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Morning Miracle: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Hal Elrod Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Morning Miracle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
6. [ ] **URETILECEK** — The Morning Miracle İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Morning Miracle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Morning Miracle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — The Morning Miracle Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Morning Miracle — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 109. Mindfulness

**Yazar:** Jon Kabat-Zinn  
**Kategori:** Farkındalık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:109` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Nereye gidersen git, orada ol — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1423` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Otopilot modu ve bilinçsiz hayat — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1424` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Düşünceler gerçek değildir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1425` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Wherever You Go There You Are: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Jon Kabat-Zinn Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Wherever You Go There You Are — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Wherever You Go There You Are İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Wherever You Go There You Are — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Wherever You Go There You Are — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Wherever You Go There You Are Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Wherever You Go There You Are — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 110. Yetenek Yanılgısı

**Yazar:** Geoff Colvin  
**Kategori:** Başarı  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:110` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mozart'ın mucize çocuk efsanesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1426` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Kasıtlı pratik ile rutin pratik arasındaki derin uçurum — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1427` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Coçluk ve geri bildirim olmadan büyüme olmaz — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1428` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Talent Is Overrated: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Geoff Colvin Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Talent Is Overrated — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Talent Is Overrated İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Talent Is Overrated — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Talent Is Overrated — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Talent Is Overrated Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Talent Is Overrated — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 111. Terapi

**Yazar:** Lori Gottlieb  
**Kategori:** Psikoloji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:111` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Terapistin kendi terapisti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1429` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Değişim istemek ile değişmek istemek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1430` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hikaye anlatımı ve kendini kurban etmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1431` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Maybe You Should Talk to Someone: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Lori Gottlieb Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Maybe You Should Talk to Someone — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Maybe You Should Talk to Someone İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Maybe You Should Talk to Someone — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Maybe You Should Talk to Someone — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — Maybe You Should Talk to Someone Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Maybe You Should Talk to Someone — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 112. Büyüme Kültürü

**Yazar:** John Doerr  
**Kategori:** Yönetim  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:112` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — OKR'ların doğuşu — Intel ve Andy Grove — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1432` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Yüksek hedef kültürü — moonshot düşünce — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1433` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Şeffaflık ve hizalanma — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1434` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Measure What Matters: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — John Doerr Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Measure What Matters — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Measure What Matters İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Measure What Matters — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Measure What Matters — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — Measure What Matters Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Measure What Matters — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 113. Satışın Psikolojisi

**Yazar:** Brian Tracy  
**Kategori:** Satış  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:113` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Satışın psikolojik temeli — insanlar duygularla alır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1435` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Reddin anatomisi — itiraz yönetimi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1436` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Güven inşası ve ilk izlenim — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1437` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Psychology of Selling: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Brian Tracy Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Psychology of Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Psychology of Selling İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Psychology of Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Psychology of Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Psychology of Selling Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Psychology of Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 114. Against Empathy

**Yazar:** Paul Bloom  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:114` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Empatinin karanlık yüzü — önyargılı acı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1438` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Rasyonel şefkat — empatinin ötesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1439` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Tükenme ve empatinin bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1440` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Bir Yüz Neden Binlerce İstatistikten Güçlüdür? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1706` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Against Empathy: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
6. [ ] **URETILECEK** — Paul Bloom Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Against Empathy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Against Empathy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Against Empathy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Against Empathy Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Against Empathy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 115. Gündelik Nesneler Tasarımı

**Yazar:** Don Norman  
**Kategori:** Tasarım  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:115` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kapı tasarımı ve hata yerine kullanıcıyı suçlamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1441` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Görünürlük ve geri bildirim — iyi tasarımın iki direği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1442` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Zihinsel modeller ve tasarımın gizli dili — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1443` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Design of Everyday Things: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — Don Norman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Design of Everyday Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — The Design of Everyday Things İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Design of Everyday Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Design of Everyday Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — The Design of Everyday Things Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Design of Everyday Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 116. Sadakat Etkisi

**Yazar:** Frederick Reichheld  
**Kategori:** İş Dünyası  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:116` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Müşteri kaybı ve görünmez buz buzdağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1444` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Net Tavsiye Skoru'nun doğuşu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1445` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sadakat ve kârlılığın matematiği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1446` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Loyalty Effect: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — Frederick Reichheld Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Loyalty Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Loyalty Effect İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Loyalty Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Loyalty Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — The Loyalty Effect Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Loyalty Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 117. Hayatın Kısalığı Üzerine

**Yazar:** Seneca  
**Kategori:** Felsefe  
**Yil:** 49  
**Durum:** DB'DE KAYITLI · `list_no:117` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayat kısa değil, biz onu israf ediyoruz — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1447` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ertelemenin ölümcül yanılgısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1448` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Stoacı saat — her anı bilinçli yaşamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1449` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — On the Shortness of Life: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Seneca Bu Kitabı Yazmaya Hangi Soruyla Başladı? — On the Shortness of Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — On the Shortness of Life İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — On the Shortness of Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — On the Shortness of Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — On the Shortness of Life Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — On the Shortness of Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 118. Bilinçaltının Gücü

**Yazar:** Joseph Murphy  
**Kategori:** Motivasyon  
**Yil:** 1963  
**Durum:** DB'DE KAYITLI · `list_no:118` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bilinçaltı ve otonom sinir sistemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1450` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Uyku öncesi programlama — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1451` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İnanç ve gerçekleşme döngüsü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1452` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Power of Your Subconscious Mind: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Joseph Murphy Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Power of Your Subconscious Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — The Power of Your Subconscious Mind İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Power of Your Subconscious Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Power of Your Subconscious Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — The Power of Your Subconscious Mind Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Power of Your Subconscious Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 119. Neşeyi Seç

**Yazar:** Dalai Lama  
**Kategori:** Mutluluk  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:119` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sekiz gün sekiz yıla bedel — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1453` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sekiz neşe sütunu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1454` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Acı ve neşe bir arada — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1455` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Book of Joy: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 94/100
5. [ ] **URETILECEK** — Dalai Lama Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Book of Joy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — The Book of Joy İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Book of Joy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Book of Joy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Book of Joy Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Book of Joy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 120. Beynin Sırları

**Yazar:** V.S. Ramachandran  
**Kategori:** Nörobilim  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:120` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Phantom limb — hayalet uzuv ve beynin gerçeği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1456` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Synesthesia — duyuların birbirine karışması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1457` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Ayna nöronlar ve empati biyolojisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1458` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Tell-Tale Brain: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — V.S. Ramachandran Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Tell-Tale Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — The Tell-Tale Brain İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Tell-Tale Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Tell-Tale Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Tell-Tale Brain Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Tell-Tale Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 121. İş Hayatında Duygusal Zeka

**Yazar:** Daniel Goleman  
**Kategori:** Liderlik  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:121` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Liderlik ve duygusal bulaşıcılık — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1459` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
2. [x] **DB'DE KAYITLI** — Beş yetkinlik çerçevesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1460` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Öz farkındalığın gücü ve kör nokta — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1461` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Working with Emotional Intelligence: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Daniel Goleman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Working with Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Working with Emotional Intelligence İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Working with Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Working with Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Working with Emotional Intelligence Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Working with Emotional Intelligence — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 122. Kalıcı Hafıza

**Yazar:** Joshua Foer  
**Kategori:** Öğrenme  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:122` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hafıza şampiyonlarıyla yarışmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1462` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hafıza sarayı ve uzamsal kodlama — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1463` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Unutma ve hatırlamanın paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1464` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Moonwalking with Einstein: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Joshua Foer Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Moonwalking with Einstein — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Moonwalking with Einstein İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Moonwalking with Einstein — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Moonwalking with Einstein — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Moonwalking with Einstein Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Moonwalking with Einstein — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 123. Etkileyici Konuşma

**Yazar:** Carmine Gallo  
**Kategori:** İletişim  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:123` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — TED sahnesindeki üç sır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1465` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beyin dostu hikaye anlatımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1466` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kural yüzde elli sekiz — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1467` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Talk Like TED: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
5. [ ] **URETILECEK** — Carmine Gallo Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Talk Like TED — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Talk Like TED İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Talk Like TED — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Talk Like TED — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Talk Like TED Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Talk Like TED — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100

## 124. Büyük Fikirler

**Yazar:** Steven Johnson  
**Kategori:** Yaratıcılık  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:124` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kahve evi ve fikir ekosistemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1468` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Yavaş sezgi ve uzun kuluçka — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1469` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bitişen olasılıklar — sınırı genişletmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1470` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Where Good Ideas Come From: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Steven Johnson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Where Good Ideas Come From — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Where Good Ideas Come From İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Where Good Ideas Come From — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Where Good Ideas Come From — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Where Good Ideas Come From Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Where Good Ideas Come From — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 125. Dinlenmenin Gücü

**Yazar:** Alex Soojung-Kim Pang  
**Kategori:** Verimlilik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:125` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Darwin'in yürüyüş yolu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1471` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Uyku ve yaratıcı problem çözme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1472` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Derin oyun ve yenileme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1473` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Rest: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
5. [ ] **URETILECEK** — Alex Soojung-Kim Pang Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Rest — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Rest İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Rest — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Rest — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
9. [ ] **URETILECEK** — Rest Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Rest — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 126. İnsanlığın Kısa Tarihi

**Yazar:** Yuval Noah Harari  
**Kategori:** Tarih  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:126` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bilişsel devrim ve hayali gerçeklikler — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1474` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
2. [x] **DB'DE KAYITLI** — Tarım devrimi — insanlığın en büyük aldatmacası — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1475` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
3. [x] **DB'DE KAYITLI** — Mutluluk ve anlam — tarihsel perspektif — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1476` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [ ] **URETILECEK** — Sapiens: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Yuval Noah Harari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Sapiens — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Sapiens İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Sapiens — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Sapiens — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Sapiens Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Sapiens — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 127. Homo Deus

**Yazar:** Yuval Noah Harari  
**Kategori:** Gelecek  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:127` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ölümsüzlük projesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1477` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Veri dini ve algoritmik otorite — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1478` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Özgür irade yanılsaması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1479` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Homo Deus: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Yuval Noah Harari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Homo Deus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Homo Deus İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Homo Deus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Homo Deus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Homo Deus Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Homo Deus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 128. 21. Yüzyıl İçin 21 Ders

**Yazar:** Yuval Noah Harari  
**Kategori:** Güncel  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:128` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yapay zeka ve iş gücünün geleceği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1480` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Dezenformasyon çağı ve gerçeği bulmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1481` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Meditasyon ve öz tanıma çağı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1482` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — 21 Lessons for the 21st Century: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
5. [ ] **URETILECEK** — Yuval Noah Harari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — 21 Lessons for the 21st Century — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — 21 Lessons for the 21st Century İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — 21 Lessons for the 21st Century — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — 21 Lessons for the 21st Century — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
9. [ ] **URETILECEK** — 21 Lessons for the 21st Century Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — 21 Lessons for the 21st Century — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 129. The Fearless Organization

**Yazar:** Amy Edmondson  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:129` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Columbia uzay mekiği ve sessizlik bedeli — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1483` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Psikolojik güvenlik nedir, ne değildir — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1484` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Lider davranışı ve güvenlik iklimi — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1485` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [x] **DB'DE KAYITLI** — En İyi Ekipler Neden Daha Çok Hata Bildiriyordu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1736` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — The Fearless Organization: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Amy Edmondson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Fearless Organization — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
7. [ ] **URETILECEK** — The Fearless Organization İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
8. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Fearless Organization — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — The Fearless Organization Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Fearless Organization — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 130. Çalınan Dikkat

**Yazar:** Johann Hari  
**Kategori:** Verimlilik  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:130` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Johann Hari'nin telefon deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1486` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dikkat ekonomisi ve dikkat mimarisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1487` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Odaklanmanın gerçek düşmanları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1488` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Stolen Focus: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — Johann Hari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Stolen Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Stolen Focus İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Stolen Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Stolen Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — Stolen Focus Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Stolen Focus — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 131. Bağımlılık Çağı

**Yazar:** Johann Hari  
**Kategori:** Toplum  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:131` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rat Park deneyi — bağımlılığın gerçek nedeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1489` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Uyuşturucu savaşının paradoksu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1490` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Kapitalizm ve bağımlılık ekonomisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1491` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Chasing the Scream: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Johann Hari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Chasing the Scream — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Chasing the Scream İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Chasing the Scream — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Chasing the Scream — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Chasing the Scream Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Chasing the Scream — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 132. Kayıp Bağlantılar

**Yazar:** Johann Hari  
**Kategori:** Psikoloji  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:132` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Depresyonun dokuz nedeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1492` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — İş ve anlam — Londra bankacısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1493` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sosyal bağlantı ve iyileşme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1494` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Lost Connections: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Johann Hari Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Lost Connections — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Lost Connections İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Lost Connections — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Lost Connections — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Lost Connections Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Lost Connections — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 133. Güçlü Yönler Bulma

**Yazar:** Marcus Buckingham  
**Kategori:** Kariyer  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:133` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zayıfları düzeltmek değil güçlüleri geliştirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1495` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Akış anı ve yetenek işareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1496` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Gallup araştırması ve iş tatmini — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1497` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Now Discover Your Strengths: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Marcus Buckingham Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Now Discover Your Strengths — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Now Discover Your Strengths İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Now Discover Your Strengths — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Now Discover Your Strengths — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Now Discover Your Strengths Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Now Discover Your Strengths — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 134. Kabile Liderliği

**Yazar:** Dave Logan  
**Kategori:** Liderlik  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:134` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Beş kabile aşaması — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1498` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Ortak düşman kültürünün tehlikesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1499` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Liderlik ve kültür şekillendirme — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1500` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [ ] **URETILECEK** — Tribal Leadership: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Dave Logan Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Tribal Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
6. [ ] **URETILECEK** — Tribal Leadership İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Tribal Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Tribal Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Tribal Leadership Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Tribal Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 135. Korkudan Öğrenmek

**Yazar:** Gavin de Becker  
**Kategori:** Güvenlik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:135` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sezginin gerçek değeri — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1501` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Gerçek korku ile endişe arasındaki fark — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1502` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Şiddetin öngörülebilirliği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1503` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — The Gift of Fear: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Gavin de Becker Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Gift of Fear — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — The Gift of Fear İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Gift of Fear — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Gift of Fear — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — The Gift of Fear Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Gift of Fear — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 136. Müzakerede Evet Almak

**Yazar:** Roger Fisher  
**Kategori:** Müzakere  
**Yil:** 1981  
**Durum:** DB'DE KAYITLI · `list_no:136` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mevzisel müzakere tuzağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1504` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — BATNA — en iyi alternatif — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1505` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Nesnel kriterler ve meşruiyet — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1506` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Getting to Yes: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Roger Fisher Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Getting to Yes — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Getting to Yes İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Getting to Yes — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Getting to Yes — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Getting to Yes Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Getting to Yes — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 137. Değişim Yönetimi

**Yazar:** John Kotter  
**Kategori:** Yönetim  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:137` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sekiz adım ve hata bir — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1507` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Güçlendirici koalisyon — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1508` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Kısa vadeli kazanımlar ve değişim momentumu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1509` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Leading Change: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — John Kotter Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Leading Change — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Leading Change İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Leading Change — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Leading Change — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Leading Change Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Leading Change — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 138. Pratik Stoacılık

**Yazar:** William Irvine  
**Kategori:** Felsefe  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:138` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Negatif görselleştirme — kaybı hayal etmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1510` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kontrol dışındaki şeylerle barışmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1511` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Stoacı akşam muhasebesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1512` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — A Guide to the Good Life: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — William Irvine Bu Kitabı Yazmaya Hangi Soruyla Başladı? — A Guide to the Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — A Guide to the Good Life İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — A Guide to the Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — A Guide to the Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — A Guide to the Good Life Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — A Guide to the Good Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 139. Yıkıcı İnovasyon

**Yazar:** Clayton Christensen  
**Kategori:** İş Dünyası  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:139` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabit disk sanayisinin dersi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1513` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — İki tür inovasyon — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1514` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kaynak dağıtımı ve strateji icra uçurumu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1515` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Innovator's Dilemma: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Clayton Christensen Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Innovator's Dilemma — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — The Innovator's Dilemma İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Innovator's Dilemma — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Innovator's Dilemma — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — The Innovator's Dilemma Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Innovator's Dilemma — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 140. Müşteri Geliştirme

**Yazar:** Rob Fitzpatrick  
**Kategori:** Girişimcilik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:140` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Anne testi nedir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1516` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Konuşmaların en kötü hataları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1517` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İlerleme belirtisi olarak para — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1518` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Mom Test: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
5. [ ] **URETILECEK** — Rob Fitzpatrick Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Mom Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Mom Test İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Mom Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Mom Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — The Mom Test Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Mom Test — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 141. İç Yolculuk

**Yazar:** Michael A. Singer  
**Kategori:** Farkındalık  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:141` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Evin kiracısı değil sahibi olmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1519` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kalbi açık tutmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1520` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bırakmak ve gerçek özgürlük — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1521` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Untethered Soul: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — Michael A. Singer Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Untethered Soul — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — The Untethered Soul İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Untethered Soul — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Untethered Soul — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
9. [ ] **URETILECEK** — The Untethered Soul Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Untethered Soul — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 142. Az Gitme Yolu

**Yazar:** M. Scott Peck  
**Kategori:** Psikoloji  
**Yil:** 1978  
**Durum:** DB'DE KAYITLI · `list_no:142` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sevgi ve disiplinin birlikte çalışması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1522` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Gerçeği kabul etme cesareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1523` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sorumluluk ve kurban kimliği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1524` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Road Less Traveled: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — M. Scott Peck Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Road Less Traveled — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — The Road Less Traveled İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Road Less Traveled — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Road Less Traveled — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — The Road Less Traveled Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Road Less Traveled — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 143. Parça Parça Yazmak

**Yazar:** Anne Lamott  
**Kategori:** Yazarlık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:143` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Berbat ilk taslak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1525` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bir inç çerçevesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1526` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İçsel eleştirmen ve radyo istasyonları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1527` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Bird by Bird: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
5. [ ] **URETILECEK** — Anne Lamott Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Bird by Bird — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Bird by Bird İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Bird by Bird — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Bird by Bird — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Bird by Bird Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Bird by Bird — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 144. Çevik Yönetim

**Yazar:** Jeff Sutherland  
**Kategori:** Yönetim  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:144` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Scrum'ın doğuşu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1528` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Günlük stand-up ve şeffaflık — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1529` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Tahmin etmek değil ölçmek — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1530` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Scrum: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Jeff Sutherland Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Scrum — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Scrum İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Scrum — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Scrum — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Scrum Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Scrum — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 145. SPIN Satış

**Yazar:** Neil Rackham  
**Kategori:** Satış  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:145` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Büyük satışın küçük satıştan farkı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1531` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dört soru türü ve ihtiyaç keşfi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1532` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Faydaları açıklamanın paradoksu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1533` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — SPIN Selling: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
5. [ ] **URETILECEK** — Neil Rackham Bu Kitabı Yazmaya Hangi Soruyla Başladı? — SPIN Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — SPIN Selling İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — SPIN Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — SPIN Selling — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — SPIN Selling Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — SPIN Selling — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 146. Black Box Thinking

**Yazar:** Matthew Syed  
**Kategori:** Felsefe  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:146` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Havacılıktan öğrenmek — başarı kültürü vs öğrenme kültürü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1534` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bilişsel uyumsuzluk — hatayı kabul edememenin psikolojisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1535` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Marginal kazanımlar — Tour de France'ta bisiklet ekibi devrimi — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1536` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [x] **DB'DE KAYITLI** — Kokpitte Kaptana İtiraz Etmek Neden Bir Güvenlik Kuralına Dönüştü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1732` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Black Box Thinking: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Matthew Syed Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Black Box Thinking — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
7. [ ] **URETILECEK** — Black Box Thinking İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Black Box Thinking — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Black Box Thinking Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Black Box Thinking — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 147. Sıçramak

**Yazar:** Matthew Syed  
**Kategori:** Başarı  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:147` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 10.000 saat efsanesi ve Anders Ericsson'un gerçek bulgusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1537` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Tenis prodigisi ve fırsat ortamının gizli rolü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1538` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Placebo etkisi ve zihnin performans üzerindeki gücü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1539` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Bounce: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Matthew Syed Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Bounce — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Bounce İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Bounce — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Bounce — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — Bounce Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Bounce — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 148. Peçete Arkası

**Yazar:** Dan Roam  
**Kategori:** Yaratıcılık  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:148` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her problem görsel düşünceyle çözülebilir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1540` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — SQVID çerçevesi — doğru görseli seçmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1541` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Napkin'de doğan fikirler — büyük kararların basit başlangıçları — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1542` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — The Back of the Napkin: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
5. [ ] **URETILECEK** — Dan Roam Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Back of the Napkin — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — The Back of the Napkin İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Back of the Napkin — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Back of the Napkin — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — The Back of the Napkin Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Back of the Napkin — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 149. Evet Dedirtmek

**Yazar:** Noah Goldstein  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:149` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sosyal kanıt — otelin havlu deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1543` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Taahhüt ve tutarlılık — küçük evet büyük evete zemin hazırlar — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1544` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Kıtlık ve kayıp korkusu — kazanmak değil kaybetmemek motive eder — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1545` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Yes!: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Noah Goldstein Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Yes! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Yes! İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Yes! — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Yes! — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
9. [ ] **URETILECEK** — Yes! Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Yes! — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 150. İkinci Makine Çağı

**Yazar:** Erik Brynjolfsson  
**Kategori:** Teknoloji  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:150` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Satranç makinesi ve insan-makine işbirliği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1546` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Moore Yasası ve bileşik büyümenin kavranmayan gücü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1547` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Beyin sermayesi çağı — idealar maddi kaynaklardan daha değerli — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1548` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — The Second Machine Age: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Erik Brynjolfsson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Second Machine Age — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — The Second Machine Age İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Second Machine Age — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Second Machine Age — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Second Machine Age Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Second Machine Age — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 151. Ölçülebilir Büyüme

**Yazar:** Gino Wickman  
**Kategori:** Yönetim  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:151` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vizyonun kağıtta kalması — EOS neden işletmeleri kurtarıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1549` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Doğru kişi, doğru yer — GWC testi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1550` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Haftalık L10 toplantısı — kaosun ritme dönüşmesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1551` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Traction: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Gino Wickman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Traction — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Traction İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Traction — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Traction — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Traction Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Traction — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 152. The Five Dysfunctions of a Team

**Yazar:** Patrick Lencioni  
**Kategori:** Liderlik  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:152` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Güven eksikliği — kırılganlık temelli güven neden her şeyin temelidir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1552` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Sahte uyum tuzağı — çatışmadan kaçmak neden ekibi yavaşlatır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1553` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Sonuçlara odaklanma — ego mu yoksa ekip mi kazansın — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1554` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
4. [x] **DB'DE KAYITLI** — Lencioni Neden Takım Sorununu Strateji Değil Güven Diye Okudu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1735` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Patrick Lencioni Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Five Dysfunctions of a Team — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — The Five Dysfunctions of a Team İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Five Dysfunctions of a Team — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Five Dysfunctions of a Team — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — The Five Dysfunctions of a Team Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Five Dysfunctions of a Team — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 153. İş Modeli Üretimi

**Yazar:** Alexander Osterwalder  
**Kategori:** Girişimcilik  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:153` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Business Model Canvas — bir sayfada tüm iş modeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1555` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ücretsiz iş modeli — Google nasıl bedavaya milyarlar kazanıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1556` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İş modeli inovasyonu — rakibi taklit etmek değil yeniden tasarlamak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1557` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Business Model Generation: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Alexander Osterwalder Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Business Model Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Business Model Generation İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Business Model Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Business Model Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Business Model Generation Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Business Model Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 154. Radikal Kabul

**Yazar:** Tara Brach  
**Kategori:** Farkındalık  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:154` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Acıyı ikiye katlamak — birincil ve ikincil acı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1558` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Yetersizlik trансı — 'bir şeyler yanlış' hissinin kökenine inmek — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1559` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — RAIN pratiği — zor duyguları eritmek için dört adım — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1560` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Radical Acceptance: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Tara Brach Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Radical Acceptance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Radical Acceptance İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Radical Acceptance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Radical Acceptance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Radical Acceptance Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Radical Acceptance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 155. Farkındalık Temelli Yaşam

**Yazar:** Jon Kabat-Zinn  
**Kategori:** Sağlık  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:155` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jon Kabat-Zinn'in hastanesi — MBSR'nin doğuşu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1561` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Otomatik pilot — zihnin nerede olduğundan habersiz yaşamak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1562` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Tam felaket — zorluğu kucaklamak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1563` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Full Catastrophe Living: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
5. [ ] **URETILECEK** — Jon Kabat-Zinn Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Full Catastrophe Living — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
6. [ ] **URETILECEK** — Full Catastrophe Living İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Full Catastrophe Living — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Full Catastrophe Living — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Full Catastrophe Living Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Full Catastrophe Living — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 156. Bilinçli Liderlik

**Yazar:** Jim Dethmer  
**Kategori:** Liderlik  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:156` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çizginin altında ya da üstünde — iki liderlik hali — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1564` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
2. [x] **DB'DE KAYITLI** — Yüzde yüz sorumluluk — suçu dışarıda aramayı bırakmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1565` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Duyguları veri olarak kullanmak — bastırmak değil okumak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1566` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Conscious Leadership: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — Jim Dethmer Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Conscious Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
6. [ ] **URETILECEK** — Conscious Leadership İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Conscious Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Conscious Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
9. [ ] **URETILECEK** — Conscious Leadership Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Conscious Leadership — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## 157. Yetenek Kodu

**Yazar:** Daniel Coyle  
**Kategori:** Başarı  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:157` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Miyelin — yeteneklerin biyolojik temeli — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1567` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Tutuşma anı — motivasyonun kimliğe dönüştüğü an — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1568` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Yetenek yuvaları — neden bazı küçük yerler büyük yetenkler üretiyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1569` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Talent Code: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
5. [ ] **URETILECEK** — Daniel Coyle Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Talent Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — The Talent Code İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Talent Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Talent Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — The Talent Code Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Talent Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 158. Kültür Kodu

**Yazar:** Daniel Coyle  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:158` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Güvenlik sinyalleri — beyin kültürü nasıl okuyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1570` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kırılganlığın döngüsü — zayıflık göstermek gücü artırır — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1571` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Ortak amaç — 'neden' sorusu kültürü bir arada tutar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1572` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Culture Code: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Daniel Coyle Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Culture Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — The Culture Code İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Culture Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Culture Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Culture Code Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Culture Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 159. Hataları Kucaklamak

**Yazar:** Carol Tavris  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:159` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Öz meşrulaştırma — zihin nasıl kendini korur — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1573` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bellek yanılsaması — hatırladıklarımız ne kadar gerçek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1574` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Piramit kararları — küçük adımlarla büyük yanlışlara doğru kayış — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1575` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Mistakes Were Made But Not by Me: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Carol Tavris Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Mistakes Were Made But Not by Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
6. [ ] **URETILECEK** — Mistakes Were Made But Not by Me İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Mistakes Were Made But Not by Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Mistakes Were Made But Not by Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — Mistakes Were Made But Not by Me Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Mistakes Were Made But Not by Me — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 160. İşte Anlam

**Yazar:** Daniel Pink  
**Kategori:** Motivasyon  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:160` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ödül paradoksu — para motivasyonu öldürebilir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1576` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Özerklik — kontrol etmek değil yönlendirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1577` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Amaç — para ve statünün ötesindeki üçüncü katman — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1578` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Drive: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
5. [ ] **URETILECEK** — Daniel Pink Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Drive — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Drive İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Drive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Drive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
9. [ ] **URETILECEK** — Drive Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Drive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100

## 161. Satışın Yeni Yüzü

**Yazar:** Daniel Pink  
**Kategori:** Satış  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:161` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hepimiz satıcıyız — satış mesleğinin yeniden tanımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1579` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kafa kafaya bilgi — asimetrik bilginin ortadan kalkması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1580` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Geri çekilme hakkı — en güçlü satış cümlesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1581` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — To Sell Is Human: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Daniel Pink Bu Kitabı Yazmaya Hangi Soruyla Başladı? — To Sell Is Human — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — To Sell Is Human İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — To Sell Is Human — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — To Sell Is Human — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — To Sell Is Human Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — To Sell Is Human — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 162. Bütün Beyin

**Yazar:** Daniel Pink  
**Kategori:** Yaratıcılık  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:162` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sol beyin çağının sonu — sağ beynin yükselişi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1582` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Tasarım — işlevselliğin ötesinde anlam yaratmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1583` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Anlam — para ve statünün ötesindeki arayış — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1584` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — A Whole New Mind: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
5. [ ] **URETILECEK** — Daniel Pink Bu Kitabı Yazmaya Hangi Soruyla Başladı? — A Whole New Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — A Whole New Mind İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — A Whole New Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — A Whole New Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — A Whole New Mind Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — A Whole New Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 163. Sirkadyen Kod

**Yazar:** Satchin Panda  
**Kategori:** Sağlık  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:163` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İç saat — vücudun 24 saatlik ritmi ve sağlık üzerindeki derin etkisi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1585` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Zaman kısıtlı beslenme — sadece yeme penceresini daraltmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1586` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Işık ve uyku — ekranların biyolojik bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1587` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Circadian Code: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Satchin Panda Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Circadian Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — The Circadian Code İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Circadian Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Circadian Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — The Circadian Code Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Circadian Code — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 164. Uzun Yaşam Bilimi

**Yazar:** David Sinclair  
**Kategori:** Sağlık  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:164` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yaşlanma bir hastalıktır — ve tedavi edilebilir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1588` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hayatta kalma genleri — stres biyolojik saati nasıl yavaşlatıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1589` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — mTOR ve AMPK — hücrenin büyüme-onarım dengesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1590` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Lifespan: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — David Sinclair Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Lifespan — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Lifespan İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Lifespan — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Lifespan — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
9. [ ] **URETILECEK** — Lifespan Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Lifespan — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 165. Uzun Ömür

**Yazar:** Peter Attia  
**Kategori:** Sağlık  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:165` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Healthspan — uzun yaşamak değil iyi yaşamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1591` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dört süvari — kronik hastalıkların ortak kökeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1592` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Egzersiz — tek ilaç gibi çalışan tek değişken — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1593` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Outlive: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Peter Attia Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Outlive — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Outlive İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Outlive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Outlive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Outlive Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Outlive — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 166. Beyin ve Diyet

**Yazar:** David Perlmutter  
**Kategori:** Sağlık  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:166` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Gluten ve beyin — beklenmedik bağlantı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1594` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Karbonhidrat ve kolesterol — tersine dönen paradigma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1595` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — BDNF — beyni büyüten molekül ve onu artırmanın yolları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1596` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Grain Brain: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
5. [ ] **URETILECEK** — David Perlmutter Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Grain Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Grain Brain İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Grain Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Grain Brain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Grain Brain Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Grain Brain — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 167. İyi Bağırsak

**Yazar:** Justin Sonnenburg  
**Kategori:** Sağlık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:167` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mikrobiyom — içimizdeki gizli organ — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1597` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beyin-bağırsak aksı — duygu ve mikrop bağlantısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1598` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Lif — mikrobiyomun birincil yakıtı ve modern diyetin en büyük eksikliği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1599` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — The Good Gut: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 94/100
5. [ ] **URETILECEK** — Justin Sonnenburg Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Good Gut — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — The Good Gut İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Good Gut — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Good Gut — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — The Good Gut Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Good Gut — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 168. Nefes

**Yazar:** James Nestor  
**Kategori:** Sağlık  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:168` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yanlış nefes almak — sessiz salgın — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1600` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Dakikada beş nefes — kalp ritmi ve sinir sistemi uyumu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1601` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — CO2 toleransı — oksijen değil karbondioksit kontrolü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1602` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Breath: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — James Nestor Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Breath — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Breath İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Breath — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Breath — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
9. [ ] **URETILECEK** — Breath Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Breath — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100

## 169. Soğuk Yöntem

**Yazar:** Wim Hof  
**Kategori:** Sağlık  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:169` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Wim Hof'un dağı — imkansız olduğu söylenenin kanıtı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1603` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Soğuk duş ve buz banyosu — stresin ters çevrilmesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1604` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Wim Hof nefes tekniği — kontrollü hiperventilasyon ve tutma — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1605` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — The Wim Hof Method: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Wim Hof Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Wim Hof Method — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — The Wim Hof Method İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Wim Hof Method — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Wim Hof Method — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — The Wim Hof Method Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Wim Hof Method — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 170. Zengin Olmayı Öğrenmek

**Yazar:** Ramit Sethi  
**Kategori:** Finans  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:170` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Otomatik sistem — para kararlarını irade dışına taşımak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1606` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Büyük kazançlara odaklanmak — latte faktörünün yanlışı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1607` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Zengin hayat tasarımı — paranın araç olduğunu hatırlamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1608` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — I Will Teach You to Be Rich: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Ramit Sethi Bu Kitabı Yazmaya Hangi Soruyla Başladı? — I Will Teach You to Be Rich — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
6. [ ] **URETILECEK** — I Will Teach You to Be Rich İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — I Will Teach You to Be Rich — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — I Will Teach You to Be Rich — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — I Will Teach You to Be Rich Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — I Will Teach You to Be Rich — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 171. Mantıklı Borsa

**Yazar:** John Bogle  
**Kategori:** Finans  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:171` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Maliyet paradoksu — daha fazla ödemek daha az kazandırır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1609` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Haystack'i satın al — tüm samanlığı almak neden kazandırır — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1610` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Piyasa zamanlaması yanılgısı — içeride kalmak neden her şeyden önemli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1611` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Little Book of Common Sense Investing: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — John Bogle Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Little Book of Common Sense Investing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — The Little Book of Common Sense Investing İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Little Book of Common Sense Investing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Little Book of Common Sense Investing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — The Little Book of Common Sense Investing Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Little Book of Common Sense Investing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 172. Komşu Milyoner

**Yazar:** Thomas Stanley  
**Kategori:** Finans  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:172` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zengin görünmek ile zengin olmak — sessiz servetin sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1612` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ekonomik giden rüzgar — aile desteğinin gizli bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1613` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Zaman, enerji, para — milyonerlerin gerçek yatırımı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1614` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Millionaire Next Door: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Thomas Stanley Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Millionaire Next Door — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — The Millionaire Next Door İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Millionaire Next Door — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Millionaire Next Door — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — The Millionaire Next Door Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Millionaire Next Door — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 173. Borç Devrimi

**Yazar:** Dave Ramsey  
**Kategori:** Finans  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:173` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çığlık atan bebek ve kar topu — borcun psikolojik savaşı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1615` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Acil durum fonu — beklenmedik olanı beklemek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1616` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bütçe — paranın patronu olmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1617` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Total Money Makeover: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Dave Ramsey Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Total Money Makeover — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — The Total Money Makeover İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Total Money Makeover — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Total Money Makeover — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
9. [ ] **URETILECEK** — The Total Money Makeover Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Total Money Makeover — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 174. İlişki Psikolojisi

**Yazar:** Sue Johnson  
**Kategori:** İlişkiler  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:174` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Duygusal bağ — yetişkin bağlanmasının temel ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1618` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Şeytan döngüsü — saldır ve çekil sarmalı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1619` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hold me tight anı — yeniden bağlanmanın kapısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1620` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Hold Me Tight: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
5. [ ] **URETILECEK** — Sue Johnson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Hold Me Tight — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Hold Me Tight İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Hold Me Tight — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Hold Me Tight — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Hold Me Tight Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Hold Me Tight — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 175. Bağlanma Teorisi

**Yazar:** Amir Levine  
**Kategori:** İlişkiler  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:175` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üç bağlanma stili — güvenli, kaygılı, kaçıngan — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1621` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kaçıngan paradoksu — yakınlık isteyen ama uzaklaşan — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1622` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kaygılı-kaçıngan tuzağı — zıt stiller neden birbirini çeker — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1623` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Attached: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Amir Levine Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Attached — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
6. [ ] **URETILECEK** — Attached İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Attached — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Attached — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
9. [ ] **URETILECEK** — Attached Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Attached — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 176. Duygusal Olgunlaşmamış Ebeveynler

**Yazar:** Lindsay Gibson  
**Kategori:** Psikoloji  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:176` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Duygusal olgunlaşmamış ebeveyn — sevgi var ama bağ yok — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1624` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Rolü tersine çevirmek — ebeveynin çocuğu olan çocuk — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1625` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yeniden ebeveynlik — kendini iyileştirmenin yolu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1626` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Adult Children of Emotionally Immature Parents: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Lindsay Gibson Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Adult Children of Emotionally Immature Parents — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Adult Children of Emotionally Immature Parents İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Adult Children of Emotionally Immature Parents — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Adult Children of Emotionally Immature Parents — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Adult Children of Emotionally Immature Parents Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Adult Children of Emotionally Immature Parents — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 177. Travma ve İyileşme

**Yazar:** Judith Herman  
**Kategori:** Psikoloji  
**Yil:** 1992  
**Durum:** DB'DE KAYITLI · `list_no:177` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Travmanın dili — sözsüz yaranın kökeni — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1627` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Güç ve bağ — iyileşmenin iki ayağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1628` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Toplumsal travma — sessizliğin suç ortaklığı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1629` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
4. [ ] **URETILECEK** — Trauma and Recovery: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Judith Herman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Trauma and Recovery — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Trauma and Recovery İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Trauma and Recovery — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Trauma and Recovery — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Trauma and Recovery Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Trauma and Recovery — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 178. Bedenin Hayır Demesi

**Yazar:** Gabor Maté  
**Kategori:** Sağlık  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:178` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bastırılan duygu, beden dili — hastalık mesajın taşıyıcısı — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1630` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Stres ve bağışıklık — neden duygular fizyoloji değiştirir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1631` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Şefkatli sınır — iyileşmenin pratik kapısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1632` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — When the Body Says No: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Gabor Maté Bu Kitabı Yazmaya Hangi Soruyla Başladı? — When the Body Says No — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — When the Body Says No İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — When the Body Says No — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — When the Body Says No — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — When the Body Says No Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — When the Body Says No — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 179. Dağınık Beyin

**Yazar:** Gabor Maté  
**Kategori:** Psikoloji  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:179` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — DEHB bir bozukluk değil — uyumsuzluk — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1633` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dopamin ve anlam — DEHB beyninin gerçek ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1634` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Utanç sarmalı — DEHB ve kimlik yarası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1635` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Scattered Minds: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
5. [ ] **URETILECEK** — Gabor Maté Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Scattered Minds — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Scattered Minds İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Scattered Minds — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Scattered Minds — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Scattered Minds Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Scattered Minds — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 180. Her Şey Gerçek Olabilir

**Yazar:** Gabor Maté  
**Kategori:** Bağımlılık  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:180` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bağımlılık bir seçim değil — acının dili — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1636` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Toksik toplum — bağımlılığı besleyen sistem — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1637` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Şefkatin nörobilimi — bağlantı bağımlılığın panzehiri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1638` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — In the Realm of Hungry Ghosts: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Gabor Maté Bu Kitabı Yazmaya Hangi Soruyla Başladı? — In the Realm of Hungry Ghosts — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — In the Realm of Hungry Ghosts İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — In the Realm of Hungry Ghosts — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — In the Realm of Hungry Ghosts — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — In the Realm of Hungry Ghosts Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — In the Realm of Hungry Ghosts — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 181. Özgür Olmak 2

**Yazar:** Brené Brown  
**Kategori:** Kişisel Gelişim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:181` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yeterince iyi olmak — mükemmeliyetçiliğin gerçek bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1639` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Utanç ve suçluluk — birbirinden çok farklı iki his — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1640` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Minnettarlık ve neşe — en cesur duygular — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1641` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Gifts of Imperfection: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 94/100
5. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Gifts of Imperfection — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — The Gifts of Imperfection İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Gifts of Imperfection — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Gifts of Imperfection — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Gifts of Imperfection Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Gifts of Imperfection — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 182. Güçlü Kalkmak

**Yazar:** Brené Brown  
**Kategori:** Dayanıklılık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:182` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Arenada olmak — düşme cesareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1642` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Hikaye tamamlama — beyin boşluğu nasıl dolduruyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1643` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Devrilme ve kalkış — iyileşmenin üç aşaması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1644` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Rising Strong: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Rising Strong — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 93/100
6. [ ] **URETILECEK** — Rising Strong İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Rising Strong — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Rising Strong — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Rising Strong Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Rising Strong — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 183. Çölde Yürümek

**Yazar:** Brené Brown  
**Kategori:** Topluluk  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:183` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Gerçek aitlik — onay için değil özgünlük için — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1645` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kutup yıldızı değerleri — kalabalığa rağmen yolunu bulmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1646` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Ortak ağrı — yalnızlığı aşmanın beklenmedik yolu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1647` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Braving the Wilderness: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Braving the Wilderness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Braving the Wilderness İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Braving the Wilderness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Braving the Wilderness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Braving the Wilderness Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Braving the Wilderness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 184. Kalbin Haritası

**Yazar:** Brené Brown  
**Kategori:** Duygular  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:184` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Duygu dili — adlandıramadığınızı yönetemezsiniz — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1648` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kıskançlık ve haset — sık karıştırılan iki ayrı yara — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1649` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kin ve öfke — taşınan ağırlıkların farkı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1650` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Atlas of the Heart: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Brené Brown Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Atlas of the Heart — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Atlas of the Heart İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Atlas of the Heart — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Atlas of the Heart — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Atlas of the Heart Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Atlas of the Heart — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 185. Akış Bulmak

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Psikoloji  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:185` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Akış deneyimi — zamanın eridiği bilinç hali — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1651` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Günlük hayatta akış — sıradan anların dönüşümü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1652` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yaşam kalitesi ve akış — mutluluğun yanlış aranması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1653` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Finding Flow: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
5. [ ] **URETILECEK** — Mihaly Csikszentmihalyi Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Finding Flow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
6. [ ] **URETILECEK** — Finding Flow İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Finding Flow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Finding Flow — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Finding Flow Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Finding Flow — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## 186. Yaratıcılık ve Akış

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Yaratıcılık  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:186` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yaratıcı kişilik — paradoksların insanı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1654` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Yaratıcı süreç — hazırlık, kuluçka ve aydınlanma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1655` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Alanın kapıcıları — yaratıcılığın sosyal boyutu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1656` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Creativity: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
5. [ ] **URETILECEK** — Mihaly Csikszentmihalyi Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Creativity — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Creativity İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Creativity — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Creativity — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Creativity Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Creativity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 187. İçgüdüsel Yeme

**Yazar:** Evelyn Tribole  
**Kategori:** Sağlık  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:187` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Diyet kültürünün reddi — besinleri ahlaki kategoriden çıkarmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1657` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Açlık ve tokluk — beden sinyallerine yeniden bağlanmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1658` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Duygusal yeme — besinden beklenen şey besin veremez — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1659` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Intuitive Eating: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Evelyn Tribole Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Intuitive Eating — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Intuitive Eating İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Intuitive Eating — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Intuitive Eating — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Intuitive Eating Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Intuitive Eating — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 188. Yeniden Doğmak

**Yazar:** David Brooks  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:188` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki dağ — birinci ve ikinci hayat — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1660` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Taahhüt kültürü — seçenekler çağında derinliği bulmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1661` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Karakter ahlakı — erdemi yeniden keşfetmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1662` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — The Second Mountain: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — David Brooks Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Second Mountain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — The Second Mountain İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Second Mountain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Second Mountain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — The Second Mountain Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Second Mountain — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 189. Yeni Toprak

**Yazar:** Eckhart Tolle  
**Kategori:** Farkındalık  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:189` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ego ve öz — kimlik yanılsamasının kökü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1663` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Acı bedeni — geçmişin duygusal tortusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1664` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Şimdiki an — tek gerçek ev — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1665` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — A New Earth: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Eckhart Tolle Bu Kitabı Yazmaya Hangi Soruyla Başladı? — A New Earth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — A New Earth İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — A New Earth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — A New Earth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — A New Earth Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — A New Earth — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 190. İçsel Barış

**Yazar:** Thich Nhat Hanh  
**Kategori:** Farkındalık  
**Yil:** 1991  
**Durum:** DB'DE KAYITLI · `list_no:190` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her adım bir dua — yürürken farkındalık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1666` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öfkeli bir mektup göndermemek — duyguya alan tanımak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1667` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İnterbeing — her şeyin birbirine bağlılığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1668` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Peace Is Every Step: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Thich Nhat Hanh Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Peace Is Every Step — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Peace Is Every Step İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Peace Is Every Step — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Peace Is Every Step — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Peace Is Every Step Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Peace Is Every Step — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 191. Öfke

**Yazar:** Thich Nhat Hanh  
**Kategori:** Psikoloji  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:191` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Öfkeyi pişirmek — soğutma değil dönüştürme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1669` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öfkeli bebeği taşımak — şefkatli bakım pratiği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1670` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bağlantısı kesilen bir zihin — öfkenin gerçek kaynağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1671` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Anger: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
5. [ ] **URETILECEK** — Thich Nhat Hanh Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Anger — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Anger İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Anger — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Anger — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
9. [ ] **URETILECEK** — Anger Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Anger — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 192. Konsantrasyon Gücü

**Yazar:** CNewport  
**Kategori:** Verimlilik  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:192` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Derin çalışma — yüzeysel çalışmanın antitezi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1672` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dikkat artığı — taşınan zihin maliyeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1673` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Derin çalışma ritüelleri — kapasitenin kasıtlı inşası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1674` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Deep Focus: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
5. [ ] **URETILECEK** — CNewport Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Deep Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Deep Focus İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Deep Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Deep Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — Deep Focus Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Deep Focus — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 193. Başarılı Değişim

**Yazar:** James Clear  
**Kategori:** Yönetim  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:193` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kimlik temelli alışkanlıklar — ben bu tür biriyim — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1675` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — İki dakika kuralı — başlamak bitirmekten önemlidir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1676` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Yüzde bir daha iyi — bileşik büyümenin alışkanlık versiyonu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1677` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Atomic Habits for Teams: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — James Clear Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Atomic Habits for Teams — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Atomic Habits for Teams İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Atomic Habits for Teams — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Atomic Habits for Teams — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Atomic Habits for Teams Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Atomic Habits for Teams — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 194. Yeni Başlayanlar İçin Meditasyon

**Yazar:** Andy Puddicombe  
**Kategori:** Farkındalık  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:194` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Meditasyon yanılgısı — zihnin boşalması değil farkındalık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1678` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — On dakika — küçük bir pratiğin büyük dönüşümü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1679` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — The Headspace Guide to Meditation: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
4. [ ] **URETILECEK** — Andy Puddicombe Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Headspace Guide to Meditation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — The Headspace Guide to Meditation İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Headspace Guide to Meditation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Headspace Guide to Meditation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — The Headspace Guide to Meditation Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Headspace Guide to Meditation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Headspace Guide to Meditation — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100

## 195. Meditasyonla İyileşme

**Yazar:** Robert Wright  
**Kategori:** Farkındalık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:195` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Evrimsel beyin ve aldatmaca — neden zihin her zaman yanlış hissedebilir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1680` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [ ] **URETILECEK** — Why Buddhism Is True: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
3. [ ] **URETILECEK** — Robert Wright Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
4. [ ] **URETILECEK** — Why Buddhism Is True İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
5. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Why Buddhism Is True Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
8. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Why Buddhism Is True — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
10. [ ] **URETILECEK** — Bugün Hâlâ Geçerli Olan Tarihsel Ders — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 196. The Shallows

**Yazar:** Nicholas Carr  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:196` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İnternet ve derin okuma — kaybedilen bir beceri — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1681` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Hafıza ve Google etkisi — bilgiyi saklamaktan aramaya geçiş — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1682` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Nicholas Carr Neden Bir Kitabı Bitiremez Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1717` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — The Shallows: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — The Shallows İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Shallows — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Shallows — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — The Shallows Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Shallows — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Shallows — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100

## 197. Dikkatin Gücü

**Yazar:** Daniel Goleman  
**Kategori:** Verimlilik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:197` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üç odak türü — iç, dış ve sistem odağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1683` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dikkat eğitimi — beyin kası olarak odak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1684` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Focus: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
4. [ ] **URETILECEK** — Daniel Goleman Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
5. [ ] **URETILECEK** — Focus İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Focus — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Focus — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Focus Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Focus — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Focus — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 198. Duygusal Çeviklik

**Yazar:** Susan David  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:198` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Düşünce kancaları — zihni ele geçiren hikayeler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1685` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Değerlere dayalı eylem — duygu değil değer rehberlik eder — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1686` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [ ] **URETILECEK** — Emotional Agility: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 93/100
4. [ ] **URETILECEK** — Susan David Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Emotional Agility — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
5. [ ] **URETILECEK** — Emotional Agility İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Emotional Agility — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Emotional Agility — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Emotional Agility Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Emotional Agility — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — Emotional Agility — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100

## 199. Psikolojik Esneklik

**Yazar:** Russ Harris  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:199` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mutluluk tuzağı — daha iyi hissetmeye çalışmak neden işe yaramıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1687` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bilişsel ayrışma — düşüncelerden mesafe almanın ACT yöntemi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1688` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [ ] **URETILECEK** — The Happiness Trap: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
4. [ ] **URETILECEK** — Russ Harris Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Happiness Trap — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — The Happiness Trap İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
6. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Happiness Trap — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
7. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — The Happiness Trap — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — The Happiness Trap Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
9. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — The Happiness Trap — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Bir Ekibin Kriz Anında Verdiği Kritik Karar — The Happiness Trap — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100

## 200. Bütünleşik Zekanın Gücü

**Yazar:** Travis Bradberry  
**Kategori:** Psikoloji  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:200` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — EQ neden IQ'dan daha belirleyici — başarının gizli faktörü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1689` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öz farkındalık — duygusal zekanın temeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1690` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İlişki yönetimi — bağlantı kurmak bir beceridir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1691` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
4. [ ] **URETILECEK** — Emotional Intelligence 2.0: Yazarın Fikrini Değiştiren Kırılma Anı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Travis Bradberry Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Emotional Intelligence 2.0 — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Emotional Intelligence 2.0 İçindeki En Şaşırtıcı Gerçek Hayat Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — Emotional Intelligence 2.0 — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Başarısız Görünen Bir Denemenin Gizli Kazancı — Emotional Intelligence 2.0 — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Emotional Intelligence 2.0 Fikrini Gerçek Hayatta Sınayan Vaka — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Yaygın Bir İnanışı Tersine Çeviren Bulgu — Emotional Intelligence 2.0 — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 201. Rakipler Takımı

**Yazar:** Doris Kearns Goodwin  
**Kategori:** Tarih  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:201` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Lincoln Neden Rakiplerini Kabinesine Aldı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1692` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Team of Rivals — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
3. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Team of Rivals — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Team of Rivals — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
5. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Team of Rivals — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
6. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Team of Rivals — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
7. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Team of Rivals — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Team of Rivals — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Team of Rivals — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Team of Rivals — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 202. Endurance

**Yazar:** Alfred Lansing  
**Kategori:** Tarih  
**Yil:** 1959  
**Durum:** DB'DE KAYITLI · `list_no:202` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Shackleton'ın 800 Millik Kurtuluş Yolculuğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1693` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Endurance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
3. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Endurance — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
4. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Endurance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Endurance — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
6. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Endurance — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Endurance — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Endurance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Endurance — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Endurance — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 203. Seabiscuit

**Yazar:** Laura Hillenbrand  
**Kategori:** Tarih  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:203` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Seabiscuit Büyük Buhran'a Nasıl Umut Oldu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1694` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Seabiscuit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
3. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Seabiscuit — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
4. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Seabiscuit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
5. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Seabiscuit — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Seabiscuit — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
7. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Seabiscuit — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Seabiscuit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Seabiscuit — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Seabiscuit — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 204. Midnight in Chernobyl

**Yazar:** Adam Higginbotham  
**Kategori:** Tarih  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:204` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çernobil Gecesi Kontrol Odasında Ne Oldu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1695` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Midnight in Chernobyl — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
3. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Midnight in Chernobyl — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
4. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Midnight in Chernobyl — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Midnight in Chernobyl — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
6. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Midnight in Chernobyl — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
7. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Midnight in Chernobyl — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Midnight in Chernobyl — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Midnight in Chernobyl — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Midnight in Chernobyl — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 205. Predictably Irrational

**Yazar:** Dan Ariely  
**Kategori:** Psikoloji  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:205` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bedavanın Gizli Maliyeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1696` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — Predictably Irrational — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
3. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Predictably Irrational — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Predictably Irrational — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Predictably Irrational — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 206. The Power of Regret

**Yazar:** Daniel H. Pink  
**Kategori:** Psikoloji  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:206` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bronz Madalya Kazananlar Neden Daha Mutlu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1697` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Power of Regret — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
3. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Power of Regret — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Power of Regret — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Power of Regret — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 207. Steve Jobs

**Yazar:** Walter Isaacson  
**Kategori:** Liderlik  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:207` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Steve Jobs'ın Kaligrafi Dersi Mac'i Nasıl Değiştirdi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1698` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Steve Jobs — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
3. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Steve Jobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
4. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Steve Jobs — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
5. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Steve Jobs — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
6. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Steve Jobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
7. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Steve Jobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Steve Jobs — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
9. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Steve Jobs — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Steve Jobs — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100

## 208. The Founders

**Yazar:** Jimmy Soni  
**Kategori:** Liderlik  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:208` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — PayPal'ın Rakip Kurucuları Nasıl Takım Oldu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1699` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — The Founders — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — The Founders — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
4. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — The Founders — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — The Founders — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — The Founders — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — The Founders — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
8. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — The Founders — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — The Founders — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
10. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — The Founders — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 209. A Random Walk Down Wall Street

**Yazar:** Burton G. Malkiel  
**Kategori:** Finans  
**Yil:** 1973  
**Durum:** DB'DE KAYITLI · `list_no:209` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rastgele Yürüyen Bir Piyasa Yenilebilir mi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1700` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — A Random Walk Down Wall Street — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — A Random Walk Down Wall Street — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — A Random Walk Down Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 210. The Checklist Manifesto

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:210` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Basit Bir Kontrol Listesi Kaç Hayat Kurtarabilir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1701` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — The Checklist Manifesto — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — The Checklist Manifesto — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — The Checklist Manifesto — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 211. The Comfort Crisis

**Yazar:** Michael Easter  
**Kategori:** Sağlık  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:211` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Konfor Alanı Bedenimizi Nasıl Zayıflatıyor? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1702` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — The Comfort Crisis — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — The Comfort Crisis — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — The Comfort Crisis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 212. The Boys in the Boat

**Yazar:** Daniel James Brown  
**Kategori:** Tarih  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:212` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dokuz İşçi Sınıfı Genci Berlin’de Tarihe Nasıl Dokundu? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1710` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Dokuz Kürekçi Hitler'in Olimpiyatlarında — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Boys in the Boat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Boys in the Boat — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Boys in the Boat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Boys in the Boat — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Boys in the Boat — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Boys in the Boat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Boys in the Boat — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Boys in the Boat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 213. The Simple Path to Wealth

**Yazar:** J. L. Collins  
**Kategori:** Finans  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:213` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1711` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Finansal Özgürlüğün Tek Yolluk Formülü — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
3. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
4. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
5. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
7. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — The Simple Path to Wealth — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — The Simple Path to Wealth — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — The Simple Path to Wealth — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 214. The Republic

**Yazar:** Plato  
**Kategori:** Felsefe  
**Yil:** c. 375 BCE  
**Durum:** DB'DE KAYITLI · `list_no:214` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Platon’a Göre İktidarı En Çok Kim Hak Eder? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1712` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Platon'un Mağarasından Kim Çıkmak İster? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
3. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — The Republic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — The Republic — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
5. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — The Republic — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
6. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — The Republic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — The Republic — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
8. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — The Republic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — The Republic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — The Republic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 215. Rubicon

**Yazar:** Tom Holland  
**Kategori:** Tarih  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:215` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sezar Rubicon’u Geçtiğinde Neden Geri Dönüş Yoktu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1718` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Sezar Rubicon'u Geçtiğinde — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Rubicon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
4. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Rubicon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Rubicon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Rubicon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100
7. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Rubicon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Rubicon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Rubicon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Rubicon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 216. A Short History of Nearly Everything

**Yazar:** Bill Bryson  
**Kategori:** Bilim  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:216` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kıtalar Bir Yapboz Gibi Uyuşuyorsa Tesadüf müydü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1721` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bilimin En Büyük Sorularını Sorabilmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — A Short History of Nearly Everything — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — A Short History of Nearly Everything — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — A Short History of Nearly Everything — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — A Short History of Nearly Everything — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — A Short History of Nearly Everything — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — A Short History of Nearly Everything — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — A Short History of Nearly Everything — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
10. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — A Short History of Nearly Everything — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 217. Chatter

**Yazar:** Ethan Kross  
**Kategori:** Psikoloji  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:217` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kendi Adını Söylemek Stresi Nasıl Azaltabilir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1716` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kafamızdaki Ses Ne Zaman Düşmana Dönüşür? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Chatter — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## 218. Creativity, Inc.

**Yazar:** Ed Catmull ve Amy Wallace  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:218` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Pixar’da Bir Filmi Kurtaran Toplantının Patronu Yoktu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1722` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Pixar'ın Filmleri Kurtaran Beyin Takımı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Creativity, Inc. — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Creativity, Inc. — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Creativity, Inc. — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Creativity, Inc. — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Creativity, Inc. — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Creativity, Inc. — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Creativity, Inc. — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Creativity, Inc. — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 219. Complications

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:219` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uykusuz Bir Cerrah Ne Zaman Yardım İstemeli? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1719` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Cerrahın Hatalarını Açıklama Cesareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
3. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — Complications — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
4. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — Complications — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — Complications — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — Complications — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — Complications — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — Complications — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — Complications — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — Complications — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 220. You're Not Listening

**Yazar:** Kate Murphy  
**Kategori:** İletişim  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:220` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dinlemek Neden Konuşmaktan Daha Zordur? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1714` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — You're Not Listening — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 221. The Devil in the White City

**Yazar:** Erik Larson  
**Kategori:** Tarih  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:221` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — George Ferris Paris’in Kulesine Nasıl Cevap Verdi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1731` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Şikago Fuarındaki Beyaz Şehir ve Karanlık Sır — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Devil in the White City — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Devil in the White City — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Devil in the White City — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Devil in the White City — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Devil in the White City — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
8. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Devil in the White City — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Devil in the White City — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
10. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Devil in the White City — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 222. The Gene

**Yazar:** Siddhartha Mukherjee  
**Kategori:** Bilim  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:222` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mendel’in Bezelyeleri Neden Otuz Yıl Sessiz Kaldı? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1726` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Mendel'in Unutulan Bezelyeleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Gene — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Gene — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Gene — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Gene — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Gene — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Gene — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Gene — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Gene — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 223. An Immense World

**Yazar:** Ed Yong  
**Kategori:** Bilim  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:223` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Filler Ayaklarıyla Kilometrelerce Öteyi Nasıl Dinliyor? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1729` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — An Immense World — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
3. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — An Immense World — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
4. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — An Immense World — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
5. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — An Immense World — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
6. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — An Immense World — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
7. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — An Immense World — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
8. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — An Immense World — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — An Immense World — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
10. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — An Immense World — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 224. Noise

**Yazar:** Daniel Kahneman, Olivier Sibony ve Cass R. Sunstein  
**Kategori:** Psikoloji  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:224` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aynı Dosyaya Bakan Uzmanlar Neden Farklı Fiyat Söyledi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1727` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Aynı Karara Farklı Günlerde Farklı Cevap Vermek — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
3. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
4. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
5. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Noise — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 225. The Undoing Project

**Yazar:** Michael Lewis  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:225` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uçağı Beş Dakika Kaçırmak Neden Otuz Dakikadan Daha Çok Acıtır? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1734` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kahneman ile Tversky'nin Zihinleri Değiştiren Dostluğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Undoing Project — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Undoing Project — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Undoing Project — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Undoing Project — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Undoing Project — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Undoing Project — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Undoing Project — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Undoing Project — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 226. The Righteous Mind

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:226` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kirli Bir Masa Ahlaki Yargıyı Neden Sertleştirdi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1738` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Ahlaki Kararlarımızı Yöneten Fil ve Binici — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Righteous Mind — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Righteous Mind — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Righteous Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Righteous Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Righteous Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Righteous Mind — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Righteous Mind — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Righteous Mind — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 227. Pour Your Heart Into It

**Yazar:** Howard Schultz ve Dori Jones Yang  
**Kategori:** Liderlik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:227` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İtalya’daki Espresso Barı Starbucks Toplantısını Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1740` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Starbucks'ın Üçüncü Mekân Fikri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Pour Your Heart Into It — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Pour Your Heart Into It — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Pour Your Heart Into It — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Pour Your Heart Into It — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Pour Your Heart Into It — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Pour Your Heart Into It — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Pour Your Heart Into It — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
10. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Pour Your Heart Into It — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100

## 228. Guns, Germs, and Steel

**Yazar:** Jared Diamond  
**Kategori:** Tarih  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:228` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 168 Kişi Bir İmparatorluğu Nasıl Esir Aldı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1743` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Zebralar Neden Ata Dönüşmedi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Guns, Germs, and Steel — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Guns, Germs, and Steel — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Guns, Germs, and Steel — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Guns, Germs, and Steel — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Guns, Germs, and Steel — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Guns, Germs, and Steel — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Guns, Germs, and Steel — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Guns, Germs, and Steel — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Guns, Germs, and Steel — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 229. Collapse

**Yazar:** Jared Diamond  
**Kategori:** Tarih  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:229` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Küçük Bir Ada Çöküşten Nasıl Kaçtı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1744` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Paskalya Adası'nın Kesilen Son Ağacı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Collapse — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Collapse — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Collapse — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Collapse — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Collapse — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Collapse — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Collapse — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Collapse — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Collapse — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 230. The Silk Roads

**Yazar:** Peter Frankopan  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:230` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kağıdı Batıya Taşıyan Savaş — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1745` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kara Ölüm İpek Yolu'nda Nasıl Yolculuk Etti? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Silk Roads — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Silk Roads — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Silk Roads — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Silk Roads — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Silk Roads — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — The Silk Roads — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Silk Roads — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Silk Roads — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Silk Roads — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 231. SPQR

**Yazar:** Mary Beard  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:231` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Roma'yı Büyüten Sıra Dışı Karar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1746` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Roma Düşmanlarını Nasıl Yurttaşa Dönüştürdü? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — SPQR — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — SPQR — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — SPQR — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — SPQR — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — SPQR — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — SPQR — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — SPQR — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — SPQR — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — SPQR — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 232. The Wright Brothers

**Yazar:** David McCullough  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:232` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bisikletçilerin Rüzgar Tüneli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1747` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Bisikletçinin Uçma Takıntısı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Wright Brothers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Wright Brothers — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Wright Brothers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Wright Brothers — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Wright Brothers — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — The Wright Brothers — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Wright Brothers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Wright Brothers — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Wright Brothers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 233. Into Thin Air

**Yazar:** Jon Krakauer  
**Kategori:** Tarih  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:233` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Everest'te Saat İkiyi Geçince — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1748` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Everest'te Karar Vermenin Ölümcül Bedeli — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Into Thin Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Into Thin Air — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Into Thin Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Into Thin Air — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Into Thin Air — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Into Thin Air — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Into Thin Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Into Thin Air — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Into Thin Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 234. Unbroken

**Yazar:** Laura Hillenbrand  
**Kategori:** Tarih  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:234` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Okyanusta 47 Gün: Louis Zamperini — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1749` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Louis Zamperini'nin Kırılamayan İradesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Unbroken — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Unbroken — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Unbroken — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Unbroken — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Unbroken — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Unbroken — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Unbroken — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Unbroken — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Unbroken — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 235. Hidden Figures

**Yazar:** Margot Lee Shetterly  
**Kategori:** Tarih  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:235` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — John Glenn'in Güvendiği Hesap — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1750` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — NASA'yı Değiştiren Görünmez Matematikçiler — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Hidden Figures — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Hidden Figures — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Hidden Figures — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Hidden Figures — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Hidden Figures — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Hidden Figures — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Hidden Figures — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Hidden Figures — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Hidden Figures — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 236. The Splendid and the Vile

**Yazar:** Erik Larson  
**Kategori:** Tarih  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:236` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bombardıman Altında Görünür Olmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1751` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Churchill'in En Karanlık Yılında Liderlik — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Splendid and the Vile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Splendid and the Vile — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Splendid and the Vile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Splendid and the Vile — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Splendid and the Vile — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — The Splendid and the Vile — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Splendid and the Vile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Splendid and the Vile — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Splendid and the Vile — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 237. Say Nothing

**Yazar:** Patrick Radden Keefe  
**Kategori:** Tarih  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:237` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sessizlik Antlaşması Nasıl Çözüldü? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1752` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Cinayetin Kuzey İrlanda'da Bıraktığı Sessizlik — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Say Nothing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Say Nothing — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Say Nothing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Say Nothing — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Say Nothing — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Say Nothing — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Say Nothing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Say Nothing — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Say Nothing — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 238. The Wager

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:238` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aynı Kazadan İki Farklı Gerçek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1753` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Batık Gemi Mürettebatının İmkânsız Seçimi — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Wager — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Wager — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Wager — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Wager — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Wager — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — The Wager — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Wager — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Wager — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Wager — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 239. Killers of the Flower Moon

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:239` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zenginliğin Ölümcül Olduğu Topraklar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1754` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Osage Cinayetleri ve Petrol Serveti — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — Killers of the Flower Moon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — Killers of the Flower Moon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — Killers of the Flower Moon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — Killers of the Flower Moon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — Killers of the Flower Moon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — Killers of the Flower Moon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — Killers of the Flower Moon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — Killers of the Flower Moon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — Killers of the Flower Moon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 240. The Lost City of Z

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:240` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Amazon'un Yuttuğu Kaşif — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1755` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Amazon'da Kaybolan Kaşif Percy Fawcett — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün — The Lost City of Z — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
4. [ ] **URETILECEK** — Sayıca Üstün Ordunun Kaybettiği Savaş — The Lost City of Z — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
5. [ ] **URETILECEK** — Haritadaki Küçük Bir Hatanın Büyük Sonucu — The Lost City of Z — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi — The Lost City of Z — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100
7. [ ] **URETILECEK** — Bir Salgının Siyasi Düzeni Yeniden Kurması — The Lost City of Z — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
8. [ ] **URETILECEK** — Sıradan Bir İnsanın Tarihe Müdahale Ettiği An — The Lost City of Z — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
9. [ ] **URETILECEK** — Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar — The Lost City of Z — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Rakip Toplumların Aynı Krize Verdiği Farklı Cevap — The Lost City of Z — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
11. [ ] **URETILECEK** — Kazananların Yıllarca Anlatmadığı Ayrıntı — The Lost City of Z — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 241. Cosmos

**Yazar:** Carl Sagan  
**Kategori:** Bilim  
**Yil:** 1980  
**Durum:** DB'DE KAYITLI · `list_no:241` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Soluk Mavi Nokta — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1756` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Dünya'nın Soluk Mavi Noktası — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — Cosmos — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — Cosmos — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — Cosmos — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — Cosmos — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — Cosmos — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — Cosmos — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — Cosmos — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — Cosmos — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — Cosmos — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 242. A Brief History of Time

**Yazar:** Stephen Hawking  
**Kategori:** Bilim  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:242` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Tek Denklemin Riski — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1757` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kara Deliklerin Tamamen Kara Olmadığı An — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — A Brief History of Time — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — A Brief History of Time — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — A Brief History of Time — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — A Brief History of Time — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — A Brief History of Time — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — A Brief History of Time — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — A Brief History of Time — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — A Brief History of Time — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — A Brief History of Time — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 243. The Code Breaker

**Yazar:** Walter Isaacson  
**Kategori:** Bilim  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:243` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bakterilerin Sakladığı Makas — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1758` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — CRISPR'ı Başlatan Beklenmedik Bakteri Savunması — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Code Breaker — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Code Breaker — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Code Breaker — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Code Breaker — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Code Breaker — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Code Breaker — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Code Breaker — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Code Breaker — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Code Breaker — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 244. The Immortal Life of Henrietta Lacks

**Yazar:** Rebecca Skloot  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:244` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ölmeyi Reddeden Hücreler — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1759` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Henrietta Lacks'in Ölümsüz Hücreleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Immortal Life of Henrietta Lacks — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Immortal Life of Henrietta Lacks — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Immortal Life of Henrietta Lacks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Immortal Life of Henrietta Lacks — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Immortal Life of Henrietta Lacks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Immortal Life of Henrietta Lacks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Immortal Life of Henrietta Lacks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Immortal Life of Henrietta Lacks — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Immortal Life of Henrietta Lacks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 245. The Hidden Life of Trees

**Yazar:** Peter Wohlleben  
**Kategori:** Bilim  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:245` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ağaçların Gizli Ağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1760` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Ağaçların Gizli İletişim Ağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Hidden Life of Trees — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Hidden Life of Trees — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Hidden Life of Trees — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Hidden Life of Trees — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Hidden Life of Trees — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Hidden Life of Trees — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Hidden Life of Trees — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Hidden Life of Trees — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Hidden Life of Trees — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 246. Entangled Life

**Yazar:** Merlin Sheldrake  
**Kategori:** Bilim  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:246` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ne Bitki Ne Hayvan: Mantarların Dünyası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1761` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Mantarların Dünyayı Birbirine Bağlayan Ağı — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — Entangled Life — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — Entangled Life — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — Entangled Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — Entangled Life — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — Entangled Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — Entangled Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — Entangled Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — Entangled Life — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — Entangled Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 247. Longitude

**Yazar:** Dava Sobel  
**Kategori:** Bilim  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:247` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Denizde Kaybolmayı Bitiren Saat — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1762` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Denizcilerin Hayatını Kurtaran Boylam Saati — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — Longitude — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — Longitude — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — Longitude — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — Longitude — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — Longitude — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — Longitude — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — Longitude — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — Longitude — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — Longitude — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 248. The Disappearing Spoon

**Yazar:** Sam Kean  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:248` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Elinde Eriyen Kaşık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1763` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Galyumdan Yapılan Kaybolan Kaşık — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Disappearing Spoon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Disappearing Spoon — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Disappearing Spoon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Disappearing Spoon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Disappearing Spoon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Disappearing Spoon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Disappearing Spoon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Disappearing Spoon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Disappearing Spoon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 249. The Poisoner's Handbook

**Yazar:** Deborah Blum  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:249` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zehirin Cezasız Kaldığı Çağ — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1764` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Zehri Bilime Dönüştüren Adli Tıp Dedektifleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Poisoner's Handbook — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Poisoner's Handbook — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Poisoner's Handbook — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Poisoner's Handbook — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Poisoner's Handbook — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Poisoner's Handbook — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Poisoner's Handbook — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Poisoner's Handbook — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Poisoner's Handbook — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 250. The Radium Girls

**Yazar:** Kate Moore  
**Kategori:** Bilim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:250` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Fırçayı Dudağında Sivriltmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1765` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Radyum Kızlarının Karanlıkta Parlayan Dişleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Radium Girls — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Radium Girls — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Radium Girls — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Radium Girls — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Radium Girls — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Radium Girls — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Radium Girls — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Radium Girls — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Radium Girls — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 251. The Butchering Art

**Yazar:** Lindsey Fitzharris  
**Kategori:** Bilim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:251` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Görünmeyen Katili Yıkamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1766` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Cerrahiyi Değiştiren Kirli Önlük — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — The Butchering Art — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — The Butchering Art — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — The Butchering Art — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — The Butchering Art — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — The Butchering Art — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — The Butchering Art — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — The Butchering Art — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — The Butchering Art — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — The Butchering Art — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 252. Surely You're Joking, Mr. Feynman!

**Yazar:** Richard P. Feynman ve Ralph Leighton  
**Kategori:** Bilim  
**Yil:** 1985  
**Durum:** DB'DE KAYITLI · `list_no:252` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sallanan Tabaktan Nobel’e — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1767` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Feynman'ın Kasa Açma Merakı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
3. [ ] **URETILECEK** — Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif — Surely You're Joking, Mr. Feynman! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
4. [ ] **URETILECEK** — Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı — Surely You're Joking, Mr. Feynman! — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Yanlış Sonucun Doğru Keşfe Götürdüğü An — Surely You're Joking, Mr. Feynman! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi — Surely You're Joking, Mr. Feynman! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
7. [ ] **URETILECEK** — Görünmeyeni Ölçmeyi Başaran İlk Araç — Surely You're Joking, Mr. Feynman! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Tek Bir Gözlemin Eski Teoriyi Yıkması — Surely You're Joking, Mr. Feynman! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — Laboratuvardaki Küçük Hatanın Büyük Sonucu — Surely You're Joking, Mr. Feynman! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Bilim Dünyasının Yıllarca Reddettiği Fikir — Surely You're Joking, Mr. Feynman! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
11. [ ] **URETILECEK** — Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi — Surely You're Joking, Mr. Feynman! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 253. The Anxious Generation

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2024  
**Durum:** DB'DE KAYITLI · `list_no:253` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Oyun Bahçesinden Ekrana Geçiş — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1768` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Telefonla Büyüyen Kaygılı Nesil — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Anxious Generation — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Anxious Generation — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Anxious Generation — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Anxious Generation — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 254. Behave

**Yazar:** Robert M. Sapolsky  
**Kategori:** Psikoloji  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:254` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir Davranışın Bir Saniye Öncesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1769` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Babunlarda Statü ve Stresin Bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Behave — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 255. The Lucifer Effect

**Yazar:** Philip Zimbardo  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:255` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İyi İnsanları Değiştiren Rol — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1770` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Hapishane Deneyi Kontrolden Nasıl Çıktı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Lucifer Effect — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Lucifer Effect — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Lucifer Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Lucifer Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Lucifer Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Lucifer Effect — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Lucifer Effect — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Lucifer Effect — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Lucifer Effect — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100

## 256. The Man Who Mistook His Wife for a Hat

**Yazar:** Oliver Sacks  
**Kategori:** Psikoloji  
**Yil:** 1985  
**Durum:** DB'DE KAYITLI · `list_no:256` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Karısını Şapka Sanan Adam — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1771` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Man Who Mistook His Wife for a Hat — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
3. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
4. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
7. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Man Who Mistook His Wife for a Hat — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
9. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Man Who Mistook His Wife for a Hat — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
10. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Man Who Mistook His Wife for a Hat — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 257. Incognito

**Yazar:** David Eagleman  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:257` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kararı Sen mi Veriyorsun? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1772` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Beynin Senden Önce Verdiği Kararlar — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Incognito — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100

## 258. The Happiness Hypothesis

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:258` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Fil ve Binicisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1773` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Antik Bilgelik Mutluluk Hakkında Ne Biliyordu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Happiness Hypothesis — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Happiness Hypothesis — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Happiness Hypothesis — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Happiness Hypothesis — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 259. The Confidence Game

**Yazar:** Maria Konnikova  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:259` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dolandırıcının Gerçek Silahı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1774` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Dolandırıcının En Güçlü Silahı: Güven — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Confidence Game — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Confidence Game — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Confidence Game — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Confidence Game — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 260. Scarcity

**Yazar:** Sendhil Mullainathan ve Eldar Shafir  
**Kategori:** Psikoloji  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:260` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yokluğun Zihni Daraltması — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1775` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Şeker Kamışı Çiftçilerinin Kıtlık Zihni — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — Scarcity — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 261. The Marshmallow Test

**Yazar:** Walter Mischel  
**Kategori:** Psikoloji  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:261` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şimdiki Bir mi, Sonraki İki mi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1776` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Marshmallow Testinin Anlatmadığı Şey — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
3. [ ] **URETILECEK** — Beynin Bizi Yanılttığı En Şaşırtıcı Deney — The Marshmallow Test — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
4. [ ] **URETILECEK** — İyi İnsanların Kötü Karar Verdiği An — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Tek Bir Kelimenin Davranışı Değiştirmesi — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
6. [ ] **URETILECEK** — Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Kalabalığın Yanlış Cevabına Uyan İnsanlar — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Bir Önyargının Gerçek Hayattaki Görünmez Bedeli — The Marshmallow Test — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Korkunun Mantığı Devre Dışı Bıraktığı An — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Beklentinin Bedeni Değiştirdiği Deney — The Marshmallow Test — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
11. [ ] **URETILECEK** — Mutluluğu Ararken Yapılan Ters Seçim — The Marshmallow Test — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 262. Shoe Dog

**Yazar:** Phil Knight  
**Kategori:** Liderlik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:262` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bagajdan Doğan Nike — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1777` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Phil Knight'ın Bagajdan Sattığı İlk Ayakkabılar — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Shoe Dog — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Shoe Dog — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Shoe Dog — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Shoe Dog — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Shoe Dog — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Shoe Dog — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Shoe Dog — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Shoe Dog — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Shoe Dog — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100

## 263. The Everything Store

**Yazar:** Brad Stone  
**Kategori:** Liderlik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:263` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Boş Sandalyenin Anlamı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1778` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Amazon'un Kapıdan Yapılan İlk Masaları — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — The Everything Store — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — The Everything Store — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — The Everything Store — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — The Everything Store — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — The Everything Store — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — The Everything Store — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — The Everything Store — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — The Everything Store — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — The Everything Store — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100

## 264. The Ride of a Lifetime

**Yazar:** Robert Iger  
**Kategori:** Liderlik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:264` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Devralınan Şirketleri Değiştirmemek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1779` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Disney Pixar'ı Satın Alırken Güveni Nasıl Kazandı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — The Ride of a Lifetime — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — The Ride of a Lifetime — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — The Ride of a Lifetime — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 91/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — The Ride of a Lifetime — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — The Ride of a Lifetime — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — The Ride of a Lifetime — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — The Ride of a Lifetime — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — The Ride of a Lifetime — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — The Ride of a Lifetime — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100

## 265. No Rules Rules

**Yazar:** Reed Hastings ve Erin Meyer  
**Kategori:** Liderlik  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:265` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kural Kitabını Yırtmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1780` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Netflix'in Sınırsız İzin Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — No Rules Rules — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — No Rules Rules — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — No Rules Rules — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — No Rules Rules — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — No Rules Rules — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — No Rules Rules — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — No Rules Rules — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — No Rules Rules — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — No Rules Rules — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100

## 266. Bad Blood

**Yazar:** John Carreyrou  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:266` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kanla Kurulan Bir Yalan — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1781` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Theranos'un Çalışmayan Kara Kutusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Bad Blood — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Bad Blood — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Bad Blood — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Bad Blood — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Bad Blood — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Bad Blood — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Bad Blood — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Bad Blood — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Bad Blood — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100

## 267. The Hard Thing About Hard Things

**Yazar:** Ben Horowitz  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:267` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kolay Cevabı Olmayan Kararlar — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1782` · `v:2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Barış Zamanı CEO'su ile Savaş Zamanı CEO'su — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
3. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — The Hard Thing About Hard Things — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
4. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — The Hard Thing About Hard Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
5. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — The Hard Thing About Hard Things — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
6. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — The Hard Thing About Hard Things — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
7. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — The Hard Thing About Hard Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — The Hard Thing About Hard Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — The Hard Thing About Hard Things — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
10. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — The Hard Thing About Hard Things — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
11. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — The Hard Thing About Hard Things — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100

## 268. The Intelligent Investor

**Yazar:** Benjamin Graham  
**Kategori:** Finans  
**Yil:** 1949  
**Durum:** DB'DE KAYITLI · `list_no:268` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bay Piyasa ile Ortaklık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1783` · `v:F5` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kapını Her Sabah Çalan Ortak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1793` · `v:F7` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [ ] **URETILECEK** — Bay Piyasa Her Gün Kapını Çalarsa — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
4. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
8. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
9. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — The Intelligent Investor — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 92/100
10. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
11. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — The Intelligent Investor — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
12. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — The Intelligent Investor — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 269. Being Mortal

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:269` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sonuna Kadar İyi Yaşamak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1784` · `v:F5` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Hayatın Sonunda Daha Fazla Tedavi Her Zaman Daha İyi mi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
3. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — Being Mortal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
4. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — Being Mortal — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
5. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — Being Mortal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
6. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — Being Mortal — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
7. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — Being Mortal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — Being Mortal — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
9. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — Being Mortal — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — Being Mortal — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
11. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — Being Mortal — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 270. Nonviolent Communication

**Yazar:** Marshall B. Rosenberg  
**Kategori:** İletişim  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:270` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Suçlamanın Altındaki İhtiyaç — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1785` · `v:F5` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Çakal Dili ile Zürafa Dili Arasındaki Fark — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
3. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
4. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
8. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
11. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Nonviolent Communication — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 271. Four Thousand Weeks

**Yazar:** Oliver Burkeman  
**Kategori:** Verimlilik  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:271` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dört Bin Haftalık Ömür — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1786` · `v:F5` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Dört Bin Haftalık Bir Hayat Nasıl Harcanmalı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
3. [ ] **URETILECEK** — Daha Az Çalışarak Daha İyi Sonuç Alan Ekip — Four Thousand Weeks — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
4. [ ] **URETILECEK** — Bir Dikkat Dağınıklığının Gün Boyu Süren Bedeli — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — İki Dakikalık Başlangıcın Büyük İşi Bitirmesi — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
6. [ ] **URETILECEK** — Hayır Diyerek Zaman Kazanan Yönetici — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
7. [ ] **URETILECEK** — Tek Bir Önceliğin Kaosu Durdurduğu Gün — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
8. [ ] **URETILECEK** — Dinlenmenin Performansı Artırdığı Deney — Four Thousand Weeks — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
9. [ ] **URETILECEK** — Yoğun Görünmek ile Üretken Olmak Arasındaki Fark — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Bir Takvimin Davranışı Değiştirmesi — Four Thousand Weeks — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
11. [ ] **URETILECEK** — Kesintisiz Çalışmanın Yaratıcı Sonucu — Four Thousand Weeks — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 272. Tao Te Ching

**Yazar:** Lao Tzu  
**Kategori:** Felsefe  
**Yil:** -400  
**Durum:** DB'DE KAYITLI · `list_no:272` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Suyun Sessiz Gücü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1787` · `v:F5` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Suyun Gücü: Yumuşak Olan Sert Olanı Nasıl Aşar? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 97/100
3. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — Tao Te Ching — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
4. [ ] **URETILECEK** — Gücün Ortasında Sade Kalmayı Seçen İnsan — Tao Te Ching — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
5. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — Tao Te Ching — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100
6. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — Tao Te Ching — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
7. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — Tao Te Ching — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — Tao Te Ching — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
9. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — Tao Te Ching — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
10. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — Tao Te Ching — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
11. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — Tao Te Ching — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 273. Why Zebras Don't Get Ulcers

**Yazar:** Robert M. Sapolsky  
**Kategori:** Sağlık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:273` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aslandan Kaçan Zebra — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1788` · `v:F6` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bedenin Yakıtı Yanlış Yere Akınca — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1789` · `v:F6` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Serengeti'de Bir Pavyan Sürüsü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1790` · `v:F6` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Aynı Elektrik, İki Farklı Sıçan — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1791` · `v:F6` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Barışı Öğrenen Sürü — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1792` · `v:F6` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Zebralar Neden Ülser Olmaz? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
7. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
10. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — Why Zebras Don't Get Ulcers — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
11. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
12. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
13. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
14. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
15. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — Why Zebras Don't Get Ulcers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 274. Delivering Happiness

**Yazar:** Tony Hsieh  
**Kategori:** Liderlik  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:274` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Boş Konfeti — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1794` · `v:C1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Salondaki Ayakkabı Mağazası — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1795` · `v:C1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Telefonda Acele Yok — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1796` · `v:C1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Çıkış Kapısındaki Teklif — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1797` · `v:C1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Kültür Pazarlığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1798` · `v:C1` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Zappos Mutluluğu Şirket Stratejisine Nasıl Çevirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Delivering Happiness — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
8. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Delivering Happiness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Delivering Happiness — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
10. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Delivering Happiness — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
11. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Delivering Happiness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
12. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Delivering Happiness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
13. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Delivering Happiness — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
14. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Delivering Happiness — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
15. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Delivering Happiness — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100

## 275. The Culture Map

**Yazar:** Erin Meyer  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:275` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Havayı Okumak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1799` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sandviçin İçindeki Eleştiri — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1800` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Evet'in Ağırlığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1801` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Sözleşmeden Önce Kahve — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1802` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Saatin İki Dili — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1803` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Aynı Geri Bildirim İki Kültürde Neden Ters Etki Yapar? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
7. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — The Culture Map — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 88/100
8. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — The Culture Map — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
9. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — The Culture Map — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100
10. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — The Culture Map — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 84/100
11. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — The Culture Map — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
12. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — The Culture Map — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
13. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — The Culture Map — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
14. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — The Culture Map — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
15. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — The Culture Map — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100

## 276. Grinding It Out

**Yazar:** Ray Kroc  
**Kategori:** Liderlik  
**Yil:** 1977  
**Durum:** DB'DE KAYITLI · `list_no:276` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sekiz Mikserlik Sinyal — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1804` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Menüyü Küçülten Mutfak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1805` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Des Plaines’teki İlk Kopya — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1806` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hamburgerin Altındaki Arsa — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1807` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Hamburger Üniversitesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1808` · `v:C2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Ray Kroc'un 52 Yaşında Başlayan Yolculuğu — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
7. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Grinding It Out — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
8. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Grinding It Out — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Grinding It Out — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
10. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Grinding It Out — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 76/100
11. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Grinding It Out — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
12. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Grinding It Out — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
13. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Grinding It Out — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
14. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Grinding It Out — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
15. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Grinding It Out — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100

## 277. Range

**Yazar:** David Epstein  
**Kategori:** Büyüme  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:277` · 10/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Roger Federer'in geç dallanması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1809` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Van Gogh'un geç başlangıcı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1810` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kepler'in analoji ile keşfi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1811` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — "Kötü niyetli" öğrenme ortamları — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1812` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Gore-Tex ve yan projeler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1813` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — InnoCentive'de alan dışı çözücüler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1814` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
7. [x] **DB'DE KAYITLI** — Gunpei Yokoi ve Game Boy — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1815` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
8. [x] **DB'DE KAYITLI** — Kariyer 'uyum kalitesi' — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1816` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
9. [x] **DB'DE KAYITLI** — Satrançta yapay zekânın üstünlüğü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1817` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
10. [x] **DB'DE KAYITLI** — Flynn etkisi ve soyut düşünme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1818` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de

## 278. Give and Take

**Yazar:** Adam Grant  
**Kategori:** Liderlik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:278` · 10/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vericiler merdivenin hem altında hem üstünde — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1819` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Bir öğretmenin her öğrencide yetenek görmesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1820` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Adam Rifkin'in beş dakikalık iyiliği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1821` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
4. [x] **DB'DE KAYITLI** — Frank Lloyd Wright ve alıcı tuzağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1822` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
5. [x] **DB'DE KAYITLI** — Cömert satıcının uzun oyunu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1823` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
6. [x] **DB'DE KAYITLI** — Pigmalion etkisi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1824` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
7. [x] **DB'DE KAYITLI** — Kekeme avukat Dave Walton — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1825` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
8. [x] **DB'DE KAYITLI** — Jon Huntsman'ın el sıkışması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1826` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
9. [x] **DB'DE KAYITLI** — Simpsons yazım odasının cömert kültürü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1827` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de
10. [x] **DB'DE KAYITLI** — Öz-koruyucu verici — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1828` · `v:OH` — **Diller:** tr — **Varyant:** yok — ⚠ eksik dil: en/es/de · eksik varyant: tr/en/es/de

---

# Sisteme Eklenmemis Kitaplar

Bu kitaplar kuyrukta baslik tasiyor ama `books` tablosunda yok.
`ingest-batch.mjs` yeni kitabi otomatik acar; `list_no` atanmamis alan bosluk isaretidir.

## Made in America

**Yazar:** Sam Walton ve John Huey  
**Kategori:** Liderlik  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Sam Walton'ın Cumartesi Sabahı Toplantıları — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
2. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Made in America — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
3. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Made in America — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Made in America — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
5. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Made in America — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 81/100
6. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Made in America — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
7. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Made in America — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
8. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Made in America — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100
9. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Made in America — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
10. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Made in America — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 90/100

## Turn the Ship Around!

**Yazar:** L. David Marquet  
**Kategori:** Liderlik  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kaptan Emir Vermeyi Bırakınca Ne Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
2. [ ] **URETILECEK** — Bir Liderin Kriz Anında Verdiği Ters Köşe Karar — Turn the Ship Around! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
3. [ ] **URETILECEK** — Emir Vermeyi Bırakan Yöneticinin Ekibi — Turn the Ship Around! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
4. [ ] **URETILECEK** — Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün — Turn the Ship Around! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
5. [ ] **URETILECEK** — Rakibini Ekibine Alan Lider — Turn the Ship Around! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100
6. [ ] **URETILECEK** — Başarısızlığı Herkesin Önünde Üstlenen Yönetici — Turn the Ship Around! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
7. [ ] **URETILECEK** — Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm — Turn the Ship Around! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — En Sessiz Çalışanın Şirketi Kurtaran Fikri — Turn the Ship Around! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
9. [ ] **URETILECEK** — Bir Toplantının Kurum Kültürünü Değiştirmesi — Turn the Ship Around! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
10. [ ] **URETILECEK** — Kontrolü Paylaşınca Güçlenen Ekip — Turn the Ship Around! — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 89/100

## One Up On Wall Street

**Yazar:** Peter Lynch ve John Rothchild  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Peter Lynch Alışveriş Merkezinde Nasıl Yatırım Buldu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — One Up On Wall Street — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 85/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — One Up On Wall Street — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — One Up On Wall Street — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## Common Stocks and Uncommon Profits

**Yazar:** Philip A. Fisher  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Philip Fisher'ın Söylenti Ağı Yöntemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — Common Stocks and Uncommon Profits — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 87/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — Common Stocks and Uncommon Profits — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — Common Stocks and Uncommon Profits — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## The Richest Man in Babylon

**Yazar:** George S. Clason  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Babil'in En Basit Zenginlik Kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — The Richest Man in Babylon — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 78/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — The Richest Man in Babylon — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — The Richest Man in Babylon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## Your Money or Your Life

**Yazar:** Vicki Robin ve Joe Dominguez  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Parayı Harcamak Aslında Hayatını Harcamak mı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — Your Money or Your Life — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — Your Money or Your Life — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — Your Money or Your Life — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## Die with Zero

**Yazar:** Bill Perkins  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Ölmeden Önce Anı Temettüsü Biriktirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — Die with Zero — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — Die with Zero — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — Die with Zero — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — Die with Zero — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — Die with Zero — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — Die with Zero — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 79/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — Die with Zero — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — Die with Zero — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 92/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — Die with Zero — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## Misbehaving

**Yazar:** Richard H. Thaler  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kahve Kupası Sahibi Olunca Neden Değerlenir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — Misbehaving — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — Misbehaving — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — Misbehaving — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — Misbehaving — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — Misbehaving — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — Misbehaving — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 82/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — Misbehaving — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — Misbehaving — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — Misbehaving — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## Against the Gods

**Yazar:** Peter L. Bernstein  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — İnsanlık Riski Ne Zaman Ölçmeye Başladı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
2. [ ] **URETILECEK** — Bir Serveti Büyüten Görünmez Karar — Against the Gods — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
3. [ ] **URETILECEK** — Piyasanın En Rasyonel İnsanları Yanılttığı Gün — Against the Gods — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
4. [ ] **URETILECEK** — Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç — Against the Gods — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
5. [ ] **URETILECEK** — Kazanmaktan Daha Zor Olan Şey: Parayı Korumak — Against the Gods — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli — Against the Gods — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
7. [ ] **URETILECEK** — Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı — Against the Gods — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 83/100
8. [ ] **URETILECEK** — Zengin Görünmek ile Zengin Olmak Arasındaki Fark — Against the Gods — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Tek Bir Finans Kuralının Değiştirdiği Hayat — Against the Gods — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100
10. [ ] **URETILECEK** — Riskin İlk Kez Sayılara Döküldüğü An — Against the Gods — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## When Breath Becomes Air

**Yazar:** Paul Kalanithi  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — When Breath Becomes Air — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — When Breath Becomes Air — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — When Breath Becomes Air — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## The Blue Zones

**Yazar:** Dan Buettner  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Uzun Yaşam Adası İkarya'nın Sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — The Blue Zones — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — The Blue Zones — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — The Blue Zones — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — The Blue Zones — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — The Blue Zones — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — The Blue Zones — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — The Blue Zones — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — The Blue Zones — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — The Blue Zones — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## Exercised

**Yazar:** Daniel E. Lieberman  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Hadza Avcıları Egzersiz Yapmadan Nasıl Aktif Kalıyor? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — Exercised — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — Exercised — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — Exercised — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## How Not to Die

**Yazar:** Michael Greger ve Gene Stone  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kalp Hastalığını Geri Çevirmeye Çalışan Doktorlar — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — How Not to Die — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — How Not to Die — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — How Not to Die — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — How Not to Die — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — How Not to Die — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — How Not to Die — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — How Not to Die — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — How Not to Die — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — How Not to Die — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## The Noonday Demon

**Yazar:** Andrew Solomon  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Depresyonu Dünyanın Her Yerinde Arayan Yazar — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
2. [ ] **URETILECEK** — Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Basit Bir Kontrolün Kurtardığı Hayatlar — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
4. [ ] **URETILECEK** — Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
5. [ ] **URETILECEK** — Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney — The Noonday Demon — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
6. [ ] **URETILECEK** — Uyku Eksikliğinin Kararları Değiştirdiği Gece — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
7. [ ] **URETILECEK** — Stresin Bedende Bıraktığı Ölçülebilir İz — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Bir Topluluğun Uzun Yaşam Sırrı — The Noonday Demon — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100
9. [ ] **URETILECEK** — Modern Hayatın Bedenimize Unutturduğu Hareket — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde Değişen Bakış — The Noonday Demon — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## Difficult Conversations

**Yazar:** Douglas Stone, Bruce Patton ve Sheila Heen  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Zor Bir Konuşmanın Aslında Üç Konuşma Olması — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Difficult Conversations — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## Thanks for the Feedback

**Yazar:** Douglas Stone ve Sheila Heen  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Geri Bildirim Alırken Bizi Kilitleyen Üç Tetikleyici — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Thanks for the Feedback — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## Supercommunicators

**Yazar:** Charles Duhigg  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — İyi İletişimcilerin Eşleştirme İlkesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Supercommunicators — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## Talking to Strangers

**Yazar:** Malcolm Gladwell  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Yabancıları Okuduğumuzu Neden Sanıyoruz? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Talking to Strangers — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## Just Listen

**Yazar:** Mark Goulston  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Sorusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
2. [ ] **URETILECEK** — Tek Bir Sorunun Kavgayı Durdurduğu An — Just Listen — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100
3. [ ] **URETILECEK** — Dinleyerek Kazanılan Zor Bir Müzakere — Just Listen — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
4. [ ] **URETILECEK** — Doğru Mesajın Yanlış Tonla Kaybedilmesi — Just Listen — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
5. [ ] **URETILECEK** — Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
6. [ ] **URETILECEK** — Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
7. [ ] **URETILECEK** — Yabancıların Birbirini Yanlış Okuduğu Karşılaşma — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
8. [ ] **URETILECEK** — Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
9. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100
10. [ ] **URETILECEK** — Aynı Cümlenin İki Kültürde Ters Etki Yaratması — Just Listen — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## Letters from a Stoic

**Yazar:** Seneca  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Seneca'ya Göre Hayat Neden Kısa Değildir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
2. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
3. [ ] **URETILECEK** — Gücün Ortasında Sade Kalmayı Seçen İnsan — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
4. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — Letters from a Stoic — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100
5. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — Letters from a Stoic — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
6. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100
7. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100
8. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100
9. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — Letters from a Stoic — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## Discourses and Selected Writings

**Yazar:** Epictetus  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Epiktetos'un Kontrol Çemberi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
2. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
3. [ ] **URETILECEK** — Gücün Ortasında Sade Kalmayı Seçen İnsan — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
4. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — Discourses and Selected Writings — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
5. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
6. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
7. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 92/100
8. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100
9. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
10. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — Discourses and Selected Writings — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## Nicomachean Ethics

**Yazar:** Aristotle  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Aristoteles'e Göre Mutluluk Neden Bir Alışkanlıktır? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 95/100
2. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
3. [ ] **URETILECEK** — Gücün Ortasında Sade Kalmayı Seçen İnsan — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — Nicomachean Ethics — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100
5. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — Nicomachean Ethics — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100
6. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
7. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
8. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100
10. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — Nicomachean Ethics — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## The Consolations of Philosophy

**Yazar:** Alain de Botton  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Sokrates İdam Karşısında Neden Fikrini Değiştirmedi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
2. [ ] **URETILECEK** — Bir Filozofun Ölüm Karşısında Verdiği Cevap — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100
3. [ ] **URETILECEK** — Gücün Ortasında Sade Kalmayı Seçen İnsan — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100
4. [ ] **URETILECEK** — Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders — The Consolations of Philosophy — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100
5. [ ] **URETILECEK** — Mutluluğu Aramayı Bırakan Filozof — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
6. [ ] **URETILECEK** — Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
7. [ ] **URETILECEK** — Kaybetmenin Anlamını Değiştiren Düşünce — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100
8. [ ] **URETILECEK** — Özgürlüğün Dışarıda Değil İçeride Bulunduğu An — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100
9. [ ] **URETILECEK** — Bir İkilemin Doğru Cevaptan Daha Değerli Olması — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
10. [ ] **URETILECEK** — İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma — The Consolations of Philosophy — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## The Antidote

**Yazar:** Oliver Burkeman  
**Kategori:** Büyüme  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Mutluluğu Kovalamayı Bırakınca Ne Olur? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100
2. [ ] **URETILECEK** — Vazgeçmek Üzereyken Yönünü Değiştiren İnsan — The Antidote — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100
3. [ ] **URETILECEK** — Küçük Bir Alışkanlığın Kimliği Değiştirmesi — The Antidote — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100
4. [ ] **URETILECEK** — Başarısızlığı Deneye Çeviren Karar — The Antidote — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100
5. [ ] **URETILECEK** — Yıllarca Görünmeyen Emeğin Bir Günde Sonuç Vermesi — The Antidote — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100
6. [ ] **URETILECEK** — Korkuya Rağmen Atılan İlk Küçük Adım — The Antidote — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100
7. [ ] **URETILECEK** — Bir Mentorun Hayatı Değiştiren Tek Sorusu — The Antidote — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100
8. [ ] **URETILECEK** — Konfor Alanından Çıkmanın Beklenmedik Bedeli — The Antidote — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100
9. [ ] **URETILECEK** — Kendine Verilen Sözün Davranışı Değiştirmesi — The Antidote — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 91/100
10. [ ] **URETILECEK** — Yeteneği Değil Süreci Seçen Kişi — The Antidote — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100
