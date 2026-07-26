import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../../..');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260725000000_career_path_v1.sql'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8');
const queue = fs.readFileSync(path.join(root, 'src/services/offlineQueue.js'), 'utf8');

describe('career Supabase contract', () => {
  const requiredTables = ['user_career_events', 'user_career_state', 'user_career_nodes', 'user_legacy_badges'];
  const requiredRpc = ['record_career_event', 'upsert_career_state', 'upsert_career_migration_state', 'award_career_nodes', 'mark_career_node_seen', 'upsert_legacy_badges'];

  it('keeps the dated migration and bootstrap schema aligned on tables, RLS and RPCs', () => {
    requiredTables.forEach((name) => {
      expect(migration).toContain(`public.${name}`);
      expect(migration).toContain(`alter table public.${name} enable row level security`);
      expect(schema).toContain(`public.${name}`);
    });
    requiredRpc.forEach((name) => {
      expect(migration).toContain(`function public.${name}`);
      expect(schema).toContain(`function public.${name}`);
    });
  });

  it('enforces server-owned identity, idempotency and bounded event input', () => {
    expect(migration).toContain('unique (user_id, credit_key)');
    expect(migration).toContain('primary key (user_id, node_id)');
    expect(migration).toContain('auth.uid()');
    expect(migration).toContain("invalid_event_time");
    expect(migration).toContain("invalid_event_subtype");
    expect(migration).toContain("'revisit_24h'");
    expect(migration).toContain("'conversation_mark_used'");
    expect(migration).toContain("'practice_completed'");
    expect(migration).toContain('on conflict (user_id, credit_key) do nothing');
  });

  it('binds queued career writes to the session that created them', () => {
    expect(queue).toContain('ownerUserId: user.id');
    expect(queue).toContain('item.ownerUserId !== user.id');
    expect(queue).toContain('upsert_legacy_badges');
    expect(queue).toContain('upsert_career_migration_state');
  });
});
