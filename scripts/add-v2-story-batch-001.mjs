import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = resolve(rootDir, 'assets/kivilcim.db');
const titlesPath = resolve(rootDir, 'HIKAYE_BASLIKLARI.md');
const catalogPath = resolve(rootDir, 'YENI_KITAP_ONERILERI.md');
const batchPath = resolve(rootDir, 'HIKAYE_URETIM_BATCH_001.md');

const sourceNotes = [
  'https://www.loc.gov/exhibits/lincoln/a-team-of-rivals.html',
  'https://www.archives.gov/publications/prologue/2006/spring/interview.html',
  'https://presidentlincoln.illinois.gov/learn/educators/educator-resources/lesson-plans',
];

const stories = {
  tr: {
    bookTitle: 'Rakipler Takımı',
    categoryName: 'Tarih',
    title: 'Lincoln Neden Rakiplerini Kabinesine Aldı?',
    description: 'Lincoln, ülkenin en büyük krizinde kendisine sadık isimler yerine eski siyasi rakiplerini aynı masaya topladı.',
    hook: 'Sana rakip olmuş üç kişiyi en kritik ekibine alır mıydın?',
    content: `1860'ta Abraham Lincoln, Cumhuriyetçi Parti'nin başkan adaylığını kazandığında Washington'ın en tanınmış ismi değildi. Üstelik adaylık yarışında William Seward, Salmon Chase ve Edward Bates gibi çok daha deneyimli rakipleri geride bırakmıştı. Başkan seçildikten sonra çevresi ondan sadık destekçilerini ödüllendirmesini bekledi. Lincoln tersini yaptı: Üç rakibini de kabinesine çağırdı. Seward dışişleri, Chase hazine, Bates ise adalet yönetimini üstlendi. Bu adamlar yalnızca güçlü değildi; Lincoln'ün kararlarına itiraz ediyor, zaman zaman kendilerini başkanlığa daha uygun görüyorlardı. Fakat ülke parçalanmanın eşiğindeydi ve Lincoln, itaat eden insanlardan çok farklı kanatları temsil eden yeteneklere ihtiyaç duydu. Tartışmaları bastırmak yerine dinledi, son kararı ise kendisi verdi. ##Siyasi rakiplerinden oluşan bu ekip, İç Savaş boyunca ülkenin en kritik kararlarını birlikte yönetti.## Lincoln özellikle Seward'ın saygısını ve yakın dostluğunu kazandı. $$Güçlü liderlik, itirazı susturmak değil; doğru insanları ortak bir amaç etrafında çalıştırabilmektir.$$ &&Sen olsaydın, sana açıkça rakip olmuş birini hangi koşullarda ekibine alırdın?&&`,
    punchline: 'Lincoln, en güçlü kabinesini kendisine sadık isimlerden değil, eski rakiplerinden kurdu.',
    thirtySec: `Lincoln 1860 seçimlerini kazandığında üç büyük siyasi rakibini dışarıda bırakabilirdi. Bunun yerine Seward'ı dışişlerine, Chase'i hazineye, Bates'i adalete getirdi. Hepsi daha deneyimliydi ve ona açıkça itiraz ediyordu. Lincoln tartışmayı zayıflık değil, daha iyi karar üretmenin yolu olarak gördü. Ülke İç Savaş'a sürüklenirken bu rakipler, farklı kanatları aynı masada tutan ve birlikte karar verebilen güçlü bir kabineye dönüştü.`,
    question: 'Sana daha önce rakip olmuş birini hangi özelliği nedeniyle ekibine alırdın?',
    keyContrast: 'Sadakat değil, yetkinlik',
  },
  en: {
    bookTitle: 'Team of Rivals',
    categoryName: 'History',
    title: 'Why Lincoln Put His Rivals in the Cabinet',
    description: 'During the country’s deepest crisis, Lincoln chose former political opponents instead of surrounding himself with loyalists.',
    hook: 'Would you trust three former rivals with your most important decisions?',
    content: `When Abraham Lincoln won the Republican nomination in 1860, he was not Washington's best-known statesman. He had defeated William Seward, Salmon Chase, and Edward Bates, men with stronger national reputations and far more experience. After becoming president, Lincoln was expected to reward loyal supporters. Instead, he invited all three rivals into his cabinet. Seward became secretary of state, Chase took the Treasury, and Bates became attorney general. They were talented, proud, and often convinced that they understood the crisis better than Lincoln did. Yet the country was breaking apart, and Lincoln wanted ability and competing viewpoints, not a room filled with agreement. He allowed sharp debate, listened patiently, and still accepted responsibility for the final decision. ##The former rivals helped guide the Union through the Civil War's most dangerous choices.## Seward, once dismissive of Lincoln, eventually became a trusted friend and ally. $$Leadership is not removing disagreement; it is turning strong differences toward a shared purpose.$$ &&What would someone have to demonstrate before you invited a former rival onto your team?&&`,
    punchline: 'Lincoln built his strongest cabinet not from loyalists, but from the rivals he had defeated.',
    thirtySec: `After winning the presidency in 1860, Lincoln could have shut his three strongest rivals out. Instead, he made Seward secretary of state, Chase treasury secretary, and Bates attorney general. Each man had more national experience and regularly challenged him. Lincoln treated disagreement as useful information rather than disloyalty. As the country entered civil war, that tense collection of competitors became a cabinet capable of representing different Republican factions at one table.`,
    question: 'What quality would persuade you to bring a former rival onto your team?',
    keyContrast: 'Loyalty versus ability',
  },
  es: {
    bookTitle: 'Equipo de rivales',
    categoryName: 'Historia',
    title: 'Por qué Lincoln incorporó a sus rivales al gabinete',
    description: 'En la mayor crisis del país, Lincoln prefirió antiguos adversarios políticos antes que un círculo de seguidores obedientes.',
    hook: '¿Confiarías tus decisiones más importantes a tres antiguos rivales?',
    content: `Cuando Abraham Lincoln ganó la candidatura republicana en 1860, no era el político más famoso de Washington. Había superado a William Seward, Salmon Chase y Edward Bates, tres rivales con más experiencia y prestigio nacional. Tras llegar a la presidencia, muchos esperaban que premiara a sus seguidores más fieles. Lincoln hizo lo contrario: invitó a los tres adversarios a formar parte de su gabinete. Seward asumió Exteriores, Chase dirigió el Tesoro y Bates se convirtió en fiscal general. Eran hombres capaces, orgullosos y dispuestos a discutir cada decisión. Algunos incluso se consideraban más preparados que el propio presidente. Pero el país se estaba dividiendo y Lincoln no quería una sala llena de personas obedientes. Necesitaba talento, perspectivas distintas y representantes de las diferentes facciones republicanas. Escuchaba los desacuerdos y luego asumía la decisión final. ##Aquel gabinete de antiguos rivales ayudó a dirigir la Unión durante las decisiones más difíciles de la Guerra Civil.## $$Liderar no consiste en eliminar el desacuerdo, sino en orientarlo hacia un propósito común.$$ &&¿Qué tendría que demostrar un antiguo rival para que decidieras incorporarlo a tu equipo?&&`,
    punchline: 'Lincoln formó su gabinete más fuerte con los rivales que acababa de derrotar.',
    thirtySec: `Después de ganar la presidencia en 1860, Lincoln podía haber apartado a sus tres principales rivales. En cambio, nombró a Seward responsable de Exteriores, a Chase secretario del Tesoro y a Bates fiscal general. Los tres tenían más experiencia nacional y discutían abiertamente con él. Lincoln no confundió el desacuerdo con la deslealtad. Cuando el país entró en guerra civil, aquel grupo incómodo permitió que distintas facciones republicanas participaran en las decisiones más difíciles.`,
    question: '¿Qué cualidad tendría que mostrar un antiguo rival para que lo sumaras a tu equipo?',
    keyContrast: 'Lealtad frente a capacidad',
  },
  de: {
    bookTitle: 'Team of Rivals',
    categoryName: 'Geschichte',
    title: 'Warum Lincoln seine Rivalen ins Kabinett holte',
    description: 'In der schwersten Krise des Landes setzte Lincoln auf frühere Gegner statt auf gehorsame Gefolgsleute.',
    hook: 'Würdest du drei frühere Rivalen an deinen wichtigsten Entscheidungen beteiligen?',
    content: `Als Abraham Lincoln 1860 die republikanische Präsidentschaftskandidatur gewann, war er nicht der bekannteste Politiker in Washington. Er hatte William Seward, Salmon Chase und Edward Bates besiegt, drei Rivalen mit größerer Erfahrung und nationalem Ansehen. Nach der Wahl erwarteten viele, dass Lincoln treue Unterstützer belohnen würde. Stattdessen holte er alle drei Gegner in sein Kabinett. Seward wurde Außenminister, Chase übernahm das Finanzministerium und Bates wurde Justizminister. Sie waren fähig, selbstbewusst und widersprachen dem Präsidenten offen. Manche hielten sich sogar für besser geeignet. Doch das Land drohte auseinanderzubrechen. Lincoln brauchte deshalb keine Runde gehorsamer Anhänger, sondern starke Persönlichkeiten, die verschiedene Flügel seiner Partei vertraten. Er ließ harte Debatten zu, hörte aufmerksam zu und übernahm anschließend selbst die Verantwortung. ##Dieses Kabinett ehemaliger Rivalen half der Union durch die gefährlichsten Entscheidungen des Bürgerkriegs.## Seward wurde später zu einem engen Verbündeten. $$Führung beseitigt Widerspruch nicht; sie richtet unterschiedliche Stärken auf ein gemeinsames Ziel aus.$$ &&Was müsste ein früherer Rivale zeigen, damit du ihn in dein Team aufnehmen würdest?&&`,
    punchline: 'Lincoln baute sein stärkstes Kabinett nicht aus Gefolgsleuten, sondern aus besiegten Rivalen.',
    thirtySec: `Nach seinem Wahlsieg 1860 hätte Lincoln seine drei stärksten Rivalen ausschließen können. Stattdessen machte er Seward zum Außenminister, Chase zum Finanzminister und Bates zum Justizminister. Alle drei verfügten über mehr nationale Erfahrung und widersprachen ihm offen. Lincoln betrachtete Streit nicht automatisch als Illoyalität. Als das Land in den Bürgerkrieg geriet, wurde aus der unbequemen Gruppe ein Kabinett, das verschiedene republikanische Lager an einem Tisch zusammenhielt.`,
    question: 'Welche Eigenschaft müsste ein früherer Rivale zeigen, damit du ihn in dein Team holst?',
    keyContrast: 'Loyalität gegen Kompetenz',
  },
};

const countWords = (text) => text.trim().split(/\s+/u).filter(Boolean).length;

for (const [lang, story] of Object.entries(stories)) {
  const contentWords = countWords(story.content);
  const contentChars = story.content.length;
  const thirtyWords = countWords(story.thirtySec);
  if (contentWords < 112 || contentWords > 187 || contentChars < 876 || contentChars > 1361) {
    throw new Error(`${lang} content length invalid: ${contentWords} words, ${contentChars} chars`);
  }
  if (thirtyWords < 55 || thirtyWords > 80) {
    throw new Error(`${lang} thirty_sec length invalid: ${thirtyWords} words`);
  }
}

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(dbPath));
const tableInfo = db.exec('PRAGMA table_info(stories)')[0];
const storyColumns = tableInfo.values.map((row) => row[1]);

if (!storyColumns.includes('version')) {
  db.run('ALTER TABLE stories ADD COLUMN version INTEGER DEFAULT 1');
}
db.run('UPDATE stories SET version = 1 WHERE version IS NULL');
db.run(`
  CREATE TABLE IF NOT EXISTS story_conversation_variants (
    story_id INTEGER NOT NULL,
    lang_code TEXT NOT NULL,
    punchline TEXT,
    thirty_sec TEXT,
    question TEXT,
    key_contrast TEXT,
    PRIMARY KEY (story_id, lang_code),
    FOREIGN KEY (story_id) REFERENCES stories(id)
  )
`);
db.run('CREATE INDEX IF NOT EXISTS idx_story_conversation_variants_lang ON story_conversation_variants(lang_code)');

let bookRow = db.exec("SELECT id, list_no FROM books WHERE list_no = 201 LIMIT 1")[0];
let bookId;
if (bookRow?.values?.length) {
  bookId = bookRow.values[0][0];
} else {
  db.run('INSERT INTO books (list_no, author, publish_year, category_id) VALUES (?, ?, ?, ?)', [
    201,
    'Doris Kearns Goodwin',
    '2005',
    41,
  ]);
  bookId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
}

for (const [lang, story] of Object.entries(stories)) {
  const existing = db.exec(`SELECT id FROM book_translations WHERE book_id = ${Number(bookId)} AND lang_code = '${lang}' LIMIT 1`)[0];
  if (!existing?.values?.length) {
    db.run('INSERT INTO book_translations (book_id, lang_code, title, category_name) VALUES (?, ?, ?, ?)', [
      bookId,
      lang,
      story.bookTitle,
      story.categoryName,
    ]);
  }
}

let storyRow = db.exec(`
  SELECT s.id
  FROM stories s
  JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
  WHERE s.book_no = 201 AND st.title = 'Lincoln Neden Rakiplerini Kabinesine Aldı?'
  LIMIT 1
`)[0];
let storyId;

if (storyRow?.values?.length) {
  storyId = storyRow.values[0][0];
  db.run('UPDATE stories SET version = 2 WHERE id = ?', [storyId]);
} else {
  db.run('INSERT INTO stories (book_no, version) VALUES (?, ?)', [201, 2]);
  storyId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
}

for (const [lang, story] of Object.entries(stories)) {
  const existing = db.exec(`SELECT id FROM story_translations WHERE story_id = ${Number(storyId)} AND lang_code = '${lang}' LIMIT 1`)[0];
  if (existing?.values?.length) {
    db.run(
      'UPDATE story_translations SET title = ?, description = ?, content = ?, hook = ? WHERE story_id = ? AND lang_code = ?',
      [story.title, story.description, story.content, story.hook, storyId, lang]
    );
  } else {
    db.run(
      'INSERT INTO story_translations (story_id, lang_code, title, description, content, hook) VALUES (?, ?, ?, ?, ?, ?)',
      [storyId, lang, story.title, story.description, story.content, story.hook]
    );
  }

  db.run(
    `INSERT OR REPLACE INTO story_conversation_variants
      (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [storyId, lang, story.punchline, story.thirtySec, story.question, story.keyContrast]
  );
}

writeFileSync(dbPath, Buffer.from(db.export()));
db.close();

let titles = readFileSync(titlesPath, 'utf8');
titles = titles
  .replace('- Kayıtlı kitap: **200**', '- Kayıtlı kitap: **201**')
  .replace('- DB’de kayıtlı Türkçe hikâye: **633**', '- DB’de kayıtlı Türkçe hikâye: **634**')
  .replace('- Yeni kitap: **100**', '- Yeni kitap: **99**')
  .replace('- Üretilecek ve doğrulanacak hikâye konusu: **2367**', '- Üretilecek ve doğrulanacak hikâye konusu: **2366**')
  .replace(
    '## 206. Team of Rivals\n\n**Yazar:** Doris Kearns Goodwin  \n**Kategori:** Tarih  \n**Kitap durumu:** YENİ ÖNERİ',
    "## 206. Team of Rivals\n\n**Yazar:** Doris Kearns Goodwin  \n**Kategori:** Tarih  \n**Kitap durumu:** DB'DE KAYITLI (V2)"
  )
  .replace(
    '1. [ ] **ÜRETİLECEK / DOĞRULANACAK** — Lincoln Neden Rakiplerini Kabinesine Aldı? — **Sohbet puanı: 91/100**',
    `1. [x] **DB'DE KAYITLI / V2** — Lincoln Neden Rakiplerini Kabinesine Aldı? — **Sohbet puanı: 91/100** \`story_id:${storyId}\``
  );
writeFileSync(titlesPath, titles, 'utf8');

let catalog = readFileSync(catalogPath, 'utf8');
catalog = catalog
  .replace('uygulama veritabanındaki 200 kitabı ve içerik üretimi için seçilen 100 yeni kitabı', 'uygulama veritabanındaki 201 kitabı ve içerik üretimi için seçilen 99 yeni kitabı')
  .replace(
    '| 206 | *Team of Rivals* | Doris Kearns Goodwin | Tarih | **YENİ ÖNERİ** | — | 0 |',
    '| 206 | *Team of Rivals* | Doris Kearns Goodwin | Tarih | **DB\'DE KAYITLI / V2** | 201 | 1 |'
  );
writeFileSync(catalogPath, catalog, 'utf8');

const batchLines = [
  '# Hikâye Üretim Batch 001',
  '',
  `- **Story ID:** ${storyId}`,
  '- **Version:** 2',
  '- **Mevcut süre:** 1 dk',
  '- **Olası süre:** 1 dk',
  '- **Kelime hedefi:** 160 ±40',
  '- **Book:** Team of Rivals — Doris Kearns Goodwin',
  '- **Status:** DB’YE EKLENDİ',
  '- **Writing method:** Her dilde doğrudan ve bağımsız yazım; çeviri kullanılmadı.',
  '',
  '## Sources',
  '',
  ...sourceNotes.map((source) => `- ${source}`),
  '',
];

for (const [lang, story] of Object.entries(stories)) {
  batchLines.push(`## ${lang.toUpperCase()}`);
  batchLines.push('');
  batchLines.push(`**Title:** ${story.title}`);
  batchLines.push('');
  batchLines.push(story.content);
  batchLines.push('');
  batchLines.push(`- **Punchline:** ${story.punchline}`);
  batchLines.push(`- **Thirty seconds:** ${story.thirtySec}`);
  batchLines.push(`- **Question:** ${story.question}`);
  batchLines.push(`- **Key contrast:** ${story.keyContrast}`);
  batchLines.push(`- **Length:** ${countWords(story.content)} words / ${story.content.length} characters`);
  batchLines.push('');
}

writeFileSync(batchPath, `${batchLines.join('\n')}\n`, 'utf8');
console.log(`Batch 001 applied with story_id=${storyId}`);
