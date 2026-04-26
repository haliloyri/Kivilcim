Aşağıda **Claude Code’a doğrudan task olarak verebileceğin**, uygulamanda **psikolojik fiyat çerçevesini gerçekten çalıştırmak için** yapman gereken tüm değişiklikleri kapsayan **detaylı ve uygulanabilir bir TODO list** var.

Bu liste:

*   ✅ *Yeni özellik şişirmeden*
*   ✅ *Mevcut mimariyi bozmadan*
*   ✅ *Premium fiyatını zihinde savunulur hale getirecek*

şekilde hazırlanmıştır.

***

# ✅ CLAUDE CODE – PRODUCT & UX CHANGE TODO LIST

## Amaç: Aylık / Yıllık fiyatı **psikolojik olarak meşru** kılmak

***

## 🧭 GLOBAL AMAÇ (Context – Claude’a söyle)

> Uygulama artık “hikâye okunan” değil,  
> **“gerçek hayatta kullanılan cümleler üreten”** bir ürün olacak.  
> Premium, içerik değil **sosyal etki** satar.

***

## TODO 1 — PRIMARY USER FLOW’U DEĞİŞTİR

**(En kritik değişiklik – yapılmazsa diğerleri çalışmaz)**

*   [ ] Home Screen’in ana CTA’sını değiştir
    *   ❌ “Günün Hikâyesi”
    *   ✅ **“Bugün Ne Söyleyeceksin?”**

*   [ ] Home’daki her hikâye kartında:
    *   “Sohbette Kullanılabilir” etiketi ekle
    *   Okuma süresini geri plana al

*   [ ] Default başarı anını değiştir:
    *   ❌ “Hikâyeyi okudu”
    *   ✅ **“Sohbette Kullan sayfasına geçti”**

👉 **Amaç:** Fiyat, okuma değil *kullanım* üzerinden savunulsun.

***

## TODO 2 — STORY DETAIL EKRANINI “YARIM BIRAK”

**(Bilinçli eksiklik yarat)**

*   [ ] Hikâye detay ekranında:
    *   Okuma ve ders kısmı kalsın ✅
    *   Ama **asıl vurgu CTA’da olsun**

*   [ ] Ana CTA:
    *   🗣 **Sohbette Kullan**
    *   Alt micro-copy:
        > “Bu hikâyeyi gerçek hayatta nasıl söylersin?”

*   [ ] Free kullanıcı için:
    *   Hikâye → tamamlanmış sayılmasın
    *   Completion sinyali **SOHBETTE KULLAN’a geçiş** olsun

👉 **Amaç:** Free kullanıcı “tam kullanmadım” hissiyle kalsın.

***

## TODO 3 — “SOHBETTE KULLAN” EKRANINI PRODUCT HALİNE GETİR

*   [ ] Bu ekranı secondary değil **core screen** olarak tanımla

*   [ ] Aşağıdaki varyantları sırayla render et:
    1.  Tek Cümle (Free açık)
    2.  30 Sn Versiyon (Premium kilit)
    3.  Vurucu Ders (Premium kilit)
    4.  Sohbet Açan Soru (Premium kilit)
    5.  Kapanış Cümlesi (Premium kilit)

*   [ ] Kilitli alanlar:
    *   Bulanık içerik
    *   Net açıklama:
        > “Bu versiyon Premium’da”

👉 **Amaç:** Premium = *hikâyeyi anlatabilme yeteneği*

***

## TODO 4 — KULLANIM SİNYALİNİ APP İÇİNE AL

**(Fiyatın en güçlü savunması)**

*   [ ] Aşağıdaki aksiyonları “kullanım” olarak işaretle:
    *   Copy
    *   Share
    *   “Bunu kullandım” (opsiyonel)

*   [ ] Local veya backend event:
    *   event: `story_variant_used`

*   [ ] Premium kullanıcıya:
    *   “Son kullandıkların” listesi oluştur

👉 **Amaç:**

> “Ben buna para verdim ve gerçekten kullandım.”

***

## TODO 5 — 5 PREMIUM KISITI TEKNİK OLARAK ENTEGRE ET

### 🔒 KISIT 1 — DERİNLİK

*   [ ] Free → yalnızca tek cümle
*   [ ] Premium → tüm varyantlar

***

### 🔒 KISIT 2 — BAĞLAM

*   [ ] Free → açıklamasız metin
*   [ ] Premium → etiketler ekle:
    *   “Toplantıda”
    *   “1:1 görüşmede”
    *   “Arkadaş sohbetinde”
    *   “Sunum açılışında”

👉 *Yanlış yerde yanlış laf etme korkusu = upgrade trigger*

***

### 🔒 KISIT 3 — KOPYALA / PAYLAŞ

*   [ ] Free:
    *   Copy butonu disabled
    *   Tooltip:
        > “Kullanmak için Premium”

*   [ ] Premium:
    *   Tek tık copy/share

***

### 🔒 KISIT 4 — HAFIZA

*   [ ] Free:
    *   History yok
    *   Favorites yok

*   [ ] Premium:
    *   Favori varyantlar
    *   Kullanım geçmişi

👉 *İptal etmeyi zorlaştırır*

***

### 🔒 KISIT 5 — İTİBAR (PRIVATE METRICS)

*   [ ] Premium kullanıcıya özel:
    *   “Bu hafta 3 sohbet başlattın”
    *   “Toplam 12 kullandın”

*   [ ] Free kullanıcı:
    *   Bu metrikleri göremez

***

## TODO 6 — PAYWALL’U YANLIŞ YERDEN KALDIR

*   [ ] Okuma ekranına paywall koyma ❌

*   [ ] Paywall’u şu anlarda tetikle:
    *   Kilitli varyanta tıklanınca
    *   Copy butonuna basılınca

*   [ ] Paywall başlığı:
    > “Okumak değil, kullanmak fark yaratır.”

👉 **Amaç:**  
Premium = *aksiyon sırasında* gerekli hissettirmek

***

## TODO 7 — AYLIK / YILLIK PAKETLERİ DAVRANIŞSAL AYIR

*   [ ] Aylık paket micro-copy:
    > “Bir ay boyunca sohbetlerinde dene.”

*   [ ] Yıllık paket micro-copy:
    > “Bu yıl söylediklerin rastgele olmayacak.”

*   [ ] Yıllık paketi:
    *   “Alışkanlık”
    *   “Süreklilik”
        diliyle çerçevele

***

## TODO 8 — İPTAL KORKUSUNU NAZİKÇE HATIRLAT

*   [ ] İptal ekranında göster:
    *   Favoriler
    *   Kullanılan varyant sayısı

*   [ ] Micro-copy:
    > “Premium kapanırsa bu liste silinir.”

👉 **Kaybedilecek şey görünür olmalı**

***

## TODO 9 — TEK CÜMLELİK MARKA GERÇEĞİNİ SABİTLE

Uygulamanın 2–3 yerinde aynı cümle geçsin:

> **“Kıvılcım Premium, daha çok okuman için değil;  
> konuşurken daha az düşünüp daha çok etki bırakman için.”**

👉 Bu cümle **fiyatın özeti**dir.

***

## ✅ SON KONTROL (Claude’dan iste)

*   [ ] Free kullanıcı:
    *   Uygulamayı seviyor mu?
    *   Ama eksik hissediyor mu?

*   [ ] Premium kullanıcı:
    *   “Bu paraya değiyor” diyebilir mi?
    *   İptal ederken zorlanır mı?

Eğer cevaplar **EVET** ise:
👉 fiyat **psikolojik olarak savunulabiliyor** demektir.


