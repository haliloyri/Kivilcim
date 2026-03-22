# Design System Document: The Modern Editorial Experience

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Hearth"**

This design system is built to transform a mobile application into a sanctuary for the mind. Moving away from the frenetic, "app-like" interfaces of modern social media, we embrace an **Editorial Minimalism** that mimics the tactile quality of a premium independent magazine. 

We break the "template" look through **Intentional Asymmetry**: we prioritize whitespace over dividers and use exaggerated typographic scales to create a rhythmic hierarchy. The goal is not just to display content, but to curate it within a space that feels quiet, intentional, and high-end.

---

## 2. Colors: The Palette of Focus
Our color strategy avoids the "clinical" feel of pure white (#FFFFFF) in favor of organic, paper-inspired tones that reduce eye strain and invite long-form engagement.

### Core Tones
- **Background (`#fcf9f4`):** Our "Paper." A warm, breathable base that sets the calm tone of the entire experience.
- **Primary (`#9e3d00`):** The "Spark." A deep, sophisticated orange used sparingly to draw the eye to calls-to-action or key insights.
- **On-Surface (`#1c1c19`):** Our "Deep Anthracite." Used for maximum legibility without the harshness of pure black.

### The "No-Line" Rule
**Sectioning through Tonal Shifts:** Designers are strictly prohibited from using 1px solid borders to separate sections. Boundaries must be defined solely by background shifts.
- To separate a header from a feed, transition from `surface` to `surface-container-low`.
- For interactive cards, use `surface-container-lowest` to create a "lifted" paper effect against the background.

### Signature Textures & Glass
- **The Glow:** Use a subtle gradient from `primary` to `primary_container` for hero buttons to give them a "lit from within" quality.
- **The Glass Layer:** For floating navigation bars or overlays, use `surface` with a 0.8 opacity and a 20px backdrop-blur. This keeps the user grounded in the content while providing a functional utility layer.

---

## 3. Typography: The Editorial Voice
We utilize a high-contrast pairing to distinguish between "The Story" (Serif) and "The System" (Sans-Serif).

- **The Soul (Newsreader):** A sophisticated Serif used for all Display and Headline levels. It carries the weight of "Kıvılcım" (The Spark) and provides a literary, authoritative feel.
- **The Utility (Manrope):** A modern, geometric Sans-Serif used for Title, Body, and Label levels. It ensures high legibility and a contemporary edge.

**Hierarchy Guidance:**
- **Display-LG (3.5rem):** Reserved for poetic moments or chapter beginnings.
- **Headline-SM (1.5rem):** Used for article titles in feeds.
- **Body-LG (1rem):** The primary reading size. Use a generous line-height (1.6) to ensure the eye never tires.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital" for this system. We achieve depth through a physical stacking metaphor.

- **The Layering Principle:** 
    1. Base Level: `surface`
    2. Section Level: `surface-container-low`
    3. Content Card: `surface-container-lowest`
- **Ambient Shadows:** When an element must "float" (e.g., a FAB or a Modal), use a diffused shadow: `y: 8px, blur: 24px, color: rgba(28, 28, 25, 0.06)`. This mimics soft, natural gallery lighting.
- **The Ghost Border:** For accessibility in input fields, use `outline-variant` at 20% opacity. If you can see the border clearly, it is too heavy.

---

## 5. Components

### Buttons
- **Primary:** Rounded (`full`), background `primary`, text `on_primary`. No border.
- **Secondary:** Background `secondary_container`, text `on_secondary_container`.
- **Tertiary:** No background. Text `primary` with `label-md` typography.

### Cards & Feed Items
- **Rule:** No dividers. 
- **Style:** Use `surface-container-low` with `xl` (1.5rem) rounded corners. Separate cards using `spacing-6` (2rem) of vertical whitespace. 
- **Imagery:** All images must use a 1:1 or 4:5 aspect ratio with `lg` corner radius.

### Input Fields
- Avoid boxes. Use a "Minimalist Underscore" or a very subtle `surface-container-highest` background fill with no border. Focus state is indicated by the "Spark" `primary` color appearing as a 2px bottom bar.

### Signature Component: "The Reading Progress"
A thin, 2px line using the `primary` color that sits at the very top of the screen (or follows the scroll), providing a non-intrusive visual cue of the user's journey through a story.

---

## 6. Do’s and Don'ts

### Do:
- **Use White Space as a Tool:** If a layout feels cluttered, do not add lines; add `spacing-8` of empty space.
- **Embrace Asymmetry:** Align headlines to the left with a wide right margin to create a modern, editorial rhythm.
- **Prioritize the Serif:** Let the Newsreader font be the star of the screen.

### Don’t:
- **Don't use 100% Black:** It breaks the "Paper" metaphor. Stick to `on_surface`.
- **Don't use Sharp Corners:** Nothing in this system should feel "stabbing." Use the `lg` or `xl` roundedness scale for a soft, human touch.
- **Don't Overuse the Spark:** If everything is `primary` orange, nothing is a spark. Use it for the one thing you want the user to do on each screen.
- **Don't use Dividers:** Avoid horizontal rules (`<hr>`). Use a background color change or whitespace instead.

---
*This system is a living document. Every pixel should feel like a spark of inspiration, grounded in the quiet stability of a well-worn book.*