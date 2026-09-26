# Hikâye Sonu ↔ "Sohbette Kullan" Entegrasyon Planı

**Durum:** Onaylandı, uygulanacak · İlgili dal: `feature/story-p1-format`
**Tarih:** 2026-09-23

## Karar (özet)

İki yerde de aynı bilgi tekrarlanmayacak, "Sohbette kullan" ekranı kalkmayacak.
Hikâye sonu **"nerede"**yi gösterip merak uyandıracak; "Sohbette kullan"
**"nasıl"**ı çalıştıracak.

- Hikâye sonu (`[[use]]`), ücretsiz: en fazla 3 kullanım kartı, "Prova et →"
  ile doğrudan "Sohbette kullan" ekranını o durum seçili açar.
- "Sohbette kullan": önce **durum** seçilir (Toplantı / Birebir / Aile /
  Sosyal / Kendime), sonra **uzunluk** (Tek cümle / 30 saniye / Soru),
  ardından prova (30 sn zamanlayıcı), "Bunu kullandım", paylaşım. Prova ve
  görsel kart premium sınırında kalır — abonelik için savunulabilir ayrım.

---

## A) Hikâye Ekranında Yapılacaklar

1. `[[use]]` bölümündeki kullanım kartı sayısı 3–5 aralığından **tam 3**'e
   indirilecek (validator `RANGES`/`uses` kuralı güncellenecek: `uses < 3 ||
   uses > 3` → hata). Amaç: hikâye sonunu kısa tutup asıl derinliği
   "Sohbette kullan"a bırakmak.
2. Her `%%...%%` kartına sabit bir **bağlam etiketi** eklenecek, böylece
   ekran hangi durumu (context) açacağını bilecek. Yeni format:
   `%%context:meeting | In a meeting, when your proposal gets shot down ::
   "…"%%`
   - `context` değerleri `UseInConversationScreen`in mevcut context
     seçenekleriyle birebir eşleşecek: `meeting`, `oneonone`, `family`,
     `social`, `self` (mevcut Storyteller `mv_storyteller_context_*` anahtarlarıyla aynı).
3. `StoryBody.js`deki `UseCaseCard`: "Copy" düğmesi yerine **"Prova et →"**
   düğmesi gelecek. Tıklanınca `onTryUseCase(storyId, context, lang)` prop'u
   tetiklenip `UseInConversationScreen`e o context + hikâye önceden seçili
   olarak navigate edilecek (kopyalama davranışı ekrana taşınıyor, hikâye
   sonunda kalmıyor).
4. `storyMarkup.js` → `splitUseCase` fonksiyonu `context:` önekini
   parse edecek şekilde güncellenecek; `extractShareParts` ve ilgili testler
   (`storyMarkup.test.js`) yeni alan için güncellenecek.
5. `[[reflect]]` bölümündeki kapanış `&&soru&&` aynı kalacak — bu,
   "Sohbette kullan"daki "Conversation Starter" kartının kaynağı olacak
   (bkz. B.2).

## B) "Sohbette Kullan" Ekranında Yapılacaklar

1. Ekranın akışı yeniden sıralanacak: önce **durum seçimi** (Toplantı /
   Birebir / Aile / Sosyal / Kendime — Storyteller modundaki context
   seçenekleriyle aynı liste), sonra o duruma ait **uzunluk** kartları
   (Tek cümle / 30 saniye / Soru).
   - Hikâyeden "Prova et →" ile gelindiğinde bu adım atlanıp doğrudan ilgili
     context açılacak.
2. Format kartlarının içerik kaynağı: mevcut `story_conversation_variants`
   tablosu (punchline / thirty_sec / question / key_contrast) — bu alanlar
   yeni P1 içerik briflerinden, her dil için ayrı ayrı **yeniden yazılacak**
   (bkz. C.2). "Conversation Starter" kartı artık `[[reflect]]`in kapanış
   sorusuyla aynı fikri paylaşacak ama ekrana özel, bağlama uyarlanmış
   biçimde yazılacak (birebir kopya değil).
3. Prova (Storyteller Mode), "Bunu kullandım", paylaşım, premium/rewarded-ad
   kapıları olduğu gibi kalacak — davranış değişmiyor, sadece girişe context
   seçimi ekleniyor.
4. Hikâyeden context önceden seçili gelindiğinde ekranın üst kısmında küçük
   bir "◀ Hikâyeye dön" bağlantısı gösterilecek.

## C) Uygulama Alt Yapısında Yapılacaklar

1. **`scripts/p1/validate.mjs`**
   - `%%...%%` regex'i `context:<slug> | ` önekini zorunlu kılacak ve
     `slug`ın izin verilen 5 değerden biri olduğunu doğrulayacak.
   - Kart sayısı kuralı `3–5` → `tam 3` olarak değişecek.
2. **`staging/p1/brief/<id>.json`** şeması genişletilecek: `use_cases[]`
   içindeki her öğeye `context` alanı eklenecek (`meeting|oneonone|family|
   social|self`), ayrıca yeni bir `conversation_variants` bloğu eklenecek:
   `{ punchline_idea, thirty_sec_idea, question_idea, key_contrast_idea }`
   — böylece hem hikâye sonu hem "Sohbette kullan" metinleri **aynı brief**
   den, birbirini görmeden, her dilde bağımsız yazılacak (K2 prensibiyle
   tutarlı).
3. **`scripts/p1/apply-to-db.mjs`**
   - Şu anki gibi `story_translations.content`i yazmaya devam edecek.
   - Yeni olarak `story_conversation_variants` tablosuna da
     `conversation_punchline / thirty_sec / question / key_contrast`
     alanlarını aynı çalıştırmada yazacak (aynı transaction, aynı yedekleme
     akışı).
4. **`src/utils/storyMarkup.js`**: `splitUseCase` → `{ context, label,
   line }` döndürecek şekilde güncellenecek; geriye dönük uyumluluk için
   `context` alanı boşsa (eski/legacy içerik) `undefined` kalacak ve eski
   davranış bozulmayacak.
5. **`src/screens/UseInConversationScreen.js`**: context-önce akışına göre
   yeniden düzenlenecek; navigasyon parametrelerine `initialContext` ve
   `storyId` (hikâyeden geliş) eklenecek.
6. **`src/components/story/StoryBody.js`**: `UseCaseCard` → "Prova et"
   düğmesi + `onTryUseCase` prop'u.
7. **i18n**: `mv_*` anahtarlarına context seçim ekranı için gerekirse yeni
   başlık/alt başlık anahtarları eklenecek (en/tr/es/de) —
   `localeParity.test.js` ile doğrulanacak.
8. **Testler**: `storyMarkup.test.js` (context parse), yeni
   `UseInConversationScreen` akış testi (varsa mevcut test dosyasına context
   önceden-seçili senaryosu eklenir), `validate.mjs` için context regex
   testleri.

---

## Hikâyeleri Yazarken Dikkat Edilecekler (pilot ve sonrası için)

Bu planın hikâye yazım sürecine etkisi:

- Her `[[use]]` kartı **tam olarak 3 tane** ve her biri 5 context
  etiketinden birine sahip olacak (aynı context iki kez kullanılabilir ama
  en az 2 farklı context olması önerilir).
- Brief yazılırken `use_cases[]`e `context` alanı da eklenecek; hikâye
  metnini yazan dil, context'i brief'ten alacak, kendi uydurmayacak —
  tutarlılık için.
- Brief'e eklenecek `conversation_variants` (punchline/30sn/soru/karşıtlık
  fikirleri) da yazım sırasında doldurulacak; bu alanlar `[[use]]` ve
  `[[reflect]]` ile aynı olayları farklı açılardan ele almalı, birebir aynı
  cümleler olmamalı.
- 20 hikâyelik pilotun kapsamına bu değişiklik dahil edilecek: pilot
  hem yeni `context:` etiketli `[[use]]` formatını hem de
  `story_conversation_variants` yazımını test edecek.
