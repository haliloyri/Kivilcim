/**
 * audio-url — Supabase Edge Function
 *
 * Returns a short-lived presigned GET URL for a story narration stored in the
 * private Cloudflare R2 bucket. The app streams the audio straight from R2.
 *
 * Object key: `<story_id>-<lang>-<narrator>.mp3` at the bucket root
 * (e.g. `1239-en-tomweiss.mp3`). The narrator part varies, so the function
 * lists by the `<story_id>-<lang>-` prefix and picks the first mp3.
 *
 * Request  (POST, JSON): { "storyId": 1059, "lang": "en" }
 * Response (200):        { "available": true, "url": "...", "narrator": "tomweiss", "expiresAt": 1730000000000 }
 *                        { "available": false }
 *
 * Deploy:
 *   supabase functions deploy audio-url
 *
 * Environment variables (Supabase Dashboard → Edge Functions → Secrets):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */

import { AwsClient } from 'npm:aws4fetch@1.0.20';

const SUPPORTED_LANGS = new Set(['tr', 'en', 'es', 'de']);
const URL_TTL_SECONDS = 3600;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

const readEnv = () => {
  const accountId = Deno.env.get('R2_ACCOUNT_ID');
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
  const bucket = Deno.env.get('R2_BUCKET');
  const missing = Object.entries({
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_BUCKET: bucket,
  })
    .filter(([, value]) => !value)
    .map(([name]) => name);
  return { accountId, accessKeyId, secretAccessKey, bucket, missing };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const env = readEnv();
  if (env.missing.length) {
    console.error('[audio-url] missing secrets:', env.missing.join(', '));
    return json({ error: 'server_not_configured', missing: env.missing }, 500);
  }

  let payload: { storyId?: unknown; lang?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const storyId = Number(payload.storyId);
  const lang = String(payload.lang ?? '').toLowerCase();
  if (!Number.isSafeInteger(storyId) || storyId <= 0) return json({ error: 'invalid_story_id' }, 400);
  if (!SUPPORTED_LANGS.has(lang)) return json({ error: 'invalid_lang' }, 400);

  const r2 = new AwsClient({
    accessKeyId: env.accessKeyId!,
    secretAccessKey: env.secretAccessKey!,
    service: 's3',
    region: 'auto',
  });

  const bucketUrl = `https://${env.accountId}.r2.cloudflarestorage.com/${env.bucket}`;
  const prefix = `${storyId}-${lang}-`;

  // List by prefix so the listen button can be disabled when no narration exists.
  const listUrl = new URL(bucketUrl);
  listUrl.searchParams.set('list-type', '2');
  listUrl.searchParams.set('prefix', prefix);
  listUrl.searchParams.set('max-keys', '20');
  const list = await r2.fetch(listUrl.toString());
  if (!list.ok) {
    console.error('[audio-url] R2 list failed:', list.status, prefix);
    return json({ error: 'storage_error', status: list.status }, 502);
  }

  const xml = await list.text();
  const key = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)]
    .map((match) => match[1])
    .filter((name) => name.toLowerCase().endsWith('.mp3'))
    .sort()[0];
  if (!key) return json({ available: false });

  const objectUrl = new URL(`${bucketUrl}/${encodeURIComponent(key)}`);
  const narrator = key.slice(prefix.length, -'.mp3'.length);

  const signUrl = new URL(objectUrl);
  signUrl.searchParams.set('X-Amz-Expires', String(URL_TTL_SECONDS));
  const signed = await r2.sign(new Request(signUrl, { method: 'GET' }), { aws: { signQuery: true } });

  return json({
    available: true,
    url: signed.url,
    narrator,
    expiresAt: Date.now() + URL_TTL_SECONDS * 1000,
  });
});
