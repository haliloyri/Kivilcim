import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'docs', 'screenshots');
const WIDTH = 1080;
const HEIGHT = 2340;

const theme = {
  background: '#fcf9f4',
  surface: '#F2EFE8',
  card: '#ffffff',
  text: '#1A1A1A',
  sub: '#7D6F5E',
  border: '#E8E3DA',
  primary: '#C5A059',
  primaryDeep: '#823b18',
  accent: '#D8C08F',
};

function escapeXml(v) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapScreen(title, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${theme.background}"/>
      <stop offset="100%" stop-color="#f7f2e8"/>
    </linearGradient>
    <linearGradient id="hero" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="#BE9347"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity="0.12" flood-color="#6e5f4f"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="0" y="0" width="100%" height="120" fill="${theme.background}"/>
  <text x="60" y="78" font-family="Georgia, serif" font-size="42" fill="${theme.primaryDeep}">Spark ✦</text>
  <text x="60" y="130" font-family="Arial, sans-serif" font-size="30" fill="${theme.sub}">${escapeXml(title)}</text>

  ${body}
</svg>`;
}

function card(x, y, w, h, label, sub) {
  return `
  <g filter="url(#shadow)">
    <rect x="${x}" y="${y}" rx="28" ry="28" width="${w}" height="${h}" fill="${theme.card}" stroke="${theme.border}"/>
    <text x="${x + 28}" y="${y + 64}" font-family="Georgia, serif" font-size="40" fill="${theme.text}">${escapeXml(label)}</text>
    <text x="${x + 28}" y="${y + 108}" font-family="Arial, sans-serif" font-size="28" fill="${theme.sub}">${escapeXml(sub)}</text>
  </g>`;
}

function pills(y, labels, activeIdx = 0) {
  let x = 60;
  return labels.map((l, i) => {
    const w = Math.max(180, l.length * 18 + 60);
    const active = i === activeIdx;
    const node = `
  <g>
    <rect x="${x}" y="${y}" rx="38" ry="38" width="${w}" height="76" fill="${active ? theme.primaryDeep : 'transparent'}" stroke="${active ? theme.primaryDeep : theme.border}"/>
    <text x="${x + 30}" y="${y + 48}" font-family="Arial, sans-serif" font-size="30" fill="${active ? '#FFFFFF' : theme.primaryDeep}">${escapeXml(l)}</text>
  </g>`;
    x += w + 16;
    return node;
  }).join('');
}

function makeHome() {
  const body = `
  <rect x="60" y="190" rx="30" ry="30" width="960" height="300" fill="url(#hero)" filter="url(#shadow)"/>
  <text x="96" y="298" font-family="Georgia, serif" font-size="62" fill="#1f1a14">7 gün streak</text>
  <text x="96" y="356" font-family="Arial, sans-serif" font-size="34" fill="#3c3327">Bugün okumaya devam et</text>
  ${pills(540, ['Tümü', 'Psikoloji', 'Finans', 'Liderlik'], 0)}
  ${card(60, 660, 960, 310, 'Atomik Alışkanlıklar', '5 dk • Kişisel Gelişim')}
  ${card(60, 1004, 470, 280, 'Düşünme Hataları', '4 dk • Psikoloji')}
  ${card(550, 1004, 470, 280, 'İkna Sanatı', '6 dk • İletişim')}
  ${card(60, 1318, 470, 280, 'İş Modeli Tasarımı', '7 dk • İş & Girişim')}
  ${card(550, 1318, 470, 280, 'Zihin Notları', '3 dk • Verimlilik')}
  <rect x="0" y="2190" width="1080" height="150" fill="${theme.background}"/>
  <line x1="60" y1="2190" x2="1020" y2="2190" stroke="${theme.border}"/>
  <text x="120" y="2278" font-family="Arial, sans-serif" font-size="28" fill="${theme.primaryDeep}">Ana Sayfa</text>
  <text x="420" y="2278" font-family="Arial, sans-serif" font-size="28" fill="${theme.sub}">Kütüphane</text>
  <text x="760" y="2278" font-family="Arial, sans-serif" font-size="28" fill="${theme.sub}">Profil</text>`;
  return wrapScreen('Ana Sayfa', body);
}

function makeOnboarding() {
  const body = `
  <text x="60" y="260" font-family="Georgia, serif" font-size="78" fill="${theme.text}">Günlük 5 dakikada</text>
  <text x="60" y="338" font-family="Georgia, serif" font-size="78" fill="${theme.primaryDeep}">daha berrak zihin</text>
  <text x="60" y="404" font-family="Arial, sans-serif" font-size="34" fill="${theme.sub}">İlham veren hikayeler, pratik dersler.</text>

  ${card(60, 470, 960, 210, 'Psikoloji', 'Zihin, dikkat ve davranış kalıpları')}
  ${card(60, 700, 960, 210, 'Liderlik', 'Karar alma, etki ve ekip yönetimi')}
  ${card(60, 930, 960, 210, 'Bilim', 'Araştırma ve gelecek perspektifi')}

  <rect x="60" y="2000" rx="22" ry="22" width="960" height="98" fill="${theme.primaryDeep}"/>
  <text x="430" y="2062" font-family="Arial, sans-serif" font-size="34" fill="#fff">Devam Et</text>
  <text x="475" y="2148" font-family="Arial, sans-serif" font-size="26" fill="${theme.sub}">Adım 2/4</text>`;
  return wrapScreen('Onboarding', body);
}

function makeLibrary() {
  const body = `
  <text x="60" y="230" font-family="Arial, sans-serif" font-size="30" fill="${theme.sub}">Favoriler</text>
  ${card(60, 260, 470, 320, 'Duygusal Çeviklik', '3 dk • Psikoloji')}
  ${card(550, 260, 470, 320, 'Derin İş', '5 dk • Verimlilik')}

  <text x="60" y="650" font-family="Arial, sans-serif" font-size="30" fill="${theme.sub}">Geçmiş</text>
  ${card(60, 680, 960, 190, 'Liderliğin 5 Seviyesi', 'Dün okundu • 6 dk')}
  ${card(60, 900, 960, 190, 'Bilinçli Dikkat', '2 gün önce • 4 dk')}
  ${card(60, 1120, 960, 190, 'Büyüme Zihniyeti', '3 gün önce • 5 dk')}`;
  return wrapScreen('Kütüphane', body);
}

function makeProgress() {
  const squares = [];
  const startX = 80;
  const startY = 330;
  const size = 54;
  const gap = 10;
  const palette = ['#EFE8D9', '#E0D0B3', '#D0B084', '#B8894A'];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 13; c++) {
      const level = (r * 13 + c * 5) % 4;
      squares.push(`<rect x="${startX + c * (size + gap)}" y="${startY + r * (size + gap)}" width="${size}" height="${size}" rx="10" fill="${palette[level]}"/>`);
    }
  }

  const body = `
  <text x="60" y="230" font-family="Georgia, serif" font-size="64" fill="${theme.text}">İlerlemen</text>
  <text x="60" y="276" font-family="Arial, sans-serif" font-size="30" fill="${theme.sub}">Son 90 günlük okuma yoğunluğu</text>
  <rect x="60" y="300" rx="28" ry="28" width="960" height="560" fill="${theme.card}" stroke="${theme.border}"/>
  ${squares.join('')}

  <text x="60" y="940" font-family="Arial, sans-serif" font-size="30" fill="${theme.sub}">Rozetler</text>
  ${card(60, 970, 470, 260, '🔥 7 Gün Seri', 'Kazanıldı')}
  ${card(550, 970, 470, 260, '🧭 Keşifçi', 'Kazanıldı')}
  ${card(60, 1250, 470, 260, '🏛️ Filozof', 'Kilidi Açılmadı')}
  ${card(550, 1250, 470, 260, '📜 Bilge', 'Kilidi Açılmadı')}`;
  return wrapScreen('İstatistik', body);
}

function makeProfile() {
  const body = `
  <circle cx="180" cy="300" r="84" fill="#F9F6F1" stroke="${theme.primary}" stroke-width="6"/>
  <text x="132" y="320" font-family="Georgia, serif" font-size="64" fill="${theme.primaryDeep}">AY</text>
  <text x="300" y="286" font-family="Georgia, serif" font-size="52" fill="${theme.text}">Asaf Oyri</text>
  <text x="300" y="332" font-family="Arial, sans-serif" font-size="28" fill="${theme.sub}">asaf@example.com</text>
  <rect x="300" y="360" rx="20" ry="20" width="360" height="62" fill="#5A9CA0"/>
  <text x="344" y="401" font-family="Arial, sans-serif" font-size="28" fill="#fff">Premium Üye</text>

  <text x="60" y="500" font-family="Arial, sans-serif" font-size="28" fill="${theme.sub}">Ayarlar</text>
  ${card(60, 530, 960, 140, 'Dark (Ink) Mode', 'Açık')}
  ${card(60, 690, 960, 140, 'Dil', 'TR')}
  ${card(60, 850, 960, 140, 'Kategoriler', '6 kategori seçili')}
  ${card(60, 1010, 960, 140, 'Bildirim Testi', 'Anında gönder')}`;
  return wrapScreen('Profil', body);
}

function makeStoryDetail() {
  const body = `
  <rect x="60" y="190" rx="30" ry="30" width="960" height="350" fill="#EBE2D3" stroke="${theme.border}"/>
  <text x="96" y="270" font-family="Arial, sans-serif" font-size="26" fill="#594238">Psikoloji</text>
  <text x="96" y="338" font-family="Georgia, serif" font-size="56" fill="#1A1A1A">Hızlı Düşün, Yavaş Karar Ver</text>
  <text x="96" y="394" font-family="Arial, sans-serif" font-size="28" fill="#594238">5 dk okuma</text>

  <rect x="60" y="580" rx="20" ry="20" width="960" height="250" fill="#fff" stroke="${theme.border}"/>
  <text x="96" y="646" font-family="Arial, sans-serif" font-size="30" fill="${theme.text}">Zihnimiz çoğu zaman kısa yolları tercih eder.</text>
  <text x="96" y="700" font-family="Arial, sans-serif" font-size="30" fill="${theme.text}">Bu durum hızlı karar almayı kolaylaştırırken</text>
  <text x="96" y="754" font-family="Arial, sans-serif" font-size="30" fill="${theme.text}">bazen hatalı çıkarımlara da yol açar.</text>

  <rect x="60" y="870" rx="20" ry="20" width="960" height="170" fill="#F5F0E6" stroke="${theme.border}"/>
  <rect x="84" y="896" width="10" height="118" fill="${theme.primary}"/>
  <text x="110" y="958" font-family="Georgia, serif" font-size="38" fill="#1A1A1A">"Yavaşlamak, daha iyi düşünmektir."</text>

  <rect x="60" y="1080" rx="20" ry="20" width="960" height="230" fill="#F7F3E8" stroke="${theme.border}"/>
  <text x="96" y="1142" font-family="Arial, sans-serif" font-size="28" fill="#594238">Bu hikayenin ilham kaynağı:</text>
  <text x="96" y="1204" font-family="Georgia, serif" font-size="44" fill="#1A1A1A">Thinking, Fast and Slow</text>

  <rect x="60" y="2140" rx="18" ry="18" width="340" height="96" fill="transparent" stroke="${theme.primaryDeep}"/>
  <text x="168" y="2200" font-family="Arial, sans-serif" font-size="32" fill="#1A1A1A">Paylaş</text>
  <rect x="420" y="2140" rx="18" ry="18" width="600" height="96" fill="${theme.primaryDeep}"/>
  <text x="568" y="2200" font-family="Arial, sans-serif" font-size="32" fill="#fff">Sonraki hikaye</text>`;
  return wrapScreen('Hikaye Detayı', body);
}

function write(name, content) {
  fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), content, 'utf8');
}

function buildIndex(files) {
  const cards = files.map((f) => `
    <article>
      <h2>${f}</h2>
      <img src="./${f}.svg" alt="${f} screenshot" loading="lazy" />
    </article>`).join('\n');

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Spark Screenshots</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f4efe6; color: #1A1A1A; }
    .wrap { max-width: 1280px; margin: 0 auto; padding: 24px; }
    h1 { margin: 0 0 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    article { background: #fff; border: 1px solid #E8E3DA; border-radius: 12px; padding: 12px; }
    h2 { font-size: 16px; margin: 0 0 10px; color: #594238; }
    img { width: 100%; height: auto; border-radius: 8px; border: 1px solid #E8E3DA; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Spark App Screenshots</h1>
    <div class="grid">${cards}
    </div>
  </div>
</body>
</html>`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const outputs = {
  home: makeHome(),
  onboarding: makeOnboarding(),
  library: makeLibrary(),
  progress: makeProgress(),
  profile: makeProfile(),
  'story-detail': makeStoryDetail(),
};

Object.entries(outputs).forEach(([name, svg]) => write(name, svg));
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildIndex(Object.keys(outputs)), 'utf8');

console.log(`Generated ${Object.keys(outputs).length} screenshots in ${OUT_DIR}`);
