/**
 * add_hook_field.mjs
 * - story_translations tablosuna `hook` TEXT sütunu ekler (yoksa)
 * - lang_code='de' olan tüm satırları story title & content'a göre
 *   Almanca Instagram Reel hook cümlesiyle doldurur
 * - Sonucu assets/kivilcim.db dosyasına yazar
 */

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');

const DB_PATH = resolve(__dirname, '../assets/kivilcim.db');

// ── Deutsche Hook-Generator ──────────────────────────────────────────────────
// Kategoriye ve hikaye başlığına göre Instagram Reel hook cümlesi üretir.
// Kategori bulunamazsa genel hook kalıplarından biri seçilir.

const CATEGORY_HOOKS = {
  // Finanzen / Finans
  'finanzen': [
    'Das hat mir Tausende Euro gespart – und ich wünschte, ich hätte es früher gewusst.',
    'Warum die Reichen immer reicher werden – die erschreckende Wahrheit.',
    'Dieses Buch hat mein Verhältnis zu Geld für immer verändert.',
    'Mit diesem Prinzip hätte ich mit 30 finanziell frei sein können.',
    'Der eine Fehler, den fast alle mit ihrem Gehalt machen.',
  ],
  // Psychologie
  'psychologie': [
    'Dein Gehirn lügt dich täglich an – und du merkst es nicht.',
    'Dieser psychologische Trick verändert, wie du Entscheidungen triffst.',
    'Das steckt wirklich hinter Prokrastination – und wie du sie überwindest.',
    'Warum kluge Menschen dumme Fehler machen – die Wissenschaft erklärt es.',
    'So manipuliert dich dein Unterbewusstsein, ohne dass du es weißt.',
  ],
  // Geschichte
  'geschichte': [
    'Der Mann, der die Welt hätte verändern können – und scheiterte.',
    'Diese 5 Minuten in der Geschichte haben alles verändert.',
    'Was die Geschichte uns lehrt, das wir immer noch ignorieren.',
    'Der vergessene Fehler, der Millionen von Leben kostete.',
    'So sah der Alltag vor 100 Jahren wirklich aus – faszinierend.',
  ],
  // Führung / Liderlik
  'führung': [
    'Was die besten Führungskräfte der Welt gemeinsam haben.',
    'Warum Kontrolle dein Team zerstört – und was stattdessen funktioniert.',
    'Das eine Wort, das jede Führungskraft kennen muss.',
    'Steve Jobs hat diesen Fehler nie gemacht – du wahrscheinlich schon.',
    'So gewinnst du in Sekunden das Vertrauen deines Teams.',
  ],
  // Gesundheit
  'gesundheit': [
    'Der eine Schlafmythos, der dich jeden Tag erschöpft.',
    'Warum du trotz gesunder Ernährung müde bist – das steckt dahinter.',
    'Das unterschätzte Ritual, das dein Leben verlängern kann.',
    'So verändert Stress dein Gehirn – und wie du gegensteuern kannst.',
    'Der Unterschied zwischen Lebenserwartung und Lebensqualität.',
  ],
  // Wissenschaft / Bilim
  'wissenschaft': [
    'Das Experiment, das alles verändert hat – und du hast noch nie davon gehört.',
    'Warum Wissenschaftler jahrelang falsch lagen – und was das bedeutet.',
    'Diese Entdeckung war so verrückt, dass niemand glaubte.',
    'So funktioniert dein Gehirn wirklich – Neurowissenschaft für alle.',
    'Der Quantensprung, der die Technologie neu definiert.',
  ],
  // Philosophie
  'philosophie': [
    'Diese eine Frage verändert, wie du über dein Leben denkst.',
    'Was Sokrates über modernes Scheitern gesagt hätte.',
    'Der philosophische Trick, der dir Stress nimmt – sofort.',
    'Warum das Streben nach Glück dich unglücklich macht.',
    'So hat ein Gefängnis die mächtigste Philosophie der Geschichte hervorgebracht.',
  ],
  // Persönliches Wachstum
  'persönliches wachstum': [
    'Die Gewohnheit, die in 66 Tagen dein Leben verändert.',
    'Warum Motivation eine Lüge ist – und was wirklich zählt.',
    'Das Buch, das ich mit 20 lesen wollte – jetzt teile ich es mit dir.',
    'Der Unterschied zwischen Menschen, die wachsen, und denen, die stagnieren.',
    'So programmierst du dein Gehirn auf Erfolg – wissenschaftlich belegt.',
  ],
  // Produktivität
  'produktivität': [
    'Wie Elon Musk in 5 Minuten entscheidet, was andere in 5 Stunden nicht schaffen.',
    'Das To-do-Listen-Problem, das dich ausbremst – ohne dass du es weißt.',
    'Warum Multitasking deine Produktivität um 40 % senkt.',
    'Die 2-Minuten-Regel, die alles verändert hat.',
    'So schaffst du in 4 Stunden mehr als in einem ganzen Arbeitstag.',
  ],
  // Kommunikation
  'kommunikation': [
    'Das Wort, das jedes Gespräch eskaliert – und wie du es vermeidest.',
    'So überzeugst du jeden in unter 60 Sekunden – ohne Manipulation.',
    'Der Fehler, den fast alle beim Zuhören machen.',
    'Warum dein Körper mehr spricht als deine Worte.',
    'Mit dieser Technik werden deine Gespräche unvergesslich.',
  ],
  // Wirtschaft / Business
  'wirtschaft': [
    'Das Startup, das in 2 Jahren zum Milliarden-Unternehmen wurde – wie?',
    'Warum die meisten Geschäftsideen scheitern – noch bevor sie starten.',
    'Der Skalierungsfehler, der Unternehmen tötet.',
    'Was Amazon weiß, das du (noch) nicht weißt.',
    'So denkst du wie ein Unternehmer – auch ohne Firma.',
  ],
  // Neurowissenschaften
  'neurowissenschaften': [
    'Dein Gehirn ist nicht für die moderne Welt gebaut – und das macht alles schwerer.',
    'Warum du nach schlechtem Schlaf schlechtere Entscheidungen triffst.',
    'So verändert Dankbarkeit buchstäblich deine Hirnstruktur.',
    'Das Neurotransmitter-Geheimnis hinter Motivation und Antrieb.',
    'Wie dein Gehirn Erinnerungen verändert, ohne dass du es merkst.',
  ],
  // Kreativität
  'kreativität': [
    'Kreativität ist keine Gabe – sie ist eine Technik.',
    'Warum deine besten Ideen unter der Dusche kommen – und wie du das nutzt.',
    'Das Geheimnis hinter den kreativsten Köpfen der Geschichte.',
    'So überwindest du die Kreativitätsblocke in unter 10 Minuten.',
    'Dieser eine Umweg machte Leonardo da Vinci zum Genie.',
  ],
};

const GENERIC_HOOKS = [
  'Das hat mein Denken für immer verändert – du solltest es wissen.',
  'Dieses Buch verändert alles, was du über Erfolg geglaubt hast.',
  'Warum du dieses Wissen dringend brauchst – aber noch nie gehört hast.',
  'Der eine Satz, der alles in Frage stellt.',
  'Was die erfolgreichsten Menschen täglich tun – und du noch nicht.',
  'Diese Erkenntnis hat mein Leben verändert. Hör zu.',
  'Das steckt wirklich hinter persönlichem Wachstum – niemand sagt dir das.',
  'Ich hätte das längst wissen sollen. Vielleicht du auch.',
  'Das unterschätzte Buch, das dein Mindset neu programmiert.',
  'Warum 99 % der Menschen scheitern – und die 1 % etwas anderes machen.',
  'So funktioniert die Welt wirklich – und kaum jemand spricht darüber.',
  'Diese Lektion hat mich Jahre gekostet. Dir schenke ich sie in 60 Sekunden.',
  'Was ich mir gewünscht hätte, mit 20 zu wissen.',
  'Der Unterschied zwischen denen, die aufsteigen, und denen, die stagnieren.',
  'Das Buch hat mein Leben in zwei Hälften geteilt: vorher und nachher.',
];

function pickHook(title, categoryHint, usedHooks) {
  // Kategoriye göre hook listesi seç
  let pool = GENERIC_HOOKS;
  if (categoryHint) {
    const key = categoryHint.toLowerCase();
    for (const [k, v] of Object.entries(CATEGORY_HOOKS)) {
      if (key.includes(k)) { pool = v; break; }
    }
  }
  // Başlıkta anahtar kelime varsa daha spesifik hook oluştur
  const lowerTitle = title?.toLowerCase() || '';
  const specificPrefixes = [
    { kw: 'geld', hook: `Was „${title}" über Geld lehrt, das kein Schulfach kann.` },
    { kw: 'erfolg', hook: `Das Geheimnis hinter echtem Erfolg – wie „${title}" es erklärt.` },
    { kw: 'gewohnheit', hook: `Wie eine einzige Gewohnheit dein Leben transformed – Lektion aus „${title}".` },
    { kw: 'angst', hook: `Angst ist keine Schwäche. Das zeigt „${title}" auf eine unerwartete Weise.` },
    { kw: 'führung', hook: `Was die besten Führungskräfte wissen – eine Lektion aus „${title}".` },
    { kw: 'entscheidung', hook: `Jede Entscheidung zählt. Was „${title}" darüber sagt, wird dich überraschen.` },
  ];
  for (const { kw, hook } of specificPrefixes) {
    if (lowerTitle.includes(kw) && !usedHooks.has(hook)) return hook;
  }
  // Kullanılmamış hook seç (round-robin)
  const unused = pool.filter(h => !usedHooks.has(h));
  const chosen = unused.length > 0 ? unused[0] : pool[Math.floor(Math.random() * pool.length)];
  return chosen;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const SQL = await initSqlJs();
const fileBuffer = readFileSync(DB_PATH);
const db = new SQL.Database(fileBuffer);

// 1. Sütun var mı kontrol et
const colCheck = db.exec("PRAGMA table_info(story_translations)");
const cols = colCheck[0].values.map(r => r[1]);
console.log('Mevcut sütunlar:', cols.join(', '));

if (!cols.includes('hook')) {
  db.run('ALTER TABLE story_translations ADD COLUMN hook TEXT');
  console.log('✅ hook sütunu eklendi.');
} else {
  console.log('ℹ️  hook sütunu zaten mevcut.');
}

// 2. Almanca hikayeleri çek
const rows = db.exec(`
  SELECT st.id, st.story_id, st.title, st.content,
         b.list_no,
         (SELECT sc.name_de FROM sub_categories sc
          JOIN books bk ON bk.sub_category_id = sc.id
          WHERE bk.id = s.book_no LIMIT 1) as cat_de
  FROM story_translations st
  JOIN stories s ON s.id = st.story_id
  LEFT JOIN books b ON b.id = s.book_no
  WHERE st.lang_code = 'de'
  ORDER BY st.id
`);

if (!rows.length || !rows[0].values.length) {
  console.log('⚠️  Almanca hikaye bulunamadı.');
  db.close();
  process.exit(0);
}

const stories = rows[0].values;
console.log(`📖 ${stories.length} Almanca hikaye bulundu.`);

const usedHooks = new Set();
let updated = 0;

const stmt = db.prepare('UPDATE story_translations SET hook = ? WHERE id = ?');

for (const [id, storyId, title, content, listNo, catDe] of stories) {
  const hook = pickHook(title, catDe, usedHooks);
  usedHooks.add(hook);
  stmt.run([hook, id]);
  updated++;
  if (updated <= 10 || updated % 50 === 0) {
    console.log(`  [${id}] "${title?.substring(0, 50)}" → ${hook.substring(0, 60)}…`);
  }
}

stmt.free();
console.log(`\n✅ ${updated} satır güncellendi.`);

// 3. DB'yi kaydet
const savedBuffer = db.export();
writeFileSync(DB_PATH, Buffer.from(savedBuffer));
db.close();
console.log(`💾 assets/kivilcim.db kaydedildi.`);
