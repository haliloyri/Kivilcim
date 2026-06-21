---
name: app-screenshots
description: "Create app screenshots without emulator/device by generating SVG screens from source code structure and design tokens. Use when: quick previews, docs visuals, PR assets, and deterministic screenshot output."
argument-hint: "which screens should be generated? (e.g. home, onboarding, settings, profile)"
---

# App Screenshot Skill

Generate screenshots without emulator/device using an SVG generator script.

## When to Use

- Emulator/device is not available
- You need fast and repeatable outputs

## Required Inputs

- Screen list
- UI source files
- Theme tokens
- Output folder

---

## Method - SVG Screenshot Generation (No Emulator)

1. Read screen structure and labels from source files.
2. Build `scripts/generate-screenshots.mjs` (one renderer per screen).
3. Save outputs to `docs/screenshots` as `.svg`.
4. Add package command.

In package.json:

```json
{
  "scripts": {
    "screenshots": "node scripts/generate-screenshots.mjs"
  }
}
```

Run:

```powershell
npm run screenshots
```

Verify:

- Files exist for all requested screens
- Labels and layout match source screens
- Aspect ratio is consistent

---

## Output Convention

- docs/screenshots/home.svg
- docs/screenshots/add-item.svg
- docs/screenshots/history.svg
- docs/screenshots/stats.svg
- docs/screenshots/settings.svg
- docs/screenshots/index.html

## Cross-Project Adaptation Checklist

1. Screen names and file names
2. Theme tokens
3. Text content
4. Output path

---

## Troubleshooting

- Screens do not resemble app
  - Re-check source screen files and design tokens
- Wrong screen resolution
  - Fix canvas and viewport values in generator
- Text clipping in SVG
  - Increase layout width or reduce font size/line length
- Non-ASCII rendering issues
  - Use UTF-8 output and fallback font stack for emoji/text

---

## Fast Start Commands

Generate screenshots:

```powershell
npm run screenshots
```
