# DAX40 2025 — 5 dakikalık veri

Bu paket, HistData'nın `GRX/EUR` sembollü 2025 bir dakikalık bid kotasyonlarından üretilmiş 5 dakikalık OHLC verisidir.

## Dosya

- `dax40_2025_5m.json`: UTC zaman damgalı 5 dakikalık OHLC mumları ve veri kalite özeti
- `build-dax40-2025.mjs`: bir dakikalık kaynak CSV'yi aynı kurallarla yeniden üretmek için kullanılan dönüştürücü

## Kapsam ve kalite

- Kaynak satırı: 335.900
- Kullanılan benzersiz kaynak satırı: 335.844
- Üretilen 5 dakikalık mum: 68.480
- Beş kaynak dakikanın tamamını içeren mum: 64.001
- Bir veya daha fazla kaynak dakikası eksik mum: 4.479
- Kaynakta bulunan ve kaldırılan birebir aynı zaman damgalı satır: 56
- Yapay mum veya ileri doğru fiyat doldurma: yok
- İlk mum: `2025-01-01T23:00:00.000Z`
- Son mum: `2025-12-31T20:55:00.000Z`

Her mumdaki `source_minute_count`, o mumun kaç adet kaynak dakika içerdiğini gösterir. Değer `5` değilse mum eksik dakika içerir.

## Önemli sınırlamalar

- Bu seri resmi Deutsche Börse/Xetra nakit DAX endeksi değildir. HistData'nın Germany/DAX bid-kotasyon proxy'sidir ve vadeli kontrat değildir.
- Kaynak zamanları HistData belgesine göre yaz saati uygulanmayan sabit EST'dir. Çıktıda UTC'ye çevrilmiştir.
- Kaynak hacim alanı daima sıfırdır. Bu nedenle JSON içindeki `volume` değeri bilinçli olarak `null` tutulmuştur.
- Fiyatlar kullandığınız kaldıraçlı işlem kuruluşunun DAX40/GER40 akışıyla farklı olabilir. Canlı kullanımdan önce aynı broker verisiyle doğrulayın.

## Kaynak

- Veri sağlayıcı: https://www.histdata.com/download-free-forex-data/
- Dosya biçimi ve saat dilimi: https://www.histdata.com/f-a-q/data-files-detailed-specification/
- Sağlayıcının veri açıklaması ve risk notu: https://www.histdata.com/f-a-q/
