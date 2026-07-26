import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const ELEVENLABS_DEFAULT_MODEL = 'eleven_multilingual_v2';
const ELEVENLABS_OUTPUT_FORMAT = 'mp3_44100_128';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const voiceLibraryPath = resolve(scriptDir, '../voice-library.json');

const loadVoiceLibrary = () => {
  if (!existsSync(voiceLibraryPath)) return null;
  try {
    return JSON.parse(readFileSync(voiceLibraryPath, 'utf8'));
  } catch {
    return null;
  }
};

const voiceNameById = (library, id) => library?.voices?.find((voice) => voice.id === id)?.name || null;

const selectVoiceForCategory = (library, category) => {
  if (!library) return null;
  const trimmedCategory = category?.trim() || '';
  const mappedId = trimmedCategory ? library.categoryMap?.[trimmedCategory] : null;
  if (mappedId) {
    return { voiceId: mappedId, source: 'kategori-eslesmesi', category: trimmedCategory, voiceName: voiceNameById(library, mappedId) };
  }
  if (library.defaultVoiceId) {
    return { voiceId: library.defaultVoiceId, source: 'kutuphane-varsayilani', category: trimmedCategory || null, voiceName: voiceNameById(library, library.defaultVoiceId) };
  }
  return null;
};

const readStoryCategory = (projectDir, project) => {
  const relativeSource = project.files?.source || 'source.json';
  const sourcePath = resolve(projectDir, relativeSource);
  if (!existsSync(sourcePath)) return null;
  try {
    const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
    return source.story?.book?.category || null;
  } catch {
    return null;
  }
};

const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

const buildSayArgs = ({ voice, rate, inputPath, outputPath }) => [
  '-v', voice,
  '-r', String(rate),
  '-f', inputPath,
  '-o', outputPath,
];

const buildElevenLabsRequest = ({ voiceId, text, modelId }) => ({
  url: `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${ELEVENLABS_OUTPUT_FORMAT}`,
  body: {
    text,
    model_id: modelId,
  },
});

const getElevenLabsCharacterUsage = async (apiKey) => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': apiKey },
    });
    if (!response.ok) return null;
    const user = await response.json();
    const count = Number(user.subscription?.character_count);
    return Number.isFinite(count) ? count : null;
  } catch {
    return null;
  }
};

const pathInsideProject = (projectDir, relativePath, label) => {
  const outputPath = resolve(projectDir, relativePath);
  if (!outputPath.startsWith(`${projectDir}${sep}`)) {
    throw new Error(`${label} proje klasörünün dışında olamaz: ${relativePath}`);
  }
  return outputPath;
};

const writeNarrationReferences = ({ project, projectPath, projectDir, relativeOutput }) => {
  project.files = { ...project.files, narration: relativeOutput };
  writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);

  const renderPlanPath = resolve(projectDir, '07-render-plani.json');
  if (!existsSync(renderPlanPath)) return;

  const renderPlan = JSON.parse(readFileSync(renderPlanPath, 'utf8'));
  renderPlan.voiceover = relativeOutput;
  writeFileSync(renderPlanPath, `${JSON.stringify(renderPlan, null, 2)}\n`);
};

if (args.includes('--help')) {
  console.log('Kullanım: node [--env-file=.env.local] create-voiceover.mjs --project KLASÖR [--provider auto|elevenlabs|macos] [--voice Yelda] [--voice-id ELEVENLABS_VOICE_ID] [--model eleven_multilingual_v2] [--rate 165] [--output audio/narration.mp3] [--force] [--dry-run]\n\nElevenLabs sağlayıcısında --voice-id verilmezse ses, hikâyenin kitap kategorisine göre voice-library.json içindeki eşleşmeden otomatik seçilir; eşleşme yoksa kütüphanenin varsayılan sesi, o da yoksa ELEVENLABS_VOICE_ID ortam değişkeni kullanılır.');
  process.exit(0);
}

if (args.includes('--self-test')) {
  const sayArgs = buildSayArgs({
    voice: 'Yelda',
    rate: 165,
    inputPath: '/tmp/voiceover.txt',
    outputPath: '/tmp/narration.aiff',
  });
  if (sayArgs.join(' ') !== '-v Yelda -r 165 -f /tmp/voiceover.txt -o /tmp/narration.aiff') {
    throw new Error('say komut oluşturma öz testi başarısız.');
  }

  const elevenRequest = buildElevenLabsRequest({
    voiceId: 'voice-id-for-test',
    text: 'Ya sana kızgın değilse?',
    modelId: ELEVENLABS_DEFAULT_MODEL,
  });
  if (!elevenRequest.url.includes('/v1/text-to-speech/voice-id-for-test?output_format=mp3_44100_128') || elevenRequest.body.model_id !== ELEVENLABS_DEFAULT_MODEL) {
    throw new Error('ElevenLabs istek oluşturma öz testi başarısız.');
  }

  console.log(JSON.stringify({ ok: true, tests: ['say-command-builder', 'elevenlabs-request-builder'] }, null, 2));
  process.exit(0);
}

const projectDir = resolve(valueOf('--project') || '');
const projectPath = resolve(projectDir, 'project.json');
if (!existsSync(projectPath)) throw new Error(`project.json bulunamadı: ${projectPath}`);
const project = JSON.parse(readFileSync(projectPath, 'utf8'));
if (project.status !== 'ONAYLANDI' || !project.approval?.message) {
  throw new Error('Seslendirme yalnızca açık onayı kaydedilmiş ONAYLANDI projede üretilebilir.');
}

const providerArgument = valueOf('--provider') || 'auto';
if (!['auto', 'elevenlabs', 'macos'].includes(providerArgument)) {
  throw new Error('--provider yalnızca auto, elevenlabs veya macos olabilir.');
}
const provider = providerArgument === 'auto'
  ? (process.env.ELEVENLABS_API_KEY?.trim() ? 'elevenlabs' : 'macos')
  : providerArgument;

const inputPath = pathInsideProject(projectDir, project.files?.voiceover || '02-seslendirme.txt', 'Seslendirme metni');
if (!existsSync(inputPath) || statSync(inputPath).size === 0) {
  throw new Error(`Seslendirme metni bulunamadı: ${inputPath}`);
}
const text = readFileSync(inputPath, 'utf8').trim();
const defaultOutput = provider === 'elevenlabs' ? 'audio/narration.mp3' : 'audio/narration.aiff';
const relativeOutput = valueOf('--output') || defaultOutput;
const outputPath = pathInsideProject(projectDir, relativeOutput, 'Seslendirme çıktısı');
if (provider === 'elevenlabs' && !outputPath.toLowerCase().endsWith('.mp3')) {
  throw new Error('ElevenLabs çıktısı MP3 olmalıdır; örnek: --output audio/narration.mp3');
}
if (provider === 'macos' && !outputPath.toLowerCase().endsWith('.aiff')) {
  throw new Error('macOS say çıktısı AIFF olmalıdır; örnek: --output audio/narration.aiff');
}
if (existsSync(outputPath) && !args.includes('--force')) {
  throw new Error(`Ses dosyası zaten var; üzerine yazmak için --force kullanın: ${outputPath}`);
}

const voice = valueOf('--voice') || 'Yelda';
const rate = Number.parseInt(valueOf('--rate') || '165', 10);
if (!Number.isSafeInteger(rate) || rate < 120 || rate > 220) {
  throw new Error('--rate 120–220 arasında bir tam sayı olmalıdır.');
}
const explicitVoiceId = valueOf('--voice-id');
let voiceSelection = explicitVoiceId
  ? { voiceId: explicitVoiceId, source: 'komut-satiri-parametresi', category: null, voiceName: voiceNameById(loadVoiceLibrary(), explicitVoiceId) }
  : null;
if (!voiceSelection && provider === 'elevenlabs') {
  const library = loadVoiceLibrary();
  const category = readStoryCategory(projectDir, project);
  voiceSelection = selectVoiceForCategory(library, category);
}
if (!voiceSelection) {
  const envVoiceId = process.env.ELEVENLABS_VOICE_ID?.trim();
  voiceSelection = envVoiceId ? { voiceId: envVoiceId, source: 'ortam-degiskeni', category: null, voiceName: null } : null;
}
const voiceId = voiceSelection?.voiceId || null;
const modelId = valueOf('--model') || process.env.ELEVENLABS_MODEL_ID?.trim() || ELEVENLABS_DEFAULT_MODEL;

if (args.includes('--dry-run')) {
  const details = provider === 'elevenlabs'
    ? {
        executable: 'https://api.elevenlabs.io/v1/text-to-speech/:voice_id',
        apiKeyConfigured: Boolean(process.env.ELEVENLABS_API_KEY?.trim()),
        voiceSelection,
        modelId,
        outputPath,
      }
    : { executable: 'say', arguments: buildSayArgs({ voice, rate, inputPath, outputPath }), outputPath };
  console.log(JSON.stringify({ provider, ...details }, null, 2));
  process.exit(0);
}

mkdirSync(dirname(outputPath), { recursive: true });

if (provider === 'elevenlabs') {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY bulunamadı. Anahtarı Git’e eklemeden .env.local dosyasına yazın ve komutu node --env-file=.env.local ile çalıştırın.');
  }
  if (!voiceId) {
    throw new Error('Ses seçilemedi: voice-library.json bulunamadı/boş, hikâye kategorisi okunamadı ve ELEVENLABS_VOICE_ID de tanımlı değil. .env.local dosyasına ELEVENLABS_VOICE_ID ekleyin veya --voice-id kullanın.');
  }

  const request = buildElevenLabsRequest({ voiceId, text, modelId });
  const charactersBefore = await getElevenLabsCharacterUsage(apiKey);
  let response;
  try {
    response = await fetch(request.url, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(request.body),
    });
  } catch (error) {
    throw new Error(`ElevenLabs bağlantısı kurulamadı: ${error.message}`);
  }

  if (!response.ok) {
    const errorBody = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, 500);
    throw new Error(`ElevenLabs seslendirme başarısız (${response.status}): ${errorBody}`);
  }

  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length === 0) throw new Error('ElevenLabs boş bir ses dosyası döndürdü.');
  writeFileSync(outputPath, audio);
  writeNarrationReferences({ project, projectPath, projectDir, relativeOutput });

  const charactersAfter = await getElevenLabsCharacterUsage(apiKey);
  const responseCreditHeader = response.headers.get('character-cost') || response.headers.get('x-character-cost');
  const headerCredits = Number(responseCreditHeader);
  const actualCredits = Number.isFinite(charactersBefore) && Number.isFinite(charactersAfter)
    ? Math.max(0, charactersAfter - charactersBefore)
    : (Number.isFinite(headerCredits) && headerCredits >= 0 ? headerCredits : null);
  const characterEstimate = Array.from(text).length;
  const creditUsage = actualCredits === null
    ? { used: characterEstimate, source: 'metin-karakter-tahmini', textCharacters: characterEstimate }
    : { used: actualCredits, source: 'ElevenLabs-kullanim-sayaci', textCharacters: characterEstimate };

  console.log(JSON.stringify({
    ok: true,
    provider,
    projectDir,
    voiceId,
    voiceSelection,
    modelId,
    output: outputPath,
    creditUsage,
  }, null, 2));
  process.exit(0);
}

const availableVoices = spawnSync('say', ['-v', '?'], { encoding: 'utf8' });
if (availableVoices.error?.code === 'ENOENT') throw new Error('macOS say komutu bulunamadı; ElevenLabs yapılandırın veya başka bir Türkçe TTS kullanın.');
if (availableVoices.status !== 0) throw new Error('Sistem sesleri okunamadı.');
const voicePattern = new RegExp(`^${voice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, 'm');
if (!voicePattern.test(availableVoices.stdout)) throw new Error(`Sistem sesi bulunamadı: ${voice}`);

const generation = spawnSync('say', buildSayArgs({ voice, rate, inputPath, outputPath }), { stdio: 'inherit' });
if (generation.status !== 0) throw new Error(`Seslendirme üretilemedi; say çıkış kodu: ${generation.status}`);
if (!existsSync(outputPath) || statSync(outputPath).size === 0) throw new Error('Seslendirme komutu çıktı dosyası üretmedi.');
writeNarrationReferences({ project, projectPath, projectDir, relativeOutput });

console.log(JSON.stringify({
  ok: true,
  provider,
  projectDir,
  voice,
  rate,
  output: outputPath,
}, null, 2));
