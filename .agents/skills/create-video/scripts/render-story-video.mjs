import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../../../..');
const args = process.argv.slice(2);
const ffmpegExecutable = process.env.FFMPEG_BIN?.trim() || 'ffmpeg';
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

if (args.includes('--help')) {
  console.log('Kullanım: node render-story-video.mjs --project KLASÖR [--dry-run]');
  process.exit(0);
}

const escapeFilterPath = (value) => String(value)
  .replaceAll('\\', '\\\\')
  .replaceAll(':', '\\:')
  .replaceAll("'", "\\'")
  .replaceAll('[', '\\[')
  .replaceAll(']', '\\]');

const motionFilter = ({ motion, duration, fps, width, height }) => {
  const frameCount = Math.max(1, Math.round(duration * fps));
  const base = `scale=${Math.round(width * 1.12)}:${Math.round(height * 1.12)}:force_original_aspect_ratio=increase,crop=${Math.round(width * 1.12)}:${Math.round(height * 1.12)}`;
  if (motion === 'static') return `${base},scale=${width}:${height},fps=${fps}`;

  const zoom = {
    slow_push_in: `min(zoom+0.00055,1.08)`,
    slow_pull_out: `if(eq(on,0),1.08,max(1.0,zoom-0.00055))`,
    pan_left: '1.08',
    pan_right: '1.08',
  }[motion] || `min(zoom+0.00055,1.08)`;
  const x = motion === 'pan_left'
    ? `(iw-iw/zoom)*(1-on/${frameCount})`
    : motion === 'pan_right'
      ? `(iw-iw/zoom)*(on/${frameCount})`
      : 'iw/2-(iw/zoom/2)';
  const y = 'ih/2-(ih/zoom/2)';
  return `${base},zoompan=z='${zoom}':x='${x}':y='${y}':d=1:s=${width}x${height}:fps=${fps}`;
};

const buildShortFfmpegArgs = ({ projectDir, plan, narrationPath, subtitlePath, logoPath, musicPath, outputPath }) => {
  const sourceVideoPath = resolve(projectDir, plan.sourceVideo);
  const totalDuration = Number(plan.durationSeconds || plan.targetDurationSeconds);
  if (!Number.isFinite(totalDuration) || totalDuration <= 0) {
    throw new Error('Kısa render planında geçerli durationSeconds gerekli.');
  }

  const inputArgs = [
    '-i', sourceVideoPath,
    '-i', narrationPath,
    '-loop', '1', '-i', logoPath,
  ];
  if (musicPath) inputArgs.push('-stream_loop', '-1', '-i', musicPath);

  const width = Number(plan.width) || 1080;
  const height = Number(plan.height) || 1920;
  const fps = Number(plan.fps) || 30;
  const durationText = totalDuration.toFixed(3);
  const logoStart = Math.max(0, totalDuration - 1.8).toFixed(3);
  const filters = [
    `[0:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=${fps},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${durationText},trim=duration=${durationText},format=yuv420p[base]`,
    '[2:v]scale=150:-1,format=rgba,colorchannelmixer=aa=0.94[logo]',
    `[base][logo]overlay=(W-w)/2:240:enable='gte(t,${logoStart})'[branded]`,
  ];

  const burnInPath = plan.burnInSubtitles
    ? resolve(projectDir, plan.burnInSubtitles)
    : subtitlePath;
  if (plan.burnInSubtitles) {
    filters.push(`[branded]subtitles='${escapeFilterPath(burnInPath)}'[vout]`);
  } else {
    filters.push(
      `[branded]subtitles='${escapeFilterPath(burnInPath)}':force_style='FontName=Arial,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H90000000,BorderStyle=1,Outline=3,Shadow=0,Alignment=2,MarginV=400'[vout]`,
    );
  }

  const audioInputs = [];
  filters.push(`[1:a]volume=${Number(plan.voiceoverVolume) || 1},apad,atrim=duration=${durationText}[voice]`);
  audioInputs.push('[voice]');
  if (plan.ambientSourceAudio) {
    const ambientVolume = Number.isFinite(Number(plan.ambientVolume)) ? Number(plan.ambientVolume) : 0.12;
    filters.push(`[0:a]volume=${ambientVolume},apad,atrim=duration=${durationText}[ambient]`);
    audioInputs.push('[ambient]');
  }
  if (musicPath) {
    const musicIndex = 3;
    filters.push(`[${musicIndex}:a]volume=0.10,apad,atrim=duration=${durationText}[bed]`);
    audioInputs.push('[bed]');
  }
  if (audioInputs.length === 1) {
    filters.push(`${audioInputs[0]}anull[aout]`);
  } else {
    filters.push(`${audioInputs.join('')}amix=inputs=${audioInputs.length}:duration=longest:dropout_transition=2:normalize=0[aout]`);
  }

  return [
    '-y',
    ...inputArgs,
    '-filter_complex', filters.join(';'),
    '-map', '[vout]',
    '-map', '[aout]',
    '-t', durationText,
    '-r', String(fps),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '48000',
    '-ac', '2',
    '-movflags', '+faststart',
    outputPath,
  ];
};

const buildFfmpegArgs = ({ projectDir, plan, narrationPath, subtitlePath, logoPath, musicPath, outputPath }) => {
  if (plan.sourceVideo) {
    return buildShortFfmpegArgs({ projectDir, plan, narrationPath, subtitlePath, logoPath, musicPath, outputPath });
  }
  const inputArgs = [];
  const filters = [];
  for (const [index, scene] of plan.scenes.entries()) {
    const imagePath = resolve(projectDir, scene.image);
    const duration = Number(scene.duration);
    inputArgs.push('-loop', '1', '-t', duration.toFixed(3), '-i', imagePath);
    const fadeOutStart = Math.max(0, duration - 0.18).toFixed(3);
    filters.push(
      `[${index}:v]${motionFilter({
        motion: scene.motion,
        duration,
        fps: plan.fps,
        width: plan.width,
        height: plan.height,
      })},trim=duration=${duration.toFixed(3)},setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.12,fade=t=out:st=${fadeOutStart}:d=0.18,format=yuv420p[v${index}]`,
    );
  }

  const videoInputs = plan.scenes.map((_, index) => `[v${index}]`).join('');
  filters.push(`${videoInputs}concat=n=${plan.scenes.length}:v=1:a=0[base]`);
  const totalDuration = plan.scenes.reduce((sum, scene) => sum + Number(scene.duration), 0);
  const logoIndex = plan.scenes.length + 1;
  const logoStart = Math.max(0, totalDuration - 1.8).toFixed(3);
  filters.push(`[${logoIndex}:v]scale=150:-1,format=rgba,colorchannelmixer=aa=0.94[logo]`);
  filters.push(`[base][logo]overlay=(W-w)/2:150:enable='gte(t,${logoStart})'[branded]`);
  filters.push(
    `[branded]subtitles='${escapeFilterPath(subtitlePath)}':force_style='FontName=Arial,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H90000000,BorderStyle=1,Outline=3,Shadow=0,Alignment=2,MarginV=185'[vout]`,
  );

  const audioIndex = plan.scenes.length;
  const musicIndex = plan.scenes.length + 2;
  if (musicPath) {
    filters.push(`[${audioIndex}:a]volume=1.0[voice]`);
    filters.push(`[${musicIndex}:a]volume=0.10[bed]`);
    filters.push('[voice][bed]amix=inputs=2:duration=longest:dropout_transition=2,apad[aout]');
  }
  const musicInputArgs = musicPath ? ['-stream_loop', '-1', '-i', musicPath] : [];
  const audioMapArgs = musicPath
    ? ['-map', '[aout]']
    : ['-map', `${audioIndex}:a:0`, '-af', 'apad'];
  return [
    '-y',
    ...inputArgs,
    '-i', narrationPath,
    '-loop', '1', '-i', logoPath,
    ...musicInputArgs,
    '-filter_complex', filters.join(';'),
    '-map', '[vout]',
    ...audioMapArgs,
    '-t', totalDuration.toFixed(3),
    '-r', String(plan.fps),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '48000',
    '-movflags', '+faststart',
    outputPath,
  ];
};

if (args.includes('--self-test')) {
  const samplePlan = {
    width: 1080,
    height: 1920,
    fps: 30,
    scenes: [
      { image: 'images/scene-01.png', duration: 5, motion: 'slow_push_in' },
      { image: 'images/scene-02.png', duration: 5, motion: 'pan_right' },
    ],
  };
  const built = buildFfmpegArgs({
    projectDir: '/tmp/create-video-self-test',
    plan: samplePlan,
    narrationPath: '/tmp/create-video-self-test/audio/narration.aiff',
    subtitlePath: '/tmp/create-video-self-test/06-altyazilar.srt',
    logoPath: '/tmp/create-video-self-test/logo.png',
    musicPath: null,
    outputPath: '/tmp/create-video-self-test/final/reel.mp4',
  });
  if (!built.includes('-filter_complex') || !built.some((value) => value.includes('concat=n=2'))) {
    throw new Error('FFmpeg komut oluşturma öz testi başarısız.');
  }
  const withMusic = buildFfmpegArgs({
    projectDir: '/tmp/create-video-self-test',
    plan: samplePlan,
    narrationPath: '/tmp/create-video-self-test/audio/narration.aiff',
    subtitlePath: '/tmp/create-video-self-test/06-altyazilar.srt',
    logoPath: '/tmp/create-video-self-test/logo.png',
    musicPath: '/tmp/create-video-self-test/audio/music.wav',
    outputPath: '/tmp/create-video-self-test/final/reel.mp4',
  });
  if (!withMusic.some((value) => value.includes('amix=inputs=2')) || !withMusic.includes('[aout]')) {
    throw new Error('Müzikli FFmpeg komut oluşturma öz testi başarısız.');
  }
  const shortBuilt = buildFfmpegArgs({
    projectDir: '/tmp/create-video-self-test',
    plan: {
      profile: 'short-rerender',
      width: 1080,
      height: 1920,
      fps: 30,
      durationSeconds: 18,
      sourceVideo: 'images/seedance-clean.mp4',
      burnInSubtitles: '06-altyazilar.ass',
      ambientSourceAudio: true,
      ambientVolume: 0.12,
      voiceoverVolume: 1,
    },
    narrationPath: '/tmp/create-video-self-test/audio/narration-fit.mp3',
    subtitlePath: '/tmp/create-video-self-test/06-altyazilar.srt',
    logoPath: '/tmp/create-video-self-test/logo.png',
    musicPath: null,
    outputPath: '/tmp/create-video-self-test/final/reel.mp4',
  });
  if (!shortBuilt.some((value) => value.includes('tpad=stop_mode=clone')) || !shortBuilt.some((value) => value.includes('06-altyazilar.ass'))) {
    throw new Error('Kısa sourceVideo/ASS komut oluşturma öz testi başarısız.');
  }
  console.log(JSON.stringify({
    ok: true,
    tests: ['story-scenes', 'story-music', 'short-source-video-ass'],
    argumentCount: built.length,
    musicArgumentCount: withMusic.length,
    shortArgumentCount: shortBuilt.length,
  }, null, 2));
  process.exit(0);
}

const projectDir = resolve(valueOf('--project') || '');
const projectPath = resolve(projectDir, 'project.json');
const renderPlanPath = resolve(projectDir, '07-render-plani.json');
if (!existsSync(projectPath)) throw new Error(`project.json bulunamadı: ${projectPath}`);
if (!existsSync(renderPlanPath)) throw new Error(`Render planı bulunamadı: ${renderPlanPath}`);

const validation = spawnSync(process.execPath, [
  resolve(scriptDir, 'validate-video-package.mjs'),
  '--project', projectDir,
  '--phase', 'render',
], { encoding: 'utf8' });
if (validation.status !== 0) {
  process.stderr.write(validation.stdout || '');
  process.stderr.write(validation.stderr || '');
  throw new Error('Render öncesi paket doğrulaması başarısız.');
}

const project = JSON.parse(readFileSync(projectPath, 'utf8'));
const plan = JSON.parse(readFileSync(renderPlanPath, 'utf8'));
const narrationPath = resolve(projectDir, plan.voiceover || project.files?.narration || 'audio/narration.aiff');
const subtitlePath = resolve(projectDir, plan.subtitles || project.files?.subtitles || '06-altyazilar.srt');
const logoPath = resolve(repoRoot, 'assets/spark_logo.png');
const musicPath = plan.music ? resolve(projectDir, plan.music) : null;
const outputPath = resolve(projectDir, plan.output || project.files?.finalVideo || 'final/reel.mp4');
const coverPath = resolve(projectDir, project.files?.cover || 'final/cover.jpg');
mkdirSync(dirname(outputPath), { recursive: true });

if (!existsSync(logoPath)) throw new Error(`Spark logosu bulunamadı: ${logoPath}`);
if (musicPath && !existsSync(musicPath)) throw new Error(`Müzik dosyası bulunamadı: ${musicPath}`);
if (plan.sourceVideo && !existsSync(resolve(projectDir, plan.sourceVideo))) {
  throw new Error(`Kısa render kaynak videosu bulunamadı: ${plan.sourceVideo}`);
}
if (plan.burnInSubtitles && !existsSync(resolve(projectDir, plan.burnInSubtitles))) {
  throw new Error(`ASS altyazı dosyası bulunamadı: ${plan.burnInSubtitles}`);
}
const ffmpegArgs = buildFfmpegArgs({ projectDir, plan, narrationPath, subtitlePath, logoPath, musicPath, outputPath });
if (args.includes('--dry-run')) {
  console.log(JSON.stringify({ executable: ffmpegExecutable, arguments: ffmpegArgs, outputPath, coverPath }, null, 2));
  process.exit(0);
}

const ffmpegProbe = spawnSync(ffmpegExecutable, ['-version'], { encoding: 'utf8' });
if (ffmpegProbe.error?.code === 'ENOENT') {
  throw new Error(`ffmpeg çalıştırıcısı bulunamadı: ${ffmpegExecutable}. Sistem paketi kurmadan önce kullanıcıdan izin alın.`);
}
if (ffmpegProbe.status !== 0) throw new Error('ffmpeg çalıştırılamadı.');

const render = spawnSync(ffmpegExecutable, ffmpegArgs, { stdio: 'inherit' });
if (render.status !== 0) throw new Error(`Video render başarısız; ffmpeg çıkış kodu: ${render.status}`);

const cover = spawnSync(ffmpegExecutable, [
  '-y',
  '-ss', String(Number(plan.coverAtSeconds) || 0.5),
  '-i', outputPath,
  '-frames:v', '1',
  '-q:v', '2',
  coverPath,
], { stdio: 'inherit' });
if (cover.status !== 0) throw new Error(`Kapak karesi üretilemedi; ffmpeg çıkış kodu: ${cover.status}`);

console.log(JSON.stringify({
  ok: true,
  projectDir,
  video: outputPath,
  cover: coverPath,
  status: 'Render tamamlandı; final doğrulama ve TAMAMLANDI geçişi bekleniyor.',
}, null, 2));
