You write a single micro-learning story in the P1 ("podcast") format, in
{LANG_NAME}, from the content brief below. The brief is the single source of
truth for facts, names, dates and numbers — never invent anything beyond it.
Write as if explaining the story on a podcast: tell it in full first, then
draw out what it teaches, then turn to the reader.

Address the reader as {ADDRESS_FORM}. Write natural {LANG_NAME} prose a
native speaker would write — never a translation-sounding register. Avoid
these phrases (and anything with the same flavor): {BANNED_PHRASES}.

## Reader experience and factual boundaries

Write for someone reading on a phone who should want to finish this account,
retell a memorable part, and try one useful idea. Earn that response through
the story's details and choices, not inflated claims or motivational slogans.

- Open with the brief's specific tension, surprising detail, or recognizable
  difficulty. Bring a person, action, object, or choice into focus immediately,
  using only what the brief supports. Prefer active verbs and a lively spoken
  rhythm to an abstract introduction or explanation of why the story matters.
  Create a reason to read the next paragraph without revealing the whole
  outcome. Keep reader-facing advice for the later sections. Vary the opening
  to suit the story; do not force every entry into a rhetorical question, an
  "Imagine..." template, or a prediction of what the reader must feel.
- For anecdotes, let the reader follow the initial situation, the meaningful
  actions, and the outcome. Let concrete details carry the surprise. For
  concepts, develop the book's example or mechanism toward its central insight;
  do not invent an event or force a victory arc.
- Make the supported outcome visible. Choose the one or two result details
  that best answer the opening tension. Avoid both vague "great success"
  endings when the brief supplies specifics and long lists of statistics.
- Build connection through a recognizable difficulty or choice. Do not invent
  thoughts, dialogue, emotions, sensory details, setbacks, or motives for the
  people in the account. Use quotation formatting only for actual quoted words
  supplied as such in the brief; do not present paraphrases as direct quotes.
- Attribute the account to its book/author naturally, usually once. After that,
  tell the account directly instead of repeatedly saying "the author explains"
  or "the book describes." Retain attribution where needed to distinguish an
  interpretation or uncertain claim from an established fact.
- Respect `confidence_note`: omitted or uncertain details are unavailable for
  embellishment. Keep numbers' scope, timeframe, and denominator intact in ALL
  sections and variants. Do not turn sequence into proof of causation, a later
  result into a claim that no earlier progress occurred, or compounding math
  into a promise of real-world improvement.
- Use short, varied paragraphs, usually 2–4 sentences. Each should advance
  the account or add a necessary insight. After delivering the outcome, move
  on; do not recap the same examples merely to reach the word range. Prefer
  sentences someone could comfortably say in one breath. Let concrete details
  carry the emphasis instead of adding commentary such as "That result gives
  the details their scale." Short sentences can give a surprising choice or
  result room to land, without making every sentence clipped or theatrical.
- Keep the sections distinct: story delivers the account; lessons explain
  2–3 different implications anchored in it; reflection helps readers recognize
  a relevant situation; use cards offer natural words for a concrete next step.
  Do not make the reader do the same exercise in every section.
- In at least one use card, let the line to say briefly connect a specific
  detail or mechanism from the brief to the proposed action. The reader should
  be able to bring this story into a real conversation, not only repeat generic
  advice. Keep the connection short and understandable without having read the
  story. Do not force an anecdote into every card, speak like a coach diagnosing
  someone, or imply that the listener can expect the protagonist's result.
- End with a manageable next move consistent with the brief: one action,
  decision, or conversation at a clear opportunity, and something to notice
  if useful. Avoid a long checklist, arbitrary commitment periods, guaranteed
  success, or making the reader responsible for an ambitious transformation.
  An application is a proposal for the reader, not another fact about the book.
- Keep the distinctive idea of this story. A library of different books should
  not become a collection of interchangeable advice about habits or hard work.

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
  the 3 cards. Base these on `use_cases` in the brief. The literal
  `context:` prefix is REQUIRED — write `%%context:oneonone | …%%`, never
  `%%oneonone | …%%`.
- `@@sentence@@` — the single pocket/takeaway line, inside [[pocket]]. One
  only, ≤ 20 words. Carry a distinctive image, choice, or mechanism from this
  story into a useful takeaway. It must make sense on a standalone share card;
  do not rely on "that detail" or another unexplained reference. Keep any first
  step manageable. Reject a line that could close many unrelated stories
  unchanged, including stock advice about "one small change" or "your next
  attempt." A named object alone is not enough: its link to the lesson must
  be clear. Keep the reflective takeaway distinct from the punchline's surprise.
- `&&question&&` — the single closing reflection question, inside
  [[reflect]], at the very end of that section. One only.
- `##sentence##` — at most one highlighted moment, inside [[story]]. Select
  a genuine turning point or earned insight, not a repeat of the opening hook.
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

## Also write the conversation and sharing variants

From the SAME brief, also write four short, independent strings for a
separate screen where the reader picks a ready-to-say line. They must not
be near-verbatim copies of the [[pocket]] or [[reflect]] sentences — same
underlying story, different framing:
- `punchline`: one short, natural sentence centered on a single vivid surprise
  or story-specific insight. It should work aloud and on a standalone share
  card without the full story. Avoid a list of details, exaggerated causation,
  vague pronouns, clickbait, and generic inspiration.
- `thirty_sec`: a self-contained ~50–90 word retelling with a clear setup,
  meaningful action, and supported outcome; for a concept, use its example
  or mechanism and resulting insight. Keep only the details needed to make
  the change understandable and memorable. Sound like someone telling a
  friend the story. Usually lead with the person, situation, or surprising
  choice; give attribution in a short, natural clause where useful or needed.
  Avoid a formal reporting preamble such as "The author recounts how [person]
  approached [abstract problem]." Use direct verbs and short, varied sentences
  that are easy to say aloud. Keep the strongest supported outcome and a few
  memorable details; cut the inventory of equipment, dates, or achievements.
  Avoid repeated author references, an unsupported statistic,
  or filler endings such as "What I like about this is...". Do not invent
  personal opinions or experiences for the user who will share the text.
- `question`: one low-pressure conversation starter inviting a concrete
  personal experience, observation, or choice. Make it easy to answer and
  follow up on without knowing the book or disclosing something sensitive.
  Prefer a question that opens an exchange to a broad ideal-self question
  that collects one-word answers. It may share the reflection's idea, but
  should sound like an invitation to another person, not a coaching exercise.
- `key_contrast`: a 2–4 word label capturing this story's meaningful shift
  or contrast. Use familiar, natural words in the target language; avoid
  abstract jargon and generic slogans. It need not be a literal "X versus Y"
  construction, and must not promise a change the account does not support.

All four strings must stand on their own for a reader who has not opened
the story. Keep them in plain text without markup, hashtags, or promotional
calls to action. Preserve exactly these four JSON keys; do not add separate
social-media fields or duplicate the same takeaway in different lengths.

Before returning the two blocks, silently check: factual support and number
scope; an immediate, lively opening; a clear outcome or insight; no repeated
recap; one feasible application and a natural story connection in at least one
use card; a pocket line that could not be swapped into unrelated stories;
spoken rhythm in the short retelling; variants with different jobs; exact
markup and section lengths. Mentally say the use lines and retelling aloud:
replace formal reporting or coaching language with words someone would use.
Fix weak passages rather than appending an explanation or quality report.

## Output format

Output exactly two fenced blocks, in this order, and nothing else:

```story
[[open]]
...full P1 story text...
```

```variants
{"punchline": "...", "thirty_sec": "...", "question": "...", "key_contrast": "..."}
```
