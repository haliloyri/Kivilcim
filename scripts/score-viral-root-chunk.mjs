import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');

const root = resolve(import.meta.dirname, '..');
const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(resolve(root, 'assets/kivilcim.db')));

const rows = db.exec(`
  SELECT s.id, CAST(s.version AS TEXT), st.title, st.description, st.content,
         COALESCE(st.hook, ''), COALESCE(v.punchline, ''),
         COALESCE(v.thirty_sec, ''), COALESCE(v.question, ''),
         COALESCE(v.key_contrast, '')
  FROM stories s
  JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
  LEFT JOIN story_conversation_variants v ON v.story_id = s.id AND v.lang_code = 'tr'
  WHERE s.id BETWEEN 1620 AND 1808
  ORDER BY s.id
`)[0];

const containsAny = (text, terms) => terms.some((term) => text.includes(term));
const countAny = (text, terms) => terms.reduce((n, term) => n + (text.includes(term) ? 1 : 0), 0);
const clamp = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)));

const emotional = ['ölüm', 'hayat', 'umut', 'acı', 'korku', 'utanç', 'yalnız', 'sevgi', 'bağ', 'çocuk', 'aile', 'travma', 'cesaret', 'kayıp', 'özgür', 'adalet', 'kurban', 'affet', 'neşe', 'mutluluk', 'öfke', 'stres'];
const universal = ['insan', 'zihin', 'beyin', 'hayat', 'ilişki', 'para', 'stres', 'alışkanlık', 'karar', 'mutluluk', 'dikkat', 'zaman', 'çocuk', 'ekip', 'iş', 'sağlık', 'güven', 'öfke', 'korku'];
const practical = ['kural', 'yöntem', 'adım', 'soru', 'alışkanlık', 'kontrol', 'liste', 'pratik', 'ritüel', 'sistem', 'çerçeve', 'teknik', 'ilke', 'strateji', 'model', 'nasıl'];
const contrast = ['ama', 'oysa', 'değil', 'yerine', 'paradoks', 'ters', 'fark', 'daha az', 'daha çok', 'görünmez', 'aslında', 'beklenmedik', 'yanılgı'];
const visual = ['zebra', 'aslan', 'fil', 'sıçan', 'pavyan', 'at', 'uçak', 'gemi', 'okyanus', 'dağ', 'everest', 'nehir', 'ada', 'kaşık', 'saat', 'fırça', 'masa', 'sandalye', 'mikser', 'hamburger', 'reçel', 'nokta', 'hücre', 'ağaç', 'mantar', 'bakteri', 'laboratuvar', 'kokpit', 'fabrika', 'yangın', 'metro', 'tabela', 'kabine', 'yarış', 'mutfak'];
const stakes = ['öldü', 'ölüm', 'felaket', 'hayat kurt', 'kanser', 'savaş', 'cinayet', 'zehir', 'hastalık', 'çöküş', 'esir', 'patlama', 'kaza'];
const action = ['bugün', 'bu hafta', 'deneyebil', 'uygula', 'seç', 'sor', 'başla', 'bırak', 'değiştir', 'öğren', 'yap'];
const healthRisk = ['kanser', 'als', 'ms ', 'dehb', 'hastalık', 'bağışıklık', 'ülser', 'kortizol', 'dopamin', 'nörobilim', 'beyin yapısını', 'biyolojik iyileş'];

const manualBoosts = new Map([
  [1693, { hook: 1, emotion: 1, share: 1, arc: 1, video: 2 }],
  [1694, { emotion: 1, share: 1, arc: 1, video: 1 }],
  [1695, { hook: 1, arc: 1, video: 2 }],
  [1696, { hook: 1, share: 1, save: 1, video: 1 }],
  [1697, { hook: 2, emotion: 1, share: 1, voice: 1, video: 1 }],
  [1701, { hook: 1, save: 1, arc: 1, video: 1 }],
  [1704, { hook: 2, share: 1, save: 1, arc: 1, video: 2 }],
  [1707, { emotion: 2, share: 1, voice: 1, arc: 1, video: 1 }],
  [1720, { hook: 2, share: 1, save: 1, video: 2 }],
  [1729, { hook: 1, emotion: 1, share: 1, video: 2 }],
  [1734, { hook: 2, emotion: 1, share: 1, voice: 1 }],
  [1748, { hook: 1, emotion: 1, arc: 1, video: 2 }],
  [1749, { emotion: 2, share: 1, arc: 1, video: 2 }],
  [1756, { hook: 1, emotion: 2, share: 2, voice: 1, video: 2 }],
  [1759, { hook: 1, emotion: 2, share: 1, arc: 1, video: 1 }],
  [1763, { hook: 1, share: 1, video: 2 }],
  [1765, { emotion: 2, share: 1, arc: 1, video: 1 }],
  [1771, { hook: 2, share: 1, arc: 1, video: 2 }],
  [1781, { hook: 1, emotion: 1, share: 1, arc: 1, video: 1 }],
  [1786, { hook: 2, emotion: 2, share: 2, save: 2, voice: 2, video: 1 }],
  [1788, { hook: 2, emotion: 2, share: 2, save: 1, voice: 2, arc: 1, video: 2 }],
  [1791, { hook: 1, share: 1, save: 1, video: 2 }],
  [1792, { hook: 2, emotion: 1, share: 2, voice: 1, arc: 1, video: 2 }],
  [1804, { hook: 1, share: 1, save: 1, arc: 1, video: 1 }],
  [1807, { hook: 1, share: 1, save: 1, video: 1 }],
]);

const scoreRow = (values) => {
  const [id, version, title, description, content, hookText, punchline, thirtySec, question, keyContrast] = values;
  const rich = Boolean(hookText && punchline && thirtySec && question && keyContrast);
  const text = [title, description, content, hookText, punchline, thirtySec, question, keyContrast]
    .join(' ')
    .toLocaleLowerCase('tr-TR');
  const hasQuestion = title.includes('?') || Boolean(question) || hookText.includes('?');
  const hasNumber = /\d/.test(text);
  const hasProperName = /\b[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\b/.test(`${title} ${description}`);
  const concisePayoff = description.length >= 35 && description.length <= 185;
  const hasContrast = containsAny(text, contrast);
  const concrete = containsAny(text, visual);
  const emotionalHits = Math.min(3, countAny(text, emotional));
  const universalHits = Math.min(3, countAny(text, universal));
  const practicalHits = Math.min(3, countAny(text, practical));

  let scores = {
    hook: 6 + (rich ? 1 : 0) + (hasQuestion ? 2 : 0) + (hasNumber ? 1 : 0) + (hasContrast ? 1 : 0) + (concrete ? 1 : 0) + (title.length >= 20 && title.length <= 70 ? 1 : 0),
    emotion: 3 + Math.min(3, emotionalHits) + (universalHits >= 2 ? 1 : 0) + (containsAny(text, stakes) ? 1 : 0) + (containsAny(text, ['umut', 'dönüş', 'iyileş', 'kurtar', 'özgür']) ? 1 : 0),
    share: 5 + (rich ? 1 : 0) + Math.min(2, universalHits) + (hasContrast ? 2 : 0) + (concisePayoff ? 1 : 0) + (hasQuestion ? 1 : 0) + ((hasNumber || concrete) ? 1 : 0),
    save: 5 + Math.min(3, practicalHits) + (rich && hasQuestion ? 1 : 0) + (hasNumber ? 1 : 0) + (universalHits >= 2 ? 1 : 0) + (containsAny(text, action) ? 1 : 0),
    voice: 4 + (rich && hasQuestion ? 1 : 0) + (containsAny(hookText.toLocaleLowerCase('tr-TR'), ['sen', 'sana', 'bugün', 'hangi', 'ne ']) ? 1 : 0) + (emotionalHits >= 2 ? 1 : 0) + (hasContrast ? 1 : 0) + (concrete ? 1 : 0),
    arc: 3 + (rich ? 1 : 0) + ((hasProperName || hasNumber) ? 2 : 0) + (containsAny(text, ['sonra', 'ardından', 'başladı', 'dönüştü', 'gitti', 'geldi', 'yıllar']) ? 1 : 0) + (containsAny(text, ['kriz', 'savaş', 'hata', 'engel', 'risk', 'kaybet', 'redded', 'mahkûm']) ? 1 : 0) + (containsAny(text, ['sonuç', 'değişti', 'kurtuldu', 'kazandı', 'çözdü', 'başardı']) ? 1 : 0),
    video: 7 + (rich ? 2 : 0) + (concrete ? 3 : 0) + ((hasProperName || hasNumber) ? 2 : 0) + (hasContrast ? 2 : 0) + (concisePayoff ? 1 : 0) + (containsAny(text, ['gördü', 'çekti', 'koştu', 'uçtu', 'öldü', 'patladı', 'eridi', 'kaçtı', 'yıktı']) ? 1 : 0),
    trust: 4 + ((hasNumber && hasProperName && !containsAny(text, healthRisk)) ? 1 : 0) - (containsAny(text, healthRisk) ? 1 : 0),
  };

  const boost = manualBoosts.get(id) || {};
  for (const key of Object.keys(scores)) scores[key] += boost[key] || 0;

  scores = {
    hook: clamp(scores.hook, 0, 15),
    emotion: clamp(scores.emotion, 0, 10),
    share: clamp(scores.share, 0, 15),
    save: clamp(scores.save, 0, 15),
    voice: clamp(scores.voice, 0, 10),
    arc: clamp(scores.arc, 0, 10),
    video: clamp(scores.video, 0, 20),
    trust: clamp(scores.trust, 0, 5),
  };

  const strengths = [
    [scores.hook / 15, 'merak uyandıran başlık'],
    [scores.emotion / 10, 'duygusal bağ'],
    [scores.share / 15, 'paylaşma dürtüsü'],
    [scores.save / 15, 'geri dönülebilir fikir'],
    [scores.voice / 10, 'kişisel anlatım sorusu'],
    [scores.arc / 10, 'net dönüşlü hikâye'],
    [scores.video / 20, 'güçlü görsel sahneler'],
  ].sort((a, b) => b[0] - a[0]);
  const weaknesses = [
    [scores.video / 20, 'görselleştirme'],
    [scores.arc / 10, 'olay örgüsü'],
    [scores.share / 15, 'paylaşılabilirlik'],
    [scores.hook / 15, 'ilk saniye etkisi'],
  ].sort((a, b) => a[0] - b[0]);
  let lead;
  if (concrete && hasNumber) lead = 'Somut sahne ve sayısal ayrıntı güçlü bir video açılışı sağlıyor';
  else if (emotionalHits >= 2 && hasContrast) lead = 'Duygusal karşıtlık paylaşma ve kişisel anlatma isteğini yükseltiyor';
  else if (practicalHits >= 2) lead = 'Uygulanabilir çerçeve, hikâyeyi geri dönüp kaydetmeye değer kılıyor';
  else if (hasQuestion && hasContrast) lead = 'Merak sorusu ve karşıtlık ilk saniye etkisini güçlendiriyor';
  else if (concrete) lead = 'Somut nesne veya sahne kısa videoda kolayca görselleşebilir';
  else lead = `${strengths[0][1]} belirgin bir avantaj sağlıyor`;
  const reason = `${lead}; ${weaknesses[0][1]} ${weaknesses[0][0] >= 0.75 ? 'yeterli' : 'geliştirilmeli'}.`;

  return { story_id: id, ...scores, reason };
};

const scored = rows.values.map(scoreRow);
const outDir = resolve(root, '.tmp_story_scores');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'score_1620_1808.json'), `${JSON.stringify(scored, null, 2)}\n`);

const totals = scored.map((row) => row.hook + row.emotion + row.share + row.save + row.voice + row.arc + row.video + row.trust);
console.log(JSON.stringify({
  rows: scored.length,
  min: Math.min(...totals),
  max: Math.max(...totals),
  average: Number((totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(2)),
  over85: totals.filter((x) => x >= 85).length,
}, null, 2));
