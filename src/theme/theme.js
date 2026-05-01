export const colors = {
  // Light: Premium warm – DESIGN_AI 2026 spec
  light: {
    background: '#F8F5F0',
    backgroundDark: '#EFE9DF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerHigh: '#E6DFD4',
    cardBackground: '#FFFDF9',
    text: '#1E1E1E',
    textSecondary: '#6B6B6B',
    primary: '#C89B3C',                  // Primary Gold
    primaryContainer: '#E8D3A8',         // Secondary Gold
    onPrimary: '#FFFFFF',
    danger: '#B3261E',
    success: '#3A5F3C',
    border: '#E7DFD4',
    activeNav: '#C89B3C',
    quoteHighlight: '#FFD166',
    overlaySoft: 'rgba(0,0,0,0.03)',
    overlayDark: 'rgba(0,0,0,0.24)',
    ctaGradientStart: '#C89B3C',
    ctaGradientEnd: '#E8D3A8',
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
    headingSmall: 24,
    headingLarge: 28,
    heroTitle: 38,
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
