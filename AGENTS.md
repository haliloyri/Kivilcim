# AGENTS.md

## Purpose
This file helps AI coding agents become productive fast in this repository.

- App type: React Native + Expo mobile app (Spark / Kivilcim)
- Main goal: implement safe UI/data changes without breaking Android/iOS builds

## First Commands To Run
From repo root:

```bash
npm install
npm start
```

Common scripts from package.json:

```bash
npm run android
npm run ios
npm run web
npm run build:apk
npm run build:apk:dev
npm run build:apk:local
npm run screenshots
npm run merge
```

There are currently no dedicated lint/test scripts in package.json.

## Source Map
- App entry and providers: [App.js](App.js)
- Navigation and screen routing: [src/navigation/AppNavigator.js](src/navigation/AppNavigator.js)
- State providers: [src/context](src/context)
- SQLite/data layer: [src/db/db.js](src/db/db.js)
- Localization: [src/locales/i18n.js](src/locales/i18n.js)
- Analytics event catalog: [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md)
- Android build/run guide: [ANDROID_APK_REHBERI.md](ANDROID_APK_REHBERI.md)

## Required Coding Conventions
1. Use Context hooks for shared state.
- Prefer `useTheme()`, `useStories()`, and `useUserData()` patterns used in existing screens/components.

2. Do not hardcode user-facing text.
- Add copy via `translations` in [src/locales/i18n.js](src/locales/i18n.js) and consume with `t(...)`.

3. Respect DB readiness guards.
- For async read flows that touch stories/user tables, ensure DB/data readiness patterns are preserved (`waitForDb`, `waitForData`) in [src/db/db.js](src/db/db.js).

4. Keep theme compatibility.
- New UI should use theme tokens from context/theme files instead of fixed colors when possible.

5. Keep analytics events consistent.
- Reuse existing event names and payload shapes documented in [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md).

## Android Build Pitfalls (Project-Specific)
Before spending time debugging code, verify build environment with [ANDROID_APK_REHBERI.md](ANDROID_APK_REHBERI.md).

High-impact checks:
- Use JDK 17 for local Gradle builds.
- Local release APK command: `cd android && .\\gradlew.bat assembleRelease --no-daemon`
- If SDK location fails, confirm `android/local.properties` uses the correct `sdk.dir`.
- Do not commit machine-specific JVM settings (for example `org.gradle.java.home`) that can break EAS/Linux builders.

## Safe Change Workflow For Agents
1. Read relevant docs first (link above), then inspect the nearest existing implementation.
2. Keep edits minimal and localized.
3. Run the smallest useful command to validate your change (`npm start`, targeted build script, or Android gradle command when needed).
4. If changing DB schema/seed behavior, verify boot flow still succeeds via [App.js](App.js) + [src/db/db.js](src/db/db.js).
5. If changing copy/locale behavior, validate both Turkish and English keys are present.

## Available Agents
Custom agents in `.github/agents/`:

| Agent | Purpose |
|-------|---------|
| **Spark Bugfix Specialist** | Fix TODO_BUGS items: UI polish, localization, state/persistence, Android behavior |
| **Explore** | Fast read-only codebase exploration and Q&A |
| **RN UI Developer** | Create/modify screens, components, navigation with proper patterns |
| **i18n Manager** | Add/update/audit translation keys across all 4 languages (en, tr, es, de) |
| **Kıvılcım Phase Runner** | Execute Kıvılcım Yolu phases 0–10 in a persistent implement-test-checkpoint loop |

## Available Skills
Custom skills in `.github/skills/`:

| Skill | Trigger |
|-------|---------|
| **build-apk** | `apk build et`, `release apk al`, `android build yap` |
| **push-to-main** | `main'e push et`, `github'a gönder` |
| **quick-main-checkin** | `checkin yap`, `hızlı commit`, `quick commit` |
| **add-screen** | `yeni ekran ekle`, `ekran oluştur`, `create new screen` |
| **add-component** | `bileşen ekle`, `component oluştur`, `create component` |
| **add-translation** | `çeviri ekle`, `translation ekle`, `i18n key ekle` |
| **run-android** | `android çalıştır`, `android aç`, `run android` |
| **run-ios** | `ios çalıştır`, `simulatörde aç`, `run ios` |
| **expo-prebuild** | `prebuild yap`, `native güncelle`, `expo prebuild` |
| **db-migration** | `veritabanı değiştir`, `tablo ekle`, `schema güncelle` |
| **proofread-stories** | `hikayeleri kontrol et`, `dil dil kontrol et`, `parça parça kontrol et`, `yazım yanlışı var mı`, `onaylı düzeltmeleri uygula` |

## Story Content Pipeline (P1 rewrite) — rules for every agent
The 770 book stories are being rewritten into the "P1" podcast-style format.
Plan: [HIKAYE_DONUSUM_PLANI.md](HIKAYE_DONUSUM_PLANI.md) · conversation cards:
[SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md](SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md) ·
automated (Anthropic Batch) pipeline: [batch/README.md](batch/README.md).

**Where things live**
- Source per story: `staging/p1/manifest.json` (one entry per `story_id`; read only the entries you need — the file is ~1.3 MB).
- Official outputs: `staging/p1/brief/<id>.json`, `staging/p1/<lang>/<id>.md`, `staging/p1/<lang>/<id>.variants.json`.
- Progress report (free, no API): `node batch/07-status.mjs en --list`.

**Hard rules**
1. **Never create, edit or overwrite anything in `staging/p1/brief/` or `staging/p1/<lang>/`** unless the user explicitly asks. These are the production outputs of the Batch pipeline (Claude Opus), which skips any id whose file already exists.
2. Never write to `assets/kivilcim.db` and never run `scripts/p1/apply-to-db.mjs` or anything that touches Supabase — the user applies content to the DB by hand after review.
3. Agent-made stories go to a **separate folder**: `staging/p1-<agent>/` (e.g. `staging/p1-codex/brief/`, `staging/p1-codex/en/`).
4. Use cards in `[[use]]` MUST start with `%%context:<meeting|oneonone|family|social|self> | ` — the app parser (`src/utils/storyMarkup.js`) needs the literal `context:` prefix.
5. Validate before reporting: `node scripts/p1/validate-dir.mjs en staging/p1-codex/en <ids>` must print `N/N passed`.

**Producing a story by hand (same inputs the Batch pipeline uses)**
1. `node batch/08-export-agent-inputs.mjs en <ids>` → writes `staging/p1-codex/inputs/`:
   `brief-system.md`, `story-system.en.md`, `<id>.brief-user.md`.
2. Brief step: follow `brief-system.md` as your system instructions, `<id>.brief-user.md` as the request → save the JSON object (no code fences) to `staging/p1-codex/brief/<id>.json`.
3. Story step: follow `story-system.en.md`, with your own brief as the input → save the ```story block body to `staging/p1-codex/en/<id>.md` and the ```variants block body to `staging/p1-codex/en/<id>.variants.json`.
4. Stay faithful to the BOOK: do not invent anecdotes, quotes, numbers or names the book does not contain; set `confidence` honestly in the brief.

## Prefer Links, Not Duplication
This file is intentionally concise. For detailed operational steps and troubleshooting:
- Android build details: [ANDROID_APK_REHBERI.md](ANDROID_APK_REHBERI.md)
- Product/feature context: [README.md](README.md)
- Analytics payload details: [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md)
