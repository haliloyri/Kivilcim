#!/usr/bin/env node
/*
 * build-reel.mjs — turns reels/<id>/reel.json into a HyperFrames project in the Albor reel format.
 *
 * Usage:
 *   node .claude/skills/albor-reel/scripts/build-reel.mjs reels/<id>            # voiceover + music + compositions
 *   node .claude/skills/albor-reel/scripts/build-reel.mjs reels/<id> --no-vo    # layout only, silent placeholder timing
 *
 * Voiceover: ElevenLabs /with-timestamps (ELEVENLABS_API_KEY in .env.local). Each scene's line is cached in
 * assets/vo/s<N>.mp3 + s<N>.json and only regenerated when its text, voice, model or speed changes.
 * Captions come from the word timings, so they always match the voice.
 * Music: reels/_music/<file>; generated once with ElevenLabs Music from "prompt" when the file is missing,
 * then trimmed and faded to the reel's length.
 * Sound effects: reels/_sfx/<name>.mp3, fetched once for free from Openverse (CC0 / CC BY) or the Pixabay files
 * bundled with HyperFrames, leading silence trimmed so each hit lands on its frame. Credits in reels/_sfx/CREDITS.md.
 *
 * Then: bash .claude/skills/albor-reel/scripts/render-reel.sh reels/<id>
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const SCREENS = path.join(ROOT, 'reels/_screens');
const MUSIC = path.join(ROOT, 'reels/_music');
const SFX_DIR = path.join(ROOT, 'reels/_sfx');
const LOGO = path.join(ROOT, 'albor-promo/assets/logo.png');
const HF = 'hyperframes@0.8.222';

// ---- brand tokens (DESIGN.md §1–3). Gold only for the CTA. No coral/orange, no glows. ----
const C = {
  paper: '#F7F3EC',
  card: '#FFFDF9',
  ink: '#24211E',
  inkSoft: '#6B625A',
  upcoming: '#8C837A', // mutedText token
  border: '#E6DED3',
  petrol: '#1F5F5B',
  hero: '#1B4B48',
  dawn: '#E9A94B',
  onDawn: '#2A1E08',
};
// category families (DESIGN.md §6.1): a book spine takes the colour of its category, like its icon in the app
const FAMILIES = {
  green: { bg: '#2F7D5B', words: ['finance', 'finans', 'growth', 'gelişim', 'motivasyon', 'motivation', 'başarı', 'hedef', 'kariyer', 'career', 'girişim', 'satış', 'pazarlama'] },
  indigo: { bg: '#5B5FB5', words: ['psych', 'psikoloji', 'philosoph', 'felsefe', 'nörobilim', 'farkındalık', 'düşünme', 'duygu', 'mutluluk'] },
  purple: { bg: '#8650A8', words: ['science', 'bilim', 'teknoloji', 'gelecek'] },
  blue: { bg: '#1F7FA8', words: ['communication', 'iletişim', 'müzakere', 'negotiation', 'ilişki'] },
  earth: { bg: '#A5623A', words: ['history', 'tarih', 'leadership', 'liderlik', 'yönetim', 'strateji'] },
  rose: { bg: '#C0507A', words: ['health', 'sağlık', 'alışkanlık', 'habit', 'bağımlılık'] },
  slate: { bg: '#4C5B7A', words: ['business', 'iş dünyası', 'productivity', 'verimlilik', 'ürün', 'tasarım'] },
};
const FAMILY_CYCLE = ['earth', 'blue', 'green', 'indigo', 'slate', 'rose'];

// one sound per visible action (hyperframes sound.md §4); two takes where an action repeats.
// Free sources only: Openverse (CC0 / CC BY, mostly Freesound) by query, then the Pixabay files bundled with HyperFrames.
const SFX = {
  // `must`: an Openverse hit is used only when its title or tags match, so "phone tap" never returns a notification chime
  whoosh1: { q: ['swipe whoosh', 'whoosh'], must: /whoosh|swoosh|swish|swipe/i, max: 1.2, vol: 0.32, bundled: 'whoosh-short.mp3' },
  whoosh2: { q: ['swoosh', 'air swoosh'], must: /whoosh|swoosh|swish|swipe/i, max: 1.2, vol: 0.32, bundled: 'whoosh.mp3' },
  slide1: { q: ['book slide', 'book sliding'], must: /slid|friction|book/i, max: 1.6, vol: 0.5 },
  slide2: { q: ['paper slide', 'cardboard slide'], must: /slid|friction|paper|cardboard/i, max: 1.6, vol: 0.5 },
  thud: { q: ['book drop', 'book thud'], must: /drop|thud|fall|book/i, max: 1.2, vol: 0.45 },
  pen: { q: ['marker drawing', 'marker writing', 'pen scribble'], must: /marker|pen|draw|writ|scribbl/i, max: 1.6, vol: 0.55 },
  tap: { q: [], max: 0.7, vol: 0.5, bundled: 'click-soft.mp3' },
};
const BUNDLED_SFX = path.join(process.env.HOME || '', '.claude/plugins/cache/hyperframes/hyperframes/0.8.222/skills/media-use/audio/assets/sfx');
let sceneSfx = []; // scene-local sound events, collected per scene by the scene builders
const cue = (t, name) => sceneSfx.push({ t: r2(t), name });

// ---- layout (1080×1920, Instagram safe band 168–1330) ----
const W = 1080, H = 1920, M = 80;
const SHOT = { left: M, top: 270, width: 920, height: 790 };
const CAP_TOP = 1150;

// ---- args, env ----
const args = process.argv.slice(2);
const NO_VO = args.includes('--no-vo');
const dirArg = args.find((a) => !a.startsWith('--'));
if (!dirArg) { console.error('Usage: build-reel.mjs reels/<id> [--no-vo]'); process.exit(1); }
const DIR = path.resolve(dirArg);
const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'reel.json'), 'utf8'));

function loadEnv(file) {
  const env = {};
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !line.trim().startsWith('#')) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}
const env = { ...loadEnv(path.join(ROOT, '.env.local')), ...process.env };
const VOICE = spec.voice || 'JBFqnCBsd6RMkjVDRZzb';
const MODEL = spec.model || 'eleven_multilingual_v2';
const VOICE_SETTINGS = { stability: 0.4, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true, speed: spec.speed || 1.06 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r2 = (n) => Math.round(n * 1000) / 1000;
const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function mediaDuration(file) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
}

// ---- book colours from the catalogue (read-only) ----
function bookFamily(title, k) {
  try {
    const db = new DatabaseSync(path.join(ROOT, 'assets/albor.db'), { readOnly: true });
    const row = db.prepare('SELECT category_name FROM book_translations WHERE title = ? ORDER BY lang_code = ? DESC LIMIT 1').get(title, spec.lang || 'en');
    db.close();
    const cat = (row?.category_name || '').toLowerCase();
    if (!row) console.warn(`  ! "${title}" is not in book_translations; hook books should be real catalogue titles.`);
    for (const [name, f] of Object.entries(FAMILIES)) if (f.words.some((w) => cat.includes(w))) return FAMILIES[name];
  } catch { /* no DB: fall back to the cycle */ }
  return FAMILIES[FAMILY_CYCLE[k % FAMILY_CYCLE.length]];
}

// ---- ElevenLabs ----
async function eleven(url, body) {
  if (!env.ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY missing in .env.local (or use --no-vo).');
  const res = await fetch(`https://api.elevenlabs.io${url}`, {
    method: 'POST', headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${url} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

function wordsFromAlignment(al) {
  const words = [];
  let cur = null;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) words.push(cur); cur = null; return; }
    if (!cur) cur = { w: '', start: al.character_start_times_seconds[i] };
    cur.w += ch;
    cur.end = al.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  return words;
}

async function voiceFor(i, text, prev, next) {
  const voDir = path.join(DIR, 'assets/vo');
  fs.mkdirSync(voDir, { recursive: true });
  const mp3 = path.join(voDir, `s${i}.mp3`);
  const meta = path.join(voDir, `s${i}.json`);
  const key = crypto.createHash('sha1').update(JSON.stringify([VOICE, MODEL, VOICE_SETTINGS, text])).digest('hex');
  if (fs.existsSync(meta) && fs.existsSync(mp3)) {
    const m = JSON.parse(fs.readFileSync(meta, 'utf8'));
    if (m.key === key) return m;
  }
  process.stdout.write(`  vo s${i}: "${text}" … `);
  // neighbouring lines keep the prosody of one continuous read instead of separate takes
  const res = await eleven(`/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`,
    { text, model_id: MODEL, voice_settings: VOICE_SETTINGS, previous_text: prev || undefined, next_text: next || undefined });
  const j = await res.json();
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
  const m = { key, text, voice: VOICE, model: MODEL, duration: mediaDuration(mp3), words: wordsFromAlignment(j.alignment) };
  fs.writeFileSync(meta, JSON.stringify(m, null, 2));
  console.log(`${m.duration.toFixed(2)} s`);
  return m;
}

async function musicFor(total) {
  const mu = spec.music;
  if (!mu?.file) return null;
  const src = path.join(MUSIC, mu.file);
  if (!fs.existsSync(src)) {
    if (!mu.prompt) throw new Error(`reels/_music/${mu.file} missing and no "prompt" to generate it.`);
    console.log(`  music: generating ${mu.file} …`);
    fs.mkdirSync(MUSIC, { recursive: true });
    const res = await eleven('/v1/music', { prompt: mu.prompt, music_length_ms: Math.ceil(total + 3) * 1000 });
    fs.writeFileSync(src, Buffer.from(await res.arrayBuffer()));
  }
  const len = mediaDuration(src);
  if (len < total) console.warn(`  ! music is ${len.toFixed(1)} s, shorter than the reel (${total.toFixed(1)} s).`);
  const out = path.join(DIR, 'assets/music.mp3');
  const fadeOut = 1.6;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(mu.offset || 0), '-i', src, '-t', String(total),
    '-af', `afade=t=in:d=0.25,afade=t=out:st=${r2(total - fadeOut)}:d=${fadeOut}`, '-b:a', '160k', out]);
  return { volume: mu.volume ?? 0.2 };
}

async function openverse(query, max, must) {
  const url = `https://api.openverse.org/v1/audio/?q=${encodeURIComponent(query)}&license=cc0,by&page_size=20`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'albor-reel' } });
      if (!res.ok) throw new Error(`Openverse ${res.status}`);
      const hits = (await res.json()).results.filter((r) => r.duration && r.duration / 1000 >= 0.15 && r.duration / 1000 <= max * 2.5 && r.url
        && (!must || must.test([r.title, ...(r.tags || []).map((t) => t.name)].join(' '))));
      // relevance order from Openverse; CC0 first when both exist
      return hits.find((r) => r.license === 'cc0') || hits[0] || null;
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
  return null;
}

// trims leading silence so the hit starts on its cue, caps the length and fades the tail
function cleanSfx(src, out, max) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af',
    `silenceremove=start_periods=1:start_threshold=-42dB,atrim=0:${max},afade=t=in:d=0.004,areverse,afade=t=in:d=${r2(Math.min(0.15, max / 4))},areverse`,
    '-ac', '2', '-ar', '44100', '-b:a', '160k', out]);
}

async function sfxLibrary(names) {
  fs.mkdirSync(SFX_DIR, { recursive: true });
  const creditsFile = path.join(SFX_DIR, 'CREDITS.md');
  const have = {};
  for (const name of names) {
    const file = path.join(SFX_DIR, `${name}.mp3`);
    const def = SFX[name];
    if (!fs.existsSync(file)) {
      process.stdout.write(`  sfx ${name} … `);
      let credit = null;
      try {
        for (const q of def.q) {
          const hit = await openverse(q, def.max, def.must);
          if (!hit) continue;
          const raw = path.join(SFX_DIR, `${name}.raw.${hit.filetype || 'mp3'}`);
          const res = await fetch(hit.url, { signal: AbortSignal.timeout(30000) });
          if (!res.ok) continue;
          fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
          cleanSfx(raw, file, def.max);
          fs.unlinkSync(raw);
          credit = `- \`${name}.mp3\`: "${hit.title}" by ${hit.creator}, ${hit.license.toUpperCase()} ${hit.license_version || ''} (${hit.foreign_landing_url || hit.url}), query "${q}"`;
          break;
        }
      } catch (e) {
        process.stdout.write(`(Openverse: ${e.message.slice(0, 60)}) `);
      }
      if (!credit && def.bundled && fs.existsSync(path.join(BUNDLED_SFX, def.bundled))) {
        cleanSfx(path.join(BUNDLED_SFX, def.bundled), file, def.max);
        credit = `- \`${name}.mp3\`: HyperFrames bundled \`${def.bundled}\` (Pixabay Content License, no attribution required)`;
      }
      if (!credit) { console.log('none found, skipped'); continue; }
      if (!fs.existsSync(creditsFile)) fs.writeFileSync(creditsFile, '# Sound effect credits\n\nCC BY sounds must be credited wherever a reel is published (for example in the post caption or profile).\n\n');
      fs.appendFileSync(creditsFile, credit + '\n');
      console.log(credit.includes('bundled') ? 'bundled' : 'openverse');
    }
    have[name] = r2(mediaDuration(file));
  }
  return have;
}

// silent stand-in: ~2.8 words a second, evenly spaced
function fakeVoice(text) {
  const ws = text.split(/\s+/);
  const per = 1 / 2.8;
  return { duration: ws.length * per, words: ws.map((w, k) => ({ w, start: k * per, end: (k + 1) * per - 0.05 })) };
}

// caption chunks. A "|" in the scene's vo text sets the breaks by hand (it is never spoken);
// otherwise a sentence end always breaks, a comma only after 4+ words, never more than 8 words
const spoken = (vo) => vo.replace(/\s*\|\s*/g, ' ').trim();
function chunks(words, vo) {
  if (vo.includes('|')) {
    let k = 0;
    return vo.split('|').map((part) => part.trim().split(/\s+/).length).map((n) => words.slice(k, (k += n)));
  }
  const out = [];
  let cur = [];
  for (const w of words) {
    cur.push(w);
    if (/[.?!]$/.test(w.w) || (/[,;:]$/.test(w.w) && cur.length >= 4) || cur.length >= 8) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}
// scene-local time of the first spoken word matching `word` (for highlights and taps)
function wordTime(vo, word, lead) {
  const hit = vo.words.find((w) => norm(w.w) === norm(word));
  if (!hit) throw new Error(`atWord "${word}" is not in the line: ${vo.words.map((w) => w.w).join(' ')}`);
  return lead + hit.start;
}

// ---- shared scene pieces ----
const baseCss = `
    #root { position: absolute; inset: 0; background: ${C.paper}; overflow: hidden; }
    .kicker { position: absolute; left: ${M}px; right: ${M}px; top: 196px; font-family: "Inter", sans-serif; font-weight: 600;
      font-size: 30px; letter-spacing: 0.18em; text-transform: uppercase; color: ${C.petrol}; }
    .cap { position: absolute; left: ${M}px; right: ${M - 20}px; top: ${CAP_TOP}px; font-family: "Inter", sans-serif; font-weight: 800;
      font-size: 66px; line-height: 1.16; letter-spacing: -0.02em; color: ${C.upcoming}; opacity: 0; }
    .ttl { position: absolute; left: ${M}px; right: ${M}px; font-family: "Playfair Display", serif; font-weight: 700;
      letter-spacing: -0.015em; color: ${C.ink}; }
    .ttl .ln { display: block; overflow: hidden; padding-bottom: 10px; }
    .ttl .w { display: inline-block; }
    .ttl .acc { color: ${C.petrol}; }`;

// karaoke captions: the phrase appears in a pale tone, each word turns petrol as it is spoken, then ink
function capsHtml(id, caps) {
  return caps.map((c, k) => `    <div class="cap" id="${id}-c${k}">${c.map((w, j) => `<span id="${id}-c${k}w${j}">${esc(w.w)}</span>`).join(' ')}</div>`).join('\n');
}
function capsJs(id, caps, lead, sceneDur) {
  return caps.map((c, k) => {
    const on = r2(lead + c[0].start - 0.08);
    const off = k < caps.length - 1 ? r2(lead + caps[k + 1][0].start - 0.09) : r2(Math.min(sceneDur - 0.05, lead + c[c.length - 1].end + 0.6));
    const lines = [
      `    tl.fromTo("#${id}-c${k}", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, ${on});`,
      ...c.map((w, j) => `    tl.set("#${id}-c${k}w${j}", { color: "${C.petrol}" }, ${r2(lead + w.start)}); tl.set("#${id}-c${k}w${j}", { color: "${C.ink}" }, ${r2(lead + (c[j + 1]?.start ?? w.end + 0.15))});`),
      `    tl.to("#${id}-c${k}", { opacity: 0, duration: 0.08 }, ${off});`,
    ];
    return lines.join('\n');
  }).join('\n');
}
function titleHtml(id, lines, top, size) {
  const spans = lines.map((l, k) => `<span class="ln"><span class="w${k === lines.length - 1 ? ' acc' : ''}" id="${id}-t${k}">${esc(l)}</span></span>`).join('\n      ');
  return `    <div class="ttl" style="top: ${top}px; font-size: ${size}px; line-height: 1.06">\n      ${spans}\n    </div>`;
}
function wrap(id, css, html, js) {
  return `<template>
  <style>${baseCss}${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
${html}
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
${js}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;
}

// a hand-drawn loop around a box: a slightly wobbly ellipse that overshoots its start, like a pen circle
function loopPath(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2, rx = w / 2 + 34, ry = h / 2 + 30;
  const pts = [];
  const steps = 64, start = -2.2, sweep = Math.PI * 2 + 0.55;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, a = start + sweep * t;
    const wob = 1 + 0.035 * Math.sin(a * 3 + 0.7) + 0.05 * t; // drifts outward, so the end passes the start
    pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob * (1 - 0.04 * t)]);
  }
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return { d: 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L'), len: Math.ceil(len) };
}

// ---- scene types ----
function hookScene(id, s, dur) {
  const books = s.books || [];
  const n = books.length;
  const heights = [104, 92, 112, 96, 108, 94];
  const bottom = 1300;
  const pileTop = bottom - books.reduce((a, _, k) => a + heights[k % 6], 0) - 50;
  let y = bottom;
  const items = books.map((title, k) => {
    const fam = bookFamily(title, k);
    const h = heights[k % 6];
    const w = [900, 840, 880, 810, 860, 830][k % 6];
    const x = [0, 40, 10, 70, 24, 54][k % 6];
    y -= h;
    // ribbon sits near the fore-edge, clear of the spine text
    const markX = w - [90, 150, 120, 170, 100, 140][k % 6];
    return `      <div class="book" id="${id}-b${k}" style="top: ${y - pileTop}px; left: ${x}px; width: ${w}px; height: ${h}px; background: ${fam.bg}">
        <span class="spine">${esc(title)}</span>
        <div class="band" style="left: ${w - 46}px"></div>
        <div class="mark" id="${id}-m${k}" style="left: ${markX}px"></div>
      </div>`;
  });
  const css = `
    #${id}-pile { position: absolute; left: ${M}px; top: ${pileTop}px; width: ${W - 2 * M}px; height: ${bottom - pileTop}px; }
    .book { position: absolute; border-radius: 10px; display: flex; align-items: center; padding-left: 40px; color: #FFFFFF;
      box-shadow: inset 0 -8px 0 rgba(0, 0, 0, 0.14); }
    .spine { font-family: "Inter", sans-serif; font-weight: 700; font-size: 32px; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
    .band { position: absolute; top: 0; bottom: 0; width: 12px; background: rgba(255, 255, 255, 0.22); }
    .mark { position: absolute; top: 100%; width: 22px; height: 0; background: ${C.paper}; }`;
  const html = `${titleHtml(id, s.title, 220, 120)}
    <div id="${id}-pile" data-layout-allow-overlap>
${items.join('\n')}
    </div>`;
  // books leave the pile one after another, alternating sides; the last one out becomes the story
  const outs = (s.slideOut ?? [n - 1, n - 3, 1]).filter((k) => k >= 0 && k < n);
  const js = `    // frame 0 is the thumbnail: title and pile already on screen
${books.map((_, k) => `    tl.fromTo("#${id}-m${k}", { height: 0 }, { height: 56, duration: 0.35, ease: "power2.out" }, ${r2(0.3 + k * 0.08)});`).join('\n')}
    tl.fromTo("#${id}-pile", { y: 0 }, { y: -14, duration: ${r2(dur * 0.6)}, ease: "sine.inOut" }, 0);
${outs.map((k, j) => {
    const t0 = r2(dur - 1.05 + j * 0.22);
    // books above the gap fall into it once the pulled book has cleared the pile
    const fall = books.map((_, m) => m).filter((m) => m > k && !outs.slice(0, j + 1).includes(m))
      .map((m) => `    tl.to("#${id}-b${m}", { y: "+=${heights[k % 6]}", duration: 0.2, ease: "power2.in" }, ${r2(t0 + 0.32)});`);
    cue(t0 + 0.12, j % 2 ? 'slide2' : 'slide1');
    if (fall.length) cue(t0 + 0.52, 'thud');
    return [`    tl.to("#${id}-b${k}", { x: ${j % 2 ? -1150 : 1150}, rotation: ${j % 2 ? -3 : 3}, duration: 0.5, ease: "power2.in" }, ${t0});`, ...fall].join('\n');
  }).join('\n')}`;
  return wrap(id, css, html, js);
}

function screenScene(id, s, dur, vo, lead, img, sceneIndex) {
  const scale = SHOT.width / img.w;
  const cam = s.camera || {};
  const from = { y: 0, zoom: 1, cx: img.w / 2, ...(cam.from || {}) };
  const to = { ...from, ...(cam.to || {}) };
  const pos = (p) => ({ x: r2(SHOT.width / 2 - p.cx * scale * p.zoom), y: r2(-p.y * scale * p.zoom), scale: p.zoom });
  const a = pos(from), b = pos(to);
  const px = (v) => r2(v * scale);
  const masks = (s.masks || []).map((mk) => `        <div class="mask" style="left: ${px(mk.x)}px; top: ${px(mk.y)}px; width: ${px(mk.w)}px; height: ${px(mk.h)}px; background: ${mk.color || C.paper}"></div>`).join('\n');
  const loops = (s.highlights || []).map((hl, k) => ({ ...hl, k, p: loopPath(px(hl.x), px(hl.y), px(hl.w), px(hl.h)) }));
  const taps = (s.taps || []).map((tp, k) => ({ ...tp, k }));
  const svg = loops.length
    ? `        <svg class="ink" width="${px(img.w)}" height="${px(img.h)}" viewBox="0 0 ${px(img.w)} ${px(img.h)}">
${loops.map((l) => `          <path id="${id}-hl${l.k}" d="${l.p.d}" fill="none" stroke="${C.petrol}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${l.p.len}" stroke-dashoffset="${l.p.len}" />`).join('\n')}
        </svg>`
    : '';
  const tapHtml = taps.map((tp) => `        <div class="tap" id="${id}-tap${tp.k}" style="left: ${r2(px(tp.x) - 60)}px; top: ${r2(px(tp.y) - 60)}px"></div>
        <div class="dot" id="${id}-dot${tp.k}" style="left: ${r2(px(tp.x) - 22)}px; top: ${r2(px(tp.y) - 22)}px"></div>`).join('\n');
  const caps = chunks(vo.words, s.vo);
  const css = `
    .shot { position: absolute; left: ${SHOT.left}px; top: ${SHOT.top}px; width: ${SHOT.width}px; height: ${SHOT.height}px;
      border-radius: 36px; overflow: hidden; background: ${C.paper}; border: 2px solid ${C.border}; }
    .cam { position: absolute; left: 0; top: 0; width: ${px(img.w)}px; height: ${px(img.h)}px; }
    .cam img { display: block; width: 100%; height: 100%; }
    .mask { position: absolute; }
    .ink { position: absolute; left: 0; top: 0; overflow: visible; }
    .tap { position: absolute; width: 120px; height: 120px; border-radius: 50%; border: 6px solid ${C.petrol}; opacity: 0; }
    .dot { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(31, 95, 91, 0.35); opacity: 0; }
    .fade { position: absolute; left: 0; right: 0; bottom: 0; height: 110px; background: linear-gradient(rgba(247, 243, 236, 0), ${C.paper}); }`;
  const html = `${s.kicker ? `    <div class="kicker" id="${id}-k">${esc(s.kicker)}</div>\n` : ''}    <div class="shot" id="${id}-shot">
      <div class="cam" id="${id}-cam">
        <img src="assets/screens/${esc(path.basename(s.image))}" alt="${esc(s.alt || 'Albor app screen')}" />
${masks}
${svg}
${tapHtml}
      </div>
      <div class="fade"></div>
    </div>
${capsHtml(id, caps)}`;
  const at = (o) => r2(o.atWord ? wordTime(vo, o.atWord, lead) : o.at ?? 1);
  cue(0.02, sceneIndex % 2 ? 'whoosh2' : 'whoosh1');
  loops.forEach((l) => cue(at(l) + 0.03, 'pen'));
  taps.forEach((tp) => cue(at(tp) + 0.03, 'tap'));
  const js = `    // the shot pushes in from below; the camera keeps moving over the real screen
    tl.fromTo("#${id}-shot", { opacity: 0, y: 90, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, 0);
${s.kicker ? `    tl.fromTo("#${id}-k", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, 0.12);\n` : ''}    tl.fromTo("#${id}-cam", { x: ${a.x}, y: ${a.y}, scale: ${a.scale}, transformOrigin: "0 0" },
      { x: ${b.x}, y: ${b.y}, scale: ${b.scale}, duration: ${r2(dur)}, ease: "sine.inOut" }, 0);
${loops.map((l) => `    tl.to("#${id}-hl${l.k}", { strokeDashoffset: 0, duration: 0.75, ease: "power1.inOut" }, ${at(l)});`).join('\n')}
${taps.map((tp) => `    tl.fromTo("#${id}-dot${tp.k}", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, ${at(tp)});
    tl.to("#${id}-dot${tp.k}", { opacity: 0, duration: 0.25 }, ${r2(at(tp) + 0.3)});
    tl.fromTo("#${id}-tap${tp.k}", { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.out" }, ${r2(at(tp) + 0.05)});`).join('\n')}
${capsJs(id, caps, lead, dur)}`;
  return wrap(id, css, html, js);
}

function endScene(id, s) {
  const css = `
    #${id}-logo { position: absolute; left: ${M}px; top: 300px; width: 168px; height: 168px; border-radius: 38px; }
    #${id}-cta { position: absolute; left: ${M}px; top: 930px; padding: 30px 56px; border-radius: 999px; background: ${C.dawn};
      font-family: "Inter", sans-serif; font-weight: 700; font-size: 46px; color: ${C.onDawn}; }
    #${id}-tap { position: absolute; left: ${M + 300}px; top: 940px; width: 120px; height: 120px; border-radius: 50%; border: 6px solid ${C.hero}; opacity: 0; }`;
  const html = `    <img id="${id}-logo" src="assets/logo.png" alt="Albor" />
${titleHtml(id, s.title, 540, 92)}
    <div id="${id}-cta">${esc(s.cta)}</div>
    <div id="${id}-tap"></div>`;
  const ctaAt = r2(0.45 + s.title.length * 0.2);
  cue(0.02, 'whoosh1');
  cue(ctaAt + 0.93, 'tap');
  const js = `    tl.fromTo("#${id}-logo", { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, 0.05);
${s.title.map((_, k) => `    tl.fromTo("#${id}-t${k}", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, ${r2(0.25 + k * 0.2)});`).join('\n')}
    tl.fromTo("#${id}-cta", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, ${ctaAt});
    // one tap on the CTA, the action the reel asks for
    tl.to("#${id}-cta", { scale: 0.96, duration: 0.1, ease: "power2.in" }, ${r2(ctaAt + 0.9)});
    tl.to("#${id}-cta", { scale: 1, duration: 0.2, ease: "power2.out" }, ${r2(ctaAt + 1.0)});
    tl.fromTo("#${id}-tap", { opacity: 0.8, scale: 0.3 }, { opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.out" }, ${r2(ctaAt + 0.92)});`;
  return wrap(id, css, html, js);
}

// ---- build ----
(async () => {
  const scenes = spec.scenes;
  fs.mkdirSync(path.join(DIR, 'compositions'), { recursive: true });
  fs.mkdirSync(path.join(DIR, 'assets/screens'), { recursive: true });
  fs.copyFileSync(LOGO, path.join(DIR, 'assets/logo.png'));

  let t = 0;
  const hosts = [], audios = [], events = [];
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const id = `s${i + 1}`;
    const text = spoken(s.vo);
    const vo = NO_VO ? fakeVoice(text) : await voiceFor(i + 1, text, scenes[i - 1] && spoken(scenes[i - 1].vo), scenes[i + 1] && spoken(scenes[i + 1].vo));
    const lead = i === 0 ? 0.15 : 0.2;
    const tail = s.type === 'end' ? 2.0 : s.type === 'hook' ? 0.9 : 0.3;
    const dur = r2(lead + vo.duration + tail);
    sceneSfx = [];
    let html;
    if (s.type === 'hook') html = hookScene(id, s, dur);
    else if (s.type === 'screen') {
      const src = path.join(SCREENS, s.image);
      fs.copyFileSync(src, path.join(DIR, 'assets/screens', path.basename(s.image)));
      html = screenScene(id, s, dur, vo, lead, pngSize(src), i);
    } else if (s.type === 'end') html = endScene(id, s);
    else throw new Error(`unknown scene type "${s.type}"`);
    fs.writeFileSync(path.join(DIR, 'compositions', `${id}.html`), html);
    hosts.push(`      <div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html"
        data-start="${r2(t)}" data-duration="${dur}" data-track-index="${i + 1}" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`);
    if (!NO_VO) audios.push(`      <audio id="vo-${id}" src="assets/vo/s${i + 1}.mp3" data-start="${r2(t + lead)}" data-duration="${r2(vo.duration)}" data-track-index="${20 + i}" data-volume="1"></audio>`);
    events.push(...sceneSfx.map((e) => ({ ...e, t: r2(t + e.t) })));
    t += dur;
  }
  const total = r2(t);
  if (!NO_VO && !args.includes('--no-sfx')) {
    const have = await sfxLibrary([...new Set(events.map((e) => e.name))]);
    fs.mkdirSync(path.join(DIR, 'assets/sfx'), { recursive: true });
    events.filter((e) => have[e.name]).forEach((e, k) => {
      fs.copyFileSync(path.join(SFX_DIR, `${e.name}.mp3`), path.join(DIR, 'assets/sfx', `${e.name}.mp3`));
      audios.push(`      <audio id="sfx-${k}" src="assets/sfx/${e.name}.mp3" data-start="${e.t}" data-duration="${have[e.name]}" data-track-index="${40 + k}" data-volume="${SFX[e.name].vol}"></audio>`);
    });
    if (fs.existsSync(path.join(SFX_DIR, 'CREDITS.md'))) fs.copyFileSync(path.join(SFX_DIR, 'CREDITS.md'), path.join(DIR, 'assets/sfx/CREDITS.md'));
  }
  const music = NO_VO ? null : await musicFor(total);
  if (music) audios.unshift(`      <audio id="music" src="assets/music.mp3" data-start="0" data-duration="${total}" data-track-index="19" data-volume="${music.volume}"></audio>`);

  fs.writeFileSync(path.join(DIR, 'index.html'), `<!doctype html>
<!-- generated by .claude/skills/albor-reel/scripts/build-reel.mjs from reel.json; edit reel.json and rebuild -->
<html lang="${spec.lang || 'en'}" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: ${C.paper}; }
      #root { position: relative; width: ${W}px; height: ${H}px; background: ${C.paper}; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
${hosts.join('\n')}
${audios.join('\n')}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      // hard cuts between scenes; each scene animates its own entrance
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);

  const name = path.basename(DIR);
  const pkg = { name, private: true, type: 'module', scripts: {
    dev: `npx --yes ${HF} preview`, check: `npx --yes ${HF} check`, render: `npx --yes ${HF} render --output out/${name}.mp4`,
  } };
  fs.writeFileSync(path.join(DIR, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  fs.writeFileSync(path.join(DIR, 'hyperframes.json'), JSON.stringify({
    $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json',
    paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' },
    media: { autoProxy: true }, authoringSkill: 'hyperframes',
  }, null, 2) + '\n');
  if (!fs.existsSync(path.join(DIR, 'meta.json'))) fs.writeFileSync(path.join(DIR, 'meta.json'), JSON.stringify({ id: name, name }, null, 2) + '\n');
  const nSfx = audios.filter((a) => a.includes('id="sfx-')).length;
  console.log(`Built ${name}: ${scenes.length} scenes, ${total} s${NO_VO ? ' (no voiceover)' : ''}${music ? ', music' : ''}, ${nSfx} sound effects.`);
})().catch((e) => { console.error(e.message); process.exit(1); });
