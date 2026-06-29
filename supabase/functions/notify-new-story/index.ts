/**
 * notify-new-story — Supabase Edge Function
 *
 * Sends a push notification to all registered devices via the Expo Push API.
 * Call this from the Supabase dashboard or trigger it via a database webhook
 * when a new story is inserted into the `stories` table.
 *
 * Deploy:
 *   supabase functions deploy notify-new-story
 *
 * Invoke manually (curl):
 *   curl -X POST https://<project>.supabase.co/functions/v1/notify-new-story \
 *     -H "Authorization: Bearer <service_role_key>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"title": "Yeni hikayeler!", "body": "Bugün için 3 yeni hikaye eklendi.", "lang": "tr"}'
 *
 * Invoke via Database Webhook:
 *   Supabase Dashboard → Database → Webhooks → New webhook
 *   Table: stories | Event: INSERT | URL: .../functions/v1/notify-new-story
 *
 * Environment variables (set in Supabase Dashboard → Edge Functions → Secrets):
 *   SUPABASE_URL      — your project URL (auto-injected)
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (auto-injected in Edge Functions)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
}

interface NotifyPayload {
  title?: string;
  body?: string;
  lang?: string;        // filter by language, omit for all
  data?: Record<string, unknown>;
  storyId?: number;     // optional — deeplink into the specific story
}

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload: NotifyPayload = await req.json().catch(() => ({}));

    const title  = payload.title ?? 'Albor';
    const body   = payload.body  ?? 'Yeni hikayeler seni bekliyor!';
    const lang   = payload.lang  ?? null;
    const data   = payload.data  ?? {};
    const storyId = payload.storyId ?? null;

    // ── Fetch tokens from Supabase ─────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let query = supabase.from('push_tokens').select('token, platform, user_id');

    // Optionally filter by language (join through profiles)
    if (lang) {
      // Get user IDs matching the requested language
      const { data: profileIds } = await supabase
        .from('profiles')
        .select('id')
        .eq('lang', lang);

      const userIds = (profileIds ?? []).map((p: { id: string }) => p.id);
      if (userIds.length > 0) {
        query = query.in('user_id', userIds);
      }
    }

    const { data: tokens, error: dbError } = await query;

    if (dbError) {
      console.error('DB error fetching tokens:', dbError.message);
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No tokens found' }), { status: 200 });
    }

    // ── Build Expo push messages (max 100 per batch) ───────────────────────
    const messages: PushMessage[] = tokens
      .filter((t: { token: string }) => t.token?.startsWith('ExponentPushToken'))
      .map((t: { token: string; platform: string }) => ({
        to:        t.token,
        title,
        body,
        sound:     'default',
        channelId: 'default',       // Android channel
        data:      { ...data, storyId },
      }));

    if (messages.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No valid Expo tokens' }), { status: 200 });
    }

    // ── Send in batches of 100 (Expo limit) ───────────────────────────────
    const BATCH_SIZE = 100;
    const results = [];

    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const res = await fetch(EXPO_PUSH_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(batch),
      });
      const json = await res.json();
      results.push(json);
    }

    console.log(`Sent ${messages.length} push notifications`);

    return new Response(
      JSON.stringify({ sent: messages.length, results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
