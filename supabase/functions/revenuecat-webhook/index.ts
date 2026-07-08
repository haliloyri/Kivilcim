// RevenueCat → Supabase webhook.
//
// Makes Premium status server-authoritative: RevenueCat calls this function
// on every entitlement-relevant event and we write the result into
// `public.profiles.is_premium`. The client's local AsyncStorage premium flag
// becomes a cache only (see ToServerTasks.md §5/§6) — this function is the
// source of truth.
//
// Docs: https://www.revenuecat.com/docs/integrations/webhooks
//
// ── KNOWN GAP (must be wired up before this is fully correct) ───────────────
// `event.app_user_id` is whatever RevenueCat thinks the user's app_user_id
// is. Today src/services/billing.js calls:
//   Purchases.configure({ apiKey: PLATFORM_API_KEY })
// with NO `appUserID`, so RevenueCat assigns its OWN random anonymous id.
// That id will NOT match `auth.uid()` / `profiles.id`, so the `eq('id',
// appUserId)` lookup below will simply miss and no profile will be updated.
// Someone needs to change billing.js's `Purchases.configure` call to pass
// `appUserID: <supabase auth.uid()>` (the app already has a stable
// auth.uid() via ensureDeviceSession() per ToServerTasks.md §3b) so RevenueCat's
// app_user_id lines up with profiles.id. Out of scope for this function —
// documented here so it isn't lost.
// ──────────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Event types that grant/confirm premium access.
const GRANT_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE']);

// Event types that definitely end premium access.
const REVOKE_EVENTS = new Set(['EXPIRATION']);

// CANCELLATION means the user turned off auto-renew, NOT that they lost
// access immediately — RevenueCat still sends CANCELLATION the moment the
// user cancels, while the entitlement typically remains active until the
// current period's expiration. So we only revoke on CANCELLATION if the
// event's expiration_at_ms is already in the past; otherwise we leave
// is_premium untouched (the EXPIRATION event will arrive later to revoke it).
//
// BILLING_ISSUE: a renewal payment failed. RevenueCat/the stores retry
// automatically for a grace period (commonly up to ~16 days depending on
// store config) before actually expiring the subscription. We deliberately
// do NOT revoke premium on BILLING_ISSUE alone — that would punish users for
// a transient card decline that often self-resolves on retry. If the grace
// period runs out, RevenueCat sends EXPIRATION, which we do handle as a
// revoke. This is a conscious "stay conservative" choice, not an oversight.
const NO_OP_EVENTS = new Set(['BILLING_ISSUE']);

interface RevenueCatEvent {
  type: string;
  app_user_id: string;
  expiration_at_ms?: number | null;
  [key: string]: unknown;
}

interface RevenueCatWebhookBody {
  event: RevenueCatEvent;
  api_version?: string;
}

function unauthorized(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function ok(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ── Auth: RevenueCat sends a custom "Authorization: Bearer <secret>"
  // header configured in the RevenueCat dashboard (Project Settings →
  // Integrations → Webhooks). This is NOT a Supabase JWT — the function is
  // deployed with verify_jwt: false and does its own check here.
  const expectedSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  const authHeader = req.headers.get('Authorization') ?? '';
  const providedSecret = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!expectedSecret) {
    console.error('[revenuecat-webhook] REVENUECAT_WEBHOOK_SECRET is not set');
    return unauthorized('webhook not configured');
  }
  if (!providedSecret || providedSecret !== expectedSecret) {
    return unauthorized('invalid or missing Authorization header');
  }

  // ── Parse body
  let body: RevenueCatWebhookBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const event = body?.event;
  if (!event?.type || !event?.app_user_id) {
    // Malformed payload — ack with 200 so RevenueCat doesn't retry forever,
    // but log it since it likely means their payload shape changed.
    console.warn('[revenuecat-webhook] missing event.type/app_user_id', JSON.stringify(body));
    return ok({ skipped: true, reason: 'missing event.type or app_user_id' });
  }

  const { type, app_user_id: appUserId } = event;

  // Decide the new is_premium value for this event. `undefined` means
  // "no change" (we still ack 200, just skip the DB write).
  let nextIsPremium: boolean | undefined;

  if (GRANT_EVENTS.has(type)) {
    nextIsPremium = true;
  } else if (REVOKE_EVENTS.has(type)) {
    nextIsPremium = false;
  } else if (type === 'CANCELLATION') {
    const expirationMs = typeof event.expiration_at_ms === 'number' ? event.expiration_at_ms : null;
    if (expirationMs !== null && expirationMs <= Date.now()) {
      // Auto-renew was off AND the period has actually lapsed -> revoke now.
      nextIsPremium = false;
    } else {
      // Auto-renew off but still within the paid period, or no expiration
      // info to judge by -> leave premium as-is; EXPIRATION will follow
      // when the period truly ends.
      nextIsPremium = undefined;
    }
  } else if (NO_OP_EVENTS.has(type)) {
    nextIsPremium = undefined;
  } else {
    // Unhandled event type (e.g. TRANSFER, SUBSCRIPTION_PAUSED, TEST, etc.)
    // — ack without changing anything.
    console.log(`[revenuecat-webhook] unhandled event type "${type}", no-op`);
    nextIsPremium = undefined;
  }

  if (nextIsPremium === undefined) {
    return ok({ skipped: true, type, app_user_id: appUserId });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Confirm a profile exists before writing — we never want to create a
  // bogus profile row keyed by a RevenueCat app_user_id that doesn't
  // correspond to a real Supabase auth user.
  const { data: existingProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', appUserId)
    .maybeSingle();

  if (lookupError) {
    console.error('[revenuecat-webhook] profile lookup failed:', lookupError.message);
    // Still 200 — RevenueCat retries on non-2xx and a transient DB blip
    // shouldn't cause a retry storm. Logged for follow-up instead.
    return ok({ error: 'profile lookup failed', app_user_id: appUserId });
  }

  if (!existingProfile) {
    console.warn(
      `[revenuecat-webhook] no profiles row for app_user_id="${appUserId}" (type=${type}); skipping. ` +
      'This is expected until billing.js passes appUserID: <auth.uid()> to Purchases.configure — see header comment.',
    );
    return ok({ skipped: true, reason: 'no matching profile', app_user_id: appUserId });
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ is_premium: nextIsPremium, updated_at: new Date().toISOString() })
    .eq('id', appUserId);

  if (updateError) {
    console.error('[revenuecat-webhook] profile update failed:', updateError.message);
    return ok({ error: 'profile update failed', app_user_id: appUserId });
  }

  return ok({ updated: true, app_user_id: appUserId, type, is_premium: nextIsPremium });
});
