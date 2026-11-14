# Kitap ve Hikâye Envanteri

> **Bu dosya pipeline'in tek kuyrugudur.** `[x]` satirlar DB'den otomatik uretilir,
> elle degistirilmez. `[ ]` satirlar uretim kuyrugudur; elle eklenip cikarilabilir.
> Yeniden uretmek icin: `node scripts/story-pipeline/sync-inventory.mjs`

- Senkron: **2026-11-06 22:17**
- Kuyruk kaynagi: KITAP_HIKAYE_ENVANTERI.md
- DB'de kitap: **274**
- DB'de hikaye: **745**
- 4 dili tam hikaye: **745**
- Sohbet varyanti tam hikaye: **694**
- Uretim kuyrugu: **116** (83 kayitli kitapta + 33 sistemde olmayan kitapta)
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
**Durum:** DB'DE KAYITLI · `list_no:1` · 12/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Britanya bisiklet takımının yüzde iki felsefesi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1059` · `v:Argon` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kimlik temelli alışkanlık — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1060` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Fotoğraf öğrencilerinin kalite vs miktar deneyi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1061` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Çevre tasarımı ile alışkanlık — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1062` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — İki dakika kuralı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1063` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — El Yıkamayla Başlayan Zafer — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1384` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [x] **DB'DE KAYITLI** — Kasanın Yanındaki Su — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1385` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
8. [x] **DB'DE KAYITLI** — İkinci Boş Gün — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1386` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
9. [x] **DB'DE KAYITLI** — Kimlikten başlayan alışkanlık — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1675` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
10. [x] **DB'DE KAYITLI** — İki Dakika Kuralı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1676` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
11. [x] **DB'DE KAYITLI** — Yüzde bir ve buz küpü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1677` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
12. [x] **DB'DE KAYITLI** — Bir Kaza James Clear’ın Alışkanlık Fikrini Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1703` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 2. Dürüst Olmak

**Yazar:** Kim Scott  
**Kategori:** Liderlik  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:2` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir yürüyüşte söylenen tek cümle — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1064` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aynı sert cümle, iki farklı yer — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1065` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Neden kimse bana söylemedi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1066` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Juice Software'da Bob'u Kahve Davetiyle Kovmak — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://lattice.com/articles/lattice-book-report-radical-candor-by-kim-scott

## 3. Şimdi Başla

**Yazar:** Neil Fiore  
**Kategori:** Verimlilik  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:3` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ertelemenin gerçek kökü: korku — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1067` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İtalyan ressam ve gevşeme paradoksu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1068` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Karşı konulmaz bir güç olarak 'şimdi' — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1069` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Berkeley Doktora Grubunda Tezi Duran Öğrenci Alan — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://www.supersummary.com/the-now-habit/summary/

## 4. Derin Çalışma

**Yazar:** Cal Newport  
**Kategori:** Verimlilik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:4` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Carl Jung'un taş kulesi inzivası — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1070` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Adam Grant'in toplu e-posta stratejisi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1071` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — J.K. Rowling'in otel odası sırrı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1072` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Newport'un sosyal medyasız akademik kariyeri — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1073` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Bill Gates'in Think Week Inzivası — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://www.asianefficiency.com/productivity/bill-gates-astonishing-power-deep-work/

## 5. Düşün ve Zengin Ol

**Yazar:** Napoleon Hill  
**Kategori:** Motivasyon  
**Yil:** 1937  
**Durum:** DB'DE KAYITLI · `list_no:5` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Andrew Carnegie'nin çelik imparatorluğu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1074` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Edison'ın 10.000 başarısızlığı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1075` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Barnes'ın Edison ortaklığı hayali — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1076` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — 500 dolarlık karar — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1077` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — R.U. Darby ve Altın Damarına Üç Metre Kala Bıraktığı Maden — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://sacred-texts.com/nth/tgr/tgr06.htm

## 6. Influence

**Yazar:** Robert Cialdini  
**Kategori:** Psikoloji  
**Yil:** 1984  
**Durum:** DB'DE KAYITLI · `list_no:6` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kapıya ayak koyma tekniği — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1078` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Restoran garsonunun bahşiş sırrı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1079` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sosyal kanıt ve otel havluları — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1080` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Kıtlık ve sınırlı üretim yanılsaması — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1081` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — İyi Niyetli Bir Tabela Hırsızlığı Nasıl Artırdı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1704` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 7. Good to Great

**Yazar:** Jim Collins  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:7` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kirpi Konsepti — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1082` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Volan etkisi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1083` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Önce kim, sonra ne — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1084` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Darwin Smith Neden Şirketinin Fabrikalarını Sattı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1724` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Amiral Stockdale ve Noel'e Kadar Dayanamayan Mahkumlar — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://jimcollins.com/concepts/Stockdale-Concept.html

## 8. Başlangıç Noktası

**Yazar:** Simon Sinek  
**Kategori:** Liderlik  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:8` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dokuz gün arayla iki uçuş denemesi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1085` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Notları bıraktığı an — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1086` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Altın Çember ve tartışmalı gerekçesi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1087` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 9. Büyük Sıçrayış

**Yazar:** Eric Ries  
**Kategori:** Girişimcilik  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:9` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zappos'un sıfır stoklu ilk satışı — **Sure:** 4 dk · **Kelime:** ~890 — `story_id:1088` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — IMVU'nun yanlış yolda koşması — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1089` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Build-Measure-Learn döngüsü — **Sure:** 6 dk · **Kelime:** ~1126 — `story_id:1090` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [ ] **URETILECEK** — Dropbox'ın Tek Bir Videoyla Sınanan Fikri — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://techcrunch.com/2011/10/19/dropbox-minimal-viable-product

## 10. Odaklanma Gücü

**Yazar:** Jack Canfield  
**Kategori:** Verimlilik  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:10` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jack Canfield'ın 100 dolarlık banknot hedefi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1091` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bir yıl 101 hedef deneyi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1092` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Odak sistemi ve kurbağayı yemek — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1093` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 11. The 7 Habits of Highly Effective People

**Yazar:** Stephen Covey  
**Kategori:** Büyüme  
**Yil:** 1989  
**Durum:** DB'DE KAYITLI · `list_no:11` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Büyük taşlar ve kavanoz dersi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1094` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Cenaze töreni egzersizi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1095` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tepki verme özgürlüğü — Viktor Frankl'dan öğrenilen ders — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1096` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hesap empati ve önce anlamak — **Sure:** 6 dk · **Kelime:** ~1106 — `story_id:1097` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Metroda Bir Cümle Bütün Hikâyeyi Nasıl Değiştirdi? — **Sure:** 4 dk · **Kelime:** ~863 — `story_id:1707` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 12. Zihin Gücü

**Yazar:** Carol Dweck  
**Kategori:** Psikoloji  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:12` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabit ve büyüme zihniyeti farkı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1098` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Michael Jordan'ın kesim hikayesi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1099` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Övgünün tehlikeli iki yüzü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1100` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — 'Henüz' kelimesinin gücü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1128` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Beynin plastikliği ve yeniden yazılma — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1129` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Şampiyonların sırrı: zorluğu sevmek — **Sure:** 4 dk · **Kelime:** ~838 — `story_id:1130` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 13. Sabah Rutini

**Yazar:** Hal Elrod  
**Kategori:** Alışkanlıklar  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:13` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hal Elrod'un ölümden dönüşü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1101` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — SAVERS — altı alışkanlığın bilimi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1102` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Beş saniyelik kural ve erken kalkma — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1103` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 14. Güç Yasaları

**Yazar:** Robert Greene  
**Kategori:** Strateji  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:14` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bismarck'ın savaşmadan kazanma sanatı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1104` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Beş rejim, tek diplomat — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1105` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İtibar yasasının söylemediği sanılan kısmı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1106` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Soytarıyı koruyan şey espri değildi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1107` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 15. Emotional Intelligence

**Yazar:** Daniel Goleman  
**Kategori:** Psikoloji  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:15` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dört yaşında marshmallow testi — **Sure:** 4 dk · **Kelime:** ~897 — `story_id:1108` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — IQ'yu geçen EQ deneyi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1109` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Öfke döngüsü ve nörolojik kaçırılma — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1110` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Bir Gazete Haberi Zekâ Tanımını Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1708` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 16. Purple Cow

**Yazar:** Seth Godin  
**Kategori:** Finans  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:16` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mor inek metaforu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1111` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Michelin rehberinin doğuşu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1112` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Boya kutusunu değiştirdiler, reklamı değil — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1113` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — En iyi olmak kimin için? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1114` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Seth Godin Neden Mor Bir İnek Aradı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1739` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Krispy Kreme'in Mor İneği — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://www.theartof.com/books/purple-cow

## 17. The Psychology of Money

**Yazar:** Morgan Housel  
**Kategori:** Finans  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:17` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ronald Read'in görünmez serveti — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1115` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Şans ve risk — Bill Gates'in okul arkadaşı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1116` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yeterince zengin olmak — tatminsizlik tuzağı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1117` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Servet Neden Genellikle Görünmezdir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1709` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 18. Beyin Fırtınası

**Yazar:** David Eagleman  
**Kategori:** Nörobilim  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:18` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — H.M.'nin sonsuz şimdi'si — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1118` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kör nokta ve beynin uydurma sanatı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1119` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bölünmüş beyin ve iki ben — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1120` · `v:Argon` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 19. Alışkanlıkların Gücü

**Yazar:** Charles Duhigg  
**Kategori:** Alışkanlıklar  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:19` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Alcoa'nın beklenmedik dönüşümü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1121` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Craving döngüsü ve diş macunu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1122` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Michael Phelps'in görselleştirme rutini — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1123` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Keystone alışkanlık ve koşu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1124` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [ ] **URETILECEK** — Febreze Neden İlk Başta Satılmadı? — **HIKAYE ADI HENUZ URETILMEDI** — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Kaynak:** https://www.supersummary.com/the-power-of-habit/summary

## 20. Liderlik Sanatı

**Yazar:** Simon Sinek  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:20` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Subaylar en son yer — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1125` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Soyut lider mi, somut lider mi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1126` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Şirketi mi bırakıyorlar, yöneticiyi mi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1127` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 22. Şimdi ve Burada

**Yazar:** Eckhart Tolle  
**Kategori:** Farkındalık  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:22` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bankta oturan adam — **Sure:** 4 dk · **Kelime:** ~815 — `story_id:1131` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ağrı ile acının farkı — **Sure:** 4 dk · **Kelime:** ~899 — `story_id:1132` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Şimdiki anın kapısı — **Sure:** 4 dk · **Kelime:** ~890 — `story_id:1133` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 23. Sosyal Hayvan

**Yazar:** David Brooks  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:23` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bilinçdışının gizli gücü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1134` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bağlanma ve başarı ilişkisi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1135` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Karakter ve ahlakın kökeni — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1136` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 24. Hız ve Güven

**Yazar:** Stephen M. R. Covey  
**Kategori:** Liderlik  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:24` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki saatlik toplantı, tek el sıkışma — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1137` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Görünmez vergi, görünmez temettü — **Sure:** 4 dk · **Kelime:** ~889 — `story_id:1138` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Dördünden biri eksikse olmuyor — **Sure:** 4 dk · **Kelime:** ~862 — `story_id:1139` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 25. Cesaret Vermek

**Yazar:** Brené Brown  
**Kategori:** Kişisel Gelişim  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:25` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Savunmasızlığın paradoksu — **Sure:** 4 dk · **Kelime:** ~885 — `story_id:1140` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yeterlilik ve utanç kıskacı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1141` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Arenada dövüşmek — **Sure:** 4 dk · **Kelime:** ~893 — `story_id:1142` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 26. Fark Yaratmak

**Yazar:** William H. McRaven  
**Kategori:** Motivasyon  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:26` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her sabah yatağını topla — **Sure:** 4 dk · **Kelime:** ~844 — `story_id:1143` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Köpekbalığı havuzu ve korku — **Sure:** 4 dk · **Kelime:** ~875 — `story_id:1144` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kolay olmayacak, devam et — **Sure:** 4 dk · **Kelime:** ~872 — `story_id:1145` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 27. Sınırlar

**Yazar:** Nedra Tawwab  
**Kategori:** Kişisel Gelişim  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:27` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayır diyememek ve tükenişin bedeli — **Sure:** 4 dk · **Kelime:** ~836 — `story_id:1146` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sınırların üç türü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1147` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sınır koymak ilişkileri yıkmaz, güçlendirir — **Sure:** 4 dk · **Kelime:** ~885 — `story_id:1148` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 28. Azim

**Yazar:** Angela Duckworth  
**Kategori:** Motivasyon  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:28` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — West Point'in 'Dayanma' testi — **Sure:** 4 dk · **Kelime:** ~870 — `story_id:1149` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Başarının formülü: Yetenek x Çaba² — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1150` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tutkuyu bulmak: Bilmek değil keşfetmek — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1151` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 29. Büyük Soru

**Yazar:** Viktor Frankl  
**Kategori:** Felsefe  
**Yil:** 1946  
**Durum:** DB'DE KAYITLI · `list_no:29` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Toplama kampında anlam arayışı — **Sure:** 4 dk · **Kelime:** ~844 — `story_id:1152` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Boş zaman ve varoluş kaygısı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1153` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sorumluluk özgürlüğün diğer yüzü — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1154` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 30. Olumlu Zeka

**Yazar:** Shirzad Chamine  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:30` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sabotaj zihninin beş sesi — **Sure:** 4 dk · **Kelime:** ~836 — `story_id:1155` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — PQ — olumlu zeka kası — **Sure:** 4 dk · **Kelime:** ~896 — `story_id:1156` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Zorlukları hediyeye çevirmek — **Sure:** 4 dk · **Kelime:** ~864 — `story_id:1157` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 31. Dürüst Konuşmak

**Yazar:** Kerry Patterson  
**Kategori:** İletişim  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:31` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uçak kazası ve söylenmeden kalan söz — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1158` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ortak zemin yaratma sanatı — **Sure:** 4 dk · **Kelime:** ~863 — `story_id:1159` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Hikayelerden gerçeklere dönmek — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1160` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 32. Sezgi Gücü

**Yazar:** Malcolm Gladwell  
**Kategori:** Psikoloji  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:32` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İtfaiyecinin ölümcül sezgisi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1161` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sahte antika ve uzman gözü — **Sure:** 4 dk · **Kelime:** ~853 — `story_id:1162` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İlk izlenim ve Warren Harding hatası — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1163` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 33. 10.000 Saat Kuralı

**Yazar:** Malcolm Gladwell  
**Kategori:** Başarı  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:33` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hamburg'da geçen saatler — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1164` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Lakeside ve bit pazarından çıkan terminal — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1165` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Ocak doğanların ligi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1166` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 34. Flow

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Psikoloji  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:34` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rock tırmanıcısının zaman kaybı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1167` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Cerrahın ameliyathanede kaybolması — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1168` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Otomatik pilot ve bilinçli seçim — **Sure:** 4 dk · **Kelime:** ~892 — `story_id:1169` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Akış Rahatken Değil, Sınırdayken Neden Gelir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1705` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 35. Karar Verme Sanatı

**Yazar:** Daniel Kahneman  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:35` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sistem 1 ve Sistem 2 — **Sure:** 4 dk · **Kelime:** ~855 — `story_id:1170` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Çapalama etkisi ve müzayede — **Sure:** 4 dk · **Kelime:** ~843 — `story_id:1171` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Linda problemi ve konjunksiyon hatası — **Sure:** 4 dk · **Kelime:** ~856 — `story_id:1172` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 36. İkna Sanatı

**Yazar:** Dale Carnegie  
**Kategori:** İletişim  
**Yil:** 1936  
**Durum:** DB'DE KAYITLI · `list_no:36` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Köpek çalınan adam — **Sure:** 4 dk · **Kelime:** ~784 — `story_id:1173` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Roosevelt'in isim hafızası — **Sure:** 4 dk · **Kelime:** ~806 — `story_id:1174` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Eleştiri yerine soru sormak — **Sure:** 4 dk · **Kelime:** ~827 — `story_id:1175` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Köpek çalan komşuya farklı yaklaşım — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1240` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Roosevelt'in isim ezberleyen dehası — **Sure:** 4 dk · **Kelime:** ~837 — `story_id:1241` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Eleştiri yapmadan değiştirme sanatı — **Sure:** 4 dk · **Kelime:** ~784 — `story_id:1242` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 37. Pareto İlkesi

**Yazar:** Richard Koch  
**Kategori:** Verimlilik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:37` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bahçedeki bezelye — **Sure:** 4 dk · **Kelime:** ~847 — `story_id:1176` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — 80/20 ve zaman yönetimi — **Sure:** 4 dk · **Kelime:** ~854 — `story_id:1177` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Az ama öz ilişkiler — **Sure:** 4 dk · **Kelime:** ~876 — `story_id:1178` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Bahçedeki bezelyenin sırrı — **Sure:** 4 dk · **Kelime:** ~859 — `story_id:1243` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Koch'un çalışma saatlerini yarıya indirmesi — **Sure:** 4 dk · **Kelime:** ~891 — `story_id:1244` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Mutluluğun yüzde yirmi kaynağı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1245` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 38. Yaratıcı Olmak

**Yazar:** Elizabeth Gilbert  
**Kategori:** Yaratıcılık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:38` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İlham perisinin ziyareti — **Sure:** 4 dk · **Kelime:** ~884 — `story_id:1179` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Korkuyla dans etmek — **Sure:** 4 dk · **Kelime:** ~836 — `story_id:1180` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yaratıcılık bir sorumluluk — **Sure:** 4 dk · **Kelime:** ~853 — `story_id:1181` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — İlham perisi kapıya geldiğinde — **Sure:** 4 dk · **Kelime:** ~819 — `story_id:1246` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Korkunun yolcu olması — **Sure:** 4 dk · **Kelime:** ~878 — `story_id:1247` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Merak yaratıcılığın pusulası — **Sure:** 4 dk · **Kelime:** ~825 — `story_id:1248` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 39. Money: Master the Game

**Yazar:** Tony Robbins  
**Kategori:** Finans  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:39` · 7/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bileşik faizin sihri — **Sure:** 4 dk · **Kelime:** ~826 — `story_id:1182` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Finansal özgürlüğün beş adımı — **Sure:** 4 dk · **Kelime:** ~878 — `story_id:1183` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Risk asimetrisi ve kayıptan kaçınma — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1184` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Theodore Johnson'ın taze meyve tasarrufu — **Sure:** 4 dk · **Kelime:** ~896 — `story_id:1249` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Serbest piyasanın en güçlü kuvveti — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1250` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Zenginliğin gerçek tanımı — **Sure:** 4 dk · **Kelime:** ~895 — `story_id:1251` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [x] **DB'DE KAYITLI** — 2008 Krizinden Sonra Tony Robbins Kimlere Sordu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1725` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 40. Zihin Haritası

**Yazar:** Tony Buzan  
**Kategori:** Öğrenme  
**Yil:** 1993  
**Durum:** DB'DE KAYITLI · `list_no:40` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Einstein'ın görsel düşünce sırrı — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1185` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bir sayfada bir kitap — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1186` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Einstein'ın görsel düşünme sırrı — **Sure:** 4 dk · **Kelime:** ~895 — `story_id:1252` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hafıza şampiyonlarının tekniği — **Sure:** 4 dk · **Kelime:** ~830 — `story_id:1253` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Her iki beyin yarımküresini birlikte kullanmak — **Sure:** 4 dk · **Kelime:** ~820 — `story_id:1254` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 41. Korkusuzluk

**Yazar:** Susan Jeffers  
**Kategori:** Motivasyon  
**Yil:** 1987  
**Durum:** DB'DE KAYITLI · `list_no:41` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Paraşütle atlayan kadın — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1187` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Hayır deme korkusu — **Sure:** 4 dk · **Kelime:** ~818 — `story_id:1188` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Paraşütle atlayan kadın — **Sure:** 4 dk · **Kelime:** ~863 — `story_id:1255` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Acının kaçınılmazlığı ve acıdan kaçma bedeli — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1256` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Jean'i işte tutan getiriler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1257` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 42. Stillness Is the Key

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:42` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Büyük İskender'in hareketsizliği — **Sure:** 4 dk · **Kelime:** ~819 — `story_id:1189` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Epiktetos'un özgürlüğü — **Sure:** 4 dk · **Kelime:** ~878 — `story_id:1190` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kennedy'nin on üç günü — **Sure:** 4 dk · **Kelime:** ~717 — `story_id:1258` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Napoleon'un mühürlü mektupları — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1260` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Kennedy'nin Not Defterindeki Yelkenliler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1741` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 43. Ego Is the Enemy

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:43` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Howard Hughes'un çöküşü — **Sure:** 4 dk · **Kelime:** ~828 — `story_id:1191` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Öğrenci zihniyeti — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1192` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Howard Hughes'ın çöküşü — **Sure:** 4 dk · **Kelime:** ~747 — `story_id:1261` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hammett Yeniden Öğrenci Oldu — **Sure:** 4 dk · **Kelime:** ~744 — `story_id:1262` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Boyd'un Çatal Yol Konuşması — **Sure:** 4 dk · **Kelime:** ~733 — `story_id:1263` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Ryan Holiday’nin Başarısı Neden Bir Uyarıya Dönüştü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1713` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 44. Engel Yolu Açar

**Yazar:** Ryan Holiday  
**Kategori:** Felsefe  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:44` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Edison'ın fabrika yangını — **Sure:** 4 dk · **Kelime:** ~827 — `story_id:1193` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Marcus Aurelius'un mektupları — **Sure:** 4 dk · **Kelime:** ~846 — `story_id:1194` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Edison'ın fabrika yangını — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1264` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Marcus Aurelius ve Asi General — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1265` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Jack Johnson'ın Gülümsemesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1266` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 45. Neden Uyuyoruz

**Yazar:** Matthew Walker  
**Kategori:** Sağlık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:45` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Uyku ve beyin temizliği — **Sure:** 4 dk · **Kelime:** ~899 — `story_id:1195` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Roger Federer'in 12 saati — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1196` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Antrenmanı bitiren son iki saat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1267` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Uyku yoksunluğu ve tıbbi hatalar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1268` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — REM uykusu ve duygusal iyileşme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1269` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 46. Bedenin Sesi

**Yazar:** Bessel van der Kolk  
**Kategori:** Sağlık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:46` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vietnam gazilerinin dondurulmuş anları — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1197` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Güvenli beden ve iyileşme — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1198` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Alarm Çalıyor, Konuşma Susuyor — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1270` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Yoga ve travma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1271` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Çocukluk Anketi ve Yetişkin Sağlığı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1272` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 47. Saatlerin Efendisi

**Yazar:** Daniel Pink  
**Kategori:** Verimlilik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:47` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hemingway'in sabah ritmi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1199` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Öğle sarhoşluğu ve dinlenme bilimi — **Sure:** 4 dk · **Kelime:** ~851 — `story_id:1200` · `v:Argon` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Zirve, çukur ve toparlanma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1273` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Öğleden sonra ve nappuccino — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1274` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Devre arasında bir sayı geride — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1275` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 48. Sıfır'dan Bir'e

**Yazar:** Peter Thiel  
**Kategori:** Girişimcilik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:48` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Monopol mu rekabet mi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1201` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Gizli sırlar ve kontrarian düşünce — **Sure:** 4 dk · **Kelime:** ~849 — `story_id:1202` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bir Girişim, Yedi Şirket — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1276` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Havayolları ve Google — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1277` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Thiel'in görüşme sorusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1278` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 49. Karanlığın Ötesi

**Yazar:** Brené Brown  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:49` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Güvenlik alanından çıkmak — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1203` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Zırh ve liderlik — **Sure:** 4 dk · **Kelime:** 800 ±100 — `story_id:1204` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr — ⚠ sure uyumsuz: 4→5
3. [x] **DB'DE KAYITLI** — Zırh ve cesaret — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1279` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Kaçılan zor konuşmalar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1280` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Yüz değerden iki değere — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1281` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 50. Simyacı

**Yazar:** Paulo Coelho  
**Kategori:** İlham  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:50` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hazinenin geri dönüşü — **Sure:** 4 dk · **Kelime:** ~879 — `story_id:1205` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kişisel efsane ve kader — **Sure:** 4 dk · **Kelime:** ~787 — `story_id:1206` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İki Kez Gelen Rüya — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1282` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — İki şahin ve vaha — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1283` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Yabani İncirin Altında Kazmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1284` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 51. İnsan Nasıl Düşünür

**Yazar:** James Allen  
**Kategori:** Felsefe  
**Yil:** 1903  
**Durum:** DB'DE KAYITLI · `list_no:51` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bahçıvan ve zihin — **Sure:** 4 dk · **Kelime:** ~859 — `story_id:1207` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Karakter ve koşullar — **Sure:** 4 dk · **Kelime:** ~887 — `story_id:1208` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Zihin bir bahçedir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1285` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Koşullar insanı gösterir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1286` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Sakinliğin gücü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1287` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 52. Can't Hurt Me

**Yazar:** David Goggins  
**Kategori:** Büyüme  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:52` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayatta kalma zihni — **Sure:** 4 dk · **Kelime:** ~865 — `story_id:1209` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aklın rahatlama dürtüsü — **Sure:** 4 dk · **Kelime:** ~886 — `story_id:1210` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Paten Salonundan Indiana'ya — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1288` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — 101 Mil ve Yüzde Kırk Kuralı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1289` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Goggins'in Kurabiye Kavanozu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1290` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — David Goggins Aynadaki Adamla Neden Konuştu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1728` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 53. Zengin Baba Fakir Baba

**Yazar:** Robert Kiyosaki  
**Kategori:** Finans  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:53` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İki babanın iki farklı dersi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1211` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — McDonald's'ın gerçek işi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1212` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İki Baba, Yasak Bir Cümle — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1291` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hamburger mi, Gayrimenkul mü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1292` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Önce vergi mi, önce gider mi — **Sure:** 4 dk · **Kelime:** ~755 — `story_id:1293` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 54. The 4-Hour Workweek

**Yazar:** Tim Ferriss  
**Kategori:** Verimlilik  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:54` · 6/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 80/20 ve işi silmek — **Sure:** 4 dk · **Kelime:** ~810 — `story_id:1213` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Korkular listesi ve olumsuz canlandırma — **Sure:** 4 dk · **Kelime:** ~866 — `story_id:1214` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Önce Reklam, Sonra Ürün — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1294` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hiçbir Şey Yapmamanın Bedelini Yazmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1295` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — İki günlük deneme — **Sure:** 4 dk · **Kelime:** ~709 — `story_id:1296` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Tim Ferriss Darboğazın Kendisi Olduğunu Nasıl Fark Etti? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1730` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 55. Minimalizm

**Yazar:** Greg McKeown  
**Kategori:** Verimlilik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:55` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Daha az, daha odaklı — **Sure:** 4 dk · **Kelime:** ~823 — `story_id:1215` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Tek gemi filosu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1216` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Önceliğin çoğulu yoktu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1297` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Doksanın altı sıfırdır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1298` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Kemancıların uykusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1299` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 56. Hiçbir Şeye Bakmamak

**Yazar:** Cal Newport  
**Kategori:** Teknoloji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:56` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir aylık e-posta yasağı — **Sure:** 4 dk · **Kelime:** ~877 — `story_id:1217` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dijital minimalizm felsefesi — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1218` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 57. The Good Life

**Yazar:** Robert Waldinger  
**Kategori:** Psikoloji  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:57` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Harvard'ın 85 yıllık mutluluk araştırması — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1219` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — 724 Hayatı İzleyen Araştırma Mutluluk Hakkında Ne Buldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1742` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [ ] **URETILECEK** — Bugün Hâlâ Geçerli Olan Tarihsel Ders — The Good Life — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 58. Şükran Günlüğü

**Yazar:** Janice Kaplan  
**Kategori:** Mutluluk  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:58` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şükranın beyin kimyası — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1220` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Karşılaştırmanın tuzağı — **Sure:** 4 dk · **Kelime:** ~872 — `story_id:1221` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 59. Karizmatik Olmak

**Yazar:** Olivia Fox Cabane  
**Kategori:** İletişim  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:59` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Marilyn Monroe'nun soyunma odası — **Sure:** 4 dk · **Kelime:** ~790 — `story_id:1222` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Varlık — karizmanın temeli — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1223` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 60. İnsan Beyninin Gücü

**Yazar:** Jim Kwik  
**Kategori:** Öğrenme  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:60` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jim Kwik'in beyin hasarı — **Sure:** 4 dk · **Kelime:** ~842 — `story_id:1224` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Hız okuma ve anlama — **Sure:** 4 dk · **Kelime:** ~882 — `story_id:1225` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 61. Cesur Olmak

**Yazar:** Ichiro Kishimi  
**Kategori:** Felsefe  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:61` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Onay ihtiyacı ve özgürlük — **Sure:** 4 dk · **Kelime:** ~834 — `story_id:1226` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Geçmiş ve şimdiki an — **Sure:** 4 dk · **Kelime:** ~867 — `story_id:1227` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 62. Yüksek Performans

**Yazar:** Brendon Burchard  
**Kategori:** Kişisel Gelişim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:62` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ambulanstaki uyanış — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1228` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Enerji yönetimi ve niyet — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1229` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 63. Savaş Sanatı

**Yazar:** Sun Tzu  
**Kategori:** Strateji  
**Yil:** -500  
**Durum:** DB'DE KAYITLI · `list_no:63` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Su gibi olmak — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1230` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kazanmak savaşmadan — **Sure:** 4 dk · **Kelime:** 800 ±100 — `story_id:1231` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr — ⚠ sure uyumsuz: 4→5

## 64. Değişimin Gücü

**Yazar:** Chip Heath  
**Kategori:** Değişim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:64` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Fil ve kazık — **Sure:** 4 dk · **Kelime:** ~842 — `story_id:1232` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Akıl ve kalp — değişimin iki motoru — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1233` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 65. Yapışkan Fikirler

**Yazar:** Chip Heath  
**Kategori:** İletişim  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:65` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jared ve Subway diyeti — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1234` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sürpriz ve merak boşluğu — **Sure:** 4 dk · **Kelime:** ~840 — `story_id:1235` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 66. Hikaye Anlatıcısı

**Yazar:** Donald Miller  
**Kategori:** Pazarlama  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:66` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kahraman ve rehber — **Sure:** 4 dk · **Kelime:** ~890 — `story_id:1236` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — BrandScript ve basit mesaj — **Sure:** 4 dk · **Kelime:** ~895 — `story_id:1237` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 67. Doğrusal Olmayan Gelecek

**Yazar:** Ray Kurzweil  
**Kategori:** Teknoloji  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:67` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Katlanarak büyüme paradoksu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1238` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İnsan-makine entegrasyonu — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1239` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 68. Akıl Yürütme

**Yazar:** Hans Rosling  
**Kategori:** Düşünme  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:68` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şempanze testi ve insan yanılgısı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1300` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dünya dört gelir düzeyinde — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1301` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Korkuyla değil veriyle düşünmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1302` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 69. Siyah Kuğu

**Yazar:** Nassim Taleb  
**Kategori:** Düşünme  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:69` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hindinin Bin Günü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1303` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ünlü uzmanın tahmini — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1304` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Hindi ve halter — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1305` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 70. Antikırılgan

**Yazar:** Nassim Taleb  
**Kategori:** Düşünme  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:70` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ormanın yangın ihtiyacı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1306` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Barbell stratejisi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1307` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Stres ve kas büyümesi — antikırılganlığın bedeni — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1308` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 71. Thinking in Systems

**Yazar:** Donella Meadows  
**Kategori:** Verimlilik  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:71` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Slinky ve boş kutu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1309` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Fren mi kartopu mu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1310` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Hızlı tepki, büyük salınım — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1311` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Küvet Neden Musluk Kadar Hızlı Değişmez? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1723` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 72. İşin Özü

**Yazar:** Michael Gerber  
**Kategori:** Girişimcilik  
**Yil:** 1986  
**Durum:** DB'DE KAYITLI · `list_no:72` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Turtadan Nefret Eden Fırıncı — **Sure:** 4 dk · **Kelime:** ~736 — `story_id:1312` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kroc'un Gerçek Ürünü — **Sure:** 4 dk · **Kelime:** ~711 — `story_id:1313` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sabah Yedideki Telefon — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1314` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 73. Müşteriyi Anlamak

**Yazar:** Nir Eyal  
**Kategori:** Ürün  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:73` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yin ve Kaçan An — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1315` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — E-posta Kutusundaki Duygu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1316` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Skinner'ın Güvercinleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1317` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 74. Indistractable

**Yazar:** Nir Eyal  
**Kategori:** Verimlilik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:74` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kapaklı Telefon Yetmedi — **Sure:** 4 dk · **Kelime:** ~718 — `story_id:1318` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İki Liste, Bir Takvim — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1319` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yüz Dolar ve Bir Çakmak — **Sure:** 4 dk · **Kelime:** ~700 — `story_id:1320` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Nir Eyal’i Kendi Kızıyla Kaçırdığı An Durdurdu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1715` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 75. Güçlü Sorular

**Yazar:** Warren Berger  
**Kategori:** Yaratıcılık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:75` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Polaroid'in anlık cevabı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1321` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Soru hiyerarşisi — neden, nasıl, ne — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1322` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Naif soru ve uzman körlüğü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1323` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 76. Yaratıcı Beyin

**Yazar:** Julia Cameron  
**Kategori:** Yaratıcılık  
**Yil:** 1992  
**Durum:** DB'DE KAYITLI · `list_no:76` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kimsenin Okumadığı Üç Sayfa — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1324` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Üstü Çizilmiş Köpekbalığı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1325` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Hurdacıda İki Saat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1326` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 77. The Success Principles

**Yazar:** Jack Canfield ve Janet Switzer  
**Kategori:** Büyüme  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:77` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Otuz Yapmak, Otuz Sahip Olmak, Otuz Olmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1327` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aynı Trafik, İki Sürücü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1328` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Haftalık 1'den 10'a Sorusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1329` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Ret Üstüne Ret: Chicken Soup Günde Beş Adımla Nasıl Yayımlandı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1733` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 78. Ustalık Gerektiren Kafaya Takmama Sanatı

**Yazar:** Mark Manson  
**Kategori:** Kişisel Gelişim  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:78` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hangi Acıyı İstiyorsunuz? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1330` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kapıdaki Bebek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1331` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Ya Yanılıyorsam? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1332` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 79. Her Şey Yolunda

**Yazar:** Mark Manson  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:79` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Umut paradoksu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1333` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Özgürlük ve seçimin bedeli — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1335` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 80. Beden Dili

**Yazar:** Joe Navarro  
**Kategori:** İletişim  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:80` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dürüst beyin ve ayaklar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1336` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Önce temel çizgiyi öğren — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1337` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Eller, alan ve güven — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1338` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 81. Uyku Devrimi

**Yazar:** Arianna Huffington  
**Kategori:** Sağlık  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:81` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Huffington'ın çöküşü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1339` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Telefon Yatak Odasından Çıkar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1340` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 82. %10 Daha Mutlu

**Yazar:** Dan Harris  
**Kategori:** Farkındalık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:82` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Panik atağından meditasyona — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1342` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yüzde on daha mutlu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1343` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kafamdaki Ses — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1344` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 83. The Paradox of Choice

**Yazar:** Barry Schwartz  
**Kategori:** Psikoloji  
**Yil:** 2004  
**Durum:** DB'DE KAYITLI · `list_no:83` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir Kot Pantolon İçin Bütün Gün — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1345` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aynı Harçlık, İki Kız Kardeş — **Sure:** 4 dk · **Kelime:** ~730 — `story_id:1346` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — On İki Şaraplık Raf — **Sure:** 4 dk · **Kelime:** ~713 — `story_id:1347` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — 24 Reçel Neden 6 Reçelden Daha Az Sattı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1720` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 84. Öğrenmeyi Öğrenmek

**Yazar:** Peter C. Brown, Henry L. Roediger III ve Mark A. McDaniel  
**Kategori:** Öğrenme  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:84` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Paraşüt Okulundaki Çakıl Çukuru — **Sure:** 4 dk · **Kelime:** ~748 — `story_id:1348` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Fosforlu Notlar ve Bir D Notu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1349` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tek Günde Öğrenen Cerrahlar — **Sure:** 4 dk · **Kelime:** ~740 — `story_id:1350` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 85. Bir Sonraki Seviye

**Yazar:** Robin Sharma  
**Kategori:** Alışkanlıklar  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:85` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zafer Saati — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1351` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Günde Beş Küçük Hedef — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1352` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Odaklı Çalışma, Planlı Toparlanma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1353` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 86. Ferrari'sini Satan Bilge

**Yazar:** Robin Sharma  
**Kategori:** İlham  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:86` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ferrari'li Avukatın Çöküşü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1354` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bilgelerin Kum Saati — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1355` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yirmi Üç Şınav, On Tane Daha — **Sure:** 4 dk · **Kelime:** ~780 — `story_id:1356` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 87. Unutulmaz Markalar

**Yazar:** Seth Godin  
**Kategori:** Pazarlama  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:87` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Müşteri kim sorusu — **Sure:** 4 dk · **Kelime:** ~758 — `story_id:1357` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kabile ve liderlik — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1358` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Pazarlama empati işidir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1359` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 88. Niyet

**Yazar:** Lynne McTaggart  
**Kategori:** Farkındalık  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:88` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Princeton mühendislik anomalileri — **Sure:** 2 dk · **Kelime:** ~450 — `story_id:1360` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Uzak iyileşme deneyleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1361` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Topluluk niyeti ve dalgalanma etkisi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1362` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 89. Zihinsel Dayanıklılık

**Yazar:** Sheryl Sandberg  
**Kategori:** Dayanıklılık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:89` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dave Goldberg'i kaybetmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1363` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — 3P tuzağı — kalıcılık, yaygınlık, kişiselleştirme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1364` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Travma sonrası büyüme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1365` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 90. Kendi Patronun Ol

**Yazar:** Paul Jarvis  
**Kategori:** Girişimcilik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:90` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Freelancer'ın fatura şoku — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1366` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Büyümeye Tavan Koymak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1367` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tahmine Göre Açılan Mağazalar — **Sure:** 4 dk · **Kelime:** ~735 — `story_id:1368` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 91. İnsanı Anlamak

**Yazar:** Chris Voss  
**Kategori:** Müzakere  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:91` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Harvard'da Sahte Bir Fidye — **Sure:** 4 dk · **Kelime:** ~711 — `story_id:1369` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Hiç Hayır Demeyen Adam — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1370` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İki Kopya mı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1371` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 92. The Life-Changing Magic of Tidying Up

**Yazar:** Marie Kondo  
**Kategori:** Felsefe  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:92` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Elinizdeki Eşyanın Cevabı — **Sure:** 4 dk · **Kelime:** ~705 — `story_id:1372` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Önce Kıyafetler, En Son Hatıralar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1373` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Evi Selamlayan Danışman — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1374` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Marie Kondo Neden “Bu Bana Neşe Veriyor mu?” Diye Sordu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1737` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 93. Stoacılık

**Yazar:** Marcus Aurelius  
**Kategori:** Felsefe  
**Yil:** 180  
**Durum:** DB'DE KAYITLI · `list_no:93` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İmparatorun Kendine Notları — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1375` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Zarar Yargıdadır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1376` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Öperken Fısıldanan Cümle — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1377` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 94. İyimserlik Öğrenmek

**Yazar:** Martin Seligman  
**Kategori:** Psikoloji  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:94` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Atlanmayan Alçak Engel — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1378` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Reddedilmeyi Açıklayan Satıcılar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1379` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kendi Sesinize İtiraz Etmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1380` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 95. Mutluluğun Peşinde

**Yazar:** Shawn Achor  
**Kategori:** Mutluluk  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:95` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her Yerde Düşen Bloklar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1381` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Stres Anında Kime Tutunursunuz — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1382` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Şeker Önce Gelince — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1383` · `v:Opus55-3` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 97. İçsel Güç

**Yazar:** Tony Robbins  
**Kategori:** Motivasyon  
**Yil:** 1991  
**Durum:** DB'DE KAYITLI · `list_no:97` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ateş üzerinde yürümek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1387` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Altı insan ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1388` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Kaynak durumu ve performans zirvesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1389` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 98. Hedeflere Ulaşmak

**Yazar:** Brian Tracy  
**Kategori:** Hedefler  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:98` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kimsenin bulamadığı çalışma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1390` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Her Sabah On Hedefi Sıfırdan Yazma Alıştırması — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100
3. [ ] **URETILECEK** — Yale'de Hedef Yazanların %3'ü Hikâyesi — Goals! — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 99. Yeme Bozukluğu

**Yazar:** Brian Tracy  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:99` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kurbağayı akşamdan seçmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1393` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — A-1 iribaşlardan önce gelir — **Sure:** 4 dk · **Kelime:** ~712 — `story_id:1394` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tek blok, tek iş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1395` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 100. Sonsuz Oyun

**Yazar:** Simon Sinek  
**Kategori:** Strateji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:100` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Son düdüğü olmayan oyun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1396` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Rakibe bakan ve müşteriye bakan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1397` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Hata yaptım demek ucuz olsun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1398` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 101. Zeki Kalabalıklar

**Yazar:** Howard Rheingold  
**Kategori:** Teknoloji  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:101` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mesaj, orada olmak demekti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1399` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 102. Devrilme Noktası

**Yazar:** Malcolm Gladwell  
**Kategori:** Sosyoloji  
**Yil:** 2000  
**Durum:** DB'DE KAYITLI · `list_no:102` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 30.000 Çiftten 430.000 Çifte — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1402` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Üç Gecelik Boya, Bir Silindir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1403` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Revere'in Çaldığı Kapılar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1404` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 103. Nasıl Başarılı Olunur

**Yazar:** David Allen  
**Kategori:** Verimlilik  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:103` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Açık döngüler ve sonraki adım — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1405` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İki dakika eşiği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1406` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Haftalık gözden geçirme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1407` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 104. Dört Anlaşma

**Yazar:** Don Miguel Ruiz  
**Kategori:** Felsefe  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:104` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir Ses Hakkında Tek Cümle — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1408` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yabancı Sana Aptal Diyor — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1409` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Alışveriş Merkezindeki Gülümseme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1410` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 105. Sessizlik

**Yazar:** Susan Cain  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:105` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sessiz olmak korkmak değildir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1411` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Daha sessiz biri var mı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1412` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 106. Liderlik 21 Yasası

**Yazar:** John C. Maxwell  
**Kategori:** Liderlik  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:106` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hamburgerlerin üstündeki tavan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1414` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Lincoln ve dağıtılan bölük — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1415` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sekiz yılın güveni, üç karar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1416` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 107. Mavi Okyanus Stratejisi

**Yazar:** W. Chan Kim  
**Kategori:** Strateji  
**Yil:** 2004  
**Durum:** DB'DE KAYITLI · `list_no:107` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayvansız Sirk — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1417` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Cirque'in çıkardıkları — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1418` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Southwest ve araba — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1419` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 108. Mucize Denklem

**Yazar:** Hal Elrod  
**Kategori:** Alışkanlıklar  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:108` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Önce söz, sonra küçük adımlar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1420` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Şans mı, emek mi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1421` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Beş dakikalık kural — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1422` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 109. Mindfulness

**Yazar:** Jon Kabat-Zinn  
**Kategori:** Farkındalık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:109` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hedefsiz yürüyüş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1423` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bilerek yaşamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1424` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Düşünce hava gibi geçer — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1425` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 110. Yetenek Yanılgısı

**Yazar:** Geoff Colvin  
**Kategori:** Başarı  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:110` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Notaları kim yazdı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1426` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yirmi yıllık hekim, beş yıllık hekim — **Sure:** 2 dk · **Kelime:** ~437 — `story_id:1427` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kendi kör noktanı göremezsin — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1428` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 111. Terapi

**Yazar:** Lori Gottlieb  
**Kategori:** Psikoloji  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:111` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Karşı koltuktaki terapist — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1429` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 112. Büyüme Kültürü

**Yazar:** John Doerr  
**Kategori:** Yönetim  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:112` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Intel'in Operation Crush'ı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1432` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Chrome'un Zorlayıcı Hedefleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1433` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — MyFitnessPal'da Bağımlılık Toplantısı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1434` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 113. Satışın Psikolojisi

**Yazar:** Brian Tracy  
**Kategori:** Satış  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:113` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Özellikler listesinde olmayan korkular — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1435` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Reddedilme korkusu bir kastır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1436` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Saniyenin onda biri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1437` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 114. Against Empathy

**Yazar:** Paul Bloom  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:114` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Empatinin karanlık yüzü — önyargılı acı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1438` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Rasyonel şefkat — empatinin ötesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1439` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tükenme ve empatinin bedeli — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1440` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Bir Yüz Neden Binlerce İstatistikten Güçlüdür? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1706` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 115. Gündelik Nesneler Tasarımı

**Yazar:** Don Norman  
**Kategori:** Tasarım  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:115` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kapı tasarımı ve hata yerine kullanıcıyı suçlamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1441` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Görünürlük ve geri bildirim — iyi tasarımın iki direği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1442` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Zihinsel modeller ve tasarımın gizli dili — **Sure:** 4 dk · **Kelime:** ~759 — `story_id:1443` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 116. Sadakat Etkisi

**Yazar:** Frederick Reichheld  
**Kategori:** İş Dünyası  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:116` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Müşterilerin yarısı beş yılda gider — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1444` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kazanmak pahalı, tutmak kazandırır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1446` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 117. Hayatın Kısalığı Üzerine

**Yazar:** Seneca  
**Kategori:** Felsefe  
**Yil:** 49  
**Durum:** DB'DE KAYITLI · `list_no:117` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Planlandığı gibi geçen günler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1447` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ellinci yıldan sonra — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1448` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 118. Bilinçaltının Gücü

**Yazar:** Joseph Murphy  
**Kategori:** Motivasyon  
**Yil:** 1963  
**Durum:** DB'DE KAYITLI · `list_no:118` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bilinçaltı, Tohum ve Toprak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1450` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Uykudan Önce Tek Sorun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1451` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İnandığınız Gibi Olsun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1452` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 119. Neşeyi Seç

**Yazar:** Dalai Lama  
**Kategori:** Mutluluk  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:119` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir hafta, tek soru — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1453` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Neşenin sekiz sütunu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1454` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Küçük daire, geniş daire — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1455` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 120. Beynin Sırları

**Yazar:** V.S. Ramachandran  
**Kategori:** Nörobilim  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:120` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ayna kutusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1456` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Beşlerin Arasındaki İkiler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1457` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sadece İzleyen Maymun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1458` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 121. İş Hayatında Duygusal Zeka

**Yazar:** Daniel Goleman  
**Kategori:** Liderlik  
**Yil:** 1998  
**Durum:** DB'DE KAYITLI · `list_no:121` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Liderlik ve duygusal bulaşıcılık — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1459` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
2. [x] **DB'DE KAYITLI** — Beş yetkinlik çerçevesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1460` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Öz farkındalığın gücü ve kör nokta — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1461` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 122. Kalıcı Hafıza

**Yazar:** Joshua Foer  
**Kategori:** Öğrenme  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:122` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Seyirciden şampiyona — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1462` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Çöken salon ve oturma düzeni — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1463` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Unutamayan adam — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1464` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 123. Etkileyici Konuşma

**Yazar:** Carmine Gallo  
**Kategori:** İletişim  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:123` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — TED sahnesindeki üç sır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1465` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Beyin dostu hikaye anlatımı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1466` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kural yüzde elli sekiz — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1467` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 124. Büyük Fikirler

**Yazar:** Steven Johnson  
**Kategori:** Yaratıcılık  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:124` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Londra'nın Kahvehaneleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1468` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yavaş Sezgi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1469` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bitişik Olanak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1470` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 125. Dinlenmenin Gücü

**Yazar:** Alex Soojung-Kim Pang  
**Kategori:** Verimlilik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:125` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Darwin'in Dört Saatlik Günü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1471` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Churchill'in Derin Oyunu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1473` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 126. İnsanlığın Kısa Tarihi

**Yazar:** Yuval Noah Harari  
**Kategori:** Tarih  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:126` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Muz Karşılığı Vaat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1474` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Tarım devrimi — insanlığın en büyük aldatmacası — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1475` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5
3. [x] **DB'DE KAYITLI** — Mutluluk ve anlam — tarihsel perspektif — **Sure:** 1 dk · **Kelime:** 800 ±100 — `story_id:1476` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→5

## 127. Homo Deus

**Yazar:** Yuval Noah Harari  
**Kategori:** Gelecek  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:127` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ölümsüzlük projesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1477` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Veri dini ve algoritmik otorite — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1478` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Özgür irade yanılsaması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1479` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 128. 21. Yüzyıl İçin 21 Ders

**Yazar:** Yuval Noah Harari  
**Kategori:** Güncel  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:128` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yapay zeka ve iş gücünün geleceği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1480` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dezenformasyon çağı ve gerçeği bulmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1481` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Meditasyon ve öz tanıma çağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1482` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 129. The Fearless Organization

**Yazar:** Amy Edmondson  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:129` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Columbia Toplantısındaki Sessizlik — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1483` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — En iyi ekipler çok hata bildirdi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1484` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — En İyi Ekipler Neden Daha Çok Hata Bildiriyordu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1736` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 130. Çalınan Dikkat

**Yazar:** Johann Hari  
**Kategori:** Verimlilik  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:130` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Johann Hari'nin telefon deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1486` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Dikkat ekonomisi ve dikkat mimarisi — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1487` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Odaklanmanın gerçek düşmanları — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1488` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 131. Bağımlılık Çağı

**Yazar:** Johann Hari  
**Kategori:** Toplum  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:131` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rat Park deneyi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1489` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Portekiz'in uyuşturucu yasası — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1490` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 132. Kayıp Bağlantılar

**Yazar:** Johann Hari  
**Kategori:** Psikoloji  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:132` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — On sekiz yaşında bir ilaç, dokuz neden — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1492` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yüzde on üç ve kontrol — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1493` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bir inek ve bir gelecek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1494` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 133. Güçlü Yönler Bulma

**Yazar:** Marcus Buckingham  
**Kategori:** Kariyer  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:133` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zayıfları düzeltmek değil güçlüleri geliştirmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1495` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Akış anı ve yetenek işareti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1496` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Gallup araştırması ve iş tatmini — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1497` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 134. Kabile Liderliği

**Yazar:** Dave Logan  
**Kategori:** Liderlik  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:134` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ben, benim, bana — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1498` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Düşman büyüdükçe kabile güçlenir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1499` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İkiliden üçlüye — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1500` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 135. Korkudan Öğrenmek

**Yazar:** Gavin de Becker  
**Kategori:** Güvenlik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:135` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Merdivendeki kedi maması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1501` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Gerçek korku, üretilen endişe — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1502` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Nezaket gibi görünen işaretler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1503` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 136. Müzakerede Evet Almak

**Yazar:** Roger Fisher  
**Kategori:** Müzakere  
**Yil:** 1981  
**Durum:** DB'DE KAYITLI · `list_no:136` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üçüncü pencere — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1504` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Elinizdeki alternatif — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1505` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Biri keser, öteki seçer — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1506` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 137. Değişim Yönetimi

**Yazar:** John Kotter  
**Kategori:** Yönetim  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:137` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kötü Anketi Yayımlayan Başkan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1507` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Koalisyonda Kim Oturmalı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1508` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Görünür İlk Kazanım — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1509` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 138. Pratik Stoacılık

**Yazar:** William Irvine  
**Kategori:** Felsefe  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:138` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kaybı kısaca hayal etmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1510` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kazanmak değil, en iyi oynamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1511` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yatmadan önce hesaplaşma — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1512` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 139. Yıkıcı İnovasyon

**Yazar:** Clayton Christensen  
**Kategori:** İş Dünyası  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:139` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dinlemek Liderliği Kaybettirince — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1513` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Müşteriyi dinleyen sürücü üreticileri — **Sure:** 4 dk · **Kelime:** ~716 — `story_id:1514` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Seagate'in rafa kalkan prototipi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1515` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 140. Müşteri Geliştirme

**Yazar:** Rob Fitzpatrick  
**Kategori:** Girişimcilik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:140` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Annenin evet'i bedava — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1516` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Müşterinin altın görünümlü pirinci — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1517` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Toplantıdan sonra ne olacak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1518` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 141. İç Yolculuk

**Yazar:** Michael A. Singer  
**Kategori:** Farkındalık  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:141` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Evin kiracısı değil sahibi olmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1519` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kalbi açık tutmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1520` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bırakmak ve gerçek özgürlük — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1521` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 142. Az Gitme Yolu

**Yazar:** M. Scott Peck  
**Kategori:** Psikoloji  
**Yil:** 1978  
**Durum:** DB'DE KAYITLI · `list_no:142` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sevgi ve disiplinin birlikte çalışması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1522` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Gerçeği kabul etme cesareti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1523` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Sorumluluk ve kurban kimliği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1524` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 143. Parça Parça Yazmak

**Yazar:** Anne Lamott  
**Kategori:** Yazarlık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:143` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Önce berbat taslak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1525` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kuş kuş ilerlemek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1526` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kavanozdaki fareler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1527` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 144. Çevik Yönetim

**Yazar:** Jeff Sutherland  
**Kategori:** Yönetim  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:144` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Scrum'ın doğuşu — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1528` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Günlük stand-up ve şeffaflık — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1529` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Tahmin etmek değil ölçmek — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1530` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3

## 145. SPIN Satış

**Yazar:** Neil Rackham  
**Kategori:** Satış  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:145` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İmzasız biten başarılı görüşme — **Sure:** 4 dk · **Kelime:** ~750 — `story_id:1531` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Değeri alıcının ağzından duymak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1532` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Önce ihtiyaç, sonra fayda — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1533` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 146. Black Box Thinking

**Yazar:** Matthew Syed  
**Kategori:** Felsefe  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:146` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Portland Üzerinde Dönen Uçak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1534` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bilişsel uyumsuzluk — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1535` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Marjinal kazanımlar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1536` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Kokpitte Kaptana İtiraz Etmek Neden Bir Güvenlik Kuralına Dönüştü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1732` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 147. Sıçramak

**Yazar:** Matthew Syed  
**Kategori:** Başarı  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:147` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 10.000 saat ve zor kısım — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1537` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bir sokak, bir koç, bir kulüp — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1538` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Uzman neden tıkanır — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1539` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 148. Peçete Arkası

**Yazar:** Dan Roam  
**Kategori:** Yaratıcılık  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:148` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çizemem diyenlere — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1540` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Resmin hangi tarafı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1541` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Üç nokta, üç ok — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1542` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 149. Evet Dedirtmek

**Yazar:** Noah Goldstein  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:149` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sosyal kanıt — otelin havlu deneyi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1543` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Taahhüt ve tutarlılık — küçük evet büyük evete zemin hazırlar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1544` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kıtlık ve kayıp korkusu — kazanmak değil kaybetmemek motive eder — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1545` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 150. İkinci Makine Çağı

**Yazar:** Erik Brynjolfsson  
**Kategori:** Teknoloji  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:150` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Satranç makinesi ve insan-makine işbirliği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1546` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Moore Yasası ve bileşik büyümenin kavranmayan gücü — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1547` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Beyin sermayesi çağı — idealar maddi kaynaklardan daha değerli — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1548` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3

## 151. Ölçülebilir Büyüme

**Yazar:** Gino Wickman  
**Kategori:** Yönetim  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:151` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vizyonun kağıtta kalması — EOS neden işletmeleri kurtarıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1549` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Doğru kişi, doğru yer — GWC testi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1550` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
3. [x] **DB'DE KAYITLI** — Haftalık L10 toplantısı — kaosun ritme dönüşmesi — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1551` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3

## 152. The Five Dysfunctions of a Team

**Yazar:** Patrick Lencioni  
**Kategori:** Liderlik  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:152` · 4/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Napa'da Sorulan En Kötü İş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1552` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Uyumlu Toplantılar Neden Susar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1553` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bu Rakam Kimin? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1554` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Lencioni’nin Piramidi Neden Güvenle Başlar? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1735` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 153. İş Modeli Üretimi

**Yazar:** Alexander Osterwalder  
**Kategori:** Girişimcilik  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:153` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Business Model Canvas — bir sayfada tüm iş modeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1555` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Ücretsiz iş modeli — Google nasıl bedavaya milyarlar kazanıyor — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1556` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İş modeli inovasyonu — rakibi taklit etmek değil yeniden tasarlamak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1557` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3

## 154. Radikal Kabul

**Yazar:** Tara Brach  
**Kategori:** Farkındalık  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:154` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sadece acıyor, yanlış değil — **Sure:** 4 dk · **Kelime:** ~712 — `story_id:1558` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Annenin fısıldadığı cümle — **Sure:** 4 dk · **Kelime:** ~754 — `story_id:1559` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Oğlunun kapısında beklemek — **Sure:** 4 dk · **Kelime:** ~870 — `story_id:1560` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 155. Farkındalık Temelli Yaşam

**Yazar:** Jon Kabat-Zinn  
**Kategori:** Sağlık  
**Yil:** 1990  
**Durum:** DB'DE KAYITLI · `list_no:155` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Jon Kabat-Zinn'in hastanesi — MBSR'nin doğuşu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1561` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Otomatik pilot — zihnin nerede olduğundan habersiz yaşamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1562` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Tam felaket — zorluğu kucaklamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1563` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 156. Bilinçli Liderlik

**Yazar:** Jim Dethmer, Diana Chapman, Kaley Warner Klemp  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:156` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çizginin Altında ya da Üstünde — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1564` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yüzde Yüz Sorumluluk — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1565` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Duyguyu Bedende Bulmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1566` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 157. Yetenek Kodu

**Yazar:** Daniel Coyle  
**Kategori:** Başarı  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:157` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Brunio'nun yavaşlattığı hareket — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1567` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İlk Nota Çalmadan Önce Sorulan Soru — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1568` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Spartak'ta Topsuz Vuruş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1569` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 158. Kültür Kodu

**Yazar:** Daniel Coyle  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:158` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İlk beş dakikanın sensörü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1570` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ben bunu berbat ettim — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1571` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Granite kazınmış 311 sözcük — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1572` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 159. Hataları Kucaklamak

**Yazar:** Carol Tavris  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:159` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Savcının ses kaydı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1573` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Çok geç basılan kitap — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1574` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Piramidin tepesinde iki öğrenci — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1575` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 160. İşte Anlam

**Yazar:** Daniel Pink  
**Kategori:** Motivasyon  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:160` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ödül paradoksu — para motivasyonu öldürebilir — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1576` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Özerklik — kontrol etmek değil yönlendirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1577` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Amaç — para ve statünün ötesindeki üçüncü katman — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1578` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 161. Satışın Yeni Yüzü

**Yazar:** Daniel Pink  
**Kategori:** Satış  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:161` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Satışsız satış — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1579` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bilgi artık alıcıda — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1580` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Masadaki 27 nesne — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1581` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 162. Bütün Beyin

**Yazar:** Daniel Pink  
**Kategori:** Yaratıcılık  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:162` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sol beyin çağının sonu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1582` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İşlevin Ötesinde Tasarım — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1583` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Paranın ötesinde anlam — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1584` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 163. Sirkadyen Kod

**Yazar:** Satchin Panda  
**Kategori:** Sağlık  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:163` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üç öğün, on beş saat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1585` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aynı yemek, farklı saat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1586` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Gözdeki ikinci iş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1587` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 164. Uzun Yaşam Bilimi

**Yazar:** David Sinclair  
**Kategori:** Sağlık  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:164` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yaşlanma bir hastalık mı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1588` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Konfor alarmı uyutur mu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1589` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Büyümek mi, onarmak mı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1590` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 165. Uzun Ömür

**Yazar:** Peter Attia  
**Kategori:** Sağlık  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:165` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Marjinal onyıl — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1591` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dört süvari — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1592` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kondisyon bir gösterge — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1593` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 166. Beyin ve Diyet

**Yazar:** David Perlmutter  
**Kategori:** Sağlık  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:166` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Gluten ve beyin — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1594` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yağ Çıktı, Şeker Girdi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1595` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — BDNF ve beyin — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1596` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 167. İyi Bağırsak

**Yazar:** Justin Sonnenburg  
**Kategori:** Sağlık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:167` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mikrobiyom — içimizdeki gizli organ — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1597` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Beyin-bağırsak aksı — duygu ve mikrop bağlantısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1598` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Lif — mikrobiyomun birincil yakıtı ve modern diyetin en büyük eksikliği — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1599` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3

## 168. Nefes

**Yazar:** James Nestor  
**Kategori:** Sağlık  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:168` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — On gün tıkalı burun — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1600` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dakikada altı nefes — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1601` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Bohr etkisi ve yavaş nefes — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1602` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 169. Soğuk Yöntem

**Yazar:** Wim Hof  
**Kategori:** Sağlık  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:169` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kutup Dairesi'nin Kuzeyinde Çıplak Ayak Yarı Maraton — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1603` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Duşun son yarım dakikası — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1604` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — 12'ye 12: nefes denemesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1605` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 170. Zengin Olmayı Öğrenmek

**Yazar:** Ramit Sethi  
**Kategori:** Finans  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:170` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ayın yedisine kadar karar yok — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1606` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kahveye dokunmayan para planı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1607` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 171. Mantıklı Borsa

**Yazar:** John Bogle  
**Kategori:** Finans  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:171` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Elli yılın küçük ücreti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1609` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İğneyi aramayın — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1610` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yüzde 12,5'e karşı 7,3 — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1611` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 172. Komşu Milyoner

**Yazar:** Thomas Stanley  
**Kategori:** Finans  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:172` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yaş Çarpı Gelir, Bölü On — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1612` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Aile parası ve yüzde 57 — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1613` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Walmart'ta on yıl, sıfır hisse — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1614` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 173. Borç Devrimi

**Yazar:** Dave Ramsey  
**Kategori:** Finans  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:173` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Borç Kartopu: Önce En Küçüğü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1615` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Acil durum fonu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1616` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Paranın patronu olmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1617` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 174. İlişki Psikolojisi

**Yazar:** Sue Johnson  
**Kategori:** İlişkiler  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:174` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Duygusal bağ — yetişkin bağlanmasının temel ihtiyacı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1618` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Şeytan döngüsü — saldır ve çekil sarmalı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1619` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Hold me tight anı — yeniden bağlanmanın kapısı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1620` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 175. Bağlanma Teorisi

**Yazar:** Amir Levine  
**Kategori:** İlişkiler  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:175` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üç bağlanma stili — güvenli, kaygılı, kaçıngan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1621` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Kaçıngan paradoksu — yakınlık isteyen ama uzaklaşan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1622` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kaygılı-kaçıngan tuzağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1623` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 176. Duygusal Olgunlaşmamış Ebeveynler

**Yazar:** Lindsay Gibson  
**Kategori:** Psikoloji  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:176` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bakım Var, Duyulma Yok — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1624` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Ebeveynin İhtiyacı Önce Geldiğinde — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1625` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İyileşme Fantezisini Bırakmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1626` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 177. Travma ve İyileşme

**Yazar:** Judith Herman  
**Kategori:** Psikoloji  
**Yil:** 1992  
**Durum:** DB'DE KAYITLI · `list_no:177` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çare değil özen — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1628` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 178. Bedenin Hayır Demesi

**Yazar:** Gabor Maté  
**Kategori:** Sağlık  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:178` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hayır Diyemeyen Kişi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1630` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Stres ve bağışıklık — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1631` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — İyileşmenin Yedi A'sı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1632` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 179. Dağınık Beyin

**Yazar:** Gabor Maté  
**Kategori:** Psikoloji  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:179` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Budapeşte'de Ağlayan Bebek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1633` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sevdiği İşe Odaklanan Öğretim Görevlisi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1634` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — John'un Karnesi ve Babasının Sözleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1635` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 180. Her Şey Gerçek Olabilir

**Yazar:** Gabor Maté  
**Kategori:** Bağımlılık  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:180` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bağımlılık bir seçim değil — acının dili — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1636` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Toksik toplum — bağımlılığı besleyen sistem — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1637` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Şefkatin nörobilimi — bağlantı bağımlılığın panzehiri — **Sure:** 4 dk · **Kelime:** ~726 — `story_id:1638` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 181. Özgür Olmak 2

**Yazar:** Brené Brown  
**Kategori:** Kişisel Gelişim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:181` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yeterince iyi olmak — mükemmeliyetçiliğin gerçek bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1639` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Utanç ve suçluluk — birbirinden çok farklı iki his — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1640` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Minnettarlık ve neşe — en cesur duygular — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1641` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 182. Güçlü Kalkmak

**Yazar:** Brené Brown  
**Kategori:** Dayanıklılık  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:182` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Arenada olmak — düşme cesareti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1642` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Hikaye tamamlama — beyin boşluğu nasıl dolduruyor — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1643` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Devrilme ve kalkış — iyileşmenin üç aşaması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1644` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 183. Çölde Yürümek

**Yazar:** Brené Brown  
**Kategori:** Topluluk  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:183` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Gerçek aitlik — onay için değil özgünlük için — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1645` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Kutup yıldızı değerleri — kalabalığa rağmen yolunu bulmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1646` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Ortak ağrı — yalnızlığı aşmanın beklenmedik yolu — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1647` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 184. Kalbin Haritası

**Yazar:** Brené Brown  
**Kategori:** Duygular  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:184` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Üç kelime, seksen yedi duygu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1648` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — İki kişi mi, üç kişi mi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1649` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kin kıskançlığın komşusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1650` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 185. Akış Bulmak

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Psikoloji  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:185` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Akış deneyimi — zamanın eridiği bilinç hali — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1651` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Günlük hayatta akış — sıradan anların dönüşümü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1652` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Yaşam kalitesi ve akış — mutluluğun yanlış aranması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1653` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 186. Yaratıcılık ve Akış

**Yazar:** Mihaly Csikszentmihalyi  
**Kategori:** Yaratıcılık  
**Yil:** 1996  
**Durum:** DB'DE KAYITLI · `list_no:186` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zıt çiftler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1654` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Yaratıcı süreç — hazırlık, kuluçka ve aydınlanma — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1655` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Birey, alan ve saha — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1656` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 187. İçgüdüsel Yeme

**Yazar:** Evelyn Tribole  
**Kategori:** Sağlık  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:187` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Diyet kültürünün reddi — besinleri ahlaki kategoriden çıkarmak — **Sure:** 1 dk · **Kelime:** 475 ±75 — `story_id:1657` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de · sure uyumsuz: 1→3
2. [x] **DB'DE KAYITLI** — Açlık ve tokluk — beden sinyallerine yeniden bağlanmak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1658` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Duygusal yeme — besinden beklenen şey besin veremez — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1659` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 188. Yeniden Doğmak

**Yazar:** David Brooks  
**Kategori:** Felsefe  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:188` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İlk dağın bedeli — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1660` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Zincirli piyano — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1661` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Dört boş kutu — **Sure:** 4 dk · **Kelime:** ~700 — `story_id:1662` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 189. Yeni Toprak

**Yazar:** Eckhart Tolle  
**Kategori:** Farkındalık  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:189` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Metrodaki kadın ve kafadaki ses — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1663` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Evlilikte acı beden — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1664` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Şimdi'nin üç yüzü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1665` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 190. İçsel Barış

**Yazar:** Thich Nhat Hanh  
**Kategori:** Farkındalık  
**Yil:** 1991  
**Durum:** DB'DE KAYITLI · `list_no:190` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Her adım bir dua — yürürken farkındalık — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1666` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öfkeli bir mektup göndermemek — duyguya alan tanımak — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1667` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — İnterbeing — her şeyin birbirine bağlılığı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1668` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 191. Öfke

**Yazar:** Thich Nhat Hanh  
**Kategori:** Psikoloji  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:191` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Öfkeyi pişirmek — soğutma değil dönüştürme — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1669` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
2. [x] **DB'DE KAYITLI** — Öfkeli bebeği taşımak — şefkatli bakım pratiği — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1670` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de
3. [x] **DB'DE KAYITLI** — Bağlantısı kesilen bir zihin — öfkenin gerçek kaynağı — **Sure:** 1 dk · **Kelime:** 160 ±40 — `story_id:1671` · `v:1` — **Diller:** de,en,es,tr — **Varyant:** yok — ⚠ eksik varyant: tr/en/es/de

## 194. Yeni Başlayanlar İçin Meditasyon

**Yazar:** Andy Puddicombe  
**Kategori:** Farkındalık  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:194` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yoldaki parlak araba — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1678` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — On yıl, on dakika — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1679` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 195. Meditasyonla İyileşme

**Yazar:** Robert Wright  
**Kategori:** Farkındalık  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:195` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çalıdaki hışırtıya sıçrayan zihin — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1680` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bugün Hâlâ Geçerli Olan Tarihsel Ders — Why Buddhism Is True — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 196. The Shallows

**Yazar:** Nicholas Carr  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:196` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir iki sayfa sonra dikkat kayıyor — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1681` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Nicholas Carr Neden Bir Kitabı Bitiremez Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1717` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 197. Dikkatin Gücü

**Yazar:** Daniel Goleman  
**Kategori:** Verimlilik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:197` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İç, Öteki ve Dış Odak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1683` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Dikkat Bir Kas Gibi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1684` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 198. Duygusal Çeviklik

**Yazar:** Susan David  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:198` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Düşünce Kancasından Çıkmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1685` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Duygu Gösterir, Değer Yönlendirir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1686` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 199. Psikolojik Esneklik

**Yazar:** Russ Harris  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:199` · 2/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mücadele düğmesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1687` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Düşünce, yalnızca düşünce — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1688` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 200. Bütünleşik Zekanın Gücü

**Yazar:** Travis Bradberry  
**Kategori:** Psikoloji  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:200` · 3/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — IQ, Kişilik ve EQ — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1689` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Önce Adlandır, Sonra Değerlendir — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1690` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Suçlamada Çözüm Cümlesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1691` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 201. Rakipler Takımı

**Yazar:** Doris Kearns Goodwin  
**Kategori:** Tarih  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:201` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Lincoln Neden Rakiplerini Kabinesine Aldı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1692` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 202. Endurance

**Yazar:** Alfred Lansing  
**Kategori:** Tarih  
**Yil:** 1959  
**Durum:** DB'DE KAYITLI · `list_no:202` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Shackleton'ın 800 Millik Kurtuluş Yolculuğu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1693` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 203. Seabiscuit

**Yazar:** Laura Hillenbrand  
**Kategori:** Tarih  
**Yil:** 2001  
**Durum:** DB'DE KAYITLI · `list_no:203` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Seabiscuit Büyük Buhran'a Nasıl Umut Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1694` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 204. Midnight in Chernobyl

**Yazar:** Adam Higginbotham  
**Kategori:** Tarih  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:204` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Çernobil Gecesi Kontrol Odasında Ne Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1695` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 205. Predictably Irrational

**Yazar:** Dan Ariely  
**Kategori:** Psikoloji  
**Yil:** 2008  
**Durum:** DB'DE KAYITLI · `list_no:205` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bedavanın Gizli Maliyeti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1696` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 206. The Power of Regret

**Yazar:** Daniel H. Pink  
**Kategori:** Psikoloji  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:206` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bronz Madalya Kazananlar Neden Daha Mutlu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1697` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 207. Steve Jobs

**Yazar:** Walter Isaacson  
**Kategori:** Liderlik  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:207` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Steve Jobs'ın Kaligrafi Dersi Mac'i Nasıl Değiştirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1698` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 208. The Founders

**Yazar:** Jimmy Soni  
**Kategori:** Liderlik  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:208` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — PayPal'ın Rakip Kurucuları Nasıl Takım Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1699` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 209. A Random Walk Down Wall Street

**Yazar:** Burton G. Malkiel  
**Kategori:** Finans  
**Yil:** 1973  
**Durum:** DB'DE KAYITLI · `list_no:209` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Rastgele Yürüyen Bir Piyasa Yenilebilir mi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1700` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 210. The Checklist Manifesto

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:210` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Basit Bir Kontrol Listesi Kaç Hayat Kurtarabilir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1701` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 211. The Comfort Crisis

**Yazar:** Michael Easter  
**Kategori:** Sağlık  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:211` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Konfor Alanı Bedenimizi Nasıl Zayıflatıyor? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1702` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 212. The Boys in the Boat

**Yazar:** Daniel James Brown  
**Kategori:** Tarih  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:212` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dokuz İşçi Sınıfı Genci Berlin’de Tarihe Nasıl Dokundu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1710` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Dokuz Kürekçi Hitler'in Olimpiyatlarında — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 213. The Simple Path to Wealth

**Yazar:** J. L. Collins  
**Kategori:** Finans  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:213` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Pirinç ve Fasulyeyle Yaşayan Keşişin Cevabı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1711` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Finansal Özgürlüğün Tek Yolluk Formülü — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 77/100

## 214. The Republic

**Yazar:** Plato  
**Kategori:** Felsefe  
**Yil:** c. 375 BCE  
**Durum:** DB'DE KAYITLI · `list_no:214` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Platon’a Göre İktidarı En Çok Kim Hak Eder? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1712` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Platon'un Mağarasından Kim Çıkmak İster? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 215. Rubicon

**Yazar:** Tom Holland  
**Kategori:** Tarih  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:215` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sezar Rubicon’u Geçtiğinde Neden Geri Dönüş Yoktu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1718` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Sezar Rubicon'u Geçtiğinde — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 216. A Short History of Nearly Everything

**Yazar:** Bill Bryson  
**Kategori:** Bilim  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:216` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kıtalar Bir Yapboz Gibi Uyuşuyorsa Tesadüf müydü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1721` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bilimin En Büyük Sorularını Sorabilmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 217. Chatter

**Yazar:** Ethan Kross  
**Kategori:** Psikoloji  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:217` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kendi Adını Söylemek Stresi Nasıl Azaltabilir? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1716` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kafamızdaki Ses Ne Zaman Düşmana Dönüşür? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 218. Creativity, Inc.

**Yazar:** Ed Catmull ve Amy Wallace  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:218` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Pixar’da Bir Filmi Kurtaran Toplantının Patronu Yoktu — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1722` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Pixar'ın Filmleri Kurtaran Beyin Takımı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 219. Complications

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2002  
**Durum:** DB'DE KAYITLI · `list_no:219` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yorgun Bir Asistan Kendi Sınırını Görebilir mi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1719` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Cerrahın Hatalarını Açıklama Cesareti — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 220. You're Not Listening

**Yazar:** Kate Murphy  
**Kategori:** İletişim  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:220` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dinlemek Neden Konuşmaktan Daha Zordur? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1714` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 221. The Devil in the White City

**Yazar:** Erik Larson  
**Kategori:** Tarih  
**Yil:** 2003  
**Durum:** DB'DE KAYITLI · `list_no:221` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — George Ferris Paris’in Kulesine Nasıl Cevap Verdi? — **Sure:** 5 dk · **Kelime:** 800 ±100 — `story_id:1731` · `v:Opus55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Şikago Fuarındaki Beyaz Şehir ve Karanlık Sır — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100

## 222. The Gene

**Yazar:** Siddhartha Mukherjee  
**Kategori:** Bilim  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:222` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Mendel’in Bezelyeleri Neden Otuz Yıl Sessiz Kaldı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1726` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Mendel'in Unutulan Bezelyeleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 223. An Immense World

**Yazar:** Ed Yong  
**Kategori:** Bilim  
**Yil:** 2022  
**Durum:** DB'DE KAYITLI · `list_no:223` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Filler Ayaklarıyla Kilometrelerce Öteyi Nasıl Dinliyor? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1729` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 224. Noise

**Yazar:** Daniel Kahneman, Olivier Sibony ve Cass R. Sunstein  
**Kategori:** Psikoloji  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:224` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aynı Dosyaya Bakan Uzmanlar Neden Farklı Fiyat Söyledi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1727` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Aynı Karara Farklı Günlerde Farklı Cevap Vermek — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## 225. The Undoing Project

**Yazar:** Michael Lewis  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:225` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aynı Limuzin, Aynı Trafik: Kim Daha Çok Üzülür? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1734` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kahneman ile Tversky'nin Zihinleri Değiştiren Dostluğu — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100

## 226. The Righteous Mind

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2012  
**Durum:** DB'DE KAYITLI · `list_no:226` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kirli Bir Masa Ahlaki Yargıyı Etkiler mi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1738` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Ahlaki Kararlarımızı Yöneten Fil ve Binici — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 227. Pour Your Heart Into It

**Yazar:** Howard Schultz ve Dori Jones Yang  
**Kategori:** Liderlik  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:227` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Milano’daki Espresso Barları Howard Schultz’a Ne Gösterdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1740` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Starbucks'ın Üçüncü Mekân Fikri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 228. Guns, Germs, and Steel

**Yazar:** Jared Diamond  
**Kategori:** Tarih  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:228` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — 168 Kişi Bir İmparatorluğu Nasıl Esir Aldı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1743` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Zebralar Neden Ata Dönüşmedi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 229. Collapse

**Yazar:** Jared Diamond  
**Kategori:** Tarih  
**Yil:** 2005  
**Durum:** DB'DE KAYITLI · `list_no:229` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Küçük Bir Ada Çöküşten Nasıl Kaçtı? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1744` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Paskalya Adası'nın Kesilen Son Ağacı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 230. The Silk Roads

**Yazar:** Peter Frankopan  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:230` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şahın Fiyatı: Pers Petrolünün Kapısı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1745` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kara Ölüm İpek Yolu'nda Nasıl Yolculuk Etti? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 87/100

## 231. SPQR

**Yazar:** Mary Beard  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:231` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Roma'yı Büyüten Sıra Dışı Karar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1746` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Roma Düşmanlarını Nasıl Yurttaşa Dönüştürdü? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 232. The Wright Brothers

**Yazar:** David McCullough  
**Kategori:** Tarih  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:232` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bisikletçilerin Rüzgar Tüneli — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1747` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Bisikletçinin Uçma Takıntısı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 233. Into Thin Air

**Yazar:** Jon Krakauer  
**Kategori:** Tarih  
**Yil:** 1997  
**Durum:** DB'DE KAYITLI · `list_no:233` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Everest'te Saat İkiyi Geçince — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1748` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Everest'te Karar Vermenin Ölümcül Bedeli — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 234. Unbroken

**Yazar:** Laura Hillenbrand  
**Kategori:** Tarih  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:234` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Okyanusta 47 Gün: Louis Zamperini — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1749` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Louis Zamperini'nin Kırılamayan İradesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## 235. Hidden Figures

**Yazar:** Margot Lee Shetterly  
**Kategori:** Tarih  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:235` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — John Glenn'in Güvendiği Hesap — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1750` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — NASA'yı Değiştiren Görünmez Matematikçiler — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## 236. The Splendid and the Vile

**Yazar:** Erik Larson  
**Kategori:** Tarih  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:236` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bombardıman Altında Görünür Olmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1751` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Churchill'in En Karanlık Yılında Liderlik — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 77/100

## 237. Say Nothing

**Yazar:** Patrick Radden Keefe  
**Kategori:** Tarih  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:237` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sessizlik Antlaşması Nasıl Çözüldü? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1752` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Cinayetin Kuzey İrlanda'da Bıraktığı Sessizlik — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 238. The Wager

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2023  
**Durum:** DB'DE KAYITLI · `list_no:238` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aynı Kazadan İki Farklı Gerçek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1753` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Batık Gemi Mürettebatının İmkânsız Seçimi — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 239. Killers of the Flower Moon

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:239` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zenginliğin Ölümcül Olduğu Topraklar — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1754` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Osage Cinayetleri ve Petrol Serveti — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 240. The Lost City of Z

**Yazar:** David Grann  
**Kategori:** Tarih  
**Yil:** 2009  
**Durum:** DB'DE KAYITLI · `list_no:240` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Amazon'un Yuttuğu Kaşif — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1755` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Amazon'da Kaybolan Kaşif Percy Fawcett — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 241. Cosmos

**Yazar:** Carl Sagan  
**Kategori:** Bilim  
**Yil:** 1980  
**Durum:** DB'DE KAYITLI · `list_no:241` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Gölgesiz Öğle Vakti — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1756` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Dünya'nın Soluk Mavi Noktası — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100

## 242. A Brief History of Time

**Yazar:** Stephen Hawking  
**Kategori:** Bilim  
**Yil:** 1988  
**Durum:** DB'DE KAYITLI · `list_no:242` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Tek Denklemin Riski — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1757` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Kara Deliklerin Tamamen Kara Olmadığı An — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 76/100

## 243. The Code Breaker

**Yazar:** Walter Isaacson  
**Kategori:** Bilim  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:243` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bakterilerin Sakladığı Makas — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1758` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — CRISPR'ı Başlatan Beklenmedik Bakteri Savunması — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 80/100

## 244. The Immortal Life of Henrietta Lacks

**Yazar:** Rebecca Skloot  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:244` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ölmeyi Reddeden Hücreler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1759` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Henrietta Lacks'in Ölümsüz Hücreleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 245. The Hidden Life of Trees

**Yazar:** Peter Wohlleben  
**Kategori:** Bilim  
**Yil:** 2015  
**Durum:** DB'DE KAYITLI · `list_no:245` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ağaçların Gizli Ağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1760` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Ağaçların Gizli İletişim Ağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 79/100

## 246. Entangled Life

**Yazar:** Merlin Sheldrake  
**Kategori:** Bilim  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:246` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Ne Bitki Ne Hayvan: Mantarların Dünyası — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1761` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Mantarların Dünyayı Birbirine Bağlayan Ağı — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 86/100

## 247. Longitude

**Yazar:** Dava Sobel  
**Kategori:** Bilim  
**Yil:** 1995  
**Durum:** DB'DE KAYITLI · `list_no:247` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Denizde Kaybolmayı Bitiren Saat — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1762` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Denizcilerin Hayatını Kurtaran Boylam Saati — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 89/100

## 248. The Disappearing Spoon

**Yazar:** Sam Kean  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:248` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Elinde Eriyen Kaşık — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1763` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Galyumdan Yapılan Kaybolan Kaşık — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 249. The Poisoner's Handbook

**Yazar:** Deborah Blum  
**Kategori:** Bilim  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:249` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Zehirin Cezasız Kaldığı Çağ — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1764` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Zehri Bilime Dönüştüren Adli Tıp Dedektifleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 90/100

## 250. The Radium Girls

**Yazar:** Kate Moore  
**Kategori:** Bilim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:250` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Fırçayı Dudağında Sivriltmek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1765` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Radyum Kızlarının Karanlıkta Parlayan Dişleri — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 83/100

## 251. The Butchering Art

**Yazar:** Lindsey Fitzharris  
**Kategori:** Bilim  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:251` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Görünmeyen Katili Yıkamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1766` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Cerrahiyi Değiştiren Kirli Önlük — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 81/100

## 252. Surely You're Joking, Mr. Feynman!

**Yazar:** Richard P. Feynman ve Ralph Leighton  
**Kategori:** Bilim  
**Yil:** 1985  
**Durum:** DB'DE KAYITLI · `list_no:252` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sallanan Tabaktan Nobel’e — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1767` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Feynman'ın Kasa Açma Merakı — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 78/100

## 253. The Anxious Generation

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2024  
**Durum:** DB'DE KAYITLI · `list_no:253` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Oyun Bahçesinden Ekrana Geçiş — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1768` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Telefonla Büyüyen Kaygılı Nesil — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 254. Behave

**Yazar:** Robert M. Sapolsky  
**Kategori:** Psikoloji  
**Yil:** 2017  
**Durum:** DB'DE KAYITLI · `list_no:254` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bir Davranışın Bir Saniye Öncesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1769` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Babunlarda Statü ve Stresin Bedeli — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 85/100

## 255. The Lucifer Effect

**Yazar:** Philip Zimbardo  
**Kategori:** Psikoloji  
**Yil:** 2007  
**Durum:** DB'DE KAYITLI · `list_no:255` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — İyi İnsanları Değiştiren Rol — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1770` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Hapishane Deneyi Kontrolden Nasıl Çıktı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## 256. The Man Who Mistook His Wife for a Hat

**Yazar:** Oliver Sacks  
**Kategori:** Psikoloji  
**Yil:** 1985  
**Durum:** DB'DE KAYITLI · `list_no:256` · 0/10 hikaye · 4/4 dil

*Hikaye yok.*

## 257. Incognito

**Yazar:** David Eagleman  
**Kategori:** Psikoloji  
**Yil:** 2011  
**Durum:** DB'DE KAYITLI · `list_no:257` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kararı Sen mi Veriyorsun? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1772` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Beynin Senden Önce Verdiği Kararlar — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100

## 258. The Happiness Hypothesis

**Yazar:** Jonathan Haidt  
**Kategori:** Psikoloji  
**Yil:** 2006  
**Durum:** DB'DE KAYITLI · `list_no:258` · 0/10 hikaye · 4/4 dil

1. [ ] **URETILECEK** — Antik Bilgelik Mutluluk Hakkında Ne Biliyordu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## 259. The Confidence Game

**Yazar:** Maria Konnikova  
**Kategori:** Psikoloji  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:259` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dolandırıcının Gerçek Silahı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1774` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bir Dolandırıcının En Güçlü Silahı: Güven — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 260. Scarcity

**Yazar:** Sendhil Mullainathan ve Eldar Shafir  
**Kategori:** Psikoloji  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:260` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Yokluğun Zihni Daraltması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1775` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Şeker Kamışı Çiftçilerinin Kıtlık Zihni — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## 261. The Marshmallow Test

**Yazar:** Walter Mischel  
**Kategori:** Psikoloji  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:261` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Şimdiki Bir mi, Sonraki İki mi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1776` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Marshmallow Testinin Anlatmadığı Şey — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## 262. Shoe Dog

**Yazar:** Phil Knight  
**Kategori:** Liderlik  
**Yil:** 2016  
**Durum:** DB'DE KAYITLI · `list_no:262` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bagajdan Doğan Nike — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1777` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Phil Knight'ın Bagajdan Sattığı İlk Ayakkabılar — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 86/100

## 263. The Everything Store

**Yazar:** Brad Stone  
**Kategori:** Liderlik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:263` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Hoparlördeki Dört Buçuk Dakika — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1778` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Amazon'un Kapıdan Yapılan İlk Masaları — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 264. The Ride of a Lifetime

**Yazar:** Robert Iger  
**Kategori:** Liderlik  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:264` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Devralınan Şirketleri Değiştirmemek — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1779` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Disney Pixar'ı Satın Alırken Güveni Nasıl Kazandı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100

## 265. No Rules Rules

**Yazar:** Reed Hastings ve Erin Meyer  
**Kategori:** Liderlik  
**Yil:** 2020  
**Durum:** DB'DE KAYITLI · `list_no:265` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kural Kitabını Yırtmak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1780` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Netflix'in Sınırsız İzin Deneyi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## 266. Bad Blood

**Yazar:** John Carreyrou  
**Kategori:** Liderlik  
**Yil:** 2018  
**Durum:** DB'DE KAYITLI · `list_no:266` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kanla Kurulan Bir Yalan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1781` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Theranos'un Çalışmayan Kara Kutusu — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 77/100

## 267. The Hard Thing About Hard Things

**Yazar:** Ben Horowitz  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:267` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Kolay Cevabı Olmayan Kararlar — **Sure:** 4 dk · **Kelime:** ~709 — `story_id:1782` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Barış Zamanı CEO'su ile Savaş Zamanı CEO'su — **Sure:** 5 dk · **Kelime:** 800 ±100 — **Puan:** 80/100

## 268. The Intelligent Investor

**Yazar:** Benjamin Graham  
**Kategori:** Finans  
**Yil:** 1949  
**Durum:** DB'DE KAYITLI · `list_no:268` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Bay Piyasa ile Ortaklık — **Sure:** 2 dk · **Kelime:** ~451 — `story_id:1783` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Bay Piyasa Her Gün Kapını Çalarsa — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 76/100

## 269. Being Mortal

**Yazar:** Atul Gawande  
**Kategori:** Sağlık  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:269` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sonuna Kadar İyi Yaşamak — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1784` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Hayatın Sonunda Daha Fazla Tedavi Her Zaman Daha İyi mi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 87/100

## 270. Nonviolent Communication

**Yazar:** Marshall B. Rosenberg  
**Kategori:** İletişim  
**Yil:** 1999  
**Durum:** DB'DE KAYITLI · `list_no:270` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Suçlamanın Altındaki İhtiyaç — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1785` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Çakal Dili ile Zürafa Dili Arasındaki Fark — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## 271. Four Thousand Weeks

**Yazar:** Oliver Burkeman  
**Kategori:** Verimlilik  
**Yil:** 2021  
**Durum:** DB'DE KAYITLI · `list_no:271` · 1/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Dört Bin Haftalık Ömür — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1786` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
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

1. [x] **DB'DE KAYITLI** — Suyun Sessiz Gücü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1787` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [ ] **URETILECEK** — Suyun Gücü: Yumuşak Olan Sert Olanı Nasıl Aşar? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 97/100

## 273. Why Zebras Don't Get Ulcers

**Yazar:** Robert M. Sapolsky  
**Kategori:** Sağlık  
**Yil:** 1994  
**Durum:** DB'DE KAYITLI · `list_no:273` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Aslandan Kaçan Zebra — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1788` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bedenin Yakıtı Yanlış Yere Akınca — **Sure:** 2 dk · **Kelime:** ~409 — `story_id:1789` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Serengeti'de Bir Pavyan Sürüsü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1790` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Aynı Elektrik, İki Farklı Sıçan — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1791` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Barışı Öğrenen Sürü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1792` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Zebralar Neden Ülser Olmaz? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## 274. Delivering Happiness

**Yazar:** Tony Hsieh  
**Kategori:** Liderlik  
**Yil:** 2010  
**Durum:** DB'DE KAYITLI · `list_no:274` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Boş Konfeti — **Sure:** 2 dk · **Kelime:** ~431 — `story_id:1794` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Salondaki Ayakkabı Mağazası — **Sure:** 2 dk · **Kelime:** ~424 — `story_id:1795` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Telefonda Acele Yok — **Sure:** 2 dk · **Kelime:** ~447 — `story_id:1796` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Çıkış Kapısındaki Teklif — **Sure:** 2 dk · **Kelime:** ~422 — `story_id:1797` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Kültür Pazarlığı — **Sure:** 2 dk · **Kelime:** ~432 — `story_id:1798` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Zappos Mutluluğu Şirket Stratejisine Nasıl Çevirdi? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 88/100

## 275. The Culture Map

**Yazar:** Erin Meyer  
**Kategori:** Liderlik  
**Yil:** 2014  
**Durum:** DB'DE KAYITLI · `list_no:275` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Havayı Okumak — **Sure:** 2 dk · **Kelime:** ~435 — `story_id:1799` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Sandviçin İçindeki Eleştiri — **Sure:** 2 dk · **Kelime:** ~437 — `story_id:1800` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Evet'in Ağırlığı — **Sure:** 2 dk · **Kelime:** ~423 — `story_id:1801` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Sözleşmeden Önce Kahve — **Sure:** 2 dk · **Kelime:** ~428 — `story_id:1802` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Saatin İki Dili — **Sure:** 2 dk · **Kelime:** ~436 — `story_id:1803` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Aynı Geri Bildirim İki Kültürde Neden Ters Etki Yapar? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## 276. Grinding It Out

**Yazar:** Ray Kroc  
**Kategori:** Liderlik  
**Yil:** 1977  
**Durum:** DB'DE KAYITLI · `list_no:276` · 5/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Sekiz Mikserlik Sinyal — **Sure:** 2 dk · **Kelime:** ~406 — `story_id:1804` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Menüyü Küçülten Mutfak — **Sure:** 2 dk · **Kelime:** ~410 — `story_id:1805` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Des Plaines’teki İlk Kopya — **Sure:** 2 dk · **Kelime:** ~408 — `story_id:1806` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Hamburgerin Altındaki Arsa — **Sure:** 2 dk · **Kelime:** ~388 — `story_id:1807` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Hamburger Üniversitesi — **Sure:** 2 dk · **Kelime:** ~381 — `story_id:1808` · `v:Opus55-2` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [ ] **URETILECEK** — Ray Kroc'un 52 Yaşında Başlayan Yolculuğu — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 85/100

## 277. Range

**Yazar:** David Epstein  
**Kategori:** Büyüme  
**Yil:** 2019  
**Durum:** DB'DE KAYITLI · `list_no:277` · 10/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Roger Federer'in geç dallanması — **Sure:** 2 dk · **Kelime:** ~411 — `story_id:1809` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Van Gogh'un geç başlangıcı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1810` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Kepler'in analoji ile keşfi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1811` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — "Kötü niyetli" öğrenme ortamları — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1812` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Yapışkan not ve yan projeler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1813` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — InnoCentive'de alan dışı çözücüler — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1814` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [x] **DB'DE KAYITLI** — Gunpei Yokoi ve Game Boy — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1815` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
8. [x] **DB'DE KAYITLI** — Kariyer 'uyum kalitesi' — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1816` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
9. [x] **DB'DE KAYITLI** — Satrançta yapay zekânın üstünlüğü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1817` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
10. [x] **DB'DE KAYITLI** — Flynn etkisi ve soyut düşünme — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1818` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

## 278. Give and Take

**Yazar:** Adam Grant  
**Kategori:** Liderlik  
**Yil:** 2013  
**Durum:** DB'DE KAYITLI · `list_no:278` · 10/10 hikaye · 4/4 dil

1. [x] **DB'DE KAYITLI** — Vericiler merdivenin hem altında hem üstünde — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1819` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
2. [x] **DB'DE KAYITLI** — Bir öğretmenin her öğrencide yetenek görmesi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1820` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
3. [x] **DB'DE KAYITLI** — Adam Rifkin'in beş dakikalık iyiliği — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1821` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
4. [x] **DB'DE KAYITLI** — Frank Lloyd Wright ve alıcı tuzağı — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1822` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
5. [x] **DB'DE KAYITLI** — Cömert satıcının uzun oyunu — **Sure:** 2 dk · **Kelime:** ~399 — `story_id:1823` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
6. [x] **DB'DE KAYITLI** — Pigmalion etkisi — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1824` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
7. [x] **DB'DE KAYITLI** — Kekeme avukat Dave Walton — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1825` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
8. [x] **DB'DE KAYITLI** — Jon Huntsman'ın el sıkışması — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1826` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
9. [x] **DB'DE KAYITLI** — Simpsons yazım odasının cömert kültürü — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1827` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr
10. [x] **DB'DE KAYITLI** — Öz-koruyucu verici — **Sure:** 3 dk · **Kelime:** 475 ±75 — `story_id:1828` · `v:SON55` — **Diller:** de,en,es,tr — **Varyant:** de,en,es,tr

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

## Turn the Ship Around!

**Yazar:** L. David Marquet  
**Kategori:** Liderlik  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kaptan Emir Vermeyi Bırakınca Ne Oldu? — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 84/100

## One Up On Wall Street

**Yazar:** Peter Lynch ve John Rothchild  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Peter Lynch Alışveriş Merkezinde Nasıl Yatırım Buldu? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## Common Stocks and Uncommon Profits

**Yazar:** Philip A. Fisher  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Philip Fisher'ın Söylenti Ağı Yöntemi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## The Richest Man in Babylon

**Yazar:** George S. Clason  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Babil'in En Basit Zenginlik Kuralı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 79/100

## Your Money or Your Life

**Yazar:** Vicki Robin ve Joe Dominguez  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Parayı Harcamak Aslında Hayatını Harcamak mı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## Die with Zero

**Yazar:** Bill Perkins  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Ölmeden Önce Anı Temettüsü Biriktirmek — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100

## Misbehaving

**Yazar:** Richard H. Thaler  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kahve Kupası Sahibi Olunca Neden Değerlenir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## Against the Gods

**Yazar:** Peter L. Bernstein  
**Kategori:** Finans  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — İnsanlık Riski Ne Zaman Ölçmeye Başladı? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 91/100

## When Breath Becomes Air

**Yazar:** Paul Kalanithi  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Doktor Hastaya Dönüştüğünde — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

## The Blue Zones

**Yazar:** Dan Buettner  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Uzun Yaşam Adası İkarya'nın Sırrı — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 80/100

## Exercised

**Yazar:** Daniel E. Lieberman  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Hadza Avcıları Egzersiz Yapmadan Nasıl Aktif Kalıyor? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 89/100

## How Not to Die

**Yazar:** Michael Greger ve Gene Stone  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Kalp Hastalığını Geri Çevirmeye Çalışan Doktorlar — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## The Noonday Demon

**Yazar:** Andrew Solomon  
**Kategori:** Sağlık  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Depresyonu Dünyanın Her Yerinde Arayan Yazar — **Sure:** 3 dk · **Kelime:** 475 ±75 — **Puan:** 82/100

## Difficult Conversations

**Yazar:** Douglas Stone, Bruce Patton ve Sheila Heen  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Zor Bir Konuşmanın Aslında Üç Konuşma Olması — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 84/100

## Thanks for the Feedback

**Yazar:** Douglas Stone ve Sheila Heen  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Geri Bildirim Alırken Bizi Kilitleyen Üç Tetikleyici — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 88/100

## Supercommunicators

**Yazar:** Charles Duhigg  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — İyi İletişimcilerin Eşleştirme İlkesi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 86/100

## Talking to Strangers

**Yazar:** Malcolm Gladwell  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Yabancıları Okuduğumuzu Neden Sanıyoruz? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 81/100

## Just Listen

**Yazar:** Mark Goulston  
**Kategori:** İletişim  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Bir Rehine Müzakerecisinin En Güçlü Sorusu — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 78/100

## Letters from a Stoic

**Yazar:** Seneca  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Seneca'ya Göre Hayat Neden Kısa Değildir? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 83/100

## Discourses and Selected Writings

**Yazar:** Epictetus  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Epiktetos'un Kontrol Çemberi — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 82/100

## Nicomachean Ethics

**Yazar:** Aristotle  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Aristoteles'e Göre Mutluluk Neden Bir Alışkanlıktır? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 95/100

## The Consolations of Philosophy

**Yazar:** Alain de Botton  
**Kategori:** Felsefe  
**Yil:** —  
**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil

1. [ ] **URETILECEK** — Sokrates İdam Karşısında Neden Fikrini Değiştirmedi? — **Sure:** 1 dk · **Kelime:** 160 ±40 — **Puan:** 90/100

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
