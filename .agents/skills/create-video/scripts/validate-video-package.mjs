import { createHash } from 'crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { extname, resolve } from 'path';

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

if (args.includes('--help')) {
  console.log('Kullanım: node validate-video-package.mjs --project KLASÖR --phase draft|render|final');
  process.exit(0);
}

const projectDir = resolve(valueOf('--project') || '');
const phase = valueOf('--phase') || 'draft';
if (!['draft', 'render', 'final'].includes(phase)) {
  throw new Error('--phase draft, render veya final olmalıdır.');
}

const errors = [];
const warnings = [];
let project = null;
let source = null;
let voiceoverWordCount = 0;
let subtitleDuration = null;
let sceneCount = 0;
let totalSceneDuration = 0;
let imageCount = 0;
let renderPlan = null;
const projectPath = resolve(projectDir, 'project.json');
const sourcePath = resolve(projectDir, 'source.json');
if (!existsSync(projectPath)) errors.push(`Eksik: ${projectPath}`);
if (!existsSync(sourcePath)) errors.push(`Eksik: ${sourcePath}`);
if (errors.length) finish();

project = JSON.parse(readFileSync(projectPath, 'utf8'));
source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const isShortRerender = project.production?.mode === 'short-rerender';
const shortRerenderDuration = Number(project.production?.targetDurationSeconds);
const renderPlanPath = resolve(projectDir, '07-render-plani.json');
let shortDurationMinimum = shortRerenderDuration;
let shortDurationMaximum = shortRerenderDuration;
const projectAdaptiveMinimum = Number(project.production?.adaptiveDurationSeconds?.min);
const projectAdaptiveMaximum = Number(project.production?.adaptiveDurationSeconds?.max);
if (Number.isFinite(projectAdaptiveMinimum) && Number.isFinite(projectAdaptiveMaximum) && projectAdaptiveMinimum > 0 && projectAdaptiveMaximum >= projectAdaptiveMinimum) {
  shortDurationMinimum = projectAdaptiveMinimum;
  shortDurationMaximum = projectAdaptiveMaximum;
}
if (isShortRerender && existsSync(renderPlanPath)) {
  try {
    const preview = JSON.parse(readFileSync(renderPlanPath, 'utf8'));
    const adaptiveMinimum = Number(preview.adaptiveDurationSeconds?.min);
    const adaptiveMaximum = Number(preview.adaptiveDurationSeconds?.max);
    if (Number.isFinite(adaptiveMinimum) && Number.isFinite(adaptiveMaximum) && adaptiveMinimum > 0 && adaptiveMaximum >= adaptiveMinimum) {
      shortDurationMinimum = adaptiveMinimum;
      shortDurationMaximum = adaptiveMaximum;
    }
  } catch {
    // Ayrıntılı JSON hatası render planı doğrulamasında raporlanır.
  }
}
if (project.schemaVersion !== 1) errors.push('project.json schemaVersion 1 olmalıdır.');
if (source.schemaVersion !== 1) errors.push('source.json schemaVersion 1 olmalıdır.');
if (Number(project.story?.storyId) !== Number(source.story?.storyId)) {
  errors.push('project.json ile source.json story_id değerleri uyuşmuyor.');
}
if (project.language !== 'tr' || source.story?.language !== 'tr') {
  errors.push('Bu akışta proje ve kaynak dili tr olmalıdır.');
}

const databasePath = project.source?.database;
if (!databasePath || !existsSync(databasePath)) {
  errors.push(`Kaynak veritabanı bulunamadı: ${databasePath || '(boş)'}`);
} else {
  const currentHash = createHash('sha256').update(readFileSync(databasePath)).digest('hex');
  if (currentHash !== project.source.databaseSha256 || currentHash !== source.databaseSha256) {
    errors.push('Veritabanı SHA-256 değeri proje hazırlandıktan sonra değişmiş; taslak yeniden hazırlanmalı.');
  }
}

const requiredDraftFiles = [
  '01-yaratici-brief.md',
  '02-seslendirme.txt',
  '03-sahne-plani.md',
  '04-gorsel-promptlar.md',
  '05-paylasim-metni.md',
  '06-altyazilar.srt',
  '07-render-plani.json',
];
for (const relativePath of requiredDraftFiles) {
  const filePath = resolve(projectDir, relativePath);
  if (!existsSync(filePath) || statSync(filePath).size === 0) errors.push(`Eksik veya boş: ${relativePath}`);
}

const placeholderPattern = /\b(?:TODO|PLACEHOLDER|PROJE_KLASÖRÜ|HİKÂYE ADI)\b/i;
for (const relativePath of requiredDraftFiles.filter((name) => !name.endsWith('.json'))) {
  const filePath = resolve(projectDir, relativePath);
  if (existsSync(filePath) && placeholderPattern.test(readFileSync(filePath, 'utf8'))) {
    errors.push(`Yer tutucu metin kaldı: ${relativePath}`);
  }
}

const voiceoverPath = resolve(projectDir, '02-seslendirme.txt');
if (existsSync(voiceoverPath)) {
  const voiceover = readFileSync(voiceoverPath, 'utf8').trim();
  if (/[#$&]{2}|~~|::/.test(voiceover)) errors.push('Seslendirme metninde veritabanı işareti kaldı.');
  voiceoverWordCount = voiceover.split(/\s+/u).filter(Boolean).length;
  if (isShortRerender && voiceoverWordCount < 1) {
    errors.push('Kısa yeniden render seslendirmesi boş olamaz.');
  } else if (!isShortRerender && (voiceoverWordCount < 90 || voiceoverWordCount > 120)) {
    errors.push(`Seslendirme 90–120 kelime olmalıdır; mevcut: ${voiceoverWordCount}.`);
  }
}

const timestampToSeconds = (value) => {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!match) return null;
  return (Number(match[1]) * 3600) + (Number(match[2]) * 60) + Number(match[3]) + (Number(match[4]) / 1000);
};

const subtitlePath = resolve(projectDir, '06-altyazilar.srt');
if (existsSync(subtitlePath)) {
  const subtitle = readFileSync(subtitlePath, 'utf8');
  const timeLines = [...subtitle.matchAll(/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}[,.]\d{3})/g)];
  if (!timeLines.length) {
    errors.push('06-altyazilar.srt içinde geçerli zaman kodu bulunamadı.');
  } else {
    const firstStart = timestampToSeconds(timeLines[0][1]);
    subtitleDuration = timestampToSeconds(timeLines.at(-1)[2]);
    if (firstStart == null || firstStart > 0.5) errors.push('İlk altyazı en geç 0,5 saniyede başlamalıdır.');
    // Short rerenders can intentionally end their spoken captions before the
    // source clip. The final visual beat is then allowed to breathe in silence.
    const minimumDuration = isShortRerender ? 0.8 : 35;
    const maximumDuration = isShortRerender ? shortDurationMaximum + 1 : 55;
    if (subtitleDuration == null || subtitleDuration < minimumDuration || subtitleDuration > maximumDuration) {
      errors.push(`Altyazı bitişi ${minimumDuration}–${maximumDuration} saniye olmalıdır; mevcut: ${subtitleDuration ?? 'geçersiz'}.`);
    }
  }
}

if (existsSync(renderPlanPath)) {
  try {
    renderPlan = JSON.parse(readFileSync(renderPlanPath, 'utf8'));
    if (renderPlan.width !== 1080 || renderPlan.height !== 1920 || renderPlan.fps !== 30) {
      errors.push('Render planı 1080×1920 ve 30 fps olmalıdır.');
    }
    if (isShortRerender) {
      const sourceVideo = renderPlan.sourceVideo;
      if (!sourceVideo) {
        errors.push(`Kısa yeniden render kaynak videosu bulunamadı: ${sourceVideo || '(boş)'}`);
      } else if (!existsSync(resolve(projectDir, sourceVideo))) {
        if (phase === 'draft') {
          warnings.push(`Seedance kaynak videosu onaydan sonra üretilecek: ${sourceVideo}`);
        } else {
          errors.push(`Kısa yeniden render kaynak videosu bulunamadı: ${sourceVideo}`);
        }
      }
      totalSceneDuration = Number(renderPlan.durationSeconds);
      sceneCount = 1;
      if (!Number.isFinite(totalSceneDuration) || totalSceneDuration < shortDurationMinimum - 0.01 || totalSceneDuration > shortDurationMaximum + 0.01) {
        const expected = shortDurationMinimum === shortDurationMaximum
          ? `${shortDurationMinimum} saniye`
          : `${shortDurationMinimum}–${shortDurationMaximum} saniye`;
        errors.push(`Kısa yeniden render süresi ${expected} olmalıdır; mevcut: ${renderPlan.durationSeconds ?? 'geçersiz'}.`);
      }
    } else if (!Array.isArray(renderPlan.scenes)) {
      errors.push('Render planında scenes dizisi bulunmalıdır.');
    } else {
      sceneCount = renderPlan.scenes.length;
      if (sceneCount < 7 || sceneCount > 8) errors.push(`Sahne sayısı 7–8 olmalıdır; mevcut: ${sceneCount}.`);
      const allowedMotions = new Set(['slow_push_in', 'slow_pull_out', 'pan_left', 'pan_right', 'static']);
      for (const [index, scene] of renderPlan.scenes.entries()) {
        const number = index + 1;
        const duration = Number(scene.duration);
        if (!Number.isFinite(duration) || duration < 3 || duration > 8) {
          errors.push(`Sahne ${number} süresi 3–8 saniye olmalıdır.`);
        } else {
          totalSceneDuration += duration;
        }
        if (!scene.image || !existsSync(resolve(projectDir, scene.image))) {
          errors.push(`Sahne ${number} görseli bulunamadı: ${scene.image || '(boş)'}`);
        }
        if (!allowedMotions.has(scene.motion)) errors.push(`Sahne ${number} hareketi geçersiz: ${scene.motion}`);
      }
      if (totalSceneDuration < 35 || totalSceneDuration > 55) {
        errors.push(`Toplam sahne süresi 35–55 saniye olmalıdır; mevcut: ${totalSceneDuration}.`);
      }
    }
  } catch (error) {
    errors.push(`07-render-plani.json okunamadı: ${error.message}`);
  }
}

const imagesDir = resolve(projectDir, 'images');
if (!existsSync(imagesDir)) {
  errors.push('images klasörü bulunamadı.');
} else {
  imageCount = readdirSync(imagesDir)
    .filter((name) => ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(name).toLowerCase()))
    .length;
  if (!isShortRerender && (imageCount < 7 || imageCount > 8)) errors.push(`7–8 sahne görseli gerekli; mevcut: ${imageCount}.`);
}

if (phase === 'render') {
  if (!['ONAYLANDI', 'TAMAMLANDI'].includes(project.status) || !project.approval?.message) {
    errors.push('Render aşaması için proje ONAYLANDI/TAMAMLANDI durumda ve açık onay kayıtlı olmalıdır.');
  }
  const narrationPath = resolve(projectDir, project.files?.narration || 'audio/narration.aiff');
  if (!existsSync(narrationPath)) errors.push(`Seslendirme dosyası bulunamadı: ${narrationPath}`);
  if (renderPlan?.music) {
    const musicPath = resolve(projectDir, renderPlan.music);
    if (!existsSync(musicPath)) errors.push(`Render planındaki müzik dosyası bulunamadı: ${musicPath}`);
  }
}

if (phase === 'final') {
  if (!['ONAYLANDI', 'TAMAMLANDI'].includes(project.status)) {
    errors.push('Final doğrulama için proje ONAYLANDI veya TAMAMLANDI olmalıdır.');
  }
  const finalVideo = resolve(projectDir, project.files?.finalVideo || 'final/reel.mp4');
  if (!existsSync(finalVideo) || statSync(finalVideo).size === 0) errors.push(`Nihai video bulunamadı: ${finalVideo}`);
  const cover = resolve(projectDir, project.files?.cover || 'final/cover.jpg');
  if (!existsSync(cover) || statSync(cover).size === 0) errors.push(`Kapak görseli bulunamadı: ${cover}`);
}

if (!isShortRerender && subtitleDuration != null && totalSceneDuration && Math.abs(subtitleDuration - totalSceneDuration) > 2.5) {
  warnings.push(`Altyazı ve sahne toplam süreleri arasında ${Math.abs(subtitleDuration - totalSceneDuration).toFixed(1)} saniye fark var.`);
}

finish();

function finish() {
  const result = {
    ok: errors.length === 0,
    phase,
    projectDir,
    status: project?.status || null,
    storyId: project?.story?.storyId || null,
    voiceoverWordCount,
    sceneCount,
    imageCount,
    totalSceneDuration,
    subtitleDuration,
    warnings,
    errors,
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}
