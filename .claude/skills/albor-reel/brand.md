# Albor reel brand and UX rules

Source of truth for colours and type is [DESIGN.md](../../../DESIGN.md). This file is the reel-specific subset. `scripts/build-reel.mjs` already applies all of it; read this before you change the generator or write a reel.json.

## Palette (light theme only; reels are always light)

| Role | Hex | Use in a reel |
|---|---|---|
| Paper | `#F7F3EC` | Every background |
| Ink | `#24211E` | Headlines, captions |
| Ink soft | `#6B625A` | Secondary text (rare) |
| Border | `#E6DED3` | Screen frame, light ribbons |
| Petrol | `#1F5F5B` | Accent line of a title, kicker, the spoken caption word, hand-drawn circles, tap rings |
| Muted text | `#8C837A` | Caption words not yet spoken |
| Category families (DESIGN.md §6.1) | green `#2F7D5B`, indigo `#5B5FB5`, purple `#8650A8`, blue `#1F7FA8`, earth `#A5623A`, rose `#C0507A`, slate `#4C5B7A` | Book spines only. Each book takes its category's colour from `assets/albor.db`, as its icon does in the app |
| Dawn gold | `#E9A94B` with text `#2A1E08` | **Only the end-card CTA.** Gold is for light and reward, nothing else |

Banned (DESIGN.md §1): coral/orange/red accents, cold greys, purple-blue gradients, category colours on large surfaces. Also banned in reels: glow blobs, radial gradients, emoji as icons, drop shadows heavier than the app's.

## Type

- Headlines: Playfair Display 700, left-aligned, last line in petrol.
- Everything else: Inter (600 for kickers, 700 for spines and the CTA, 800 for captions).
- Kicker: Inter 600, 30 px, uppercase, letter-spacing 0.18em, petrol.
- Captions: Inter 800, 66 px, left-aligned at x 80, top 1150, karaoke style. The phrase appears in muted text, the spoken word turns petrol, spoken words stay ink.
- Nothing under 28 px.

## Frame (1080×1920)

- Side margin 80 px. All text and product inside the Instagram safe band, 168–1330 px.
- Below 1330 px: empty paper. Instagram puts the caption, handle and buttons there.
- Real app screens sit in a 920×790 frame at top 270 (ending at 1060), radius 36, 2 px border, no phone bezel. The 90 px gap to the captions stays empty.

## UX of a reel

1. **Frame 0 is the thumbnail.** The hook line is fully on screen at 0 s. Never start on the logo or an empty frame.
2. **One idea per scene, one scene per voice line.** Scene length = voice + 0.2 s before + 0.3 s after (hook 0.9 s after, end card 2 s after). Voice speed 1.06.
3. **Hard cuts** between scenes. Each screen pushes in from below (0.5 s, `power3.out`), and the camera never stops moving.
4. **Point at the thing the voice names.** A hand-drawn petrol circle (`highlights`) draws itself on the word that names it; a tap ring (`taps`) shows a press. At most one per scene.
5. **Life comes from sound and rhythm, not decoration:** a music bed under the voice, motion on every beat, books that leave the pile and land where they fall.
6. **Show the real product.** Use screenshots from `reels/_screens/<lang>/`. Move a slow camera over them (pan, at most 1.1× zoom). Never draw a fake app screen.
7. **Captions follow the voice** word for word, from ElevenLabs timings. Many people watch muted.
8. **One CTA**, on the end card, in gold, with one tap. It says what to do in the app ("Read today's story"), not "Download now".

## Avoid the "AI video" look

The first Turkish draft had all of these. Each one is now a rule:

| Tell | Rule |
|---|---|
| A triple of excuses or benefits ("No time. No focus. 300 pages.") | One concrete line. Never a list of three. |
| A rhetorical turn ("What if it took 6 minutes?") | Say what the app does, plainly. |
| Bouncy pops (`back.out`), pulsing buttons, yoyo loops | `power2`/`power3`/`sine` eases only. Nothing bounces, nothing pulses. Motion has a physical cause: a push, a pull, a fall, a tap. |
| Glow blobs and gradients behind text | Flat paper. |
| Invented UI (a fake quote card, a fake "selected" answer) | Only real screens and real copy from the app. |
| Generic slogan ("Every day, one book idea.") | A specific claim the screens prove. |
| Everything centred | Left-aligned, editorial, like the app. |
| Made-up numbers or quotes | Only facts the story in the app contains. Book titles in the hook must exist in `assets/albor.db` (`book_translations`). |
| Internal labels on screen (e.g. the `SON55` badge) | Cover them with a `masks` entry in the paper colour. |
| One voice line read alone, with a flat ending | The generator sends the previous and next lines to ElevenLabs so the read flows. Write lines the way people talk: contractions, a pause written as "...". |
