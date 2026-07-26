# Kıvılcım Yolu — Fazlı Uygulama Görev Planı

> Bu dosya, Kıvılcım Yolu ve kariyer rozetleri özelliğini önceki ürün yazışmalarını okumadan geliştirebilmek için hazırlanmış bağımsız uygulama spesifikasyonudur.

## 1. Belgenin amacı

Bu plan, mevcut bağımsız rozet koleksiyonunu; kullanıcının okuma, düşünme ve günlük hayatta uygulama davranışlarını anlamlı bir gelişim hikâyesine dönüştüren kariyer yolu sistemiyle değiştirmek için gereken işleri tanımlar.

Bu aşamada amaç kod yazmak değildir. Aşağıdaki görevler uygulama sırasında sırasıyla ele alınmalı; her fazın çıkış kriterleri tamamlanmadan bağımlı faz bitmiş kabul edilmemelidir.

## 2. Değişmez ürün kararları

- Kullanıcı arayüzünde “kariyer” yerine **Kıvılcım Yolu** adı kullanılacaktır.
- İlk sürümde toplam **12 kariyer düğümü** bulunacaktır:
  - 3 ortak başlangıç rütbesi
  - Keşif Yolu’nda 3 rütbe
  - Derinlik Yolu’nda 3 rütbe
  - Aktarım Yolu’nda 3 rütbe
- Bir düğüm tamamlandığında kullanıcı aynı anda hem rozeti hem unvanı kazanır. Ayrı mikro rozet ve rütbe sistemleri kurulmaz.
- Kullanıcının aynı anda yalnızca bir aktif yolu bulunur.
- Diğer yollardaki davranış ilerlemesi arka planda korunur.
- Yol değiştirmek ücretsizdir; ilerlemeyi sıfırlamaz ve bekleme süresi oluşturmaz.
- Profilde görünen unvan, aktif yoldaki en yüksek kazanılmış rütbedir. Aktif yolda henüz rütbe yoksa “Yolcu” gösterilir.
- Kazanılan rütbeler kalıcıdır; seri kaybı veya ara verme nedeniyle geri alınmaz.
- Koşullar birleşik, belirsiz tek bir yüzdeye dönüştürülmez. Her koşul ayrı gösterilir.
- Ana sayfada günlük okuma hedefi tamamlanmadan kariyer görevi birincil eylem olmaz.
- Temel hikâyeler, erişilebilirlik özellikleri veya tamamlanabilirlik Premium arkasına konmaz.
- Global `12/12` tamamlama baskısı gösterilmez. Kullanıcının seçtiği yolun son rütbesi geçerli finaldir.
- V1’de yüzü, adı ve konuşan kişiliği olan tam maskot yapılmaz.
- Yalnızca Kıvılcım Yolu ekranında ve kariyer/rozet modallarında soyut, sessiz bir **Rehber Işık** kullanılabilir.
- Kullanıcıyı suçlayan, korkutan veya seri kaybıyla tehdit eden metin kullanılmaz.
- “Uzman”, “usta”, “otorite” gibi doğrulanmamış yeterlilik unvanları kullanılmaz.

## 3. V1 kapsamı dışında kalanlar

Aşağıdakiler bu uygulama planına eklenmemelidir:

- Hikâye sayısına bağlı bağımsız `10/25/50/100` rozetleri
- Seri rozetleri
- Paylaşım veya kopyalama sayısı rozetleri
- Favori/kaydetme sayısı rozetleri
- Her kategori için ayrı uzmanlık rozeti
- Gizli, sezonluk veya Premium satın alma rozetleri
- Arkadaş daveti rozetleri
- XP, seviye çubuğu veya liderlik tablosu
- Aktif yol değiştirirken ceza, ücret veya cooldown
- Tamamlanmış rütbenin geri alınması
- Kullanıcı adına otomatik ve değiştirilemez yol seçimi
- Sosyal paylaşımı zorunlu ilerleme koşulu yapmak
- Rehber Işık’ı Home, normal hikâye, paywall veya bildirim ekranlarına taşımak

## 4. İlerleme sözlüğü ve kredi kuralları

Kodda ve testlerde aşağıdaki kısa adlar kullanılabilir; kullanıcı arayüzünde açık Türkçe karşılıkları gösterilmelidir.

| Kod | Kullanıcı karşılığı | Kesin tanım |
|---|---|---|
| `H` | Hikâye | Okuma veya sesli dinleme yoluyla anlamlı biçimde tamamlanan benzersiz hikâye |
| `K` | Kategori | Kredi alan hikâyelerin ait olduğu farklı ana kategori sayısı |
| `D` | Derin etkileşim | Bir çıkarımı kaydetme veya ilk tamamlamadan en az 24 saat sonra hikâyeyi yeniden anlamlı biçimde tamamlama |
| `U` | Uygulama | “Sohbette Kullan”, prova tamamlama veya özel “nerede kullanacağım” planı |
| `G` | Aktif gün | En az bir anlamlı `H`, `D` veya `U` olayı bulunan farklı yerel takvim günü |

Kurallar:

- Bir rütbedeki bütün koşullar **VE** koşuludur.
- Aynı hikâye `H` değerini yalnızca bir kez artırır.
- Kariyer rütbesi hesabında bir yerel günde en fazla 3 yeni `H` kredisi kullanılır.
- Aynı hikâye en fazla bir `D` kredisi üretir.
- Yeniden ziyaretin `D` sayılması için ilk tamamlamadan en az 24 saat geçmiş olmalı ve hikâye tekrar anlamlı biçimde tamamlanmalıdır.
- Kaydet–sil–yeniden kaydet döngüsü yeni `D` kredisi üretmez.
- Aynı hikâye en fazla bir `U` kredisi üretir.
- Kariyer rütbesi hesabında bir yerel günde en fazla 1 yeni `U` kredisi kullanılır.
- Kopyalama ve sosyal paylaşım `U` değildir.
- `K`, günlük kredi sınırından sonra uygun kabul edilen `H` hikâyelerinin ana kategorilerinden hesaplanır.
- `G` günleri ardışık olmak zorunda değildir.
- Okuma ve sesli dinleme aynı `H` kredisini verir.
- Şüpheli hız cezalandırılmaz; eksik gün, derinlik veya uygulama şartı tamamlanana kadar rütbe bekler.
- Ham olaylar kaydedilir; günlük sınırlar olay kaydını silerek değil, ilerleme hesaplama motorunda uygulanır.
- Tarih hesaplarında UTC günü yerine kullanıcının yerel takvim günü kullanılmalıdır.

## 5. Kesin yol ve rütbe tanımları

Kod kimlikleri kalıcı sözleşme kabul edilmelidir. Kullanıcıya gösterilen metinler çeviri anahtarlarından gelmelidir.

| Sıra | Kalıcı `nodeId` | Yol | Türkçe rütbe | Koşullar | Açılan yardımcı deneyim |
|---:|---|---|---|---|---|
| 1 | `common_first_spark` | Ortak | İlk Kıvılcım | H1 | Kıvılcım Yolu haritası |
| 2 | `common_curious` | Ortak | Meraklı | H3, K2, D1, G3 | Üç yolun ön izlemesi |
| 3 | `common_traveler` | Ortak | Yolcu | H7, K3, D2, U1, G5 | Yol seçimi ve profil unvanı |
| 4 | `exploration_route_seeker` | Keşif | Rota Arayıcısı | H12, K4, D3, U1, G8 | Kişisel kategori pusulası |
| 5 | `exploration_horizon_traveler` | Keşif | Ufuk Gezgini | H25, K6, D7, U2, G18 | Haftalık üç hikâyelik çapraz kategori rotası |
| 6 | `exploration_wisdom_cartographer` | Keşif | Bilgelik Haritacısı | H50, K8, D15, U5, G35 | Bilgelik Atlası, profil amblemi ve dönem özeti |
| 7 | `depth_thinker` | Derinlik | Düşünür | H10, K3, D5, U1, G8 | İçgörü Rafı |
| 8 | `depth_synthesizer` | Derinlik | Sentezci | H20, K4, D12, U2, G18 | Haftalık iki hikâye sentezi |
| 9 | `depth_insight_curator` | Derinlik | İçgörü Küratörü | H40, K5, D25, U5, G35 | Bilgelik Dosyası, profil amblemi ve dönem özeti |
| 10 | `transfer_storyteller` | Aktarım | Anlatıcı | H10, K3, D3, U3, G8 | Kişiselleştirilmiş sohbet başlangıçları |
| 11 | `transfer_connector` | Aktarım | Bağ Kurucu | H20, K4, D7, U8, G18 | Kullanılan/kaydedilen sohbet kartları destesi |
| 12 | `transfer_spark_carrier` | Aktarım | Kıvılcım Taşıyıcısı | H40, K5, D15, U18, G35 | Beş hikâyelik Kıvılcım Paketi, profil amblemi ve dönem özeti |

Dinamik kategori kuralı:

- Mevcut bundled veri denetiminde 10 ana kategori ve 750 hikâye görülmüştür; bu sayı runtime için sabit sözleşme kabul edilmemelidir.
- Tanımdaki `K` hedefi, kullanıcının dilinde erişilebilir ana kategori sayısından yüksekse gerçek hedef erişilebilir ana kategori sayısına düşürülür.
- Bu normalizasyon yalnızca kategori şartına uygulanır; diğer şartlar değişmez.
- Ekranda tanımdaki teorik sayı değil, hesaplanan gerçek hedef gösterilir.
- İçerik envanteri geçici olarak yüklenemediyse kullanıcıya imkânsız sıfır ilerleme gösterilmez; son bilinen hedef veya yükleniyor durumu korunur.

İlk denge hipotezi:

- Ortak yol ilk 5–7 aktif günde tamamlanabilmelidir.
- Seçilen yolun ilk rütbesi yaklaşık 8–12 aktif günde gelmelidir.
- İkinci rütbe yaklaşık 3–4 haftalık anlamlı kullanım istemelidir.
- Capstone yaklaşık 6–8 haftalık dengeli kullanım istemelidir.
- Bu süreler ürün metriği hedefidir; kullanıcıya kesin gün vaadi olarak gösterilmez.
- Eşik değişikliği yapılacaksa `ruleVersion` artırılmalı ve daha önce kazanılmış node’lar grandfather edilmelidir.

## 6. Yol davranışı

- Ortak üç düğüm yol seçmeden ilerler.
- `common_traveler` kazanıldıktan sonra kullanıcıya tam ekran yol seçimi sunulur.
- Sistem davranışlara göre bir yol önerebilir, ancak kullanıcı seçimi kendisi yapar.
- Kullanıcı seçim ekranını erteleyebilir. Bu durumda mevcut unvan “Yolcu”, sıradaki ana eylem “Yolunu seç” olur.
- Seçili olmayan yolların `H/K/D/U/G` metrikleri birikmeye devam eder.
- Seçili olmayan bir yolun rütbesi otomatik kutlanmaz.
- Kullanıcı bir yola geçtiğinde o yol için geçmiş davranışları koşulları karşılıyorsa uygun düğümler kalıcı olarak kazanılır.
- Aynı anda birden çok düğüm uygun olursa hepsi veritabanına kazanılmış olarak yazılır; yalnızca en yüksek yeni rütbe kutlanır ve diğerleri kısa özette belirtilir.
- Aktif yol değiştiğinde profil unvanı o yoldaki en yüksek kazanılmış rütbeye geçer. O yolda rütbe yoksa “Yolcu” gösterilir.
- Daha önce başka bir yolda kazanılmış unvanlar silinmez ve yol geçmişinde görünür.
- Aktif yol tamamlandığında kullanıcı aynı unvanla devam edebilir veya başka bir yola odaklanabilir.

## 7. Önerilen kaynak yapısı

Mevcut route ve dosya isimlerini gereksiz yere kırmamak için `ProgressTab` ve `src/screens/ProgressScreen.js` ilk sürümde korunmalıdır. Yalnızca kullanıcıya görünen sekme etiketi “Yolum”, ekran başlığı “Kıvılcım Yolu” olur.

Yeni modüller için önerilen yapı:

```text
src/
  constants/
    careerPath.js
  context/
    CareerPathContext.js
  db/
    userDb.js
  utils/
    careerProgress.js
    careerNextAction.js
    localDate.js
  components/
    career/
      CareerHeroCard.js
      CareerNextActionCard.js
      CareerPathSelector.js
      CareerTimeline.js
      CareerNode.js
      CareerRequirementsList.js
      CareerNodeSheet.js
      CareerPromotionModal.js
      CareerPathSwitchSheet.js
      CareerMigrationSummary.js
      GuideLight.js
  screens/
    CareerPathSelectionScreen.js
    CareerToolkitScreen.js
```

Notlar:

- Kesin dosya sayısı gerektiğinde azaltılabilir; ancak Home ve Progress içinde ayrı ilerleme hesapları yazılmamalıdır.
- Saf hesaplama fonksiyonları React bileşenlerinden ve depolama kodundan bağımsız olmalıdır.
- `CareerPathContext`, `UserDataContext` ve `StoriesContext` verilerini okuyabilmesi için provider sırası `UserDataProvider → StoriesProvider → CareerPathProvider` olacak şekilde kurulmalıdır.
- Kariyerin kalıcı kullanıcı tabloları, asset tabanlı içerik veritabanından ayrı `kivilcim_user.db` içinde tutulmalıdır. Mevcut içerik DB’sinin sürüm mekanizması dosyayı silebildiği için yeni kariyer tabloları bu dosyaya bağlanmamalıdır.
- Eski badge sistemi yeni sistem doğrulanana kadar özellik bayrağının arkasında tutulmalı; erken ve geri dönüşü zor silme yapılmamalıdır.

## 8. Ana TODO kontrol listesi

Bu liste ilerleme takibi içindir. Her maddenin ayrıntılı kapsamı, dosyaları, bağımlılıkları ve kabul kriterleri aşağıdaki fazlarda yer almaktadır.

`[x]`, repo içindeki uygulama ve tekrarlanabilir doğrulamanın tamamlandığını gösterir. `[ ]` kalan canlı Supabase, fiziksel cihaz veya kontrollü rollout çalışmasını gösterir; bunlar kod yazılmış olsa bile gerçek ortam kanıtı olmadan tamam sayılmaz.

### Faz 0

- [x] `KY-000` — Feature flag ve güvenli geri dönüş
- [x] `KY-001` — Kalıcı yol/düğüm sözleşmesi
- [x] `KY-002` — Saf domain model ve fixture’lar
- [x] `KY-003` — Otomatik test iskeleti
- [ ] `KY-004` — Canlı Supabase/içerik şeması doğrulaması

### Faz 1

- [x] `KY-100` — Yerel tarih yardımcıları
- [x] `KY-101` — Ayrı kullanıcı DB’si ve kariyer tabloları
- [x] `KY-102` — Yerel kariyer repository
- [x] `KY-103` — Saf metrik hesaplama motoru
- [x] `KY-104` — Yol öneri algoritması
- [x] `KY-105` — Tek sıradaki eylem motoru
- [x] `KY-106` — Domain test matrisi

### Faz 2

- [x] `KY-200` — Supabase kariyer şeması/RLS
- [x] `KY-201` — Supabase kariyer servisleri
- [x] `KY-202` — Kullanıcıya bağlı offline queue
- [x] `KY-203` — Server-first/local-fallback context yüklemesi
- [x] `KY-204` — Legacy V1 migration
- [x] `KY-205` — Reset, hesap geçişi ve gizlilik

### Faz 3

- [x] `KY-300` — Ortak hikâye tamamlama olayı
- [x] `KY-301` — Audio completion eşitliği
- [x] `KY-302` — Çıkarımı kaydetme derinlik olayı
- [x] `KY-303` — 24 saat sonrası revisit
- [x] `KY-304` — Sohbette Kullan uygulama olayı
- [x] `KY-305` — Özel uygulama planı alternatifi
- [x] `KY-306` — Event idempotency ve analytics kontrolleri

### Faz 4

- [x] `KY-400` — CareerPathContext view-model
- [x] `KY-401` — Transaction-safe rütbe award
- [x] `KY-402` — Generic promotion kuyruğu
- [x] `KY-403` — Çoklu kazanım ve capstone
- [x] `KY-404` — Profil unvanı entegrasyonu

### Faz 5

- [x] `KY-500` — Merkezi career visual mapping
- [x] `KY-501` — Soyut Rehber Işık
- [x] `KY-502` — Requirement/node bileşenleri
- [x] `KY-503` — Hero/next action/path selector

### Faz 6

- [x] `KY-600` — ProgressScreen’i yeni modele bağlama
- [x] `KY-601` — Header, bilgi ve identity hero
- [x] `KY-602` — Next action routing
- [x] `KY-603` — Path selector ve timeline
- [x] `KY-604` — İkincil Ritim bölümü
- [x] `KY-605` — Yolculuk özeti ve Miras
- [x] `KY-606` — Tüm ekran state’leri

### Faz 7

- [x] `KY-700` — İlk yol seçimi
- [x] `KY-701` — Node ayrıntı sheet’i
- [x] `KY-702` — Yol değiştirme sheet’i
- [x] `KY-703` — Global promotion modalı
- [x] `KY-704` — Capstone finali
- [x] `KY-705` — Rank/path paylaşımı
- [x] `KY-706` — Legacy modal ayrıştırması

### Faz 8

- [x] `KY-800` — Home duplicate hesabını kaldırma
- [x] `KY-801` — Günlük hedef önceliği ve career action
- [x] `KY-802` — Home `x/25` sunumunu kaldırma
- [x] `KY-803` — Keşif yardımcı deneyimleri
- [x] `KY-804` — Derinlik yardımcı deneyimleri
- [x] `KY-805` — Aktarım yardımcı deneyimleri
- [x] `KY-806` — Unlock availability guard’ları

### Faz 9

- [x] `KY-900` — Dört dil i18n
- [x] `KY-901` — Analytics kataloğu
- [x] `KY-902` — Erişilebilirlik
- [x] `KY-903` — Reduce Motion/ses/haptik
- [x] `KY-904` — Performans

### Faz 10

- [x] `KY-1000` — Screenshot üreticisi
- [ ] `KY-1001` — Manuel QA matrisi
- [ ] `KY-1002` — Otomatik test/build smoke
- [ ] `KY-1003` — Shadow mode
- [ ] `KY-1004` — Kontrollü rollout
- [ ] `KY-1005` — Eski core badge temizliği
- [x] `KY-1006` — Son dokümantasyon

---

# FAZ 0 — Uygulama sözleşmesi, feature flag ve test iskeleti

## Fazın amacı

Kodun farklı bölümlerinin farklı kariyer kuralları üretmesini engelleyen tek sözleşmeyi oluşturmak ve geliştirmeyi güvenli biçimde açıp kapatabilmek.

## Görevler

### KY-000 — Uygulama çalışma dalını ve feature flag’i tanımla

**İlgili dosyalar**

- Yeni: `src/config/featureFlags.js`
- Kontrollü rollout yapılacaksa yeni: `src/context/FeatureFlagContext.js`
- `src/utils/analytics.js`
- Gerekirse: `app.json`

**Yapılacaklar**

- `careerPathV1` adlı tek bir bayrak tanımla.
- Bayrak kapalıyken mevcut İlerleme/rozet deneyimi çalışmaya devam etsin.
- Bayrak açıkken yeni CareerPath provider, yeni Yolum ekranı ve yeni promotion sistemi çalışsın.
- Olay kaydı için ayrıca `careerEventCaptureV1` bayrağı tanımlanabilir; bu bayrak UI açılmadan önce gölge veri toplamayı mümkün kılmalıdır.
- Bayrak değerini ekran dosyalarına dağınık sabitler olarak yazma; tek modülden tüket.
- Projede uzaktan feature flag altyapısı yoksa ilk sürümde derleme zamanı bayrağı kullan; uzaktan kontrol varmış gibi sahte API oluşturma.
- Yüzdesel production rollout yapılacaksa mevcut PostHog istemcisi üzerinde gerçek flag okuma/cache/fallback katmanını ayrıca kur:
  - payload: `{ variant: "control" | "career_v1", version: 1 }`
  - timeout veya bozuk payload: `control`
  - offline açılış: son stabil assignment
  - assignment cache anahtarı: kullanıcı + deney + sürüm
  - geç gelen sonuç aynı oturum içinde ekranı control’den treatment’a çevirmemeli
  - flag kapandığında kariyer verisi silinmemeli
- Remote flag tamamlanmazsa yüzdesel rollout iddiasında bulunma; staff build ve ayrı staged release kullan.

**Kabul kriterleri**

- Tek satırlık bayrak değişimiyle eski ve yeni deneyim arasında geçiş yapılabilir.
- Bayrak kapalıyken uygulama açılışı, Home, StoryDetail ve eski Progress davranışı değişmez.
- Bayrak açıkken provider başlatma hatası uygulamayı beyaz ekranda bırakmaz.
- Offline/timeout durumunda aynı kullanıcı bir oturum içinde iki farklı varyanta geçmez.

### KY-001 — Kalıcı yol ve düğüm sözleşmesini oluştur

**İlgili dosyalar**

- Yeni: `src/constants/careerPath.js`

**Yapılacaklar**

- `PATH_IDS`: `exploration`, `depth`, `transfer`.
- Bu belgede verilen 12 kalıcı `nodeId` değerini tanımla.
- Her düğümde en az şu alanları tut:
  - `id`
  - `pathId`
  - `order`
  - `titleKey`
  - `descriptionKey`
  - `identityKey`
  - `requirements`
  - `unlockKey`
  - `visualKey`
- Düğüm koşullarını ekran dosyalarında tekrar yazma.
- `requirements` yapısını `{ stories, categories, deepInteractions, applications, activeDays }` olarak standartlaştır.
- Kullanıcıya açık isimleri sabit metin olarak tanıma; i18n anahtarı kullan.
- Tanım doğrulayıcı ekle: benzersiz ID, geçerli yol, pozitif hedef ve sıralı düğüm kontrolü.

**Kabul kriterleri**

- 12 düğümün tamamı tek kaynaktan okunur.
- Aynı `nodeId` iki kez tanımlanırsa geliştirme ortamında açık hata üretilir.
- Home, Progress, modal ve share katmanları koşul sayılarını bu tanımdan alabilir.

### KY-002 — Saf domain modelleri ve fixture’ları tanımla

**İlgili dosyalar**

- Yeni: `src/utils/careerProgress.js`
- Yeni: `src/utils/careerNextAction.js`
- Yeni: `src/fixtures/careerScenarios.js` veya test fixture dizini

**Yapılacaklar**

- UI’nin tüketeceği ortak `CareerViewModel` şeklini belgeleyip uygula:
  - `metrics`
  - `commonNodes`
  - `paths`
  - `activePath`
  - `currentNode`
  - `nextNode`
  - `displayedTitle`
  - `nextAction`
  - `unseenPromotionCount`
  - `isPathSelectionDue`
  - `completedPathIds`
- Düğüm durumlarını standartlaştır:
  - `completed`
  - `current`
  - `next`
  - `future`
- Aşağıdaki fixture’ları hazırla:
  - hiç olay yok
  - ilk hikâye tamamlanmış
  - ortak yol kısmi
  - Yolcu tamamlanmış fakat yol seçilmemiş
  - her yol için ilk, orta ve son rütbe
  - bir koşulu eksik düğüm
  - aynı anda birden fazla düğüm kazanan kullanıcı
  - yolu tamamlamış kullanıcı
  - legacy migration kullanıcısı
  - erişilebilir kategori sayısı hedefin altında
  - offline/cache state

**Kabul kriterleri**

- Aynı fixture Home ve Progress için aynı `currentNode` ve `nextAction` sonucunu verir.
- UI bileşenleri ham olay listesini kendileri hesaplamaz.

### KY-003 — Minimum otomatik test altyapısını ekle

**İlgili dosyalar**

- `package.json`
- Yeni test yapılandırması
- Yeni: `src/utils/__tests__/careerProgress.test.js`
- Yeni: `src/utils/__tests__/careerNextAction.test.js`

**Yapılacaklar**

- Projede mevcut test script’i olmadığı için Expo sürümüyle uyumlu Jest altyapısını kur.
- `test` ve hedefli `test:career` script’leri ekle.
- Öncelikle saf domain fonksiyonlarını test et; ekran testlerini veri modeli sabitlenmeden yazma.
- Zaman testlerinde gerçek sistem saatine bağlanma; sabit `now` ve timezone girişi kullan.

**Kabul kriterleri**

- Test komutu yerel ve CI ortamında etkileşimsiz çalışır.
- Günlük kredi sınırı, 24 saat kuralı, kategori normalizasyonu ve yol değişimi testlerle korunur.

### KY-004 — Canlı Supabase ve içerik şeması uyumluluğunu doğrula

**İlgili dosyalar**

- `supabase/schema.sql`
- `src/services/supabase.js`
- `src/db/db.js`

**Yapılacaklar**

- Canlı Supabase şemasını salt-okunur olarak doğrula ve repo içindeki `schema.sql` ile farklarını kaydet.
- Özellikle story anahtarı ve kategori ilişkisini doğrula:
  - `id` / `story_id`
  - `category_id`
  - `category_name`
  - parent category alanları
- `get_user_stats()` RPC’sinin gerçek tablo/kolonlarla çalıştığını test et.
- Server kategori istatistiği hata verip sessizce SQLite fallback’e düşüyorsa kök nedeni düzelt.
- `UseInConversationScreen` tarafından gönderilen action değerleriyle `user_variant_usage`/`record_variant_usage` izinli enum’unu karşılaştır; `share_native` ile server’daki `share` sözleşmesi gibi uyuşmazlıkları normalize et.
- Kariyer `K` metriği için dil bağımsız, stabil ana kategori ID’sinin hangi kaynaktan geleceğini kesinleştir.
- Mevcut içerik DB’sinde `DB_VERSION` artışının dosyayı silip asset’ten yeniden kopyaladığını doğrula; kullanıcı kariyer şeması için bu mekanizmayı kullanma.
- Bu doğrulama tamamlanmadan production Supabase migration’ı çalıştırma.

**Kabul kriterleri**

- Aynı story için local ve server aynı stabil kategori kimliğini döndürür.
- `get_user_stats()` canlı şemada kolon hatası üretmez.
- Kariyer migration’ı yanlış story/category kolon varsayımına dayanmaz.

## Faz 0 çıkış kapısı

- 12 düğüm tek tanım dosyasındadır.
- Fixture tabanlı ortak view-model üretilmektedir.
- Feature flag ile eski deneyime güvenli dönüş mümkündür.
- Saf domain testleri çalışmaktadır.

---

# FAZ 1 — Kariyer olay modeli ve ilerleme motoru

## Fazın amacı

Mevcut `user_reads` tablosunun sağlayamadığı aktif gün, yeniden ziyaret ve günlük kredi sınırı bilgilerini güvenilir, idempotent bir olay modeliyle oluşturmak.

## Kritik mevcut durum

Mevcut `user_reads` tablosunun birincil anahtarı `(user_id, story_id)` ve `recordRead()` işlemi `INSERT OR REPLACE` kullanmaktadır. Bu nedenle aynı hikâye yeniden okunduğunda eski tarih kaybolur. Ayrıca mevcut içerik DB’sinde `DB_VERSION` değişimi tüm dosyayı silebilir. Kariyer sistemi doğrudan bu tabloya veya dosyaya bağlanırsa:

- geçmiş aktif günler azalabilir,
- 24 saat sonra yeniden ziyaret kanıtlanamaz,
- ilk ve son tamamlanma tarihi ayrıştırılamaz,
- günlük kredi sınırları doğru uygulanamaz.
- içerik DB’si yenilendiğinde kariyer olayları kaybolabilir.

Bu tablo mevcut streak/heatmap davranışını kırmamak için ilk adımda değiştirilmemeli; kariyer için ayrı `kivilcim_user.db` dosyasında eklemeli olay günlüğü kullanılmalıdır.

## Görevler

### KY-100 — Yerel tarih yardımcılarını oluştur

**İlgili dosyalar**

- Yeni: `src/utils/localDate.js`
- Güncellenecek ilgili yeni kariyer servisleri

**Yapılacaklar**

- `toLocalDay(date)` ile `YYYY-MM-DD` yerel gün üret.
- `hoursBetween(a, b)` veya eşdeğer güvenli süre hesabı ekle.
- Geçersiz timestamp için kontrollü fallback tanımla.
- Yeni kariyer kodunda `new Date().toISOString().split('T')[0]` kullanma.
- Olayda hem UTC `occurredAt` hem yerel `localDay` sakla.
- Gerekirse olay anındaki timezone offset’ini sakla; seyahat sonrası geçmiş günü yeniden yorumlama.

**Kabul kriterleri**

- İstanbul’da gece yarısına yakın olay yanlış UTC gününe yazılmaz.
- DST kullanan timezone senaryoları test edilir.

### KY-101 — Ayrı kullanıcı SQLite DB’sini ve kariyer tablolarını ekle

**İlgili dosyalar**

- Yeni: `src/db/userDb.js`
- `App.js`

**Yapılacaklar**

- `kivilcim_user.db` adlı ayrı kullanıcı veritabanını açan `initUserDb()` fonksiyonu oluştur.
- İçerik DB’sini asset’ten yeniden kopyalayan `DB_VERSION` mekanizmasını kullanma.
- Kullanıcı DB’si için eklemeli ve transaction-safe bir `user_schema_version` migration runner oluştur.
- `App.js` başlangıç sırasını `initDb → seedData → initUserDb → provider load` olacak şekilde düzenle.

Önerilen tablolar:

1. `user_career_events`
   - `event_id TEXT NOT NULL`
   - `user_id TEXT NOT NULL`
   - `credit_key TEXT NOT NULL`
   - `credit_type TEXT NOT NULL` (`H`, `D`, `U`)
   - `event_subtype TEXT NOT NULL`
   - `story_id TEXT NOT NULL`
   - `category_id INTEGER`
   - `completion_method TEXT`
   - `occurred_at TEXT NOT NULL`
   - `local_day TEXT NOT NULL`
   - `timezone_offset_minutes INTEGER NOT NULL`
   - `rule_version INTEGER NOT NULL`
   - `metadata_json TEXT`
   - `created_at TEXT NOT NULL`
   - `PRIMARY KEY(user_id, event_id)`

2. `user_career_state`
   - `user_id TEXT PRIMARY KEY`
   - `active_path TEXT`
   - `rule_version INTEGER NOT NULL`
   - `selected_at TEXT`
   - `selection_source TEXT`
   - `intro_seen_at TEXT`
   - `migration_version INTEGER NOT NULL DEFAULT 0`
   - `migration_summary_seen_at TEXT`
   - `updated_at TEXT NOT NULL`

3. `user_career_nodes`
   - `user_id TEXT NOT NULL`
   - `node_id TEXT NOT NULL`
   - `path_id TEXT NOT NULL`
   - `rule_version INTEGER NOT NULL`
   - `earned_at TEXT NOT NULL`
   - `seen_at TEXT`
   - `award_source TEXT NOT NULL`
   - `requirements_snapshot_json TEXT NOT NULL`
   - `PRIMARY KEY(user_id, node_id)`

4. `user_legacy_badges` yalnız legacy koleksiyon korunacaksa
   - `user_id TEXT NOT NULL`
   - `badge_id TEXT NOT NULL`
   - `earned_at TEXT`
   - `PRIMARY KEY(user_id, badge_id)`

Ek kısıt ve indexler:

- `credit_key` değerini `ruleVersion + creditType + storyId` girdilerinden deterministik üret.
- `(user_id, credit_key)` için unique index; aynı hikâyenin aynı kredi türünü iki kez üretmesini engelle.
- Event ID ve credit key queue retry boyunca değişmeden korunmalıdır.
- `(user_id, local_day, credit_type)` için index; günlük limit hesabını hızlandır.
- `(user_id, occurred_at)` için index.
- `node_id`, `path` ve event türü değerlerini yazmadan önce uygulama katmanında doğrula.
- Migration transaction içinde çalışmalı ve yarım tablolar bırakmamalıdır.
- Kullanıcı DB migration’ı içerik DB dosyasını silmemeli veya yeniden kopyalamamalıdır.

**Kabul kriterleri**

- Mevcut kurulum üzerine migration veri kaybetmeden çalışır.
- Yeni kurulumda tablolar ilk açılışta hazırdır.
- Aynı `H/D/U` olayı tekrar çağrıldığında ikinci satır oluşmaz.
- `waitForUserDb` hazır olma koruması tüm yeni sorgularda kullanılır.
- İçerik `DB_VERSION` değeri değiştirildiğinde kariyer verisi yerinde kalır.

### KY-102 — Yerel kariyer repository fonksiyonlarını ekle

**İlgili dosyalar**

- `src/db/userDb.js`

**Yapılacaklar**

En az aşağıdaki işlevleri ekle:

- `recordCareerEvent(event)`
- `getCareerEvents(userId)`
- `getCareerEventForStory(userId, creditType, storyId)`
- `getCareerState(userId)`
- `upsertCareerState(userId, patch)`
- `getEarnedCareerNodes(userId)`
- `awardCareerNodes(userId, nodes)`
- `markCareerNodeSeen(userId, nodeId)`
- `getUnseenCareerNodes(userId)`
- `getLegacyBadgeIds(userId)`
- `replaceLegacyBadgeIds(userId, badgeIds)`
- `clearCareerData(userId)`

Kurallar:

- Event yazımı `INSERT OR IGNORE`/unique constraint ile idempotent olmalı.
- `awardCareerNodes` transaction içinde çoklu düğüm yazabilmeli.
- `earned_at` bir kez yazıldıktan sonra threshold değişikliği nedeniyle güncellenmemeli.
- `seen_at`, yalnız kullanıcı promotion’ı gerçekten gördüğünde yazılmalı.
- Repository UI metni veya navigation kararı üretmemeli.
- İçerik/kategori lookup gerektiğinde `src/db/db.js` yalnızca okunmalı; kariyer kullanıcı state’i oraya yazılmamalı.

**Kabul kriterleri**

- Uygulama kapanıp açıldığında active path, earned node ve seen state korunur.
- Aynı promotion iki kez kazanılmış yazılmaz.
- Tam veri sıfırlama kariyer tablolarını da temizler.

### KY-103 — Saf metrik hesaplama motorunu tamamla

**İlgili dosyalar**

- `src/utils/careerProgress.js`

**Yapılacaklar**

- Olayları `occurredAt`, ardından stabil `eventId` sırasıyla deterministik sırala.
- Her `localDay` için ilk 3 benzersiz `H` olayını rütbe kredisine al.
- Her `localDay` için ilk 1 benzersiz `U` olayını rütbe kredisine al.
- `D` için hikâye başına bir kredi uygula.
- İlgili story için geçerli `H` bulunmayan orphan `D/U` olayını rütbe hesabına katma; event üretim katmanı da normal akışta bu durumu engellemelidir.
- `K` değerini kredi alan `H` olaylarının benzersiz ana kategori kimliklerinden hesapla.
- `G` değerini en az bir geçerli olay bulunan benzersiz yerel günlerden hesapla.
- Erişilebilir kategori sayısını kullanarak her düğüm için efektif kategori hedefi üret.
- Her requirement satırı için şu alanları üret:
  - `type`
  - `current`
  - `target`
  - `remaining`
  - `completed`
  - `labelKey`
- Düğüm uygunluğunu bütün koşullar tamamlandıysa true yap.
- Kazanılmış düğümü threshold daha sonra yükselse bile tamamlanmış göstermeye devam et.

**Kabul kriterleri**

- Dördüncü aynı gün hikâyesi ham özet sayısında görülebilir, fakat rütbe `H/K` kredisini artırmaz.
- İkinci aynı gün uygulama ham geçmişte kalır, fakat rütbe `U` kredisini artırmaz.
- Koşullar ayrı satırlar olarak döner; tek toplam yüzde zorunlu değildir.
- Aynı input her cihazda aynı sonucu verir.

### KY-104 — Yol öneri algoritmasını uygula

**İlgili dosyalar**

- `src/utils/careerProgress.js` veya ayrı `src/utils/careerRecommendation.js`

**Yapılacaklar**

Yolcu tamamlandıktan sonra yalnızca yardımcı öneri üret:

- Keşif sinyali: kredi alan farklı kategori / uygun hikâye oranı.
- Derinlik sinyali: `D / H`.
- Aktarım sinyali: `U / H`.
- Skorları `0..1` aralığına normalize et.
- En yüksek iki skor arasındaki fark küçükse tek yol dayatma; “Üç yol da sana uygun” sonucu üret.
- Öneri sebebi kullanıcıya ölçülebilir davranışla açıklanmalı.
- Sistem önerisi path seçiminden ayrı saklanmalı; kullanıcı kararı her zaman üstün olmalı.

**Kabul kriterleri**

- Aynı davranış verisi aynı öneriyi verir.
- Eksik/verisiz durumda rastgele yol seçilmez.
- Öneri copy’si kişilik teşhisi veya uzmanlık iddiası içermez.

### KY-105 — Tek sıradaki eylem motorunu uygula

**İlgili dosyalar**

- `src/utils/careerNextAction.js`

**Yapılacaklar**

Durum sırası:

1. Ortak yol tamamlanmadıysa sıradaki ortak düğüm.
2. Yolcu tamamlandı, aktif yol yoksa `choose_path`.
3. Aktif yol varsa sıradaki tamamlanmamış düğüm.
4. Aktif yol bittiyse `path_complete`.

Eksik koşul önceliği:

1. `U`: uygun hikâyeyi “Sohbette Kullan” veya özel uygulama akışına aç.
2. `D`: 24 saat koşulu dolmuş uygun hikâyeyi yeniden aç veya çıkarım kaydetme eylemi sun.
3. `K`: henüz kredi alınmamış erişilebilir kategoriden uygun hikâye öner.
4. `H`: sıradaki uygun hikâyeyi aç.
5. Yalnız `G` eksikse ve bugün anlamlı olay yapılmışsa `today_complete`; kullanıcıyı aynı gün daha fazla grinde zorlama.

Her action en az şunları taşımalı:

- `type`
- `titleKey`
- `bodyKey`
- `ctaKey`
- `targetNodeId`
- `missingRequirement`
- `destination`
- `storyId` veya `categoryId` gerekiyorsa
- `isAvailableOffline`

**Kabul kriterleri**

- Home ve Yolum aynı action nesnesini kullanır.
- Action, erişilemeyen/paywall arkasındaki hikâyeyi habersiz hedeflemez.
- Uygun hedef yoksa bozuk deep link yerine güvenli kategori/yol ekranı fallback’i döner.

### KY-106 — Domain test matrisini tamamla

**İlgili dosyalar**

- Career test dosyaları

**Testler**

- Aynı hikâyeden iki `H` gelmemesi
- Okuma ve audio completion’ın eşit sayılması
- Kısa hikâyede 5 saniyeden önce `H` gelmemesi
- Aynı gün 4. `H` kredisinin dışarıda kalması
- Aynı gün 2. `U` kredisinin dışarıda kalması
- Copy/share’ın `U` olmaması
- 23 saat 59 dakika revisit’in `D` olmaması
- 24 saat sonrası anlamlı revisit’in `D` olması
- Save-delete döngüsünün yeni `D` üretmemesi
- Geçerli H olmadan D/U olayının rütbe kredisine girmemesi
- Yol değişiminde event ve earned node kaybı olmaması
- Non-active path progress’in hesaplanması fakat otomatik promotion üretmemesi
- Çoklu unlock’ta en yüksek düğümün promotion seçilmesi
- Kategori envanteri hedefin altındayken imkânsız şart oluşmaması
- Threshold değişse bile earned node’un kalması
- Yerel gün sınırı ve timezone testleri

## Faz 1 çıkış kapısı

- Olay modeli ve saf ilerleme motoru tamamlanmıştır.
- Home/Progress bağımsız sayaç üretmeden aynı sonuçları alabilir.
- Anti-farm ve tarih kuralları testlerle korunmaktadır.

---

# FAZ 2 — Supabase, offline sync ve legacy migration

## Fazın amacı

Kariyer verisinin çevrimdışı çalışmasını, cihazlar arasında birleşmesini ve mevcut kullanıcıların eski kazanımlarının kaybolmamasını sağlamak.

## Görevler

### KY-200 — Supabase kariyer şemasını ekle

**İlgili dosyalar**

- `supabase/schema.sql`
- Yeni: `supabase/migrations/<timestamp>_career_path_v1.sql`

**Yapılacaklar**

- SQLite modeline karşılık gelen tabloları ekle:
  - `user_career_events`
  - `user_career_state`
  - `user_career_nodes`
  - gerekiyorsa `user_legacy_badges`
- Bütün tablolarda `user_id` değerini `auth.users(id)` ile ilişkilendir.
- `ON DELETE CASCADE` kullan.
- Her tabloda RLS aç.
- Kullanıcının yalnızca kendi satırlarını okuma/yazma politikalarını ekle.
- `user_career_events` için `(user_id, credit_key)` unique constraint ekle.
- `user_career_nodes` için `(user_id, node_id)` primary key ekle.
- İndeksleri yerel modelle uyumlu kur.
- Doğrudan tablo yazımı kullanılıyorsa değer doğrulama check constraint’leri ekle.
- Rütbeler gelecekte parasal değer kazanırsa server-authoritative award RPC gerekeceğini kod yorumunda belirt; V1’de client event güven modeli mevcut `user_reads` yaklaşımıyla aynı olabilir.
- Tarih damgalı migration dosyasını tekrar uygulanabilir yaz; aynı son şemayı yeni kurulumlar için `supabase/schema.sql` içine de yansıt.
- `record_career_event` RPC’si ekle:
  - kullanıcıyı payload’dan değil `auth.uid()` üzerinden belirlesin,
  - izinli credit/subtype değerlerini doğrulasın,
  - event ID/credit key ile idempotent upsert yapsın,
  - client olay anındaki `occurred_at`, `local_day` ve timezone offset bilgisini korusun,
  - bariz gelecekteki timestamp gibi geçersiz girdileri reddetsin,
  - migration backfill kaynağını normal live event’ten ayırsın.
- RPC yazımı kullanıldığında client’ın `user_career_events` tablosuna doğrudan insert yetkisini kapat.

**Kabul kriterleri**

- SQL mevcut veritabanı üzerinde tekrar çalıştırılabilir.
- RLS başka kullanıcının event/state/node verisini okumayı veya değiştirmeyi engeller.
- Aynı olayın offline retry ile ikinci kez yazılması duplicate üretmez.

### KY-201 — Supabase servis fonksiyonlarını ekle

**İlgili dosyalar**

- `src/services/supabase.js`

**Yapılacaklar**

- Kariyer event upsert/fetch fonksiyonları ekle.
- Event yazımını doğrudan tablo insert’i yerine `record_career_event` RPC’sine bağla.
- Career state get/upsert fonksiyonları ekle.
- Earned node get/upsert ve seen işaretleme fonksiyonları ekle.
- Legacy badge snapshot get/upsert fonksiyonları ekle.
- Server çağrısı başarısız olduğunda mevcut servisin log + local fallback desenini koru.
- Dönen alanları client camelCase biçimine normalize et.
- `occurred_at` ve `local_day` alanlarını birbirine karıştırma.

**Kabul kriterleri**

- Server online olduğunda local eventler idempotent birleşir.
- Server offline olduğunda çağrı app’i crash ettirmez.

### KY-202 — Offline queue’ya kariyer operasyonlarını ekle

**İlgili dosyalar**

- `src/services/offlineQueue.js`

**Yapılacaklar**

- Yeni handler’lar:
  - `record_career_event`
  - `upsert_career_state`
  - `award_career_nodes`
  - `mark_career_node_seen`
  - `upsert_legacy_badges`
- Queue payload’ında olay anının `occurredAt` ve `localDay` değerlerini sakla; flush anında yeniden tarih üretme.
- Queue payload’ında `eventId`, `creditKey`, `ruleVersion` ve timezone offset değerlerini de koru.
- Her kariyer queue öğesine oluşturulduğu Supabase `ownerUserId` değerini ekle.
- Flush sırasında aktif session user ID ile queue owner ID eşleşmiyorsa öğeyi başka kullanıcı adına gönderme; güvenli biçimde beklet veya açıkça karantinaya al.
- Network hatası ve kalıcı constraint hatasını mevcut desenle ayır.
- Reset handler’ına yeni kariyer tablolarını ekle.
- Aynı event’in çok kez kuyruklanması durumunda server unique constraint sayesinde güvenli sonuç al.
- Varyant kullanımının mevcut quota mantığını bozma; kariyer `U` olayı ayrı ve idempotent bir kanıt kaydı olmalıdır.

**Kabul kriterleri**

- Offline kazanılan ilerleme uygulama yeniden başladıktan sonra görünür.
- Bağlantı gelince server’a senkronize olur.
- Flush zamanı olay gününü değiştirmez.
- Kullanıcı/session değişiminde eski kullanıcının queue öğesi yeni kullanıcı hesabına yazılmaz.

### KY-203 — CareerPathContext server-first/local-fallback yükleme stratejisini kur

**İlgili dosyalar**

- Yeni: `src/context/CareerPathContext.js`
- `App.js`

**Yapılacaklar**

- Provider’ı `StoriesProvider` altında ve `Main` üstünde bağla.
- Başlangıçta yerel cache’i hızlıca göster.
- Server oturumu hazırsa server verisini getir, local ile idempotent birleştir ve view-model’i yenile.
- Merge kuralları açık olmalı:
  - eventler `creditKey` ile union,
  - earned node’lar `nodeId` ile union ve en eski `earnedAt` korunur,
  - `seenAt` iki taraftan biri doluysa kaybolmaz,
  - active path/state çakışmasında doğrulanmış en yeni `updatedAt` kazanır,
  - henüz server’a gitmemiş local queue verisi stale server snapshot tarafından silinmez.
- Server gecikmesi sırasında kazanılmış rütbeyi geçici olarak sıfır gösterme.
- `loading`, `refreshing`, `isOffline`, `error` state’lerini ayrı tut.
- Context en az şu API’yi sağlamalı:
  - `careerViewModel`
  - `activePath`
  - `selectPath`
  - `switchPath`
  - `recordCareerEvent`
  - `activePromotion`
  - `closePromotion`
  - `unseenPromotionCount`
  - `markMigrationSummarySeen`
  - `refreshCareer`
- Story listesi hazır değilse kategori hedefi/öneri hesabını ertele veya cache kullan.

**Kabul kriterleri**

- Yavaş server yanıtı kullanıcı unvanını kaybolmuş gibi göstermez.
- Context mount/unmount sırasında duplicate event veya promotion üretmez.

### KY-204 — Legacy V1 migration’ını uygula

**İlgili dosyalar**

- Yeni: `src/services/migrateCareerPath.js`
- `src/context/UserDataContext.js`
- `src/db/db.js`
- `src/db/userDb.js`
- `src/services/migrateLocalToServer.js`

**Migration sürümü**

- `CAREER_MIGRATION_VERSION = 1`

**Yapılacaklar**

Migration başlamadan önce gerekli AsyncStorage ve SQLite verilerini oku; kalıcı `migration_version` değerini yalnız işlem başarıyla tamamlandıktan sonra yaz.

Backfill politikası:

- `user_reads` satırlarından benzersiz `H` event’i oluştur.
- Her story için ana kategori kimliğini mevcut story/book/category ilişkilerinden çöz.
- Mevcut `read_at` değerini eldeki en iyi tarih olarak kullan; kaybolmuş eski tarihler uydurulmaz.
- `variantUsage` içindeki benzersiz `mark_used` kayıtlarından `U` event’i oluştur.
- Aynı story için birden fazla `mark_used` varsa en eski geçerli kayıt seçilir.
- Copy/share eventleri `U` yapılmaz.
- Mevcut favorites verisinden `D` üretme; timestamp ve gerçek etkileşim kanıtı yoktur.
- Geçmiş revisit verisi yoksa `D` uydurma.
- Eski `checkBadges()` sonucu ile o anda kazanılmış eski badge ID’lerini `user_legacy_badges` içine snapshot olarak yaz.
- Yeni ortak yol düğümlerinden koşulları karşılayanları `award_source = legacy_migration_v1` ile kazanılmış yaz.
- Migration ile gelen düğümlerin `seen_at` alanını migration anında doldur; tek tek promotion kuyruğuna ekleme.
- Aktif yolu migration sırasında otomatik seçme.
- Kullanıcıya bir defalık, özet migration kartı/modalı göster:
  - okumalarının korunduğunu belirt,
  - yeni derinlik/uygulama davranışlarının bundan sonra ölçüleceğini açıkla,
  - eski rozetlerin Miras bölümünde olduğunu bildir.

Transaction/idempotency:

- SQLite yazılarını transaction içinde yap.
- Migration yarıda kalırsa güvenle tekrar çalışabilmeli.
- Event unique constraint ve node primary key tekrar çalışmayı güvenli kılmalı.
- AsyncStorage ve server sync işlemleri başarısız olsa bile local migration state tutarlı kalmalı.

**Kabul kriterleri**

- Mevcut kullanıcı sıfır hikâyeye düşmez.
- Eski rozetler kaybolmuş görünmez.
- Kullanıcıya modal yağmuru gösterilmez.
- Uydurma `D` veya aktif gün oluşturulmaz.
- Migration ikinci kez çalıştığında veri veya promotion çoğalmaz.

### KY-205 — Veri sıfırlama, hesap geçişi ve gizlilik akışlarını güncelle

**İlgili dosyalar**

- `src/context/UserDataContext.js`
- `src/context/CareerPathContext.js`
- `src/services/offlineQueue.js`
- `src/services/supabase.js`

**Yapılacaklar**

- “Verilerimi sil” işlemi career event/state/node/legacy verisini de temizlesin.
- Pending promotion ve migration summary state’i temizlensin.
- Analytics identity reset davranışı korunmalı.
- Kullanıcıya ait özel uygulama verisinin analytics payload’ına eklenmediğini doğrula.

**Kabul kriterleri**

- Reset sonrası eski unvan yeniden görünmez.
- Server offline olsa bile local reset tamamlanır ve server silme işlemi kuyruğa alınır.

## Faz 2 çıkış kapısı

- Yeni kurulum, mevcut kullanıcı migration’ı ve offline kullanım ayrı ayrı çalışmaktadır.
- Kariyer verisi uygulama yeniden başlatıldığında ve server senkronundan sonra korunmaktadır.

---

# FAZ 3 — Anlamlı davranış olaylarını ürün akışlarına bağlama

## Fazın amacı

`H`, `D` ve `U` olaylarını yalnız gerçekten anlamlı kullanıcı davranışlarında, bir kez ve doğru timestamp ile üretmek.

## Görevler

### KY-300 — Hikâye tamamlamayı tek bir idempotent fonksiyonda birleştir

**İlgili dosyalar**

- `src/screens/StoryDetailScreen.js`
- `src/context/CareerPathContext.js`
- Gerekirse `src/context/UserDataContext.js`

**Yapılacaklar**

- Mevcut `READ_COMPLETE_RATIO = 0.9` davranışını koru.
- Scroll ile %90’a ulaşınca `H` event’i üret.
- Ekrana tamamen sığan kısa hikâyelerde yalnız layout ölçümünün tamamlanmasıyla anında `H` verme.
- Kısa hikâye için en az 5 saniye foreground dwell koşulu uygula; süre tek merkezi sabit ve test fixture’ı ile korunmalıdır.
- Kullanıcı 5 saniye dolmadan ekranı kapatır veya app background’a geçerse kısa hikâyeyi tamamlanmış sayma.
- `addToHistory()` ve kariyer event yazımını ayrı ayrı dağınık çağırmak yerine idempotent bir completion koordinasyonu kur.
- Aynı screen visit içinde ref ile bir kez çalıştır.
- Aynı hikâye başka oturumda tekrar tamamlandığında ikinci `H` oluşmamasını repository constraint’e bırak.
- `completedStories` listesini kariyerin source of truth’u yapma; mevcut görsel/tüketim amacıyla ayrı kalabilir.
- Mevcut no-op `releasePendingBadge()` çağrılarını yeni promotion queue doğrulandıktan sonra kaldır.

**Kabul kriterleri**

- Sadece ekran açmak `H` üretmez.
- %90 scroll veya en az 5 saniye görünür kalan kısa hikâye bir `H` üretir.
- Aynı hikâyeyi tekrar açmak toplam `H` artırmaz.

### KY-301 — Sesli dinleme tamamlanmasını eşit krediye bağla

**İlgili dosyalar**

- `src/screens/StoryDetailScreen.js`

**Yapılacaklar**

- `Speech.speak` `onDone` callback’inde story completion koordinasyonunu `completionMethod = audio` ile çağır.
- Kullanıcı sesli okumayı erken durdurursa `H` verme.
- Speech error durumunda `H` verme.
- Scroll ile daha önce tamamlanan hikâyede audio callback duplicate üretmemeli.
- Audio Premium ise bu durum yolu Premium’a bağımlı hale getirmez; kullanıcı aynı koşulu ücretsiz okuma ile tamamlayabilir.

**Kabul kriterleri**

- Tam sesli dinleme ve %90 okuma eşit `H` üretir.
- Erken stop/pause tek başına kredi üretmez.

### KY-302 — Açık “çıkarımı kaydet” derin etkileşimini ekle

**İlgili dosyalar**

- `src/screens/StoryDetailScreen.js`
- Gerekirse yeni: `src/components/career/TakeawaySaveAction.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Hikâyenin mevcut lesson/takeaway/reflection içeriğinden kullanıcıya “Bende kalan” veya eşdeğer kısa bir seçim/kaydetme eylemi sun.
- Eylem bütün kullanıcılara ücretsiz olmalı.
- İlgili hikâye için `H` yoksa seçim UI’da saklanabilir ancak kariyer `D` kredisi, story tamamlanana kadar üretilmemeli.
- Önceden kaydedilmiş seçim varken story daha sonra tamamlanırsa completion koordinasyonu aynı transaction/akış sonunda idempotent `D` üretmelidir.
- İlk başarılı kayıtta `D` event’i, subtype `takeaway_saved` üret.
- Kullanıcı daha sonra görünümden kaldırsa bile kazanılmış `D` kredisi geri alınmaz.
- Aynı hikâyede tekrar kaydetmek yeni `D` üretmez.
- İçgörü Rafı için gereken referansı event metadata’da minimal ve dil güvenli biçimde sakla; serbest kullanıcı metni analytics’e gönderme.

**Kabul kriterleri**

- İlk ortak rütbelerdeki `D` koşulu kullanıcı tarafından anlaşılır bir eylemle tamamlanabilir.
- Save-delete farm mümkün değildir.

### KY-303 — 24 saat sonrası yeniden ziyaret derinliğini bağla

**İlgili dosyalar**

- `src/screens/StoryDetailScreen.js`
- `src/utils/careerProgress.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Story’nin ilk `H` event timestamp’ini oku.
- En az 24 saat sonra aynı story yeniden %90 tamamlanırsa ve daha önce `D` yoksa subtype `revisit_24h` ile `D` üret.
- Sadece ekranı açmak veya kısa süre bakmak revisit kredisi vermemeli.
- 24 saat hesabı gerçek UTC timestamp farkıyla yapılmalı; yerel gün farkı tek başına yeterli değildir.

**Kabul kriterleri**

- 23:59 sonra revisit sayılmaz.
- 24:00 ve sonrası anlamlı tamamlanma sayılır.
- Daha önce takeaway ile `D` alan hikâye ikinci `D` üretmez.

### KY-304 — Uygulama kredisini “Sohbette Kullan” akışına bağla

**İlgili dosyalar**

- `src/screens/UseInConversationScreen.js`
- `src/components/MicroVariantCard.js`
- `src/context/CareerPathContext.js`
- `src/context/UserDataContext.js`

**Yapılacaklar**

- `mark_used` ilk kez başarıyla kaydedildiğinde aynı story için `U`, subtype `conversation_mark_used` üret.
- Storyteller practice tamamlanırsa `U`, subtype `practice_completed` üret; unique constraint duplicate’i önlesin.
- Copy, native share, Instagram share veya kart kaydetme `U` üretmesin.
- İlgili story için geçerli `H` yoksa kariyer `U` kredisi verme; kullanıcıya önce hikâyeyi tamamlama yönlendirmesi sun.
- Kullanıcı `mark_used` toggle’ını geri alsa bile kariyer `U` kredisi geri alınmasın.
- Mevcut server quota hatası oluşursa UI optimistic durumu ile career event arasında tutarsızlık yaratma:
  - kalıcı kayıt başarısızsa kullanıcıya açık hata göster,
  - kariyer event’ini yalnız kabul edilen uygulama eyleminde üret.
- Mevcut `share_native`/`share` action adı uyuşmazlığını aynı değişiklikte düzelt; paylaşım yine de `U` üretmemelidir.
- Free kullanıcı en az bir ücretsiz uygulama yoluna her zaman erişebilmeli.

**Kabul kriterleri**

- Kopyalama/paylaşma ile Aktarım Yolu farm edilemez.
- Mark-used geri alma rütbeyi düşürmez.
- Aynı hikâye birden çok varyantla yalnız bir `U` üretir.

### KY-305 — Özel “nerede kullanacağım” alternatifi ekle

**İlgili dosyalar**

- `src/screens/UseInConversationScreen.js` veya yeni küçük bottom sheet
- `src/locales/i18n.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Sosyal paylaşım yapmak istemeyen kullanıcı için özel uygulama alternatifi sun.
- Kullanıcı en azından “iş/okul”, “sosyal sohbet”, “kişisel karar” gibi özel bir bağlam seçebilmeli.
- Tamamlandığında `U`, subtype `private_application_plan` üret.
- İlgili story için geçerli `H` şartı aranmalı.
- Serbest metin zorunlu olmasın.
- Serbest metin eklenirse yalnız cihazda/sunucuda kullanıcı verisi olarak saklanmalı; analytics’e gönderilmemeli.
- Bu eylem paywall veya reklam arkasında olmamalı.

**Kabul kriterleri**

- Ortak Yolcu rütbesi sosyal paylaşım veya Premium gerektirmeden tamamlanabilir.
- Kullanıcının özel plan içeriği log/analytics’e düşmez.

### KY-306 — Event üretim analytics ve idempotency kontrollerini ekle

**Yapılacaklar**

- Bir event insert edildiğinde completion engine’i tek kez refresh et.
- `INSERT OR IGNORE` sonucu yeni satır oluşmadıysa tekrar promotion değerlendirmesi yapma.
- Çok hızlı ardışık callback’lerde yarış durumunu test et.
- Event kayıt hatası kullanıcı hikâye okumasını engellememeli; retry yapılabilmeli.

**Kabul kriterleri**

- Tek kullanıcı eylemi tek event ve en fazla tek promotion değerlendirmesi üretir.
- Double tap veya React effect rerun duplicate üretmez.

## Faz 3 çıkış kapısı

- Kullanıcı `H`, `D` ve `U` koşullarının her birini açık ve ücretsiz bir ürün eylemiyle tamamlayabilir.
- Audio/read parity ve 24 saat kuralı doğrulanmıştır.

---

# FAZ 4 — CareerPathContext, rütbe kazanımı ve güvenli promotion kuyruğu

## Fazın amacı

Kazanım, görülme ve overlay sıralamasını tek state katmanında yönetmek; mevcut modal çakışma korumalarını yeni sisteme taşımak.

## Görevler

### KY-400 — CareerPathContext view-model ve mutasyon API’sini tamamla

**İlgili dosyalar**

- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Event, state, earned nodes ve story inventory’den tek `careerViewModel` üret.
- Hesaplamayı `useMemo` ile stabilize et; ham event listesini her render’da tekrar tekrar tarama.
- `selectPath` ve `switchPath` mutasyonlarını kalıcı/local-first yap.
- Aktif yoldaki yeni uygun node’ları sırayla belirle.
- Earned node snapshot’ını threshold hesabından ayrı tut.
- Common node’ları active path gerektirmeden değerlendir.
- Non-active path metriklerini hesapla fakat yeni node award/promotion üretme.
- Profile için `displayedRank` ve `displayedPath` sağla.

**Kabul kriterleri**

- Yol değiştirme event veya earned node silmez.
- App restart sonrası aynı title/path görünür.
- Threshold config değişse bile kazanılmış node korunur.

### KY-401 — Yeni rütbe award işlemini transaction-safe yap

**Yapılacaklar**

- Bir event sonrası uygun fakat kazanılmamış düğümleri belirle.
- Ön koşul sırasını uygula; üst düğüm alt düğüm yazılmadan tek başına kazanılmamalı.
- Tüm yeni düğümleri tek transaction ile yaz.
- `award_source` değerleri:
  - `live_event`
  - `path_switch_backfill`
  - `legacy_migration_v1`
- Live event ve path switch backfill için promotion özeti üret.
- Legacy migration için tek tek promotion üretme.

**Kabul kriterleri**

- İşlem yarıda kalırsa yarım rütbe zinciri oluşmaz.
- Aynı event tekrar işlendiğinde promotion çoğalmaz.

### KY-402 — Mevcut badge queue davranışını generic promotion kuyruğuna dönüştür

**İlgili dosyalar**

- `src/context/UserDataContext.js`
- `src/context/CareerPathContext.js`
- `src/navigation/AppNavigator.js`

**Korunacak mevcut davranış**

- Pending öğe kuyruğu
- Seen state
- Presentation blocker sözlüğü
- Navigation hazır olmadan modal açmama
- Share/ad/paywall/overlay kapanana kadar bekleme

**Yapılacaklar**

- `activeBadgeModal` yerine yeni `activePromotion` payload’ı kullan.
- `pendingBadgeIds` yerine node ID tabanlı pending promotion listesi oluştur.
- `setBadgePresentationBlocked` adı V1’de call-site değişimini azaltmak için korunabilir; davranışın generic olduğu yorumla açıklanmalıdır.
- Blocker call-site’larını koru:
  - navigation
  - badge/rank share sheet
  - StoryDetail overlay ve text share
  - UseInConversation overlay ve native share
  - ShareCardModal
  - ad/paywall akışları
- Promotion açılmadan önce navigation hazır, başka modal kapalı ve node unseen olmalı.
- Kapatıldığında `seen_at` kalıcı yazılmalı ve tab dot güncellenmeli.

**Kabul kriterleri**

- Promotion reklam, paywall, native share veya StorytellerOverlay üzerine açılmaz.
- Blocker kalkınca bekleyen promotion yalnız bir kez açılır.
- Uygulama kapanırsa unseen promotion sonraki uygun anda geri gelir.

### KY-403 — Çoklu kazanım ve capstone davranışını uygula

**Yapılacaklar**

- Aynı hesaplamada birden fazla node kazanılırsa yalnız en yüksek node promotion’ını aç.
- Modal içinde “Bu adımları da tamamladın” şeklinde kompakt alt özet göster.
- Aktif yolun son node’u için promotion tipini `capstone` yap.
- Eski `allBadgesCompleted` ve `badgeCollectionCompletionSeen` mantığını yeni final için kullanma.
- Capstone sonrası next action:
  - `keep_current_path`
  - `focus_another_path`

**Kabul kriterleri**

- Modal yağmuru oluşmaz.
- Global tüm rozet finali görünmez.
- Her yol kendi başına tamamlanmış sayılabilir.

### KY-404 — Profil unvanı entegrasyonunu ekle

**İlgili dosyalar**

- `src/screens/ProfileScreen.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Profil adının altında aktif yolun güncel unvanını göster.
- Tıklanınca `ProgressTab` aç.
- Aktif yol yoksa kazanılmış en yüksek ortak unvanı göster.
- Manuel unvan seçici V1’e ekleme.
- Unvanı sertifika/uzmanlık etiketi gibi sunma.

**Kabul kriterleri**

- Yol değiştirildiğinde profil unvanı deterministik değişir.
- Eski yoldaki kazanılmış unvan kaybolmuş sayılmaz; yalnız aktif gösterim değişir.

## Faz 4 çıkış kapısı

- Career state, earned nodes, active path ve promotion queue tek kaynaktan yönetilmektedir.
- Overlay çakışmaları ve çoklu unlock senaryoları güvenlidir.

---

# FAZ 5 — Görsel sistem, Rehber Işık ve temel UI bileşenleri

## Fazın amacı

12 düğümü tek bir premium ve yetişkin görsel aile içinde göstermek; ekran geliştirmesini tekrar kullanılabilir ve erişilebilir bileşenlerle hazırlamak.

## Görsel yön

- Ortak yol: büyüyen altın kıvılcım
- Keşif: turkuaz/lacivert pusuladan haritaya gelişen sembol
- Derinlik: mor/gece mavisi mercekten katmanlı prizmaya gelişen sembol
- Aktarım: mercan/kehribar ses halkasından köprü veya yayılan ışığa gelişen sembol
- Bütün rütbeler aynı madalyon/geometrik çerçeve ailesini kullanır.
- Her üst rütbe bir öncekinin görsel evrimidir; bağımsız ve rastgele ikon gibi görünmez.
- Kilit/durum yalnızca renkle anlatılmaz.
- Fazla parlak casino jetonu, çocuk oyunu veya çizgi film karakteri estetiği kullanılmaz.

## Görevler

### KY-500 — Merkezi career visual mapping oluştur

**İlgili dosyalar**

- Yeni: `src/constants/careerVisuals.js`
- `src/components/BadgeIcon.js`
- `src/utils/categoryImages.js`
- `assets/`

**Yapılacaklar**

- Her `visualKey` için şu alanları tek mapping’de tanımla:
  - icon veya image source
  - light/dark renk çifti
  - path accent
  - locked/current/completed görünüm meta’sı
  - share background
- `BadgeIcon`, `BADGE_MAP`, `BADGE_IMAGES` ve `BADGE_BANNER_MAP` yanında aynı bilgiyi tekrar eden dördüncü bir dağınık mapping oluşturma.
- Mevcut asset fallback desenini koru: asset eksikse gradient + Ionicon ile anlamlı görünüm üret.
- Yeni asset dosyaları için isimlendirme standardı kullan:
  - `assets/career/common/...`
  - `assets/career/exploration/...`
  - `assets/career/depth/...`
  - `assets/career/transfer/...`
- Asset’leri açık ve koyu zeminde doğrula.
- Boyut/çözünürlük ve bundle bütçesini kayıt altına al; gereksiz 30 farklı arka plan üretme.

**Kabul kriterleri**

- Her node asset eksikken bile boş veya kırık render olmaz.
- Aynı node ekran, modal ve share kartında aynı görsel kimliği taşır.

### KY-501 — Soyut Rehber Işık bileşenini uygula

**İlgili dosyalar**

- Yeni: `src/components/career/GuideLight.js`

**Yapılacaklar**

- Yüzü, gözü, adı veya konuşan kişiliği olmayan altın/kehribar bir ışık sembolü tasarla.
- Desteklenen durumlar:
  - `idle`
  - `guide`
  - `celebrate`
  - `gentleReturn`
- Yalnız şu yüzeylerde kullanılmasına izin ver:
  - Kıvılcım Yolu hero
  - aktif kariyer düğümü
  - Yolum içindeki sıradaki adım göstergesi
  - yeni rütbe/capstone modalı
  - kariyer empty/return state’i
- Home, normal hikâye, paywall, bildirim ve her legacy rozet kutusunda kullanma.
- Animasyonu React Native Animated/SVG gibi mevcut bağımlılıklarla çöz; yalnız bu öğe için ağır animasyon paketi ekleme.
- `Reduce Motion` açıkken statik render yap.
- Dekoratif bileşeni erişilebilirlik ağacından çıkar; hiçbir bilgiyi tek başına taşımasın.

**Kabul kriterleri**

- Rehber Işık kapatıldığında bilgi kaybı olmaz.
- Animasyon sürekli tekrar etmez ve kullanıcı dikkatini metinden çalmaz.
- Promotion animasyonu en fazla 2–3 saniyedir ve atlanabilir.

### KY-502 — Requirement ve node temel bileşenlerini oluştur

**İlgili dosyalar**

- Yeni: `src/components/career/CareerRequirementsList.js`
- Yeni: `src/components/career/CareerNode.js`
- Yeni: `src/components/career/CareerTimeline.js`

**Yapılacaklar**

- Her requirement için sayı, hedef, durum ikonu ve açık label göster.
- Tamamlandı/kısmi/gelecek durumunu renk + ikon + metinle belirt.
- Tek bir opacity değişikliğini kilit göstergesi olarak kullanma.
- Current node expanded; completed ve future node compact olabilsin.
- Timeline ekran okuyucuda doğal üstten alta sırayı korusun.
- Node kontrolünde:
  - `accessibilityRole="button"`
  - state bilgisi
  - açık accessibility label
  - minimum 44×44 touch target
- Görsel progress bar kullanılırsa sayısal metin her zaman yanında bulunsun.

**Kabul kriterleri**

- Kullanıcı yüzde görmeden eksik koşulu anlayabilir.
- VoiceOver/TalkBack node adı, durumu ve her requirement değerini okuyabilir.

### KY-503 — Hero, next action ve path selector bileşenlerini oluştur

**İlgili dosyalar**

- Yeni: `src/components/career/CareerHeroCard.js`
- Yeni: `src/components/career/CareerNextActionCard.js`
- Yeni: `src/components/career/CareerPathSelector.js`

**Yapılacaklar**

- Hero’da unvan, aktif yol, kademe ve exact requirements göster.
- Hero içinde yalnız ikincil “Odağı değiştir” eylemi bulunsun.
- Next Action kartında yalnız bir güçlü primary CTA bulunsun.
- Path selector’da üç yolun adı, progress durumu ve aktif “Odak” etiketi gösterilsin.
- Path chip’leri doğrudan veri silen eylem yapmamalı; switch confirmation sheet açmalı.
- 320 px ekran, büyük font ve uzun Almanca metin için wrapping tasarla.

**Kabul kriterleri**

- Above-the-fold alanda iki rakip primary CTA oluşmaz.
- Seçili yol yalnız renkle değil metin/state ile anlaşılır.

## Faz 5 çıkış kapısı

- Career UI fixture’larla light/dark ve dört dilde render edilebilir.
- Rehber Işık sınırlı, dekoratif ve erişilebilirdir.

---

# FAZ 6 — “Yolum / Kıvılcım Yolu” ekranını yeniden kurma

## Fazın amacı

Mevcut yakın/kazanılan/kilitli rozet ızgarasını kimlik, sıradaki anlamlı eylem ve dikey yol haritası merkezli deneyimle değiştirmek.

## Kesin bilgi mimarisi

Ekran sırası:

1. Header: “Kıvılcım Yolu” + bilgi butonu
2. Aktif kimlik hero
3. Tek “Sıradaki adım” kartı
4. Keşif / Derinlik / Aktarım selector
5. Ortak gövde + aktif yolun dikey haritası
6. İkincil “Ritim” bölümü
7. “Yolculuk özeti”
8. Yalnız legacy kullanıcı için kapalı “Miras Rozetleri”

## Görevler

### KY-600 — ProgressScreen’i yeni view-model’e bağla

**İlgili dosyalar**

- `src/screens/ProgressScreen.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- Internal dosya ve route adı `ProgressScreen` / `ProgressTab` olarak kalsın.
- `CareerPathContext` içinden `careerViewModel` tüket.
- Şu yerel hesapları kaldır:
  - `badgeProgressMeta`
  - `nearBadges`
  - `lockedBadges`
  - `closestBadge`
  - `categoryAction`
  - core için `showAllBadges`
- Header’daki duplicate `tabProgress` render’ını düzelt.
- `earned/total`, `x/25` veya `x/12` stat kartı gösterme.
- Eski hidden `{false && ...}` hero bloğunu yeni ekran parity doğrulandıktan sonra temizle.

**Kabul kriterleri**

- ProgressScreen kendi H/K/D/U/G hesabını yazmaz.
- Aynı snapshot Home ile aynı current node ve next action gösterir.

### KY-601 — Header, bilgi açıklaması ve identity hero’yu ekle

**Yapılacaklar**

- User-facing ekran başlığı “Kıvılcım Yolu” olsun.
- Bilgi butonu açıklama sheet’i açsın.
- Bilgi metninin anlamı:
  - yolun uygulama içi davranış gelişimini gösterdiği,
  - sertifika veya uzmanlık belgesi olmadığı,
  - rütbelerin kalıcı olduğu,
  - yol değişiminde ilerlemenin korunacağı.
- Hero’da mevcut unvan, aktif yol, kademe ve exact requirement satırları gösterilsin.
- Aktif yol yoksa en yüksek ortak unvan ve “Yolunu seç” durumu gösterilsin.
- Rehber Işık burada küçük ve sakin kullanılabilir.

**Kabul kriterleri**

- Kullanıcı 5 saniye içinde kim olduğunu ve neyin eksik olduğunu anlayabilir.
- Bilgi metni uzmanlık iddiasını önler.

### KY-602 — Tek sıradaki adım kartını ve destination routing’i bağla

**Yapılacaklar**

- `careerViewModel.nextAction` dışındaki alternatif görevleri aynı anda gösterme.
- Action type’lara göre destination uygula:
  - story detail
  - belirli kategori/search
  - takeaway save/revisit
  - UseInConversation/private application
  - path selection
  - path complete
- CTA basılmadan önce target hâlâ erişilebilir mi kontrol et.
- Offline erişilemeyen action için güvenli cached/fallback hedef ver.
- Tıklama analytics’i navigation başarılı olduğunda gönder.

**Kabul kriterleri**

- Kırık story/category hedefi kullanıcıyı boş sayfaya atmaz.
- Free kullanıcı habersiz paywall’a düşmez.

### KY-603 — Path selector ve dikey timeline’ı yerleştir

**Yapılacaklar**

- Ortak üç node’u kompakt ortak gövde olarak göster.
- Aktif yolun üç node’unu tam timeline’da göster.
- Diğer yollar selector üzerinde özet progress taşır; üç ayrı görev listesi aynı anda açılmaz.
- Yalnız current node expanded olsun.
- Future node title, anlam ve koşullarını gizleme.
- Future node’u “kilitli gizem kutusu” yapmak yerine prerequisite’i açıkla.
- Node tap `CareerNodeSheet` açsın.

**Kabul kriterleri**

- Mobil ekranda pan/zoom gerektirmez.
- Node sırası ve prerequisite görsel olarak anlaşılır.

### KY-604 — Ritim bölümünü ikincil alana taşı ve mevcut davranışı koru

**İlgili dosyalar**

- `src/screens/ProgressScreen.js`
- `src/db/db.js`

**Yapılacaklar**

- Mevcut 8 haftalık heatmap hesaplama ve görünümünü koru.
- Mevcut streak, longest streak ve aktif gün özetini Ritim bölümüne taşı.
- Streak freeze kartını yalnız risk/protected durumunda ve bu bölüm içinde göster.
- Streak freeze Premium davranışını kariyer requirement’larına bağlama.
- Career `G` ile streak’i aynı kavram olarak sunma; `G` ardışık değildir.
- Heatmap’in mevcut `user_reads` tarih sınırlamasını kariyer event geçmişiyle karıştırma; gerekirse ileride ayrı teknik borç olarak belge.

**Kabul kriterleri**

- Streak/freeze regresyona uğramaz.
- Ritim hero ve next action’ın önüne geçmez.

### KY-605 — Yolculuk özeti ve Miras Rozetleri bölümünü ekle

**Yapılacaklar**

- Yolculuk özetinde ham/raporlama metrikleri göster:
  - benzersiz tamamlanan hikâyeler
  - keşfedilen kategoriler
  - derin etkileşimler
  - uygulamalar
  - aktif günler
- Bunları ayrı yeni badge üreticisi yapma.
- Legacy badge snapshot boş değilse kapalı “Miras Rozetleri” bölümü göster.
- Miras bölümünde eski badge görsel/isimlerini korunmuş geçmiş olarak sun.
- Core 12 rütbeyi Miras grid’inde tekrar gösterme.
- Legacy olmayan kullanıcıya boş Miras bölümü gösterme.

**Kabul kriterleri**

- Eski kullanıcı kazanımlarını kaybetmiş hissetmez.
- Aynı başarı core rank ve legacy badge olarak iki kez kutlanmaz.

### KY-606 — Ekran state’lerini eksiksiz uygula

**Zorunlu state’ler**

- Loading: skeleton veya cached state; sıfır unvan göstermeme
- Error: retry + son bilinen data
- Offline: cached harita + sakin offline banner
- Hiç okuma yok: “İlk kıvılcımını yak” + ilk story CTA
- Ortak yol ilerliyor
- Yolcu kazanıldı, yol seçilmedi
- Aktif yol normal ilerleme
- Bir requirement tamam, diğeri eksik
- Bugünkü kredi sınırı doldu / yalnız aktif gün bekleniyor
- Aktif yol tamamlandı
- Legacy migration özeti bekliyor
- Erişilebilir kategori envanteri teorik hedeften az

**Kabul kriterleri**

- Hiçbir state boş gri ekran veya yanlış “0 ilerleme” algısı üretmez.
- Offline state veri kaybı gibi görünmez.

## Faz 6 çıkış kapısı

- Yeni Yolum ekranı bütün zorunlu state’lerde çalışır.
- Mevcut heatmap/streak ikincil olarak korunur.
- Eski 25 rozet core bilgi mimarisinden çıkarılmıştır.

---

# FAZ 7 — Yol seçimi, node sheet, promotion, capstone ve paylaşım

## Fazın amacı

Kullanıcının yol kararını bilinçli vermesini, düğüm ayrıntısını doğru modal tipinde görmesini ve büyük kazanımların güvenli biçimde kutlanmasını sağlamak.

## Görevler

### KY-700 — Tam ekran ilk yol seçimi akışını ekle

**İlgili dosyalar**

- Yeni: `src/screens/CareerPathSelectionScreen.js`
- `src/navigation/AppNavigator.js`
- `src/locales/i18n.js`

**Yapılacaklar**

- Stack route ekle; `ProgressTab` route’unu değiştirme.
- Ekranda üç yolun:
  - kısa amacı
  - davranış örneği
  - üç rütbe ön izlemesi
  - açacağı yardımcı deneyim
  gösterilsin.
- Sistem önerisi varsa nedenini tek cümlede belirt.
- Önerilen yol görsel olarak vurgulanabilir; otomatik seçilmez.
- “Bu yolu seç” primary CTA ve “Daha sonra” güvenli çıkışı olsun.
- Seçim başarıyla persist edilmeden ekranı tamamlanmış sayma.
- Yol seçimi tüm kullanıcılara ücretsizdir.

**Kabul kriterleri**

- Kullanıcı öneriyi reddedip başka yol seçebilir.
- App kill sonrası yarım seçim yanlış active path yazmaz.

### KY-701 — Node ayrıntı bottom sheet’ini uygula

**İlgili dosyalar**

- Yeni: `src/components/career/CareerNodeSheet.js`

**İçerik davranışı**

- `completed`:
  - rütbe/unvan
  - kazanılma tarihi
  - requirement/evidence özeti
  - profil gösterimi bilgisi
  - isteğe bağlı paylaş
- `current`:
  - rütbenin anlamı
  - ayrı requirement listesi
  - tek next action CTA
- `future`:
  - visible title
  - açacağı yardımcı deneyim
  - ön koşul ve exact requirements
  - kutlama animasyonu yok

**Yapılacaklar**

- Sheet screen-local olabilir; global promotion modalıyla karıştırma.
- Manual open haptik, ses veya confetti üretmemeli.
- Accessibility modal semantiği, focus ve back/escape davranışı ekle.

**Kabul kriterleri**

- Completed/current/future içerikleri birbirinden anlamlı biçimde farklıdır.
- Future node gizlenmez ve yanlış earned kutlaması yapmaz.

### KY-702 — Yol değiştirme confirmation sheet’ini uygula

**İlgili dosyalar**

- Yeni: `src/components/career/CareerPathSwitchSheet.js`

**Yapılacaklar**

- Yeni yolun adı ve mevcut hesaplanmış ilerlemesini göster.
- Açık güvence metni göster: “İlerlemen korunur.”
- Eski ve yeni aktif unvanın nasıl değişeceğini ön izle.
- Confirm edilmeden active path değiştirme.
- Cooldown, ücret veya reset ekleme.
- Switch sonrası geçmiş metriklerle birden çok node kazanılıyorsa çoklu unlock özet kuralını kullan.

**Kabul kriterleri**

- Cancel hiçbir state değiştirmez.
- Confirm sonrası Home ve Yolum aynı anda yeni odağı gösterir.

### KY-703 — Global CareerPromotionModal’ı uygula

**İlgili dosyalar**

- Yeni: `src/components/career/CareerPromotionModal.js`
- `src/navigation/AppNavigator.js`

**Modal içeriği**

- “Yeni rütbe” veya capstone başlığı
- Büyük node görseli
- Yeni unvan
- Kısa kimlik cümlesi
- Tamamlanan davranışların özeti
- Açılan yardımcı deneyim
- Bir sonraki küçük adım
- Primary: “Yola devam”
- Secondary: “Paylaş”

**Yapılacaklar**

- Mevcut modal animasyon/haptik altyapısını bileşene çıkararak yeniden kullan.
- Yoğun konfetti yerine kısa ışık geçişi ve sınırlı parıltı tercih et.
- Önemli promotion’ın dış alana yanlış dokunmayla kapanmasını engelle; açık X/back/CTA sun.
- Sound, haptic ve Reduce Motion tercihlerine saygı göster.
- `setAudioModeAsync({ playsInSilentMode: true })` davranışını ürün tercihiyle gözden geçir; sessiz modu zorla delme.
- Rehber Işık yalnız burada kısa `celebrate` durumunda görünebilir.
- Manuel node detayını bu modalda gösterme.

**Kabul kriterleri**

- Promotion yalnız gerçek state transition’da bir kez görünür.
- Reduce Motion’da spring/confetti yoktur.
- Screen reader focus başlığa taşınır ve kapanınca önceki kontrole döner.

### KY-704 — Capstone final akışını uygula

**Yapılacaklar**

- Her üç yolun son node’u özel `capstone` presentation alır.
- Global “Tüm rozetleri tamamladın” metni kullanılmaz.
- Final, yalnız tamamlanan aktif yolu adlandırır.
- Modal sonrası:
  - aynı yolda kal
  - başka yola odaklan
  seçenekleri sunulur.
- Profil amblemi ve dönem özeti erişilebilir hale gelir.

**Kabul kriterleri**

- Bir yolun finali diğer iki yolu tamamlamayı zorunlu kılmaz.
- Eski collection completion modalı aktif UI’da görünmez.

### KY-705 — Badge share altyapısını rank/path paylaşımına uyarla

**İlgili dosyalar**

- `src/components/BadgeShareSheet.js`
- `src/components/BadgeIcon.js`
- `src/locales/i18n.js`

**Yapılacaklar**

- Mevcut capture, post/story format, busy state ve share blocker davranışını koru.
- Bileşeni backward-compatible genişlet veya generic achievement share bileşenine çıkar.
- Yeni props:
  - rank title
  - path label
  - evidence summary
  - visual key
  - earned date
- `BADGE_LINE1_TR` ve dil conditional’larını i18n’e taşı.
- TR/EN/ES/DE için doğal paylaşım metni sağla.
- Paylaşım isteğe bağlıdır; rütbe koşulu değildir.
- Kullanıcı adı yoksa nötr fallback kullan.

**Kabul kriterleri**

- Rank share kartı doğru yol ve unvanı gösterir.
- Story/post capture kırpılmaz.
- Share kapandığında promotion yeniden baştan açılmaz.

### KY-706 — Legacy global badge modalını güvenli biçimde ayrıştır

**İlgili dosyalar**

- `src/navigation/AppNavigator.js`
- `src/context/UserDataContext.js`

**Yapılacaklar**

- Eski badge detayının hâlâ Miras bölümünden açılması gerekiyorsa legacy modal yolunu koru.
- Career node manual detail global legacy badge modalını kullanmasın.
- `allBadgesCompleted`, `isBadgeCollectionCompletionVisible` ve ilgili close/storage akışını feature flag rollout tamamlandıktan sonra kaldır.
- No-op `releasePendingBadge` API ve StoryDetail çağrılarını yeni queue doğrulandıktan sonra temizle.
- `BADGE_QUOTES` navigation dosyasından çıkarılacaksa legacy share davranışını bozma.

**Kabul kriterleri**

- Career ve legacy modal state’leri birbirini yanlış tetiklemez.
- Rollback sırasında eski deneyim çalışabilir.

## Faz 7 çıkış kapısı

- Yol seçimi/değişimi, node detail, promotion, capstone ve share uçtan uca çalışır.
- Aynı anda birden fazla uygulama modalı görünmez.

---

# FAZ 8 — Home entegrasyonu ve rütbe yardımcı deneyimleri

## Fazın amacı

Kariyer yolunu günlük okuma davranışını bozmadan Home’a bağlamak ve rütbe açıklamalarında vaat edilen yardımcı deneyimleri gerçekten sunmak.

## Görevler

### KY-800 — Home’daki duplicate badge hesabını kaldır

**İlgili dosyalar**

- `src/screens/HomeScreen.js`
- `src/context/CareerPathContext.js`

**Yapılacaklar**

- `CareerPathContext` içinden `careerViewModel` ve `nextAction` al.
- Şu yapıları kaldır:
  - `badgeProgressInfo`
  - local `metricById`
  - ratio’ya göre sıralanan `nextCandidates`
  - eski `badgeCarouselItems`
  - yalnız badge carousel için kullanılan scroll/index state’i
- Home kendi total/category/share/favorite badge hedef haritasını hesaplamamalı.

**Kabul kriterleri**

- Home ve Yolum exact aynı next node/requirement verisini gösterir.
- Eski “en yakın yüzde” algoritması kalmaz.

### KY-801 — Günlük hedef önceliğini ve career action’ı bağla

**İlgili dosyalar**

- `src/screens/HomeScreen.js`

**Yapılacaklar**

- `doneCount < personalizedTarget` iken mevcut kişiselleştirilmiş story primary action davranışını koru.
- Günlük hedef tamamlandıktan sonra:
  - `nextAction` varsa tek kariyer action kartı göster,
  - bugün için anlamlı action yoksa “Bugünlük tamam” göster,
  - active path bittiyse final/başka yol seçme eylemi göster.
- Career kartından navigation, KY-602 ile aynı destination resolver’ı kullanmalı.
- Birden çok badge carousel veya farklı görev kartları göstermemeli.
- Free story/ad/paywall kurallarına dokunma; hedef seçerken erişilebilir story kullan.

**Kabul kriterleri**

- Günlük hedef tamamlanmadan career grind ana CTA olmaz.
- Günlük hedef sonrası action kullanıcıyı aynı gün gereksiz hacme zorlamaz.

### KY-802 — Home header’daki `x/25` sunumunu kaldır

**Yapılacaklar**

- Mevcut kupa/earned-total göstergesini kaldır.
- Yerine tercihen sakin active rank/path chip’i koy; chip primary CTA gibi görünmemeli.
- Chip tap’i `ProgressTab` açmalı.
- Active path yoksa ortak unvan veya “Yolunu seç” göster.
- Rehber Işık Home’da kullanılmamalı.

**Kabul kriterleri**

- Global koleksiyon tamamlama baskısı Home’da görünmez.
- Okuma odaklı header hiyerarşisi korunur.

### KY-803 — Keşif Yolu yardımcı deneyimlerini uygula

**İlgili dosyalar**

- Yeni veya dinamik: `src/screens/CareerToolkitScreen.js`
- Gerekirse Home/Progress yardımcı modülleri

**Rota Arayıcısı — Kategori Pusulası**

- Kredi alınan kategori dağılımını göster.
- En az keşfedilen erişilebilir kategoriye tek öneri sun.
- Kategori adını stabil ID’den aktif dile çöz.

**Ufuk Gezgini — Haftalık Rota**

- Üç farklı kategoriden üç erişilebilir hikâye seç.
- Aynı hafta deterministik rota koru.
- Tamamlanan hikâyeyi rota üzerinde işaretle.
- Free kullanıcıya kilitli story dayatma.

**Bilgelik Haritacısı — Bilgelik Atlası**

- Kategori kapsaması, seçilmiş hikâyeler ve dönem özeti göster.
- Profil amblemini aç.
- Atlas uzmanlık sertifikası gibi görünmemeli.

**Kabul kriterleri**

- Unlock copy’sinde vaat edilen araç gerçekten erişilebilirdir.
- Ana hikâye içeriği bu araçların arkasına kilitlenmez.

### KY-804 — Derinlik Yolu yardımcı deneyimlerini uygula

**Düşünür — İçgörü Rafı**

- `takeaway_saved`/uygun D event’leriyle ilişkili hikâyeleri listele.
- Kullanıcı raf görünümünden bir öğeyi kaldırsa bile career award gerilemez.

**Sentezci — Haftalık Sentez**

- Tercihen farklı kategorilerden iki tamamlanmış hikâye seç.
- Kullanıcıya kısa karşılaştırma/düşünme sorusu sun.
- AI veya serbest uzun metin V1 için zorunlu değildir.

**İçgörü Küratörü — Bilgelik Dosyası**

- Biriken içgörüleri dönem ve kategoriye göre özetle.
- Profil amblemini aç.
- Kullanıcının özel metnini analytics’e gönderme.

**Kabul kriterleri**

- İçgörü Rafı gerçek D olaylarından beslenir; favorites sayacı değildir.
- Sentez/Dosya boş state’leri açıklayıcıdır.

### KY-805 — Aktarım Yolu yardımcı deneyimlerini uygula

**Anlatıcı — Sohbet başlangıçları**

- Kullanıcının tamamladığı hikâyelerden erişilebilir konuşma varyantlarına kısayol sun.
- Kopyalama tek başına U üretmez.

**Bağ Kurucu — Kişisel deste**

- Benzersiz `U` aldığı story/variant kartlarını listele.
- Toggle silinmiş olsa bile kazanılmış career event’in geçmişi kaybolmaz; kart görünürlüğü için ayrı tercih tutulabilir.

**Kıvılcım Taşıyıcısı — Kıvılcım Paketi**

- Kullanıcının geçmişinden beş hikâyelik özel paket oluşturmasına izin ver.
- Paket private kalabilir; paylaşmak isteğe bağlıdır.
- Profil amblemini ve dönem özetini aç.

**Kabul kriterleri**

- Sosyal paylaşım yapmadan yol tamamlanabilir.
- Paket paylaşımı yeni rütbe veya kredi üretmez.

### KY-806 — Unlock availability guard’larını ekle

**Yapılacaklar**

- Bir node “şu araç açıldı” diyorsa ilgili ekran/route üretim sürümünde mevcut olmalı.
- Araç hazır değilse node’u production’da etkinleştirme veya unlock metnini vaat etmeyen güvenli sürüme çek.
- Unlock’lar Premium durumundan bağımsız olmalı.
- Toolkit route doğrudan açıldığında yetki/earned node kontrolü yapmalı.

**Kabul kriterleri**

- Kullanıcı kazanım sonrası “yakında” veya bozuk route ile karşılaşmaz.
- Paywall kazanılmış aracı geri almaz.

## Faz 8 çıkış kapısı

- Home günlük hedef önceliğini koruyarak tek kariyer action’ı gösterir.
- Dokuz yol rütbesinin vaat ettiği yardımcı deneyimlerin kullanılabilir karşılığı vardır.

---

# FAZ 9 — i18n, analytics, erişilebilirlik ve performans

## Fazın amacı

Yeni deneyimin dört dilde, ölçülebilir, gizlilik güvenli, erişilebilir ve performanslı olmasını sağlamak.

## Görevler

### KY-900 — Tüm kariyer metinlerini i18n’e taşı

**İlgili dosyalar**

- `src/locales/i18n.js`

**Diller**

- `tr`
- `en`
- `es`
- `de`

**Anahtar aileleri**

- Ekran ve bilgi:
  - `tabJourney`
  - `careerPathTitle`
  - `careerPathInfoTitle`
  - `careerPathInfoBody`
  - `careerCurrentPath`
  - `careerCurrentRank`
  - `careerNextAction`
- Yol isim/açıklamaları:
  - `careerPathExploration*`
  - `careerPathDepth*`
  - `careerPathTransfer*`
- Her node için:
  - `_title`
  - `_description`
  - `_identity`
  - `_unlock`
- Requirement:
  - stories
  - categories
  - deep interactions
  - applications
  - active days
- State:
  - completed/current/future
  - loading/error/offline
  - today complete
  - path complete
- Modal/sheet/share/migration
- Rehber Işık için yalnız kısa nötr copy:
  - “Yeni bir yol açıldı.”
  - “Bugünkü kıvılcım yerini buldu.”
  - “İlerlemen burada. Kaldığın yerden devam edebilirsin.”

**Yapılacaklar**

- Kod içindeki `lang === 'tr' ? ... : ...` kariyer metinlerini kaldır.
- Placeholder’lar için merkezi formatter kullan; dağınık `.replace()` zincirlerini azalt.
- Tüm dillerde key ve placeholder parity testi ekle.
- Share copy’sinde ES/DE’nin İngilizce fallback almasını engelle.
- Türkçe canonical copy’yi yazım/karakter açısından gözden geçir.

**Kabul kriterleri**

- Hiçbir kariyer ekranında raw key veya yanlış dil görünmez.
- Dört dil aynı placeholder setini kullanır.

### KY-901 — Analytics event kataloğunu uygula

**İlgili dosyalar**

- `src/utils/analytics.js`
- `docs/ANALYTICS_EVENTS.md`

**Event’ler**

1. `career_path_exposure`
   - treatment gerçekten render edildiğinde, kullanıcı + rule version için bir kez
2. `career_path_viewed`
   - ekran görüntülendiğinde, oturum başına kontrollü
3. `career_path_intro_viewed`
4. `career_path_selected`
5. `career_path_focus_changed`
6. `career_node_opened`
7. `career_next_action_clicked`
8. `career_node_completed`
9. `career_promotion_seen`
10. `career_promotion_dismissed`
11. `career_promotion_shared`
12. `career_path_completed`
13. `career_migration_completed`
14. `career_migration_summary_seen`
15. `story_completed`

**Ortak güvenli payload alanları**

- `career_version`
- `path_id`
- `node_id`
- `previous_node_id`
- `node_state`
- `action_type`
- `missing_requirement`
- `source`
- `completion_method`
- `backfilled`
- `offline`
- `lang`

**Kurallar**

- `career_node_completed` render’dan değil, kalıcı award transition’ından gönderilir.
- Dedupe anahtarı user + career version + node ID olmalıdır.
- Exposure flag sonucu alındığında değil, yeni UI gerçekten render edildiğinde gönderilir.
- Display name, email, serbest reflection/application metni ve story body gönderilmez.
- `career_path_selected` içinde önerilen yol, seçilen yol ve önerinin kabul edilip edilmediği tutulabilir.
- Event adları ve payload dokümanı kodla bire bir eşleşmelidir.
- Kontrollü kullanıcı bazlı flag/deney kullanılacaksa Supabase session hazır olduğunda `identifyUser()` ile stabil kimlik bağla; bunu PII göndermeden yap.
- `initAnalytics → set context → identify` başlangıç sırasını deterministik tut; provider’ın init öncesi context çağrısının sessizce kaybolmadığını doğrula.

**Kabul kriterleri**

- Aynı node için duplicate completed event oluşmaz.
- Migration ve gerçek zamanlı kazanım `backfilled` alanıyla ayrılır.
- Analytics kapalıyken özellik çalışmaya devam eder.

### KY-902 — Erişilebilirlik gereksinimlerini tamamla

**İlgili yüzeyler**

- Yolum ekranı
- Path selection
- Node sheet
- Promotion/capstone modal
- Share sheet
- Toolkit ekranları

**Yapılacaklar**

- Mantıksal okuma sırası üstten alta olsun.
- Her node için ad + durum + mevcut/hedef + next action okunabilir olsun.
- Kilit/current/completed yalnız renkle ayrılmasın.
- Dekoratif görseller accessibility tree dışında olsun.
- Modal `accessibilityViewIsModal`, ilk focus ve kapanış sonrası focus dönüşü uygulasın.
- Rank duyurusu bir kez yapılsın; başlıkla çift okunmasın.
- Minimum 44×44 touch target.
- 200% font ölçeğinde metin kesilmesin.
- Açık/koyu temada normal metin için 4.5:1 kontrast hedefle.
- VoiceOver ve TalkBack ayrı doğrulansın.

**Kabul kriterleri**

- Ekran yalnız screen reader ile kullanılabilir.
- Renk körlüğünde node durumları ayırt edilebilir.

### KY-903 — Reduce Motion, ses ve haptik tercihlerini uygula

**Yapılacaklar**

- `AccessibilityInfo.isReduceMotionEnabled()` ve değişiklik listener’ı kullan.
- Reduce Motion açıkken:
  - confetti/parçacık yok,
  - spring scale yok,
  - otomatik timeline ışık hareketi yok,
  - kısa fade yeterli.
- Haptik başarısızlığı kullanıcı akışını bozmasın.
- Cihaz sessiz modunu zorla aşan kutlama sesi kullanma.
- Ses kapalıyken modal aynı bilgiyi metinle vermeli.

**Kabul kriterleri**

- Ayar runtime’da değişirse sonraki animasyonlar uyum sağlar.
- Motion/sound hiçbir bilginin tek kaynağı değildir.

### KY-904 — Performans ve veri hacmi doğrulaması yap

**Yapılacaklar**

- Event sorgularında tanımlanan indexlerin kullanıldığını kontrol et.
- Career engine’i her frame/render’da çalıştırma.
- Home ve Progress aynı memoized snapshot’ı tüketmeli.
- Server/local merge sonsuz effect loop üretmemeli.
- Büyük event geçmişi fixture’ıyla hesaplama süresini ölç.
- ProgressScreen açılış p95 ve JS thread blokajını rollout analytics’inde izle.
- Asset bundle büyümesini ölç.

**Kabul kriterleri**

- Progress ekranı görünür takılma olmadan açılır.
- 2.000+ olay fixture’ı makul sürede hesaplanır.
- Scroll sırasında engine tekrar tekrar çalışmaz.

## Faz 9 çıkış kapısı

- Dört dil, analytics dokümantasyonu, erişilebilirlik ve performans kontrolleri tamamlanmıştır.

---

# FAZ 10 — QA, kontrollü yayın ve eski sistem temizliği

## Fazın amacı

Migration, offline, modal koordinasyonu ve platform farklarını doğrulamak; yeni sistem sağlıklı çalıştıktan sonra eski core badge kodunu güvenli biçimde temizlemek.

## Görevler

### KY-1000 — Statik ekran görüntüsü üreticisini güncelle

**İlgili dosyalar**

- `scripts/generate-screenshots.mjs`
- Üretilen `docs/screenshots/` çıktıları

**Yapılacaklar**

- `makeProgress()` içeriğini Kıvılcım Yolu IA’sına güncelle.
- Dosya/output adı docs linklerini kırmamak için `progress` olarak kalabilir.
- En az şu preview’ları üret:
  - yeni kullanıcı
  - ortak yol kısmi
  - aktif Derinlik yolu
  - capstone
  - legacy Miras bölümü
  - dark mode
  - uzun Almanca metin
- Statik screenshot script’ini fonksiyonel test kabul etme.

**Kabul kriterleri**

- `npm run screenshots` hatasız çalışır.
- Üretilen ekran son IA’yı temsil eder.

### KY-1001 — Zorunlu manuel QA matrisini çalıştır

| Boyut | Varyantlar |
|---|---|
| Platform | iOS, Android; web smoke |
| Dil | tr, en, es, de |
| Tema | açık, koyu |
| Kullanıcı | yeni, ortak yol, yol seçmemiş, her active path, capstone, legacy |
| Abonelik | Free, Premium |
| Ağ | online, offline ilk açılış, offline event, reconnect |
| Feature flag | old/control, career V1, kill switch |
| Zaman | İstanbul gece yarısı, farklı timezone, DST |
| Erişilebilirlik | VoiceOver, TalkBack, 200% font, Reduce Motion |
| Yaşam döngüsü | cold start, background/foreground, app kill |
| Senkron | tek cihaz, ikinci cihaz, stale server snapshot |

**Kritik senaryolar**

- %90 scroll tamamlama
- ekrana sığan kısa story
- audio done / audio early stop
- takeaway save-delete
- 23:59 ve 24:00 revisit
- copy/share/mark-used ayrımı
- aynı gün 4. H ve 2. U
- Yolcu sonrası selection erteleme
- aktif yol değiştirme
- yol switch ile çoklu unlock
- promotion sırasında ad/share/paywall açık olması
- capstone
- legacy migration ve app restart
- reset user data

**Kabul kriterleri**

- Her kritik senaryonun beklenen sonucu QA kaydına yazılır.
- P0/P1 hata açıkken production flag açılmaz.

### KY-1002 — Otomatik doğrulama ve build smoke’u çalıştır

**Çalıştırılacaklar**

- Career unit testleri
- i18n key/placeholder parity
- Migration idempotency testleri
- Offline queue owner testleri
- Modal queue component/integration testleri
- Expo bundle/start smoke
- iOS smoke
- Android smoke
- Uygunsa development APK build

**Kabul kriterleri**

- Uygulama boot, onboarding, Home, StoryDetail, UseInConversation, Yolum ve Profile rotaları açılır.
- Testler etkileşimsiz ve tekrarlanabilir çalışır.

### KY-1003 — Shadow mode doğrulaması yap

**Yapılacaklar**

- `careerEventCaptureV1` açık, yeni UI kapalı olarak internal/staff build çalıştır.
- H/K/D/U/G snapshot’larını kullanıcıya göstermeden üret.
- Event duplicate, local/server mismatch ve timezone dağılımını incele.
- Legacy `totalReads/categoryStats` ile yeni H/K’nin neden farklı olduğunu örnek kullanıcılar üzerinde açıkla.
- Yanlış event tetikleyicilerini UI rollout öncesinde düzelt.

**Kabul kriterleri**

- Duplicate career event oranı kabul edilebilir düzeydedir.
- Local ve server snapshot farkları bilinen, belgeli sebepler dışında yoktur.

### KY-1004 — Kontrollü rollout uygula

**Önerilen sıra**

1. Staff/developer allowlist
2. %1–5 yeni kullanıcı, en az 48 saat teknik sağlık
3. %10 yeni kullanıcı + ayrı legacy cohort
4. %25, D7 gözlemi
5. %50, D14 karşılaştırması
6. Guardrail’ler temizse %100

**Guardrail’ler**

- Crash-free session
- Progress ekranı açılış p95
- Duplicate `career_node_completed`
- Modal çakışması veya boş ekran
- Story completion oranında düşüş
- Günlük hedef tamamlamada düşüş
- Free kullanıcının career CTA’dan paywall’a düşme oranı
- Legacy migration hata oranı
- Local/server snapshot uyuşmazlığı
- Kullanıcının path seçimini erteleme ve geri dönme oranı
- Reduce Motion/accessibility hata raporları

**Kabul kriterleri**

- Kill switch veri silmeden eski UI’a dönebilir.
- Rollout genişletme kararı yalnız engagement değil guardrail’lerle birlikte verilir.

### KY-1005 — Eski core badge kodunu temizle

**İlgili dosyalar**

- `src/utils/badges.js`
- `src/context/UserDataContext.js`
- `src/screens/ProgressScreen.js`
- `src/screens/HomeScreen.js`
- `src/navigation/AppNavigator.js`
- `src/components/BadgeShareSheet.js`
- `src/components/BadgeIcon.js`
- `src/utils/categoryImages.js`
- `src/locales/i18n.js`

**Yapılacaklar**

- Yalnız `%100` rollout ve rollback penceresi tamamlandıktan sonra temizle.
- Eski near/earned/locked core IA kodunu kaldır.
- Home badge carousel ve ratio helpers’ı kaldır.
- Global all badges complete modalını kaldır.
- Kullanılmayan `releasePendingBadge`, completion storage key ve imports’u kaldır.
- Hidden legacy JSX ve ölü styles’ı kaldır.
- Miras Rozetleri için gereken tanım, görsel ve share kodunu koru.
- Eski badge ID’lerini migration audit trail’den silme veya yeniden kullanma.
- `rg` ile call-site’sız helper/import/style doğrulaması yap.

**Kabul kriterleri**

- Aktif UI’da “Tüm 25 rozet” veya `earned/25` kalmaz.
- Miras koleksiyonu çalışmaya devam eder.
- Rollout öncesi eski ID’ler başka anlamda tekrar kullanılmaz.

### KY-1006 — Son ürün/teknik dokümantasyonu güncelle

**İlgili dosyalar**

- `README.md`
- `docs/ANALYTICS_EVENTS.md`
- Bu görev dosyası
- Gerekirse veri/migration dokümanı

**Yapılacaklar**

- Kullanıcı-facing marka ayrımını açıkla: uygulama markası ile “Kıvılcım Yolu” özellik adı.
- H/K/D/U/G tanımlarını teknik dokümana ekle.
- Career schema version, migration version ve feature flag davranışını belgele.
- Yeni context/service/component sorumluluklarını Source Map’e ekle.
- Tamamlanan task checkbox’larını ve sapma kararlarını güncelle.

**Kabul kriterleri**

- Yeni bir geliştirici konuşma geçmişi olmadan sistemi anlayabilir ve debug edebilir.

## Faz 10 çıkış kapısı

- Production rollout guardrail’leri geçmiştir.
- Eski core rozet deneyimi güvenli biçimde kaldırılmış veya yalnız Miras olarak sınırlandırılmıştır.
- Dokümantasyon kodla uyumludur.

---

# 9. Faz bağımlılıkları ve paralel çalışma

```text
Faz 0: sözleşme/fixture/flag
  ├── Faz 1: user DB + engine
  │     ├── Faz 2: server/sync/migration
  │     ├── Faz 3: H/D/U event bağlama
  │     └── Faz 4: context/award/queue
  └── Faz 5: asset ve UI bileşenleri (fixture ile paralel)

Faz 4 + Faz 5
  └── Faz 6: Yolum ekranı
        ├── Faz 7: modal/share/navigation
        └── Faz 8: Home + unlock araçları

Faz 6–8
  └── Faz 9: i18n/analytics/a11y/performance
        └── Faz 10: QA/rollout/cleanup
```

Paralel yapılabilecekler:

- Faz 5 görsel/UI bileşenleri, Faz 1 fixture’larıyla paralel geliştirilebilir.
- Share kartı görsel çalışması, merkezi visual mapping sabitlendikten sonra Yolum ekranıyla paralel ilerleyebilir.
- Dört dil copy çalışması, key sözleşmesi sabitlendikten sonra paralel yürütülebilir.
- Toolkit ekranları, event ve earned-node sözleşmesi tamamlandıktan sonra üç yol için ayrı geliştirilebilir.

Bloklanan işler:

- Home entegrasyonu `nextAction` sözleşmesi bitmeden başlamamalıdır.
- Promotion queue kalıcı award/seen modeli bitmeden production-ready sayılmamalıdır.
- Legacy cleanup yeni Home/Progress parity ve rollback penceresi bitmeden yapılmamalıdır.
- Supabase migration, canlı schema audit tamamlanmadan uygulanmamalıdır.

---

# 10. Release engelleyici kabul kriterleri

Aşağıdaki maddelerden biri başarısızsa `careerPathV1` production’da açılmamalıdır:

- [ ] H/K/D/U/G hesapları tek motor tarafından üretiliyor.
- [ ] Canlı Supabase story/category şeması repo sözleşmesiyle doğrulandı ve `get_user_stats()` kolon hatası yok.
- [ ] Kariyer eventleri içerik DB version değişiminde silinmiyor.
- [ ] Aynı story farklı callback veya offline retry ile duplicate kredi üretmiyor.
- [ ] Okuma ve tam audio completion eşit H sağlıyor.
- [ ] Revisit ilk completion tarihini değiştirmiyor.
- [ ] D ve U ücretsiz, açık ve sosyal paylaşım zorunluluğu olmadan tamamlanabiliyor.
- [ ] K kategori adıyla değil stabil kategori ID’siyle hesaplanıyor.
- [ ] G yerel gün ve timezone testlerini geçiyor.
- [ ] Bir rütbe yalnız bütün AND koşulları tamamlandığında kazanılıyor.
- [ ] Kazanılmış rütbe yol değişimi, toggle geri alma veya threshold değişimiyle kaybolmuyor.
- [ ] Migration sahte D üretmiyor ve modal yağmuru oluşturmuyor.
- [ ] Home günlük hedef tamamlanmadan career grind göstermiyor.
- [ ] Home ve Yolum aynı next action’ı gösteriyor.
- [ ] Promotion başka overlay üzerine açılmıyor.
- [ ] Free kullanıcı kariyer CTA’sından beklenmedik paywall’a düşmüyor.
- [ ] Dört dilde key/placeholder parity geçiyor.
- [ ] VoiceOver, TalkBack, 200% font ve Reduce Motion doğrulanıyor.
- [ ] Career analytics eventleri PII ve serbest kullanıcı metni içermiyor.
- [ ] Offline queue öğesi yanlış kullanıcı session’ında flush edilmiyor.
- [ ] Reset local, server, pending queue ve career state’i temizliyor.
- [ ] Kill switch kariyer verisini silmeden eski UI’a dönebiliyor.

---

# 11. Nihai Definition of Done

Kıvılcım Yolu aşağıdaki koşulların tamamı sağlandığında bitmiş kabul edilir:

- 12 düğümlü sürümlü kariyer tanımı tek kaynaktadır.
- Ayrı kullanıcı DB’sindeki olay günlüğü kalıcı ve idempotenttir.
- Local/server/offline akışları aynı kariyer snapshot’ını üretir.
- Legacy kullanıcıların güvenilir H/K/U geçmişi korunur; uydurma D oluşturulmaz.
- Kullanıcı bir aktif yol seçebilir, ücretsiz değiştirebilir ve ilerlemesini kaybetmez.
- Yolum ekranında kimlik, exact eksikler ve tek next action ilk görünümde anlaşılır.
- Günlük okuma hedefi Home’da birincil kalır.
- Node detail, promotion, capstone ve share modal koordinasyonu güvenlidir.
- Her rütbenin vaat ettiği yardımcı deneyim gerçekten erişilebilirdir.
- Rehber Işık yalnız izin verilen kariyer yüzeylerinde ve dekoratif rolde kullanılır.
- Tüm metinler Türkçe, İngilizce, İspanyolca ve Almanca tamamlanmıştır.
- Analytics dokümante, idempotent ve gizlilik güvenlidir.
- Erişilebilirlik ve performans kabul kriterleri geçmiştir.
- iOS ve Android smoke/build doğrulaması tamamlanmıştır.
- Kontrollü rollout guardrail’leri geçmiştir.
- Eski 25 rozet core ilerleme sistemi değildir; yalnız gerekiyorsa Miras olarak korunur.
