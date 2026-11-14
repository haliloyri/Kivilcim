# Reference stories (few-shot)

One approved P1 (`p1v2`) story per language. `batch/08-export-agent-inputs.mjs --compact`
appends every `<lang>.md` here to `staging/<out>/inputs/story-system.md`, so a cheaper
model (Sonnet) copies the house voice from a real example instead of from rules alone.

- Used only by hand-writing agents (`hikaye-yazari`, `hikaye-editor`). The Batch
  pipeline (`05-submit-stories.mjs`) does not read this folder.
- Keep one story per language: each one costs ~800–1,000 input tokens on every run.
- Pick stories that pass `node scripts/p1/validate-dir.mjs <lang> <dir> <id>` with
  0 errors and that a human read and approved. Machine score alone is not enough.
- Replace a file by hand when a better story is approved. File shape: a `### <lang>`
  heading and the story body in a ```story fence.

Current picks (2026-11-04, chosen by `score-models.mjs` with 0 errors from
`staging/p1-claude/`, kept by the user): tr 1824, en 1426, es 1426, de 1357.
