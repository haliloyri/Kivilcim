#!/usr/bin/env node
// AI-writing tell scanner for P1 stories.
// Rules are adapted from the "humanizer" skill (Wikipedia: Signs of AI writing),
// keeping only checks that a script can do reliably. English and Spanish follow
// the skill's libraries; Turkish and German use a smaller list written for this
// project (the skill has no Turkish/German library).
//
// Used by validate.mjs. Also runnable on its own as a revision-list report:
//   node scripts/p1/ai-tells.mjs <lang> [storyId ...]
//   node scripts/p1/ai-tells.mjs en --min 3      (only stories with >= 3 hits)
//
// Severity: chatbot artifacts, knowledge-cutoff disclaimers and sycophancy are
// errors (they never belong in a story). Everything else is a warning with a
// weight; the weighted total per 100 words is reported as the "tell score".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// [label, weight, patterns]. Patterns are case-insensitive regex sources.
// weight 3 = dead giveaway (humanizer tier 1), 2 = reliable tell, 1 = weak tell.
const WARN_RULES = {
  en: [
    ['AI vocabulary', 3, ['\\bdelv(e|es|ed|ing)\\b', '\\btapestry\\b', '\\btestament\\b', '\\bpivotal\\b', '\\bintricate\\b', '\\bintricacies\\b', '\\bunderscor(e|es|ed|ing)\\b', '\\bshowcas(e|es|ed|ing)\\b', '\\bgarner(s|ed|ing)?\\b', '\\binterplay\\b', '\\bvibrant\\b', '\\bendur(ing|es)\\b', '\\bcrucial\\b', '\\balign(s|ed)? with\\b']],
    ['significance inflation', 3, ['\\b(stands|serves|stood|served) as\\b', '\\bmarks? a (shift|turning point|pivotal)', '\\bevolving landscape\\b', '\\bindelible\\b', '\\bdeeply rooted\\b', '\\bsetting the stage\\b', '\\bbroader (movement|trend)\\b', '\\bvital role\\b', '\\bkey role\\b']],
    ['promotional language', 3, ['\\bnestled\\b', '\\bbreathtaking\\b', '\\bstunning\\b', '\\bgroundbreaking\\b', '\\brenowned\\b', '\\bmust-visit\\b', '\\bgame-changer\\b', '\\bseamless(ly)?\\b']],
    ['generic positive ending', 3, ['future looks bright', 'exciting times', 'step in the right direction', 'journey toward', 'the possibilities are (endless|limitless)']],
    ['authority trope', 2, ['\\bat its core\\b', '\\bthe real question is\\b', '\\bwhat really matters\\b', '\\bfundamentally,', '\\bin reality,', '\\bthe deeper issue\\b', '\\bthe heart of the matter\\b']],
    ['signposting', 2, ["let's dive", "let's explore", "let's break this down", "here's what you need to know", 'without further ado', 'now let.s look at']],
    ['announcer transition', 2, ['here is the catch', "here's the catch", 'then something striking happened', 'what happened next surprised', 'the answer came (faster|sooner)']],
    ['filler phrase', 1, ['\\bin order to\\b', 'due to the fact that', 'at this point in time', "it(.s| is) (important|worth) (to note|noting)", 'in the event that']],
    ['hedging', 1, ['could potentially', 'might possibly', 'it could be argued', 'it may be argued']],
    ['weasel attribution', 2, ['\\bexperts (argue|say|believe)\\b', '\\bindustry observers\\b', '\\bsome critics argue\\b', '\\bresearchers believe\\b(?! that)']],
    ['-ing tail phrase', 2, [',\\s+(highlighting|underscoring|emphasizing|reflecting|symbolizing|showcasing|contributing to|fostering|ensuring|cultivating)\\b']],
    ['copula avoidance', 2, ['\\b(functions|acts) as a\\b', '\\bboasts\\b', '\\brepresents a\\b']],
    ['negative parallelism', 2, ['\\bnot only\\b[^.!?\\n]{1,80}\\bbut (also )?\\b', "\\bit(.s| is) not (just|merely|simply|only)\\b", "\\bnot just (about )?[^.!?\\n]{1,60}[,;] (it|but)\\b"]],
    ['chatty opener', 3, ['^(picture|imagine|think of|consider|suppose|ever noticed)\\b']], // opening line only, handled separately
  ],
  es: [
    ['conector inflado', 3, ['\\ben este sentido\\b', '\\bcabe destacar\\b', '\\bes importante señalar\\b', '\\bes importante destacar\\b', '\\bsin lugar a dudas\\b', '\\ben definitiva\\b', '\\bdicho (esto|lo anterior)\\b']],
    ['apertura formulaica', 3, ['\\ben el mundo actual\\b', '\\ben la era digital\\b', '\\bhoy en día\\b', '\\ben los últimos años\\b']],
    ['lenguaje promocional', 3, ['\\binnovador\\b', '\\brevolucionario\\b', '\\bdisruptivo\\b', '\\bde vanguardia\\b', '\\bemblemático\\b', '\\bimprescindible\\b']],
    ['evita la cópula', 2, ['\\bse erige como\\b', '\\bse consolida como\\b', '\\bconstituye una?\\b']],
    ['cierre genérico', 3, ['\\ben conclusión\\b', '\\bel futuro es prometedor\\b', '\\bun antes y un después\\b', '\\blas posibilidades son infinitas\\b']],
    ['anuncio', 2, ['\\bvamos a explorar\\b', '\\bprofundicemos\\b', '\\bdescubramos juntos\\b', '\\bveamos a continuación\\b']],
    ['tono académico', 2, ['\\bes menester\\b', '\\bresulta imperativo\\b', '\\bcobra especial relevancia\\b', '\\bno cabe duda de que\\b']],
    ['paralelismo negativo', 2, ['\\bno solo\\b[^.!?\\n]{1,80}\\bsino (también )?\\b', '\\bno es (solo|simplemente|únicamente) ']],
    ['gerundio de relleno', 2, [',\\s+(destacando|subrayando|reflejando|simbolizando|fomentando|garantizando)\\b']],
    ['apertura que invita', 3, ['^(imagina|imagínate|piensa en|considera)\\b']],
  ],
  tr: [
    ['şişirilmiş giriş', 3, ['günümüz dünyasında', 'hızla değişen dünyada', 'çağımızda', 'son yıllarda']],
    ['kalıp bağlaç', 2, ['\\bşunu belirtmek (önemlidir|gerekir)\\b', '\\bbelirtmekte fayda var\\b', '\\bbu bağlamda\\b', '\\bbu noktada\\b', '\\bhiç şüphesiz\\b', '\\bşüphesiz ki\\b', '\\bdikkat çekici bir şekilde\\b']],
    ['önem şişirme', 3, ['\\bdönüm noktası\\b', '\\bkritik bir rol\\b', '\\bönemli bir rol oynar\\b', '\\bışık tutuyor\\b', '\\bışık tutar\\b', '\\bçığır açan\\b', '\\bbüyüleyici\\b']],
    ['genel kapanış', 3, ['\\bsonuç olarak\\b', 'gelecek parlak', 'heyecan verici bir yolculuk', 'unutmamak gerekir', 'unutmayın ki']],
    ['duyuru', 2, ['\\bhadi başlayalım\\b', '\\bderinlemesine inceleyelim\\b', '\\bbilmeniz gerekenler\\b', '\\bdaha yakından bakalım\\b']],
    ['olumsuz paralellik', 2, ['\\byalnızca\\b[^.!?\\n]{1,80}\\bdeğil\\b[^.!?\\n]{1,40}\\baynı zamanda\\b', '\\bsadece\\b[^.!?\\n]{1,80}\\bdeğil\\b[^.!?\\n]{1,40}\\baynı zamanda\\b']],
    ['çağrıştıran açılış', 3, ['^(hayal edin|düşünün|bir düşünün|gözünüzün önüne getirin)']],
  ],
  de: [
    ['aufgeblasene Einleitung', 3, ['in der heutigen (schnelllebigen )?(welt|zeit)', 'im heutigen digitalen zeitalter', 'in der hektischen welt von heute', 'in einer welt, in der', '\\bgrundsätzlich gilt\\b', '\\bbetrachten wir zunächst\\b']],
    ['Bedeutungsaufblähung', 3, ['\\bein beweis für\\b', '\\bspielt eine (entscheidende|zentrale) rolle\\b', '\\bbahnbrechend\\b', '\\bwegweisend\\b', '\\bwendepunkt\\b']],
    ['generischer Schluss', 3, ['zusammenfassend lässt sich sagen', 'die zukunft sieht (rosig|vielversprechend) aus', 'spannende zeiten', 'alles in allem']],
    ['Ankündigung', 2, ['\\btauchen wir\\b', '\\blassen sie uns\\b', '\\bwerfen wir einen blick\\b', '\\bes ist wichtig (zu beachten|hervorzuheben)\\b', '\\beintauchen\\b', '\\bnicht zuletzt\\b']],
    ['Autoritätsfloskel', 2, ['\\bim kern\\b', '\\bin wirklichkeit\\b', '\\bentscheidend ist\\b']],
    ['negative Parallelität', 2, ['\\bnicht nur\\b[^.!?\\n]{1,80}\\bsondern (auch )?\\b', '\\bes (geht|ist) nicht (nur|bloß|einfach)\\b']],
    ['einladende Eröffnung', 3, ['^(stell dir vor|stellen sie sich vor|denk an|denke an)\\b']],
  ],
};

// Errors: text that is chatbot correspondence, a training-cutoff disclaimer
// or flattery. These never belong in a story.
const ERROR_RULES = {
  en: ['i hope this helps', 'let me know if', 'great question', "you're absolutely right", 'you’re absolutely right', 'excellent point', 'what a (great|thoughtful)', '\\bas an ai\\b', 'as of my last', 'up to my last training', 'while specific details (are|remain) (limited|scarce)', 'based on available information', '^certainly!', '^of course!'],
  es: ['espero que esto (te )?(sirva|ayude)', 'excelente pregunta', '¡por supuesto!', '¡claro que sí!', 'como (un )?modelo de ia', 'hasta mi (última )?(actualización|fecha de corte)'],
  tr: ['umarım (bu )?yardımcı olur', 'harika bir soru', 'bir yapay zek[âa] (olarak|modeli olarak)', 'son eğitim verilerime göre'],
  de: ['ich hoffe, das hilft', '^gute frage', 'als ki-modell', 'bis zu meinem letzten trainingsstand'],
};

const SENTENCE_SPLIT = /(?<=[.!?…])\s+(?=[\p{Lu}"“«¿¡])/u;
const stripMarkup = (s) => s
  .replace(/^\[\[\w+\]\]\s*$/gm, '')
  .replace(/%%context:\w+\s*\|/g, '')
  .replace(/(\$\$|##|&&|@@|%%|~~|\*\*|::)/g, ' ')
  .replace(/^\s*[->]\s+/gm, '')
  .replace(/\s+/g, ' ').trim();
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;
const sentencesOf = (s) => s.split(SENTENCE_SPLIT).map((x) => x.trim()).filter((x) => wordCount(x) >= 2);

const sectionOf = (text, name) => {
  const m = new RegExp(`\\[\\[${name}\\]\\]\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\[\\[\\w+\\]\\]\\s*\\n|$)`).exec(text);
  return m ? m[1].trim() : '';
};

const hitsFor = (plain, rules) => {
  const out = [];
  rules.forEach(([label, weight, pats]) => {
    pats.forEach((p) => {
      if (p.startsWith('^')) return; // opener rules are matched separately
      const re = new RegExp(p, 'giu');
      const found = plain.match(re);
      if (found) out.push({ label, weight, sample: found[0], count: found.length });
    });
  });
  return out;
};

/**
 * @param {string} text   full P1 story markdown
 * @param {string} lang   en | tr | es | de
 * @param {string} [variantsText]  raw contents of <id>.variants.json (optional)
 * @returns {{errors:string[], warnings:string[], hits:object[], score:number, per100:number}}
 */
export const scanAiTells = (text, lang, variantsText = '') => {
  const errors = [];
  const warnings = [];
  const rules = WARN_RULES[lang] || [];
  const plain = stripMarkup(text) + (variantsText ? ` ${variantsText.replace(/[{}"]|\\n/g, ' ')}` : '');
  const lower = plain.toLowerCase();

  // Errors: chatbot / cutoff / sycophancy.
  (ERROR_RULES[lang] || []).forEach((p) => {
    const re = new RegExp(p.startsWith('^') ? p.slice(1) : p, 'iu');
    if (re.test(p.startsWith('^') ? plain.slice(0, 40) : lower)) errors.push(`chatbot/cutoff/flattery artifact: /${p}/`);
  });

  // Weighted rule hits.
  const hits = hitsFor(lower, rules);
  hits.forEach((h) => warnings.push(`${h.label}: "${h.sample}"${h.count > 1 ? ` ×${h.count}` : ''}`));

  // Chatty opener (first sentence of [[open]]).
  const opener = stripMarkup(sectionOf(text, 'open')).toLowerCase();
  rules.filter(([label]) => /opener|apertura que|çağrıştıran|eröffnung|chatty/i.test(label)).forEach(([label, weight, pats]) => {
    pats.forEach((p) => {
      if (new RegExp(p, 'iu').test(opener)) { hits.push({ label, weight, sample: opener.split(/\s+/).slice(0, 2).join(' '), count: 1 }); warnings.push(`${label}: opens with "${opener.split(/\s+/).slice(0, 2).join(' ')}…", start inside the scene`); }
    });
  });

  // Structural / statistical tells (language independent).
  const story = stripMarkup(sectionOf(text, 'story'));
  const sents = sentencesOf(story);
  if (sents.length >= 8) {
    // Uniform rhythm: low variation in sentence length.
    const lens = sents.map(wordCount);
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
    if (sd / mean < 0.38) { warnings.push(`uniform sentence length (sd/mean ${(sd / mean).toFixed(2)}); mix short and long`); hits.push({ label: 'uniform rhythm', weight: 2, count: 1 }); }
    // 4+ sentences in a row starting with the same word.
    let run = 1;
    for (let i = 1; i < sents.length; i += 1) {
      const a = sents[i].split(/\s+/)[0].toLowerCase();
      const b = sents[i - 1].split(/\s+/)[0].toLowerCase();
      run = a === b ? run + 1 : 1;
      if (run === 4) { warnings.push(`4 sentences in a row start with "${a}"`); hits.push({ label: 'repeated sentence start', weight: 2, count: 1 }); break; }
    }
  }
  // Aphorism endings: many story paragraphs that end on a very short sentence.
  const paras = sectionOf(text, 'story').split(/\n\s*\n/).map(stripMarkup).filter((p) => wordCount(p) >= 12);
  if (paras.length >= 5) {
    const short = paras.filter((p) => { const ss = sentencesOf(p); return ss.length >= 2 && wordCount(ss[ss.length - 1]) <= 7; }).length;
    if (short / paras.length > 0.5) { warnings.push(`${short}/${paras.length} story paragraphs end on a short punchy line`); hits.push({ label: 'aphorism endings', weight: 2, count: 1 }); }
  }
  // Rule of three: "A, B, and C" style lists.
  if (lang === 'en') {
    const triples = (plain.match(/\b[\w'-]+, [\w' -]{2,30}, (and|or) [\w' -]{2,30}[.,;]/g) || []).length;
    if (triples > 5) { warnings.push(`${triples} "A, B, and C" lists (rule-of-three habit)`); hits.push({ label: 'rule of three', weight: 1, count: 1 }); }
  }
  // Decoration: emoji and heavy bold outside lesson titles.
  if (/\p{Extended_Pictographic}/u.test(text)) { warnings.push('emoji in story text'); hits.push({ label: 'emoji', weight: 2, count: 1 }); }
  const boldOutsideLessons = (text.replace(/\$\$\*\*[^*]+\*\*/g, '').match(/\*\*/g) || []).length / 2;
  if (boldOutsideLessons > 4) { warnings.push(`${boldOutsideLessons} bold spans outside lesson titles (keep sparing)`); hits.push({ label: 'bold overuse', weight: 1, count: 1 }); }

  // Score: weighted hits per 100 words.
  const wc = Math.max(1, wordCount(plain));
  const score = hits.reduce((a, h) => a + h.weight * (h.count || 1), 0);
  const per100 = (score / wc) * 100;
  if (per100 >= 0.7) warnings.push(`AI-tell score ${per100.toFixed(1)}/100 words (weighted hits ${score}); target < 0.7`);

  return { errors, warnings, hits, score, per100 };
};

// ---- CLI: revision-list report ----------------------------------------
const main = () => {
  const args = process.argv.slice(2);
  const minIdx = args.indexOf('--min');
  const min = minIdx !== -1 ? Number(args[minIdx + 1]) : 1;
  const rest = args.filter((a, i) => minIdx === -1 || (i !== minIdx && i !== minIdx + 1));
  const [lang, ...ids] = rest;
  if (!lang) { console.error('usage: node scripts/p1/ai-tells.mjs <lang> [storyId ...] [--min N]'); process.exit(2); }
  const dir = path.join(ROOT, 'staging/p1', lang);
  const files = ids.length ? ids.map((i) => `${i}.md`) : fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const rows = [];
  files.forEach((f) => {
    const id = f.replace(/\.md$/, '');
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const vp = path.join(dir, `${id}.variants.json`);
    const v = fs.existsSync(vp) ? fs.readFileSync(vp, 'utf8') : '';
    const r = scanAiTells(text, lang, v);
    rows.push({ id, ...r });
  });
  rows.sort((a, b) => b.per100 - a.per100);
  const flagged = rows.filter((r) => r.hits.length >= min || r.errors.length);
  console.log(`${lang.toUpperCase()}: ${flagged.length}/${rows.length} stories with >= ${min} AI-tell hit(s). Worst first (score per 100 words):\n`);
  flagged.slice(0, 40).forEach((r) => {
    console.log(`${r.id}  ${r.per100.toFixed(1)}  ${r.errors.length ? 'ERR ' : ''}${[...new Set(r.hits.map((h) => h.label))].join(', ')}`);
  });
  const tally = {};
  rows.forEach((r) => r.hits.forEach((h) => { tally[h.label] = (tally[h.label] || 0) + 1; }));
  console.log('\nBy pattern (stories affected):');
  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${k}`));
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
