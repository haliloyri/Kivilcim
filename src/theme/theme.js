// ─── Colour system ──────────────────────────────────────────────────────────
// Neutrals (paper, ink, surfaces) are shared by every accent. The accent is the
// brand colour: Deep Petrol is Albor's identity and the default. Navy and Ochre
// are optional accents a user can pick later (theme picker) — the brand itself
// (store assets, share cards, notifications) always stays Petrol.
//
// Every accent defines the same four roles per mode so any accent works in
// every component:
//   primary          – filled surfaces (buttons, selected pill, active states)
//   onPrimary        – text/icons on `primary` (contrast-checked, ≥ 4.5:1)
//   primaryText      – accent-coloured text/icons on the page background
//                      (≥ 4.5:1 on background; differs from primary when the
//                      fill is too light to be read as text, e.g. Ochre)
//   primaryContainer – soft tinted surface; `primaryText` must read on it
// Gold is no longer a brand colour: it is the `reward` role (streaks, badges,
// goal completed) so those moments stand out.

const NEUTRALS = {
  light: {
    background: '#F7F3EC',               // paper
    backgroundDark: '#EDE7DD',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerHigh: '#E4DDD2',
    cardBackground: '#FFFDF9',
    text: '#24211E',                     // warm ink (14.5:1 on paper)
    textSecondary: '#6B625A',            // warm grey (5.4:1 on paper)
    mutedText: '#8C837A',
    danger: '#B3261E',
    success: '#3A5F3C',
    border: '#E6DED3',
    divider: '#E6DED3',
    quoteHighlight: '#FFD166',
    reward: '#C89B3C',
    rewardText: '#8A6418',               // reward as text on paper (5.4:1)
    overlaySoft: 'rgba(0,0,0,0.03)',
    overlayDark: 'rgba(0,0,0,0.24)',
    modalOverlay: 'rgba(18,17,15,0.26)',
    modalSurface: '#FFFDF9',
    tabBarBackground: '#FBF8F2',
    tabBarBorder: 'rgba(0,0,0,0.06)',
    tabInactive: '#6B625A',
  },
  dark: {
    background: '#141413',
    backgroundDark: '#1C1B1A',
    surfaceContainerLowest: '#1C1B1A',
    surfaceContainerHigh: '#2A2927',
    cardBackground: '#201F1D',
    elevatedSurface: '#2A2927',
    text: '#F2EEE8',
    textSecondary: '#A8A29A',            // 6.5:1 on card
    mutedText: '#7E7870',
    danger: '#F06A4A',
    success: '#6FBF73',
    border: '#2F2E2B',
    divider: '#3A3936',
    quoteHighlight: '#FFD166',
    reward: '#E5C27A',
    rewardText: '#E5C27A',
    overlaySoft: 'rgba(0,0,0,0.06)',
    overlayDark: 'rgba(0,0,0,0.4)',
    modalOverlay: 'rgba(0,0,0,0.4)',
    modalSurface: '#1C1B1A',
    tabBarBackground: 'rgba(20,20,19,0.94)',
    tabBarBorder: 'rgba(255,255,255,0.06)',
    tabInactive: '#9C968E',
  },
};

export const ACCENTS = {
  petrol: {
    id: 'petrol',
    light: {
      primary: '#1F5F5B',                // 7.4:1 with white, 6.7:1 on paper
      onPrimary: '#FFFFFF',
      primaryText: '#1F5F5B',
      primaryContainer: '#E2EDEA',
      ctaGradientStart: '#2A716C',
      ctaGradientEnd: '#1F5F5B',
    },
    dark: {
      primary: '#7CC0B6',                // 8.8:1 on background
      onPrimary: '#1A1A1A',
      primaryText: '#7CC0B6',
      primaryContainer: '#1F3634',
      ctaGradientStart: '#8CCBC1',
      ctaGradientEnd: '#6DB3A8',
    },
  },
  navy: {
    id: 'navy',
    light: {
      primary: '#1F3A5C',
      onPrimary: '#FFFFFF',
      primaryText: '#1F3A5C',
      primaryContainer: '#E3E9F1',
      ctaGradientStart: '#2C4A73',
      ctaGradientEnd: '#1F3A5C',
    },
    dark: {
      primary: '#8FB0D9',
      onPrimary: '#1A1A1A',
      primaryText: '#8FB0D9',
      primaryContainer: '#1E2A3A',
      ctaGradientStart: '#9DBCE2',
      ctaGradientEnd: '#7FA2CF',
    },
  },
  ochre: {
    id: 'ochre',
    light: {
      primary: '#D4952A',                // light fill → dark label (6.5:1)
      onPrimary: '#221C14',
      primaryText: '#8A5A0E',            // text variant (5.3:1 on paper)
      primaryContainer: '#F6E7C8',
      ctaGradientStart: '#DDA343',
      ctaGradientEnd: '#C98A1E',
    },
    dark: {
      primary: '#E0A53C',
      onPrimary: '#1A1A1A',
      primaryText: '#E0A53C',
      primaryContainer: '#35291A',
      ctaGradientStart: '#E8B458',
      ctaGradientEnd: '#D4952A',
    },
  },
};

export const DEFAULT_ACCENT = 'petrol';

export const buildPalette = (mode = 'light', accentId = DEFAULT_ACCENT) => {
  const m = mode === 'dark' ? 'dark' : 'light';
  const accent = (ACCENTS[accentId] || ACCENTS[DEFAULT_ACCENT])[m];
  return {
    ...NEUTRALS[m],
    ...accent,
    // Legacy aliases kept so existing screens keep working.
    activeNav: accent.primaryText,
  };
};

// Default (brand) palettes. Prefer useTheme().colors in components — it follows
// the user's chosen accent.
export const colors = {
  light: buildPalette('light', DEFAULT_ACCENT),
  dark: buildPalette('dark', DEFAULT_ACCENT),
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
