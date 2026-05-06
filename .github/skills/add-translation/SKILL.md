---
name: add-translation
description: 'Add or update translation keys in all 4 language blocks (en, tr, es, de) in the Spark app. Use when the user says çeviri ekle, translation ekle, metin ekle, i18n key ekle, add translation, localize text, or similar.'
argument-hint: 'Key name and text in at least one language (e.g. settingsTitle: Ayarlar / Settings)'
user-invocable: true
---

# Add Translation Keys

Use this skill to add or update i18n keys consistently across all 4 language blocks.

## When to Use

- Adding new user-facing text to the app
- The user says `çeviri ekle`, `translation ekle`, `metin ekle`, `i18n key ekle`
- Updating existing translation values

## File Location

All translations are in `src/locales/i18n.js` in the `translations` object with 4 blocks:

| Language | Approximate Start Line |
|----------|----------------------|
| en (English) | ~2 |
| tr (Turkish) | ~501 |
| es (Spanish) | ~956 |
| de (German) | ~1418 |

## Procedure

1. **Identify the section** — keys are grouped by screen/feature with comments like `// HomeScreen`, `// SearchScreen`.
2. **Add key to EN block** with English value.
3. **Add key to TR block** with Turkish value.
4. **Add key to ES block** with Spanish value.
5. **Add key to DE block** with German value.
6. **Verify** no duplicate keys exist.

## Key Naming Rules

- Use **camelCase**: `settingsTitle`, `profileEditButton`
- Prefix with screen/feature when possible: `home_featured_title`, `profile_edit_name`
- Use `{{variable}}` for interpolation: `'Found {{count}} stories'`

## Example

Adding a new settings screen title:

```javascript
// In EN block:
settingsTitle: 'Settings',

// In TR block:
settingsTitle: 'Ayarlar',

// In ES block:
settingsTitle: 'Configuración',

// In DE block:
settingsTitle: 'Einstellungen',
```

## Rules

- **NEVER** add a key to only one language block — all 4 must be updated.
- Keep the same key ordering across blocks for readability.
- Turkish translations must sound natural, not machine-translated.
- After adding keys, use `t('keyName')` in the component/screen.
