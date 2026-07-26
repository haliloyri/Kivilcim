---
name: proofread-stories
description: Audit Spark story text language by language and in resumable chunks—Turkish, English, Spanish, then German—for spelling, capitalization, diacritic, and clear punctuation mistakes; persist progress and exact proposals in STORY_YAZIM_KONTROLU.md; and apply only explicitly approved items. Use when asked to check, proofread, spell-check, or correct stories, especially requests such as "hikayeleri kontrol et", "dil dil kontrol et", "parça parça kontrol et", "yazım yanlışı var mı", or "onayladığım düzeltmeleri uygula".
---

# Proofread Stories

Audit stories conservatively in small, persistent units: finish one language in ordered chunks before starting the next language. Keep a hard approval gate between finding an issue and changing story data.

## Non-negotiable approval gate

- During an audit, write or update only `STORY_YAZIM_KONTROLU.md` and temporary files under `/tmp`.
- Do not modify `assets/kivilcim.db`, batch data, generation scripts, or other app files before explicit user approval.
- Do not apply approved fixes while unfinished chunks remain in the requested audit scope. Finish that scope first so database changes do not invalidate the remaining review.
- Treat an unqualified approval such as `onaylıyorum` as approval of every item whose status is `Bekliyor`. Treat an approval naming IDs as approval of only those IDs.
- If approval is ambiguous, ask which `YK-...` IDs are approved. Do not infer approval from silence, thanks, or a request to explain findings.
- Apply exactly the approved old-to-new replacements. Do not make additional nearby improvements during the apply phase.

## Scope

Use `assets/kivilcim.db` as the runtime catalog. Audit exactly `tr`, `en`, `es`, and `de` in:

- `story_translations`: `title`, `description`, `content`, `hook`
- `story_conversation_variants`: `punchline`, `thirty_sec`, `question`, `key_contrast`

Some fields intentionally mirror each other, especially `description`/`punchline` and `hook`/`question`. Report one human-facing issue when the same typo is mirrored, but list every database target that must be kept in sync.

Check spelling, word separation, capitalization, required diacritics, apostrophes, and unmistakable punctuation errors. Do not report stylistic preferences, translation choices, factual disputes, dialect variants, or optional rewrites as spelling errors. Be especially conservative with proper nouns, book titles, quotations, brands, loanwords, and intentional fragments.

Preserve the story markup tokens exactly: `##`, `~~`, `::`, `$$`, and `&&`. A correction may change text inside a marked span but must not add, remove, reorder, or unbalance the tokens.

Apply language-specific judgment:

- Turkish: preserve Turkish characters and proper-name suffix/apostrophe rules.
- English: accept consistent US or UK spelling; do not convert one variety merely by preference.
- Spanish: check accents, `ñ`, and paired `¿?`/`¡!` where required.
- German: check noun capitalization, umlauts, `ß`, and compounds without stylistic overreach.

## Language-by-language chunk workflow

Use this default order and do not mix languages inside a chunk:

1. `tr`
2. `en`
3. `es`
4. `de`

Use 100 stories per chunk unless the user requests another size. Accept chunk sizes from 1 to 500. Finish every chunk of the current language before moving to the next. If the user requests only one language or one chunk, limit the scope accordingly.

For a new full audit:

1. Create `STORY_YAZIM_KONTROLU.md` from the report format below. Record the database SHA-256, language order, chunk size, and all language statuses as `Bekliyor`.
2. Export the first Turkish chunk:

   ```bash
   node .github/skills/proofread-stories/scripts/extract-story-texts.mjs --langs tr --after-story-id 0 --limit 100 --output /tmp/spark-story-proofread-tr.json
   ```

3. Check only the exported language and inspect every populated text field. Treat empty optional legacy fields as coverage notes, not spelling findings.
4. Compare mirrored fields so the same typo becomes one proposal with multiple targets.
5. For each high-confidence issue, search the repository for the exact erroneous phrase. Record a unique batch/generation source path when found; otherwise record `Bulunamadı`.
6. Append findings with the next unused stable ID (`YK-001`, `YK-002`, ...). Then append the completed chunk to `Parça günlüğü`, update language totals, and write `Sıradaki` using `metadata.batch.nextAfterStoryId`.
7. Persist the report before loading another chunk. Never rely on chat memory as the progress record.
8. If `metadata.batch.hasMore` is true, export the next chunk using the returned ID. For example:

   ```bash
   node .github/skills/proofread-stories/scripts/extract-story-texts.mjs --langs tr --after-story-id 1108 --limit 100 --output /tmp/spark-story-proofread-tr.json
   ```

9. When `hasMore` is false, mark the language `Tamamlandı`, set the next language to `Devam ediyor`, and restart `--after-story-id` at `0`.
10. After the last requested language, mark the audit `Tamamlandı`, report findings by language, and wait for approval.

For a resumed audit, read `STORY_YAZIM_KONTROLU.md` first. Continue from its `Sıradaki` language and story ID. Confirm the current database SHA-256 equals the report before exporting. If it differs, stop and start a fresh report; never combine findings from different database versions.

If the request covers the full catalog, continue chunk by chunk until all four languages finish. If the user explicitly asks for “one chunk,” finish exactly one chunk, persist progress, and stop.

## Report format

Use this structure so the review and approval remain unambiguous:

```markdown
# Dört Dilde Hikâye Yazım Kontrolü

- Denetim zamanı: YYYY-MM-DD HH:mm TZ
- Veri kaynağı: `assets/kivilcim.db`
- Veri tabanı SHA-256: `...`
- Diller: `tr`, `en`, `es`, `de`
- Dil sırası: `tr → en → es → de`
- Parça büyüklüğü: 100 hikâye
- Denetim durumu: Devam ediyor
- Sıradaki: `tr`, `after_story_id: LAST_ID`, parça 2
- İncelenen kayıt: CHUNK_SIZE / TOTAL dil kaydı
- Sonuç: FINDING_COUNT bekleyen öneri

## İlerleme

| Dil | Durum | Tamamlanan parça | İncelenen | Bulgu | Son story_id |
|---|---|---:|---:|---:|---:|
| tr | Devam ediyor | 1 | CHUNK_SIZE | FINDING_COUNT | LAST_ID |
| en | Bekliyor | 0 | 0 | 0 | — |
| es | Bekliyor | 0 | 0 | 0 | — |
| de | Bekliyor | 0 | 0 | 0 | — |

## Parça günlüğü

| Dil | Parça | Story ID aralığı | Kayıt | Bulgu | Durum |
|---|---:|---|---:|---:|---|
| tr | 1 | FIRST_ID–LAST_ID | CHUNK_SIZE | FINDING_COUNT | Tamamlandı |

## Kapsam sorunları

- Yok.

## Öneriler

### YK-001 — tr — story_id 123

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `scripts/example.mjs` veya `Bulunamadı`
- Mevcut: `kısa ve ayırt edici hatalı parça`
- Öneri: `kısa ve ayırt edici düzeltilmiş parça`
- Gerekçe: Kısa, nesnel açıklama.
- Güven: Yüksek

## Uygulama günlüğü

- Henüz değişiklik uygulanmadı; kullanıcı onayı bekleniyor.
```

Keep all proposals from every completed chunk under the same `## Öneriler` heading. If the completed audit has no issue, write `Yüksek güvenli yazım hatası bulunmadı.` Never invent a finding to populate the report. Never delete earlier chunk findings when appending later chunks.

## Apply approved fixes

Proceed only after explicit approval:

1. Re-read `STORY_YAZIM_KONTROLU.md` and resolve the approved IDs. Confirm every selected item is still `Bekliyor`.
2. Recompute the database SHA-256. If it differs from the report, stop and re-audit affected records before changing anything.
3. Build `/tmp/approved-story-fixes.json` from only the approved report items. Use the schema below. Include every mirrored database target needed for consistency.
4. Run a dry run and inspect its exact replacements:

   ```bash
   node .github/skills/proofread-stories/scripts/apply-approved-fixes.mjs --plan /tmp/approved-story-fixes.json
   ```

5. Update each uniquely identified batch/generation source with `apply_patch`. Preserve quote style, template literals, escaping, and story markup. If a source is not uniquely identifiable, leave source files unchanged and note that fact in the log.
6. Apply the already verified database plan:

   ```bash
   node .github/skills/proofread-stories/scripts/apply-approved-fixes.mjs --plan /tmp/approved-story-fixes.json --apply
   ```

7. Re-run the extractor for the affected story IDs. Confirm the old text is absent, the new text is present, mirrored fields agree, all four languages remain present, and markup token counts are unchanged.
8. Change only applied report items from `Durum: Bekliyor` to `Durum: Uygulandı`. Leave unapproved items pending. Append the backup path and verification result to `## Uygulama günlüğü`.
9. Summarize applied and still-pending IDs to the user.

Use this plan schema:

```json
{
  "databaseSha256": "hash copied from the report",
  "fixes": [
    {
      "id": "YK-001",
      "storyId": 123,
      "lang": "tr",
      "old": "hatalı parça",
      "new": "düzeltilmiş parça",
      "expectedOccurrences": 1,
      "targets": [
        { "table": "story_translations", "field": "content" }
      ]
    }
  ]
}
```

Do not use an empty `old` value, a whole-story replacement when a short unique excerpt is sufficient, wildcard matching, or a plan containing unapproved IDs.

## Included scripts

- `scripts/extract-story-texts.mjs`: read-only export, four-language coverage summary, and resumable `--after-story-id`/`--limit` chunking.
- `scripts/apply-approved-fixes.mjs`: exact-match dry run and guarded application to the SQLite catalog; it creates a timestamped backup under `/tmp` before writing.
