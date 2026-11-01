---
name: albor-reel
description: Produces an Albor marketing reel (Instagram Reels / TikTok / Shorts, 1080×1920) in the fixed house format, with real app screens, an ElevenLabs voiceover and music bed, karaoke captions synced to the voice, hand-drawn highlights and the brand palette. Use when: reels videosu yap, reel üret, tanıtım videosu, ürün videosu, yeni reel, reel formatında, make a reel, promo reel, marketing video for Albor, another reel like reel-01.
---

# Albor reel

Every reel is one `reel.json` in `reels/<id>/`. A generator turns it into a HyperFrames project, so every reel has the same layout, type, colours, timing and caption style. You write the script and pick the screens. You do not hand-write compositions.

Read [brand.md](brand.md) first. It holds the palette, the frame and the "AI look" rules.

Reference reel: `reels/reel-01-unfinished-books/` (product angle 1, English).

## Steps

1. **Angle and script.** Write the voice lines first, one per scene, 25–30 s in total (about 70 spoken words). Check them against the "Avoid the AI video look" table in brand.md. Facts must come from the real story shown on screen.
2. **Screens.** Use or add real screenshots in `reels/_screens/<lang>/` (1170×2532 PNG from the app). If none fits, ask the user for a screenshot. Never mock one up. Look at the image, then pick camera `y` values (source pixels; the frame shows about 1120 source px of height).
3. **Write `reels/<id>/reel.json`.** Copy the reference reel and change it. Scene types are listed below.
4. **Build:**
   ```bash
   node .claude/skills/albor-reel/scripts/build-reel.mjs reels/<id>
   ```
   Voice lines are cached per scene and only regenerate when their text changes. `--no-vo` builds a silent layout pass without spending ElevenLabs credits.
5. **Look.** Run `npx hyperframes check` and `npx hyperframes snapshot --at <one time per scene>` in `reels/<id>`, then read the contact sheet. Fix by editing `reel.json` and rebuilding, never by editing the generated HTML. Caption `line_unread` warnings are expected: the captions follow the voice.
6. **Render:**
   ```bash
   bash .claude/skills/albor-reel/scripts/render-reel.sh reels/<id>
   ```
   Deliver `reels/<id>/out/<id>.final.mp4` (normalized to about -15 LUFS). Send it with SendUserFile.

## reel.json

```json
{
  "id": "reel-02-…",
  "lang": "en",
  "voice": "JBFqnCBsd6RMkjVDRZzb",
  "music": { "file": "acoustic-morning-110.mp3", "prompt": "…", "volume": 0.2 },
  "scenes": [ … ]
}
```

- `voice`: ElevenLabs voice id. The default is "George", a calm, warm narrator. Keep one voice across all reels of a language. `model` defaults to `eleven_multilingual_v2`.
- `music`: a track in `reels/_music/`. If the file is missing, it is generated once from `prompt` with ElevenLabs Music, then shared by later reels. The generator trims and fades it to the reel's length. `volume` 0.2 sits about 11 dB under the voice. Reuse one track across a series so the account has a recognisable sound. `speed` (default 1.06) sets the voice tempo.
- Every scene has `vo`: the line that is spoken. A `|` in `vo` sets caption breaks by hand and is not spoken.

| type | fields | what it shows |
|---|---|---|
| `hook` | `title` (2–3 short lines, last line petrol), `books` (real catalogue titles, bottom first; spine colour comes from the book's category), optional `slideOut` (indices; default top, top−2, 1) | The thumbnail: the question as the headline and a pile of half-read books. At the end the `slideOut` books are pulled out left and right in turn, and the books above them fall into the gaps |
| `screen` | `image` (path under `reels/_screens/`), `kicker`, `camera.from/to` `{y, zoom, cx}` (zoom < 1 shows the whole width), optional `masks` `[{x,y,w,h,color}]`, `highlights` `[{x,y,w,h,atWord}]`, `taps` `[{x,y,atWord}]`; all in source px | A real app screen with a moving camera, the kicker above and karaoke captions below. A highlight draws a pen circle around the box; a tap shows a press. `atWord` times it to the first spoken word that matches (or use `at` in seconds) |
| `end` | `title` (2 lines), `cta` | Logo, claim and the gold CTA |

Order: `hook`, then 2–4 `screen` scenes, then `end`. A new scene type (a quote, a number) goes into `build-reel.mjs` together with its rules in brand.md, so later reels can reuse it.

## Rules

- Language: English is the default. Another language needs its own screenshots in `reels/_screens/<lang>/` and a native voice.
- Never write to `assets/albor.db`. Reading it to check book titles is fine.
- `ELEVENLABS_API_KEY` comes from `.env.local`. Never print it.
- Sound effects come from `reels/_sfx/`, one per visible action: a whoosh (2 takes) when a scene comes in, a book slide (2 takes) and a thud in the hook, a pen stroke on each highlight, and a tap on each tap and on the CTA. They are free. A missing file is fetched once from Openverse (CC0 / CC BY, mostly Freesound), and a hit is used only when its title or tags match the sound. Otherwise the generator falls back to the Pixabay files bundled with HyperFrames. Openverse often times out: a skipped sound is fetched on the next build, so rebuild until every effect is there. The source of each file is in `reels/_sfx/CREDITS.md`. A CC BY sound must be credited where the reel is published (today all are CC0 or Pixabay). To swap a sound, replace its file in `reels/_sfx/` and edit its line in CREDITS.md. `--no-sfx` skips the effects.
- Mascot: none, by decision. Life comes from voice, music, motion and real screens. Revisit this only with a designed character, never an improvised one.
