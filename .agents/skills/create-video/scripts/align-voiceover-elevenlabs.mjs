import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, resolve, sep } from 'path';

const args = process.argv.slice(2);

const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

const pathInsideProject = (projectDir, relativePath, label) => {
  const outputPath = resolve(projectDir, relativePath);
  if (!outputPath.startsWith(`${projectDir}${sep}`)) {
    throw new Error(`${label} proje klasörünün dışında olamaz: ${relativePath}`);
  }
  return outputPath;
};

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

if (args.includes('--help')) {
  console.log('Kullanım: node --env-file=.env.local align-voiceover-elevenlabs.mjs --project KLASÖR [--audio audio/narration.mp3] [--text 02-seslendirme.txt] [--output audio/forced-alignment.json]');
  process.exit(0);
}

const projectDir = resolve(valueOf('--project') || '');
const projectPath = resolve(projectDir, 'project.json');
if (!existsSync(projectPath)) throw new Error(`project.json bulunamadı: ${projectPath}`);
const project = JSON.parse(readFileSync(projectPath, 'utf8'));
const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
if (!apiKey) throw new Error('ELEVENLABS_API_KEY bulunamadı. Anahtarı yalnızca .env.local dosyasında saklayın.');

const audioRelativePath = valueOf('--audio') || project.files?.narration || 'audio/narration.mp3';
const textRelativePath = valueOf('--text') || project.files?.voiceover || '02-seslendirme.txt';
const outputRelativePath = valueOf('--output') || 'audio/forced-alignment.json';
const audioPath = pathInsideProject(projectDir, audioRelativePath, 'Ses dosyası');
const textPath = pathInsideProject(projectDir, textRelativePath, 'Seslendirme metni');
const outputPath = pathInsideProject(projectDir, outputRelativePath, 'Zamanlama çıktısı');

if (!existsSync(audioPath) || statSync(audioPath).size === 0) throw new Error(`Ses dosyası bulunamadı: ${audioPath}`);
if (!existsSync(textPath) || statSync(textPath).size === 0) throw new Error(`Seslendirme metni bulunamadı: ${textPath}`);

const text = readFileSync(textPath, 'utf8').trim();
const audio = readFileSync(audioPath);
const form = new FormData();
form.append('file', new Blob([audio], { type: 'audio/mpeg' }), 'narration.mp3');
form.append('text', text);

const characterCountBefore = await getElevenLabsCharacterUsage(apiKey);
let response;
try {
  response = await fetch('https://api.elevenlabs.io/v1/forced-alignment', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });
} catch (error) {
  throw new Error(`ElevenLabs Forced Alignment bağlantısı kurulamadı: ${error.message}`);
}

if (!response.ok) {
  const errorBody = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, 500);
  throw new Error(`ElevenLabs Forced Alignment başarısız (${response.status}): ${errorBody}`);
}

const alignment = await response.json();
if (!Array.isArray(alignment.words) || alignment.words.length === 0) {
  throw new Error('ElevenLabs kelime zamanlaması döndürmedi.');
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(alignment, null, 2)}\n`, 'utf8');

const characterCountAfter = await getElevenLabsCharacterUsage(apiKey);
const creditHeader = Number(response.headers.get('character-cost') || response.headers.get('x-character-cost'));
const usedCredits = Number.isFinite(characterCountBefore) && Number.isFinite(characterCountAfter)
  ? Math.max(0, characterCountAfter - characterCountBefore)
  : (Number.isFinite(creditHeader) && creditHeader >= 0 ? creditHeader : null);

console.log(JSON.stringify({
  ok: true,
  projectDir,
  audio: audioPath,
  text: textPath,
  output: outputPath,
  words: alignment.words.length,
  loss: alignment.loss ?? null,
  creditUsage: usedCredits === null
    ? { used: null, source: 'ElevenLabs-kullanim-sayaci-okunamadi' }
    : { used: usedCredits, source: 'ElevenLabs-kullanim-sayaci' },
}, null, 2));
