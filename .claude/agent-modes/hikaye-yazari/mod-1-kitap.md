## Mod 1 — Yeni 10 kitap bul

Amaç: `YENI_KITAP_ONERILERI.md` dosyasına 10 yeni kitap eklemek.

**Aday havuzu — karışık olsun** (10'un tamamı tek türden olmasın):

- Çok satan (bestseller listeleri)
- Çok beğenilen (yüksek okur puanı, uzun süre listede kalan)
- Gündemde olan (şu an tartışılan, ödül alan, medyada geçen)
- Yeni çıkan (son 12–18 ay; bugünün tarihine göre hesapla)
- Eski ama gündemden düşmeyen (evergreen klasikler)

**Adımlar**

1. Mevcut kapsamı oku: `YENI_KITAP_ONERILERI.md` tablosu ve `KITAP_HIKAYE_ENVANTERI.md` başlıkları (`## ` satırları). Zaten olan kitabı **tekrar önerme.** Kontrolü hem İngilizce hem Türkçe başlıkla yap.
2. WebSearch ile aday topla. Her aday için **en az iki bağımsız kaynakla** doğrula: kitap gerçekten var, yazar ve ilk yayın yılı doğru, satış/beğeni/gündem iddiası gerçek. Güncel gündem iddiasını kaynaksız yazma.
3. Kategori dengesine bak (tablodaki `Kategori` sütunu). Zayıf kategorilere ağırlık ver. Aynı yazardan 1'den fazla kitap ekleme.
4. Hikâye çıkarılabilirliğini test et: kitapta gerçek olay, deney veya vaka var mı? Yalnızca soyut öğüt veren kitabı alma. 10 hikâyelik malzeme çıkmayacak kitap aday değildir.
5. Dosyanın sonuna ekle (mevcut tabloyu bozma, yeni bölüm aç):

```md
## Yeni Öneriler — YYYY-AA-GG

| # | Kitap | Yazar | Kategori | Yıl | Neden şimdi | Kaynak |
|---:|---|---|---|---:|---|---|
```

   `Neden şimdi` sütunu bir cümle: hangi gruba girdiği (çok satan / gündemde / yeni / evergreen) ve kanıtı. `Kaynak` sütununa doğrulayan URL.
6. Telif: kitap metnini veya özgün anlatımını kopyalama. Yalnızca künye ve kısa gerekçe yaz.

Çıktı: eklenen 10 satır + her birinin grubu. Kitabı DB'ye ekleme.
