export const colors = {
  // Light: Premium warm – DESIGN_AI 2026 spec
  light: {
    background: '#FAF8F3',
    backgroundDark: '#EFE9DF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerHigh: '#E6DFD4',
    cardBackground: '#FFFDF9',
    text: '#142A4A',                     // Albor Navy — headings, logo, titles
    textSecondary: '#6B7280',
    primary: '#142A4A',                  // Albor Navy — buttons/CTAs
    primaryContainer: '#D9E2EC',         // Pale navy container
    onPrimary: '#FFFFFF',
    danger: '#B3261E',
    success: '#3A5F3C',
    border: '#E7DFD4',
    activeNav: '#142A4A',
    quoteHighlight: '#FFD166',
    overlaySoft: 'rgba(0,0,0,0.03)',
    overlayDark: 'rgba(0,0,0,0.24)',
    ctaGradientStart: '#2C4A73',
    ctaGradientEnd: '#142A4A',
  },
  // Dark: OLED-friendly – DESIGN_AI 2026 spec
  dark: {
    background: '#121212',
    backgroundDark: '#1C1C1E',
    surfaceContainerLowest: '#1C1C1E',
    surfaceContainerHigh: '#2A2B2F',
    cardBackground: '#202124',
    elevatedSurface: '#2A2B2F',
    text: '#F5F5F5',
    textSecondary: '#A1A1AA',
    mutedText: '#7B7B84',
    primary: '#E5C27A',                  // Dark mode gold
    primaryContainer: '#D9B15F',
    onPrimary: '#1A1A1A',
    danger: '#F06A4A',
    success: '#6FBF73',
    border: '#2F2F33',
    divider: '#3A3A3F',
    activeNav: '#E5C27A',
    quoteHighlight: '#FFD166',
    overlaySoft: 'rgba(0,0,0,0.06)',
    overlayDark: 'rgba(0,0,0,0.4)',
    ctaGradientStart: '#E5C27A',
    ctaGradientEnd: '#D9B15F',
  },
};

// Picks the most readable text colour (#1A1A1A vs #FFFFFF) for a given filled
// background using WCAG relative luminance. Used wherever a pill/badge/button is
// filled with a variable accent colour (e.g. per-category gold/blue/green), so
// the label always meets contrast instead of being hardcoded to white.
export const readableTextOn = (background) => {
  if (!background || typeof background !== 'string' || background[0] !== '#') {
    return '#FFFFFF';
  }
  let hex = background.slice(1);
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length !== 6) return '#FFFFFF';

  const channel = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = channel(parseInt(hex.slice(0, 2), 16));
  const g = channel(parseInt(hex.slice(2, 4), 16));
  const b = channel(parseInt(hex.slice(4, 6), 16));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Luminance of the two candidate text colours (#1A1A1A ≈ 0.0103, #FFFFFF = 1).
  const contrastDark = (L + 0.05) / (0.0103 + 0.05);
  const contrastWhite = (1 + 0.05) / (L + 0.05);
  return contrastDark >= contrastWhite ? '#1A1A1A' : '#FFFFFF';
};

// Returns a darker shade of a hex colour by the given fraction (0-1).
// Used to nudge a too-light filled background a shade richer so that
// readableTextOn() reliably resolves to white instead of landing on the
// black/white tie-break line — keeps text colour contrast-driven rather
// than hardcoded.
export const darkenHex = (hex, amount = 0.35) => {
  if (!hex || typeof hex !== 'string' || hex[0] !== '#') return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return hex;

  const factor = 1 - amount;
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
  const r = parseInt(h.slice(0, 2), 16) * factor;
  const g = parseInt(h.slice(2, 4), 16) * factor;
  const b = parseInt(h.slice(4, 6), 16) * factor;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const typography = {
  fonts: {
    heading: 'PlayfairDisplay',
    headingItalic: 'PlayfairDisplay-Italic',
    body: 'Inter',
  },
  sizes: {
    badge: 10,
    ui: 13,
    meta: 15,
    body: 17,
    categoryPill: 18,
    button: 18,
    quote: 18,
    headingSmall: 22,
    headingLarge: 26,
    heroTitle: 34,
  },
  spacing: {
    bodyLineHeight: 28,
    quoteLineHeight: 30,
    badgeLetterSpacing: 0.5,
    bodyLetterSpacing: 0.2,
  }
};

export const layout = {
  radius: {
    button: 14,
    card: 22,
    featuredCard: 24,
    categoryPill: 25,
  },
  heights: {
    buttonPrimary: 52,
    buttonSecondary: 44,
    categoryPill: 50,
    bottomNav: 92,
    featuredCard: 390,
  },
  padding: {
    horizontal: 20,
    vertical: 16,
    cardGap: 16,
  },
  borderWidth: 0.5,
  featuredCardWidth: 0.46,
};

export default {
  typography,
  layout,
};
