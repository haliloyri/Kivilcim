#!/usr/bin/env node
/*
 * create-voiceover.mjs — Spark hikayelerini doğrudan ElevenLabs ile seslendirir.
 *
 * Kaynak metin: proje kökündeki "Elevenlabs-seslendirme.md" dosyası.
 *   Başlıklar "## [ID] Baslik" biçiminde; o ID'nin altındaki metin seslendirilir.
 *
 * Kullanım:
 *   node scripts/create-voiceover.mjs 1061                 # tek hikaye
 *   node scripts/create-voiceover.mjs 1061 1062 1063       # birden çok
 *   node scripts/create-voiceover.mjs all                  # md'deki tüm hikayeler
 *   node scripts/create-voiceover.mjs 1061 --model eleven_v3
 *   node scripts/create-voiceover.mjs 1061 --voice <voiceId>
 *
 * Ayarlar .env.local'dan okunur:
 *   ELEVENLABS_API_KEY   (zorunlu)
 *   ELEVENLABS_VOICE_ID  (varsayılan ses)
 *   ELEVENLABS_MODEL_ID  (varsayılan model, örn. eleven_multilingual_v2)
 *
 * Çıktı: seslendirmeler/[ID].mp3
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MD_PATH = path.join(ROOT, 'Elevenlabs-seslendirme.md');
const OUT_DIR = path.join(ROOT, 'seslendirmeler');

// ---- .env.local yükle ----
function loadEnv(file) {
  const env = {};
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (/^\s*#/.test(line)) continue;
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}
const env = { ...loadEnv(path.join(ROOT, '.env.local')), ...process.env };

// ---- argümanlar ----
const rawArgs = process.argv.slice(2);
function flag(name) {
  const i = rawArgs.indexOf(name);
  return i !== -1 && rawArgs[i + 1] ? rawArgs[i + 1] : null;
}
const DRY = rawArgs.includes('--dry');
const ids = rawArgs.filter((a) => /^(all|\d+)$/.test(a));
const API_KEY = env.ELEVENLABS_API_KEY;
const VOICE_ID = flag('--voice') || env.ELEVENLABS_VOICE_ID;
const MODEL_ID = flag('--model') || env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const IS_V3 = /v3/i.test(MODEL_ID);

if (!API_KEY) { console.error('HATA: .env.local içinde ELEVENLABS_API_KEY yok.'); process.exit(1); }
if (!VOICE_ID) { console.error('HATA: ELEVENLABS_VOICE_ID belirtilmemiş (.env.local veya --voice).'); process.exit(1); }
if (ids.length === 0) { console.error('Kullanım: node scripts/create-voiceover.mjs <ID | all> [--model X] [--voice Y]'); process.exit(1); }

// ---- md'den hikaye metinlerini çıkar ----
function parseStories(md) {
  const map = new Map();
  const lines = md.split(/\r?\n/);
  let cur = null, buf = [];
  const flush = () => { if (cur) map.set(cur, buf.join('\n').trim()); };
  for (const line of lines) {
    const h = line.match(/^##\s*\[(\d+)\]\s*(.*)$/);
    if (h) { flush(); cur = h[1]; buf = []; continue; }
    if (/^#\s/.test(line) || /^---\s*$/.test(line)) { continue; } // H1 ve ayraçları atla
    if (cur) buf.push(line);
  }
  flush();
  return map;
}

// ---- v3 dışı modeller için etiketleri sese çevir ----
function normalizeForModel(text) {
  if (IS_V3) return text.trim(); // v3 etiketleri aynen destekler
  return text
    .replace(/\[pause\]/gi, ' … ')                 // duraklama -> üç nokta
    .replace(/\[(?:emphasized|deliberate|slows down|rushed|whispering|understated|stress on next word)\]/gi, '')
    .replace(/\[[^\]]*\]/g, '')                     // kalan tüm köşeli etiketler
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function synth(id, text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status}: ${errText.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `[${id}].mp3`);
  fs.writeFileSync(outPath, buf);
  return outPath;
}

(async () => {
  const stories = parseStories(fs.readFileSync(MD_PATH, 'utf8'));
  const targets = ids.includes('all') ? [...stories.keys()] : ids;
  console.log(`Model: ${MODEL_ID} | Ses: ${VOICE_ID} | ${IS_V3 ? 'v3 etiketleri korunuyor' : 'v3 etiketleri sese dönüştürülüyor'}`);
  for (const id of targets) {
    const raw = stories.get(String(id));
    if (!raw) { console.warn(`- [${id}] md'de bulunamadı, atlanıyor.`); continue; }
    const text = normalizeForModel(raw);
    if (DRY) {
      console.log(`\n----- [${id}] gönderilecek metin (${text.length} karakter) -----`);
      console.log(text);
      console.log('----- (--dry: API çağrılmadı) -----');
      continue;
    }
    process.stdout.write(`- [${id}] üretiliyor… `);
    try {
      const out = await synth(id, text);
      console.log(`kaydedildi -> ${path.relative(ROOT, out)}`);
    } catch (e) {
      console.log('BAŞARISIZ');
      console.error(`  ${e.message}`);
    }
  }
})();
