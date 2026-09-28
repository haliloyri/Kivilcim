# Codex pilot — 3 stories, blind comparison with Claude Opus

Paste everything below the line into Codex (strongest GPT-5.5 model, high reasoning).
Compare afterwards:
- Codex:  `staging/p1-codex/brief/<id>.json`, `staging/p1-codex/en/<id>.md`, `<id>.variants.json`
- Opus:   `staging/p1/brief/<id>.json`,       `staging/p1/en/<id>.md`,       `<id>.variants.json`
- Stories: 1059 (British Cycling / 1% gains), 1060 (identity-based habits), 1061 (photography class: quantity vs quality) — all from *Atomic Habits*.

---

You are working in the Spark repo. First read `AGENTS.md`, especially the section
"Story Content Pipeline (P1 rewrite)". Follow its hard rules.

## Task
Rewrite 3 book stories — ids **1059, 1060, 1061** — into the P1 format, in **English**,
doing both steps the automated pipeline does: first a content brief, then the story
plus its "Use in Conversation" variants. This is a **blind quality comparison** with
another model, so:

- **Do NOT open, read, grep or diff** anything under `staging/p1/brief/` or `staging/p1/en/`
  (and no other `staging/p1/<lang>/` folder). Those hold the other model's answers for
  these same ids. Do not look at git history for them either.
- Use only the inputs listed below plus your own knowledge of the book.
- Write only inside `staging/p1-codex/`. Do not touch any other file, the DB, or Supabase.

## Inputs (already exported — identical to what the other model received)
- `staging/p1-codex/inputs/brief-system.md` — instructions for the brief step
- `staging/p1-codex/inputs/<id>.brief-user.md` — the request for each id (book + existing Turkish text)
- `staging/p1-codex/inputs/story-system.en.md` — instructions for the story step

Background you may read for context: `HIKAYE_DONUSUM_PLANI.md`,
`SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md`, `src/utils/storyMarkup.js` (how the app renders the markup).

## Steps, for each id
1. **Brief.** Treat `brief-system.md` as your instructions and `<id>.brief-user.md` as the
   request. The Turkish text is reference only — the brief must reflect what the BOOK
   actually says. Do not invent anecdotes, quotes, numbers, names or dates; if you are
   unsure a detail is in the book, leave it out and lower `confidence`.
   Save the JSON object (no code fences) to `staging/p1-codex/brief/<id>.json`.
2. **Story.** Treat `story-system.en.md` as your instructions and your brief as the input.
   Its output has a ```story block and a ```variants block:
   - save the story block body to `staging/p1-codex/en/<id>.md`
   - save the variants block body (valid JSON) to `staging/p1-codex/en/<id>.variants.json`
   Every use card must start with `%%context:<meeting|oneonone|family|social|self> | `.
   Write natural, warm, spoken English — as if a thoughtful podcast host is telling it.
3. **Validate** and fix until everything passes:
   `node scripts/p1/validate-dir.mjs en staging/p1-codex/en 1059 1060 1061`

## When done
Stop after these 3 stories (do not continue with other ids) and report:
- the validator output (must be `3/3 passed`)
- per story: word count, brief `confidence`, and any book detail you were unsure about
- total time spent
