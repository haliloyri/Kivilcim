import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

if (args.includes('--help')) {
  console.log(`Kullanım:
  node set-project-status.mjs --project KLASÖR --status ONAY_BEKLIYOR
  node set-project-status.mjs --project KLASÖR --status ONAYLANDI --approval "Onaylıyorum"
  node set-project-status.mjs --project KLASÖR --status TAMAMLANDI
  node set-project-status.mjs --project KLASÖR --status HAZIRLANIYOR --note "Revizyon istendi"`);
  process.exit(0);
}

const projectDir = resolve(valueOf('--project') || '');
const nextStatus = valueOf('--status');
const approvalMessage = valueOf('--approval');
const note = valueOf('--note') || '';
const allowedStatuses = new Set(['HAZIRLANIYOR', 'ONAY_BEKLIYOR', 'ONAYLANDI', 'TAMAMLANDI']);
if (!nextStatus || !allowedStatuses.has(nextStatus)) {
  throw new Error(`--status şu değerlerden biri olmalıdır: ${[...allowedStatuses].join(', ')}`);
}

const projectPath = resolve(projectDir, 'project.json');
if (!existsSync(projectPath)) throw new Error(`project.json bulunamadı: ${projectPath}`);
const project = JSON.parse(readFileSync(projectPath, 'utf8'));
if (project.schemaVersion !== 1 || !project.story?.storyId || !project.story?.title) {
  throw new Error('Geçersiz create-video proje dosyası.');
}

const transitions = {
  HAZIRLANIYOR: new Set(['ONAY_BEKLIYOR']),
  ONAY_BEKLIYOR: new Set(['ONAYLANDI', 'HAZIRLANIYOR']),
  ONAYLANDI: new Set(['TAMAMLANDI', 'HAZIRLANIYOR']),
  TAMAMLANDI: new Set(['HAZIRLANIYOR']),
};
const currentStatus = project.status;
if (!transitions[currentStatus]?.has(nextStatus)) {
  throw new Error(`İzin verilmeyen durum geçişi: ${currentStatus} → ${nextStatus}`);
}

const validationPhase = nextStatus === 'TAMAMLANDI'
  ? 'final'
  : ['ONAY_BEKLIYOR', 'ONAYLANDI'].includes(nextStatus)
    ? 'draft'
    : null;
if (validationPhase) {
  const validation = spawnSync(process.execPath, [
    resolve(scriptDir, 'validate-video-package.mjs'),
    '--project', projectDir,
    '--phase', validationPhase,
  ], { encoding: 'utf8' });
  if (validation.status !== 0) {
    process.stderr.write(validation.stdout || '');
    process.stderr.write(validation.stderr || '');
    throw new Error(`${nextStatus} geçişi için ${validationPhase} paket doğrulaması başarısız.`);
  }
}

const normalizeApproval = (value) => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .replace(/[.!?]+$/g, '')
  .trim()
  .replace(/\s+/g, ' ');
const explicitApprovals = new Set([
  'onaylıyorum',
  'bu paketi onaylıyorum',
  'taslağı onaylıyorum',
  'videoyu oluştur',
]);

const now = new Date().toISOString();
if (nextStatus === 'ONAYLANDI') {
  const normalized = normalizeApproval(approvalMessage);
  const naturalLanguageRenderApproval = /\bvideoyu?\b.*\boluştur(?:alım)?\b/u.test(normalized);
  if (!explicitApprovals.has(normalized) && !naturalLanguageRenderApproval) {
    throw new Error('ONAYLANDI durumu için açık kullanıcı onayı gerekli: “Onaylıyorum” veya “Videoyu oluştur”.');
  }
  project.approval = {
    message: approvalMessage,
    approvedAt: now,
  };
}

if (nextStatus === 'HAZIRLANIYOR') project.approval = null;
if (nextStatus === 'TAMAMLANDI') {
  const finalVideo = resolve(projectDir, project.files?.finalVideo || 'final/reel.mp4');
  if (!existsSync(finalVideo)) throw new Error(`Nihai video bulunmadan TAMAMLANDI yapılamaz: ${finalVideo}`);
}

project.status = nextStatus;
project.updatedAt = now;
project.history = Array.isArray(project.history) ? project.history : [];
project.history.push({
  status: nextStatus,
  at: now,
  note: note || (
    nextStatus === 'ONAYLANDI'
      ? `Açık kullanıcı onayı: ${approvalMessage}`
      : `${currentStatus} durumundan geçildi.`
  ),
});

const temporaryPath = `${projectPath}.tmp`;
writeFileSync(temporaryPath, `${JSON.stringify(project, null, 2)}\n`, 'utf8');
renameSync(temporaryPath, projectPath);

const historyLines = project.history
  .map((entry) => `- ${entry.at} — \`${entry.status}\`${entry.note ? ` — ${entry.note}` : ''}`)
  .join('\n');
const approvalLine = project.approval
  ? `${project.approval.approvedAt} — “${project.approval.message}”`
  : 'Henüz alınmadı';
writeFileSync(resolve(projectDir, 'STATUS.md'), `# Video Proje Durumu

- Durum: \`${project.status}\`
- Hikâye: ${project.story.title}
- story_id: ${project.story.storyId}
- Dil: \`${project.language}\`
- Son güncelleme: ${now}
- Kaynak SHA-256: \`${project.source.databaseSha256}\`
- Onay: ${approvalLine}

## Durum geçmişi

${historyLines}
`, 'utf8');

console.log(JSON.stringify({
  projectDir,
  storyId: project.story.storyId,
  title: project.story.title,
  previousStatus: currentStatus,
  status: nextStatus,
  updatedAt: now,
}, null, 2));
