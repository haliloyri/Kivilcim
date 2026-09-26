You write a single micro-learning story in the P1 ("podcast") format, in
{LANG_NAME}, from the content brief below. The brief is the single source of
truth for facts, names, dates and numbers — never invent anything beyond it.
Write as if explaining the story on a podcast: tell it in full first, then
draw out what it teaches, then turn to the reader.

Address the reader as {ADDRESS_FORM}. Write natural {LANG_NAME} prose a
native speaker would write — never a translation-sounding register. Avoid
these phrases (and anything with the same flavor): {BANNED_PHRASES}.

## Format (exact markup)

Section tags, alone on their own line, in this exact order:
`[[open]]` `[[story]]` `[[lessons]]` `[[reflect]]` `[[use]]` `[[pocket]]`

Block markers:
- `$$**Title.** body$$` — a lesson card. [[lessons]] needs exactly 2–3 of
  these, each starting with a **bold** title.
- `- text` — a bullet (used inside [[reflect]]).
- `> text` — a quoted line / dialogue, inside [[story]].
- `%%context:<slug> | Situation :: "line to say"%%` — a use-case card.
  [[use]] needs EXACTLY 3 of these. `<slug>` must be one of: meeting,
  oneonone, family, social, self — using at least 2 distinct values across
  the 3 cards. Base these on `use_cases` in the brief.
- `@@sentence@@` — the single pocket/takeaway line, inside [[pocket]]. One
  only, ≤ 20 words.
- `&&question&&` — the single closing reflection question, inside
  [[reflect]], at the very end of that section. One only.
- `##sentence##` — at most one highlighted moment, inside [[story]].
- `~~before :: after~~` — an optional before/after contrast (rarely needed).

Inline: `**bold**` (sparingly) and `*italic*` (book titles, an inner voice).

## Section lengths ({LANG_NAME})
- [[open]]: {LEN_OPEN} words — hook the reader, do not summarize the story.
- [[story]]: {LEN_STORY} words — tell it fully and faithfully; a short
  anecdote told faithfully beats padding.
- [[lessons]]: {LEN_LESSONS} words across 2–3 cards, each tied to a concrete
  beat of the story (not generic advice).
- [[reflect]]: {LEN_REFLECT} words — 2–5 bullets that make the reader apply
  the story to their own life, then the closing `&&question&&`.
- [[use]]: {LEN_USE} words across exactly 3 `%%...%%` cards.
- [[pocket]]: ≤ 20 words, one `@@...@@` line.

Never repeat a paragraph. Never use a sentence that doesn't refer to this
specific story (no generic filler like "this isn't a mechanical recipe").

## Also write the "Use in Conversation" variants

From the SAME brief, also write four short, independent strings for a
separate screen where the reader picks a ready-to-say line. They must not
be near-verbatim copies of the [[pocket]] or [[reflect]] sentences — same
underlying story, different framing:
- `punchline`: one sharp sentence, the story's sharpest takeaway.
- `thirty_sec`: a self-contained ~50–90 word retelling (works for someone
  who has not read the full story).
- `question`: one conversation-starter question (may echo the brief's
  `reflect_final` idea, worded freshly).
- `key_contrast`: a 2–4 word before/after label (e.g. "Doubt and proof").

## Output format

Output exactly two fenced blocks, in this order, and nothing else:

```story
[[open]]
...full P1 story text...
```

```variants
{"punchline": "...", "thirty_sec": "...", "question": "...", "key_contrast": "..."}
```
