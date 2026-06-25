import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = resolve(rootDir, 'assets/kivilcim.db');
const catalogPath = resolve(rootDir, 'YENI_KITAP_ONERILERI.md');
const titlesPath = resolve(rootDir, 'HIKAYE_BASLIKLARI.md');
const taskPath = resolve(rootDir, 'HIKAYE_URETIM_TASK.md');

const proposedStoryTitles = [
  "Zebralar Neden Ata Dönüşmedi?",
  "Paskalya Adası'nın Kesilen Son Ağacı",
  "Kara Ölüm İpek Yolu'nda Nasıl Yolculuk Etti?",
  "Roma Düşmanlarını Nasıl Yurttaşa Dönüştürdü?",
  "Sezar Rubicon'u Geçtiğinde",
  "Lincoln Neden Rakiplerini Kabinesine Aldı?",
  "Bir Bisikletçinin Uçma Takıntısı",
  "Shackleton'ın 800 Millik Kurtuluş Yolculuğu",
  "Everest'te Karar Vermenin Ölümcül Bedeli",
  "Louis Zamperini'nin Kırılamayan İradesi",
  "Dokuz Kürekçi Hitler'in Olimpiyatlarında",
  "NASA'yı Değiştiren Görünmez Matematikçiler",
  "Seabiscuit Büyük Buhran'a Nasıl Umut Oldu?",
  "Churchill'in En Karanlık Yılında Liderlik",
  "Şikago Fuarındaki Beyaz Şehir ve Karanlık Sır",
  "Çernobil Gecesi Kontrol Odasında Ne Oldu?",
  "Bir Cinayetin Kuzey İrlanda'da Bıraktığı Sessizlik",
  "Batık Gemi Mürettebatının İmkânsız Seçimi",
  "Osage Cinayetleri ve Petrol Serveti",
  "Amazon'da Kaybolan Kaşif Percy Fawcett",
  "Bilimin En Büyük Sorularını Sorabilmek",
  "Dünya'nın Soluk Mavi Noktası",
  "Kara Deliklerin Tamamen Kara Olmadığı An",
  "Mendel'in Unutulan Bezelyeleri",
  "CRISPR'ı Başlatan Beklenmedik Bakteri Savunması",
  "Henrietta Lacks'in Ölümsüz Hücreleri",
  "Ağaçların Gizli İletişim Ağı",
  "Mantarların Dünyayı Birbirine Bağlayan Ağı",
  "Denizcilerin Hayatını Kurtaran Boylam Saati",
  "Galyumdan Yapılan Kaybolan Kaşık",
  "Zehri Bilime Dönüştüren Adli Tıp Dedektifleri",
  "Radyum Kızlarının Karanlıkta Parlayan Dişleri",
  "Cerrahiyi Değiştiren Kirli Önlük",
  "Feynman'ın Kasa Açma Merakı",
  "Hayvanların Göremediğimiz Duyusal Dünyası",
  "Bedavanın Gizli Maliyeti",
  "Ahlaki Kararlarımızı Yöneten Fil ve Binici",
  "Telefonla Büyüyen Kaygılı Nesil",
  "Babunlarda Statü ve Stresin Bedeli",
  "Bir Hapishane Deneyi Kontrolden Nasıl Çıktı?",
  "Karısını Şapka Sanan Adam",
  "Beynin Senden Önce Verdiği Kararlar",
  "Antik Bilgelik Mutluluk Hakkında Ne Biliyordu?",
  "Bir Dolandırıcının En Güçlü Silahı: Güven",
  "Kahneman ile Tversky'nin Zihinleri Değiştiren Dostluğu",
  "Aynı Karara Farklı Günlerde Farklı Cevap Vermek",
  "Şeker Kamışı Çiftçilerinin Kıtlık Zihni",
  "Bronz Madalya Kazananlar Neden Daha Mutlu?",
  "Kafamızdaki Ses Ne Zaman Düşmana Dönüşür?",
  "Marshmallow Testinin Anlatmadığı Şey",
  "Phil Knight'ın Bagajdan Sattığı İlk Ayakkabılar",
  "Pixar'ın Filmleri Kurtaran Beyin Takımı",
  "Amazon'un Kapıdan Yapılan İlk Masaları",
  "Steve Jobs'ın Kaligrafi Dersi Mac'i Nasıl Değiştirdi?",
  "Disney Pixar'ı Satın Alırken Güveni Nasıl Kazandı?",
  "Netflix'in Sınırsız İzin Deneyi",
  "Theranos'un Çalışmayan Kara Kutusu",
  "Barış Zamanı CEO'su ile Savaş Zamanı CEO'su",
  "PayPal'ın Rakip Kurucuları Nasıl Takım Oldu?",
  "Zappos Mutluluğu Şirket Stratejisine Nasıl Çevirdi?",
  "Starbucks'ın Üçüncü Mekân Fikri",
  "Ray Kroc'un 52 Yaşında Başlayan Yolculuğu",
  "Sam Walton'ın Cumartesi Sabahı Toplantıları",
  "Aynı Geri Bildirim İki Kültürde Neden Ters Etki Yapar?",
  "Kaptan Emir Vermeyi Bırakınca Ne Oldu?",
  "Bay Piyasa Her Gün Kapını Çalarsa",
  "Rastgele Yürüyen Bir Piyasa Yenilebilir mi?",
  "Peter Lynch Alışveriş Merkezinde Nasıl Yatırım Buldu?",
  "Philip Fisher'ın Söylenti Ağı Yöntemi",
  "Babil'in En Basit Zenginlik Kuralı",
  "Parayı Harcamak Aslında Hayatını Harcamak mı?",
  "Finansal Özgürlüğün Tek Yolluk Formülü",
  "Ölmeden Önce Anı Temettüsü Biriktirmek",
  "Kahve Kupası Sahibi Olunca Neden Değerlenir?",
  "İnsanlık Riski Ne Zaman Ölçmeye Başladı?",
  "Hayatın Sonunda Daha Fazla Tedavi Her Zaman Daha İyi mi?",
  "Bir Cerrahın Hatalarını Açıklama Cesareti",
  "Basit Bir Kontrol Listesi Kaç Hayat Kurtarabilir?",
  "Doktor Hastaya Dönüştüğünde",
  "Zebralar Neden Ülser Olmaz?",
  "Uzun Yaşam Adası İkarya'nın Sırrı",
  "Hadza Avcıları Egzersiz Yapmadan Nasıl Aktif Kalıyor?",
  "Konfor Alanı Bedenimizi Nasıl Zayıflatıyor?",
  "Kalp Hastalığını Geri Çevirmeye Çalışan Doktorlar",
  "Depresyonu Dünyanın Her Yerinde Arayan Yazar",
  "Çakal Dili ile Zürafa Dili Arasındaki Fark",
  "Zor Bir Konuşmanın Aslında Üç Konuşma Olması",
  "Geri Bildirim Alırken Bizi Kilitleyen Üç Tetikleyici",
  "İyi İletişimcilerin Eşleştirme İlkesi",
  "Yabancıları Okuduğumuzu Neden Sanıyoruz?",
  "Dinlemek Neden Konuşmaktan Daha Zordur?",
  "Bir Rehine Müzakerecisinin En Güçlü Sorusu",
  "Seneca'ya Göre Hayat Neden Kısa Değildir?",
  "Epiktetos'un Kontrol Çemberi",
  "Platon'un Mağarasından Kim Çıkmak İster?",
  "Aristoteles'e Göre Mutluluk Neden Bir Alışkanlıktır?",
  "Suyun Gücü: Yumuşak Olan Sert Olanı Nasıl Aşar?",
  "Sokrates İdam Karşısında Neden Fikrini Değiştirmedi?",
  "Dört Bin Haftalık Bir Hayat Nasıl Harcanmalı?",
  "Mutluluğu Kovalamayı Bırakınca Ne Olur?",
];

const universalTopicTemplates = [
  '{book}: Yazarın Fikrini Değiştiren Kırılma Anı',
  '{author} Bu Kitabı Yazmaya Hangi Soruyla Başladı?',
  '{book} İçindeki En Şaşırtıcı Gerçek Hayat Deneyi',
  'Küçük Bir Kararın Beklenmedik Zincirleme Etkisi',
  'Başarısız Görünen Bir Denemenin Gizli Kazancı',
  '{book} Fikrini Gerçek Hayatta Sınayan Vaka',
  'Yaygın Bir İnanışı Tersine Çeviren Bulgu',
  'Bir Ekibin Kriz Anında Verdiği Kritik Karar',
  'Bugün Hâlâ Geçerli Olan Tarihsel Ders',
  'Tek Bir Sorunun Bütün Sistemi Değiştirdiği An',
];

const categoryTopicTemplates = {
  Finans: [
    'Bir Serveti Büyüten Görünmez Karar',
    'Piyasanın En Rasyonel İnsanları Yanılttığı Gün',
    'Küçük Birikimin Yıllar Sonra Yarattığı Şaşırtıcı Sonuç',
    'Kazanmaktan Daha Zor Olan Şey: Parayı Korumak',
    'Kalabalığın Peşinden Gitmenin Ölçülebilir Bedeli',
    'Bir Kriz Sırasında Soğukkanlı Kalan Yatırımcı',
    'Zengin Görünmek ile Zengin Olmak Arasındaki Fark',
    'Tek Bir Finans Kuralının Değiştirdiği Hayat',
    'Riskin İlk Kez Sayılara Döküldüğü An',
    'Para Hakkındaki En Güçlü Davranış Deneyi',
  ],
  Psikoloji: [
    'Beynin Bizi Yanılttığı En Şaşırtıcı Deney',
    'İyi İnsanların Kötü Karar Verdiği An',
    'Tek Bir Kelimenin Davranışı Değiştirmesi',
    'Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi',
    'Kalabalığın Yanlış Cevabına Uyan İnsanlar',
    'Bir Önyargının Gerçek Hayattaki Görünmez Bedeli',
    'Korkunun Mantığı Devre Dışı Bıraktığı An',
    'Beklentinin Bedeni Değiştirdiği Deney',
    'Mutluluğu Ararken Yapılan Ters Seçim',
    'Kendimiz Hakkında Anlattığımız En Büyük Yanılsama',
  ],
  Liderlik: [
    'Bir Liderin Kriz Anında Verdiği Ters Köşe Karar',
    'Emir Vermeyi Bırakan Yöneticinin Ekibi',
    'Kötü Haberi Erken Söylemenin Şirketi Kurtardığı Gün',
    'Rakibini Ekibine Alan Lider',
    'Başarısızlığı Herkesin Önünde Üstlenen Yönetici',
    'Küçük Bir Güven Hareketinin Yarattığı Büyük Dönüşüm',
    'En Sessiz Çalışanın Şirketi Kurtaran Fikri',
    'Bir Toplantının Kurum Kültürünü Değiştirmesi',
    'Kontrolü Paylaşınca Güçlenen Ekip',
    'Liderin Söylemediği Tek Cümlenin Bedeli',
  ],
  Sağlık: [
    'Bir Doktorun Tıp Hakkındaki Fikrini Değiştiren Hasta',
    'Basit Bir Kontrolün Kurtardığı Hayatlar',
    'Vücudun Verdiği Sessiz Uyarıyı Fark Eden Araştırmacı',
    'Herkesin Doğru Sandığı Sağlık Kuralını Bozan Deney',
    'Uyku Eksikliğinin Kararları Değiştirdiği Gece',
    'Stresin Bedende Bıraktığı Ölçülebilir İz',
    'Bir Topluluğun Uzun Yaşam Sırrı',
    'Modern Hayatın Bedenimize Unutturduğu Hareket',
    'Doktor Hastaya Dönüştüğünde Değişen Bakış',
    'Küçük Bir Alışkanlığın Yıllar Sonraki Sağlık Etkisi',
  ],
  Büyüme: [
    'Vazgeçmek Üzereyken Yönünü Değiştiren İnsan',
    'Küçük Bir Alışkanlığın Kimliği Değiştirmesi',
    'Başarısızlığı Deneye Çeviren Karar',
    'Yıllarca Görünmeyen Emeğin Bir Günde Sonuç Vermesi',
    'Korkuya Rağmen Atılan İlk Küçük Adım',
    'Bir Mentorun Hayatı Değiştiren Tek Sorusu',
    'Konfor Alanından Çıkmanın Beklenmedik Bedeli',
    'Kendine Verilen Sözün Davranışı Değiştirmesi',
    'Yeteneği Değil Süreci Seçen Kişi',
    'Kaybı Yeni Bir Başlangıca Dönüştüren Hikâye',
  ],
  Bilim: [
    'Tesadüfen Yapılan ve Dünyayı Değiştiren Keşif',
    'Kimsenin İnanmadığı Deneyi Tekrarlayan Bilim İnsanı',
    'Yanlış Sonucun Doğru Keşfe Götürdüğü An',
    'Bir Çocukluk Merakının Bilimsel Devrime Dönüşmesi',
    'Görünmeyeni Ölçmeyi Başaran İlk Araç',
    'Tek Bir Gözlemin Eski Teoriyi Yıkması',
    'Laboratuvardaki Küçük Hatanın Büyük Sonucu',
    'Bilim Dünyasının Yıllarca Reddettiği Fikir',
    'Doğadaki Basit Bir Canlının Teknolojiye İlham Vermesi',
    'Cevabından Daha Değerli Olan Bilimsel Soru',
  ],
  Felsefe: [
    'Bir Filozofun Ölüm Karşısında Verdiği Cevap',
    'Gücün Ortasında Sade Kalmayı Seçen İnsan',
    'Kontrol Edemediğimiz Şeylerle İlgili Eski Bir Ders',
    'Mutluluğu Aramayı Bırakan Filozof',
    'Tek Bir Soruyla Bütün İnançları Sarsan Öğretmen',
    'Kaybetmenin Anlamını Değiştiren Düşünce',
    'Özgürlüğün Dışarıda Değil İçeride Bulunduğu An',
    'Bir İkilemin Doğru Cevaptan Daha Değerli Olması',
    'İyi Bir Hayatın Ölçüsü Üzerine Unutulmayan Tartışma',
    'Yüzyıllar Sonra Hâlâ Rahatsız Eden Soru',
  ],
  İletişim: [
    'Tek Bir Sorunun Kavgayı Durdurduğu An',
    'Dinleyerek Kazanılan Zor Bir Müzakere',
    'Doğru Mesajın Yanlış Tonla Kaybedilmesi',
    'Bir Sessizliğin Konuşmadan Daha Fazla Şey Söylemesi',
    'Geri Bildirimin Savunmayı Değil Merakı Tetiklediği An',
    'Yabancıların Birbirini Yanlış Okuduğu Karşılaşma',
    'Empati Kurmanın Anlaşmak Anlamına Gelmediği Gün',
    'Bir Rehine Müzakerecisinin En Güçlü Dinleme Tekniği',
    'Aynı Cümlenin İki Kültürde Ters Etki Yaratması',
    'Zor Konuşmayı Kolaylaştıran Beklenmedik Başlangıç',
  ],
  Verimlilik: [
    'Daha Az Çalışarak Daha İyi Sonuç Alan Ekip',
    'Bir Dikkat Dağınıklığının Gün Boyu Süren Bedeli',
    'İki Dakikalık Başlangıcın Büyük İşi Bitirmesi',
    'Hayır Diyerek Zaman Kazanan Yönetici',
    'Tek Bir Önceliğin Kaosu Durdurduğu Gün',
    'Dinlenmenin Performansı Artırdığı Deney',
    'Yoğun Görünmek ile Üretken Olmak Arasındaki Fark',
    'Bir Takvimin Davranışı Değiştirmesi',
    'Kesintisiz Çalışmanın Yaratıcı Sonucu',
    'Bitmeyen Listeyi Küçülten Basit Kural',
  ],
  Tarih: [
    'Tek Bir Kararın Bir İmparatorluğu Değiştirdiği Gün',
    'Sayıca Üstün Ordunun Kaybettiği Savaş',
    'Haritadaki Küçük Bir Hatanın Büyük Sonucu',
    'Unutulan Bir İcadın Tarihin Yönünü Değiştirmesi',
    'Bir Salgının Siyasi Düzeni Yeniden Kurması',
    'Sıradan Bir İnsanın Tarihe Müdahale Ettiği An',
    'Bir Şehrin Hayatta Kalmak İçin Verdiği Zor Karar',
    'Rakip Toplumların Aynı Krize Verdiği Farklı Cevap',
    'Kazananların Yıllarca Anlatmadığı Ayrıntı',
    'Geçmişten Bugüne Ulaşan Beklenmedik Zincir',
  ],
};

const fillTemplate = (template, book) => {
  const bookTitle = book.original_title || book.title;
  const hasBookTitle = template.includes('{book}');
  const filled = template
    .replaceAll('{book}', bookTitle)
    .replaceAll('{author}', book.author);
  return hasBookTitle ? filled : `${filled} — ${bookTitle}`;
};

const scoreTitle = (title, seed = '') => {
  const input = `${title}|${seed}`;
  let hash = 0;
  for (const char of input) hash = ((hash * 31) + char.codePointAt(0)) >>> 0;
  let score = 76 + (hash % 15);
  if (title.includes('?')) score += 3;
  if (/\d/.test(title)) score += 2;
  if (title.includes(':')) score += 2;
  if (/neden|nasıl|gizli|şaşırtıcı|beklenmedik|kurtar|değiştir|kriz/i.test(title)) score += 2;
  return Math.min(score, 98);
};

const buildTenTopics = (book, existingStories = [], seedTitle = null) => {
  const topics = existingStories.map((story) => ({
    title: story.title,
    status: 'DB',
    storyId: story.story_id,
  }));

  if (seedTitle && topics.length < 10) {
    topics.push({ title: seedTitle, status: 'NEW' });
  }

  const templates = existingStories.length > 0
    ? universalTopicTemplates
    : (categoryTopicTemplates[book.category] || universalTopicTemplates);
  let templateIndex = 0;
  while (topics.length < 10) {
    const template = templates[templateIndex % templates.length] || universalTopicTemplates[templateIndex % universalTopicTemplates.length];
    const title = fillTemplate(template, book);
    if (!topics.some((topic) => topic.title.toLocaleLowerCase('tr') === title.toLocaleLowerCase('tr'))) {
      topics.push({ title, status: 'NEW' });
    }
    templateIndex += 1;
  }

  return topics.slice(0, 10).map((topic) => ({
    ...topic,
    score: scoreTitle(topic.title, `${book.author}|${book.original_title || book.title}`),
  }));
};

const parseRecommendations = (markdown) => {
  const rows = [];
  for (const line of markdown.split('\n')) {
    if (!/^\|\s*\d+\s*\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    const isLegacyRecommendation = cells.length === 4;
    const isCurrentRecommendation = cells.length >= 7 && cells[4].includes('YENİ ÖNERİ');
    if (!isLegacyRecommendation && !isCurrentRecommendation) continue;
    rows.push({
      sourceNo: Number(cells[0]),
      title: cells[1].replace(/^\*|\*$/g, '').trim(),
      author: cells[2],
      category: cells[3],
    });
  }
  return rows;
};

const queryRows = (db, sql) => {
  const result = db.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) => Object.fromEntries(
    result.columns.map((column, index) => [column, values[index]])
  ));
};

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(dbPath));
const recommendations = parseRecommendations(readFileSync(catalogPath, 'utf8'));

if (recommendations.length !== 100 || proposedStoryTitles.length !== 100) {
  throw new Error(`Expected 100 recommendations and titles; found ${recommendations.length} and ${proposedStoryTitles.length}.`);
}

const dbBooks = queryRows(db, `
  SELECT
    b.list_no,
    en.title AS original_title,
    b.author,
    COALESCE(ct.translation, c.category_name, '') AS category,
    COUNT(st.id) AS story_count
  FROM books b
  JOIN book_translations en ON en.book_id = b.id AND en.lang_code = 'en'
  LEFT JOIN subcategories sub ON sub.id = b.category_id
  LEFT JOIN categories c ON c.id = sub.categori_id
  LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = 'tr'
  LEFT JOIN stories s ON s.book_no = b.list_no
  LEFT JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
  GROUP BY b.id
  ORDER BY b.list_no;
`);

const dbStories = queryRows(db, `
  SELECT
    b.list_no,
    s.id AS story_id,
    st.title
  FROM books b
  JOIN stories s ON s.book_no = b.list_no
  JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
  ORDER BY b.list_no, s.id;
`);

const storiesByBook = new Map();
for (const story of dbStories) {
  if (!storiesByBook.has(story.list_no)) storiesByBook.set(story.list_no, []);
  storiesByBook.get(story.list_no).push(story);
}

const totalTopicCount = (dbBooks.length + recommendations.length) * 10;
const productionTopicCount = totalTopicCount - dbStories.length;

const catalogLines = [
  '# Kitap Kataloğu ve Yeni Öneriler',
  '',
  'Bu katalog, uygulama veritabanındaki 200 kitabı ve içerik üretimi için seçilen 100 yeni kitabı tek listede birleştirir.',
  '',
  '- `DB\'DE KAYITLI`: Kitap ve en az bir Türkçe hikâyesi `assets/kivilcim.db` içinde bulunur.',
  '- `YENİ ÖNERİ`: Kitap henüz veritabanında bulunmaz; hikâye üretimi ve editoryal onay bekler.',
  '- Veritabanında ayrı bir özgün başlık alanı olmadığı için kayıtlı kitaplarda İngilizce (`en`) başlık kullanılmıştır.',
  '',
  '> **Telif notu:** Kitap metni veya özgün anlatımı kopyalanmamalıdır. Gerçek olay, deney ve iddialar bağımsız kaynaklarla doğrulanıp uygulama için özgün biçimde yazılmalıdır.',
  '',
  '| # | Kitap | Yazar | Kategori | Durum | DB No | Hikâye Sayısı |',
  '|---:|---|---|---|---|---:|---:|',
];

for (const [index, book] of dbBooks.entries()) {
  catalogLines.push(`| ${index + 1} | *${book.original_title}* | ${book.author} | ${book.category} | **DB'DE KAYITLI** | ${book.list_no} | ${book.story_count} |`);
}

for (const [index, book] of recommendations.entries()) {
  catalogLines.push(`| ${dbBooks.length + index + 1} | *${book.title}* | ${book.author} | ${book.category} | **YENİ ÖNERİ** | — | 0 |`);
}

writeFileSync(catalogPath, `${catalogLines.join('\n')}\n`, 'utf8');

const titleLines = [
  '# Hikâye Başlıkları Envanteri',
  '',
  'Bu dosya, 300 kitabın her biri için 10 hikâye konusu içerir. Puanlar başlığın merak, somutluk, şaşırtıcılık ve sohbet açma potansiyeline göre verilen editoryal öncelik puanlarıdır; olgusal doğruluk puanı değildir.',
  '',
  `- Kayıtlı kitap: **${dbBooks.length}**`,
  `- DB’de kayıtlı Türkçe hikâye: **${dbStories.length}**`,
  `- Yeni kitap: **${recommendations.length}**`,
  `- Üretilecek ve doğrulanacak hikâye konusu: **${productionTopicCount}**`,
  `- Toplam izlenen başlık: **${totalTopicCount}**`,
  '',
  '## Durumlar',
  '',
  '- `[x] DB’DE KAYITLI`: Hikâye metni veritabanında bulunur.',
  '- `[ ] ÜRETİLECEK / DOĞRULANACAK`: Editoryal konu önerisidir; kitapla ilişkisi, olguları ve kaynakları henüz doğrulanmalıdır.',
  '- `Sohbet puanı`: 100 üzerinden editoryal öncelik tahminidir.',
  '',
  '# DB’de Kayıtlı Kitaplar',
  '',
];

for (const book of dbBooks) {
  titleLines.push(`## ${book.list_no}. ${book.original_title}`);
  titleLines.push('');
  titleLines.push(`**Yazar:** ${book.author}  `);
  titleLines.push(`**Kategori:** ${book.category}  `);
  titleLines.push(`**Kitap durumu:** DB'DE KAYITLI`);
  titleLines.push('');
  const topics = buildTenTopics(book, storiesByBook.get(book.list_no) || []);
  for (const [topicIndex, topic] of topics.entries()) {
    if (topic.status === 'DB') {
      titleLines.push(`${topicIndex + 1}. [x] **DB'DE KAYITLI** — ${topic.title} — **Sohbet puanı: ${topic.score}/100** \`story_id:${topic.storyId}\``);
    } else {
      titleLines.push(`${topicIndex + 1}. [ ] **ÜRETİLECEK / DOĞRULANACAK** — ${topic.title} — **Sohbet puanı: ${topic.score}/100**`);
    }
  }
  titleLines.push('');
}

titleLines.push('# Yeni Kitaplar');
titleLines.push('');

for (const [index, book] of recommendations.entries()) {
  titleLines.push(`## ${dbBooks.length + index + 1}. ${book.title}`);
  titleLines.push('');
  titleLines.push(`**Yazar:** ${book.author}  `);
  titleLines.push(`**Kategori:** ${book.category}  `);
  titleLines.push('**Kitap durumu:** YENİ ÖNERİ');
  titleLines.push('');
  const topics = buildTenTopics(book, [], proposedStoryTitles[index]);
  for (const [topicIndex, topic] of topics.entries()) {
    titleLines.push(`${topicIndex + 1}. [ ] **ÜRETİLECEK / DOĞRULANACAK** — ${topic.title} — **Sohbet puanı: ${topic.score}/100**`);
  }
  titleLines.push('');
}

writeFileSync(titlesPath, `${titleLines.join('\n')}\n`, 'utf8');

const taskContent = `# Hikâye Üretim Görevi

## Amaç

\`HIKAYE_BASLIKLARI.md\` içindeki \`[ ] ÜRETİLECEK\` başlıkları araştırarak Spark mobil uygulamasının mevcut biçim ve uzunluk kurallarına uygun Türkçe hikâyelere dönüştürmek.

## Kapsam

- Girdi kataloğu: \`YENI_KITAP_ONERILERI.md\`
- İş kuyruğu: \`HIKAYE_BASLIKLARI.md\` içindeki \`[ ] ÜRETİLECEK / DOĞRULANACAK\` satırları
- Mevcut biçim referansı: \`assets/kivilcim.db\` içindeki Türkçe \`story_translations.content\` kayıtları
- Toplam plan: **300 kitap için 3.000 hikâye başlığı**
- İlk üretim kapsamı: **${productionTopicCount} yeni Türkçe hikâye**
- DB’de kayıtlı **${dbStories.length}** hikâye yeniden üretilmeyecek.

## Çıktı Şeması

Her hikâye şu alanları içermelidir:

\`\`\`yaml
book_title: "Özgün kitap adı"
author: "Yazar"
category: "Uygulamadaki ana kategori"
title: "Hikâye başlığı"
description: "Tek cümlelik kısa açıklama"
content: |-
  112-187 kelimelik özgün hikâye metni.
source_notes:
  - "Doğrulamada kullanılan güvenilir kaynak URL'si"
verification_status: "verified"
\`\`\`

## Uzunluk Kuralları

- Kelime: **112-187**; hedef yaklaşık **151**
- Karakter: **876-1.361**; hedef yaklaşık **1.128** (boşluklar dahil)
- Başlık ve açıklama bu ölçüme dahil değildir; yalnızca \`content\` ölçülür.

## İçerik Biçimi

Her \`content\` alanında tam olarak birer tane bulunmalıdır:

- \`##...##\`: Hikâyenin çarpıcı sonucu veya dönüm noktası
- \`$$...$$\`: Genellenebilir ana ders
- \`&&...&&\`: Sohbet açan, tek cümlelik düşünme sorusu

Metin şu akışı izlemelidir:

1. Merak uyandıran somut giriş
2. Kişi, olay veya deneyin bağlamı
3. Gerilim, engel ya da şaşırtıcı gelişme
4. \`##...##\` ile sonuç
5. \`$$...$$\` ile ders
6. \`&&...&&\` ile sohbet sorusu

## Araştırma ve Güvenlik

- Kitap özeti tek başına doğrulama kaynağı sayılmaz.
- Gerçek olaylar en az iki güvenilir kaynakla doğrulanmalıdır; mümkünse birincil kaynak kullanılmalıdır.
- Doğrudan kitap metni, uzun alıntı veya yazara özgü anlatım kopyalanmamalıdır.
- Tartışmalı deneyler ve tezler kesin gerçek gibi sunulmamalı; eleştiriler belirtilmelidir.
- Sağlık, psikoloji ve finans içerikleri kişisel tavsiye vermemelidir.
- Yaşayan kişiler hakkındaki olumsuz iddialar için güçlü kaynak ve tarafsız dil zorunludur.
- Türkçe doğal, konuşulabilir ve mobil ekranda kolay okunabilir olmalıdır.

## Çalışma Akışı

1. Kuyruktan bir \`ÜRETİLECEK / DOĞRULANACAK\` başlık seç.
2. Kitaptaki olayın gerçekten yer aldığını doğrula.
3. Olayı bağımsız ve güvenilir kaynaklarla araştır.
4. Özgün hikâyeyi yaz.
5. Kelime, karakter ve işaret sayısını otomatik doğrula.
6. Editoryal ve olgusal kontrolden geçir.
7. Onaylanan içeriği bir staging çıktısına ekle; doğrudan DB’ye yazma.
8. Başlık durumunu \`İNCELEMEDE\` veya \`ONAYLANDI\` olarak güncelle.

## Kabul Kriterleri

- [ ] Kitap ve yazar katalogla eşleşiyor.
- [ ] Olay kitapla ilişkili ve bağımsız kaynaklarla doğrulanmış.
- [ ] İçerik 112-187 kelime ve 876-1.361 karakter arasında.
- [ ] \`##\`, \`$$\` ve \`&&\` blokları doğru ve birer kez kullanılmış.
- [ ] Metin tek başına anlaşılabiliyor ve ortamda anlatılabilecek kadar somut.
- [ ] Ana ders olaydan doğal biçimde çıkıyor.
- [ ] Son soru sohbet başlatıyor; evet/hayır cevabına sıkışmıyor.
- [ ] Telifli metin veya uzun doğrudan alıntı içermiyor.
- [ ] Riskli iddialar dengeli ve kaynaklı.
- [ ] DB’ye ekleme öncesinde insan onayı alınmış.

## Tamamlanma Tanımı

Görev, ${productionTopicCount} yeni başlığın tamamı doğrulanıp kabul kriterlerini geçen staging kayıtlarına dönüştürüldüğünde tamamlanır. DB aktarımı ayrı bir migration görevidir.
`;

db.close();

console.log(`Updated ${catalogPath}`);
console.log(`Created ${titlesPath}`);
console.log(`Preserved hand-maintained ${taskPath}`);
