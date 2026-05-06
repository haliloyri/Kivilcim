---
name: db-migration
description: 'Safely modify the SQLite database schema or seed data in the Spark app. Use when the user says veritabanı değiştir, tablo ekle, schema güncelle, db migration, add table, modify database, seed data, or similar.'
argument-hint: 'Describe the schema change (e.g. add bookmarks table, add column to stories)'
user-invocable: true
---

# Database Migration

Use this skill to safely modify the SQLite database schema or seed data.

## When to Use

- Adding a new table or column
- Modifying seed data or default values
- The user says `veritabanı değiştir`, `tablo ekle`, `schema güncelle`, `db migration`

## Database Architecture

- **File**: `src/db/db.js`
- **Engine**: `expo-sqlite` (synchronous API via `openDatabaseSync`)
- **DB Name**: `kivilcim.db`
- **Version Control**: `DB_VERSION` constant — bump to force full DB reset on next launch
- **Readiness Guards**: `waitForDb()` and `waitForData()` — must be respected by consumers

## Procedure

1. **Read current schema** in `src/db/db.js` to understand existing tables and columns.
2. **Plan the migration**:
   - For **additive changes** (new table, new column): Use `ALTER TABLE` or `CREATE TABLE IF NOT EXISTS`.
   - For **breaking changes** (rename column, change types): Bump `DB_VERSION` to force reset.
3. **Implement the change** in the appropriate function in `db.js`.
4. **Update context providers** if new data flows are needed (`StoriesContext.js`, `UserDataContext.js`).
5. **Test boot flow** — ensure `App.js` → `db.js` initialization still succeeds.
6. **Run prebuild**: `npx expo prebuild --platform android`

## Safety Rules

- **NEVER** remove or rename existing columns without bumping `DB_VERSION`.
- **ALWAYS** use `IF NOT EXISTS` for new tables.
- **ALWAYS** wrap migrations in try/catch — a failed migration must not crash the app.
- **Preserve** `waitForDb` / `waitForData` guard patterns.
- **Test** that the app boots successfully after changes.

## Version Bump Pattern

If the change requires a clean DB reset:

```javascript
// In src/db/db.js — increment this number
const DB_VERSION = 12; // was 11
```

This deletes the old DB and copies the fresh one from assets on next launch.

## Example: Adding a New Table

```javascript
// In the initialization function:
db.execSync(`
  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (story_id) REFERENCES stories(id)
  )
`);
```

## Checklist

- [ ] Schema change implemented in `db.js`
- [ ] `DB_VERSION` bumped if breaking change
- [ ] `waitForDb`/`waitForData` guards preserved
- [ ] Context providers updated if needed
- [ ] App boots successfully
- [ ] `npx expo prebuild --platform android` passes
