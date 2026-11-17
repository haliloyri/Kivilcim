// App Store panoramik ekran görüntüsü setini üretir.
// Kullanım: npm run store:shots -- <tr|en|es|de>
// Girdi:  docs/app-store/raw/<dil>/01.png … 06.png (1320×2868, simülatör çekimi)
// Çıktı:  docs/app-store/screenshots/<dil>/6.9/01..06.png (1320×2868)
//         docs/app-store/screenshots/<dil>/6.5/01..06.png (1284×2778)
//         docs/app-store/screenshots/<dil>/6.3/01..06.png (1206×2622)
// STORE_SHOTS_FORCE_OVERFLOW=1: 1. başlığı üç kez tekrarlar (taşma denetimini sınamak için).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import captionsModule from './captions.js';

const { validateCaptions, LANGS } = captionsModule;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FRAME_W = 1320, FRAME_H = 2868, FRAMES = 6;
// Ek ölçüler: kare hedefi kaplayacak kadar küçültülür, en-boy farkı ortadan eşit kırpılır.
const EXTRA = [{ dir: '6.5', w: 1284, h: 2778 }, { dir: '6.3', w: 1206, h: 2622 }];

function fail(msg) {
  console.error(`store:shots: ${msg}`);
  process.exit(1);
}

function probeSize(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', file]).toString().trim();
  return out;
}

function chrome(args) {
  return execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', `--window-size=${FRAMES * FRAME_W},${FRAME_H}`,
    '--virtual-time-budget=8000', ...args,
  ], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...args]);
}

const lang = process.argv[2];
if (!LANGS.includes(lang)) fail(`dil ver: ${LANGS.join(' | ')}`);

// 1. Başlıklar
const captions = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/store-shots/captions.json'), 'utf8'));
const errors = validateCaptions(captions);
if (errors.length) fail(`başlık hatası:\n  ${errors.join('\n  ')}`);
const frames = [...captions[lang].frames];
if (process.env.STORE_SHOTS_FORCE_OVERFLOW === '1') frames[0] = `${frames[0]} ${frames[0]} ${frames[0]}`;

// 2. Ham çekimler
const rawDir = path.join(ROOT, 'docs/app-store/raw', lang);
const shots = [];
for (let i = 1; i <= FRAMES; i++) {
  const file = path.join(rawDir, `${String(i).padStart(2, '0')}.png`);
  if (!fs.existsSync(file)) fail(`ham çekim yok: ${path.relative(ROOT, file)}`);
  const size = probeSize(file);
  if (size !== `${FRAME_W}x${FRAME_H}`) fail(`${path.relative(ROOT, file)} ölçüsü ${size}, beklenen ${FRAME_W}x${FRAME_H} (iPhone 17 Pro Max)`);
  shots.push(pathToFileURL(file).href);
}

// 3. Şablon verisi + şerit
const buildDir = path.join(ROOT, 'docs/app-store/build');
fs.mkdirSync(buildDir, { recursive: true });
const albi = pathToFileURL(path.join(ROOT, 'assets/albi')).href;
const { subs, tagline } = captions[lang];
// Dile göre değişen kart kesim alanları (ham çekimdeki piksel); yoksa strip.html içindeki varsayılan kullanılır.
const rects = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/store-shots/pops.json'), 'utf8'))[lang] || {};
fs.writeFileSync(path.join(buildDir, `${lang}-data.js`), `window.STRIP = ${JSON.stringify({ tagline, frames, subs, shots, albi, rects })};\n`);
const page = `${pathToFileURL(path.join(ROOT, 'scripts/store-shots/strip.html')).href}?lang=${lang}`;

// 4. Taşma denetimi
const dom = chrome(['--dump-dom', page]);
const ready = /data-ready="1"/.test(dom);
const overflow = (dom.match(/data-overflow="([^"]*)"/) || [])[1];
if (!ready) fail('şablon yüklenmedi (data-ready yok); ham çekim ya da font yolu kontrol et');
if (overflow) fail(`başlık taşıyor: ${lang} kare ${overflow}. Metni kısalt (punto küçültme).`);

const stripPng = path.join(buildDir, `${lang}-strip.png`);
chrome([`--screenshot=${stripPng}`, page]);
if (probeSize(stripPng) !== `${FRAMES * FRAME_W}x${FRAME_H}`) fail(`şerit ölçüsü yanlış: ${probeSize(stripPng)}`);

// 5–6. Dilimle ve küçült (rgb24: alfa kanalı yok)
const outBig = path.join(ROOT, 'docs/app-store/screenshots', lang, '6.9');
const outDir = (dir) => path.join(ROOT, 'docs/app-store/screenshots', lang, dir);
fs.mkdirSync(outBig, { recursive: true });
for (const e of EXTRA) fs.mkdirSync(outDir(e.dir), { recursive: true });
for (let i = 0; i < FRAMES; i++) {
  const name = `${String(i + 1).padStart(2, '0')}.png`;
  ffmpeg(['-i', stripPng, '-vf', `crop=${FRAME_W}:${FRAME_H}:${i * FRAME_W}:0`, '-frames:v', '1', '-update', '1', '-pix_fmt', 'rgb24', path.join(outBig, name)]);
  for (const e of EXTRA) {
    ffmpeg(['-i', path.join(outBig, name), '-vf', `scale=${e.w}:${e.h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${e.w}:${e.h}`, '-frames:v', '1', '-update', '1', '-pix_fmt', 'rgb24', path.join(outDir(e.dir), name)]);
  }
}

console.log(`store:shots: ${lang} → ${path.relative(ROOT, path.dirname(outBig))}/{6.9,${EXTRA.map((e) => e.dir).join(',')}} (her biri 6 PNG)`);
