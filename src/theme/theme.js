export const colors = {
  // Light: "The Digital Hearth" – warm editorial palette from FirstSteps/DESIGN.md
  light: {
    background: '#F9F6F1',              // Off-white / Hafif kemik rengi
    backgroundDark: '#F2EFE8',          // Slightly darker for contrasts
    surfaceContainerLowest: '#ffffff',   // lifted card surface
    surfaceContainerHigh: '#EBE6DC',     // deeper container surface
    text: '#1A1A1A',                     // Koyu antrasit
    textSecondary: '#9E9E9E',            // Kategori etiketleri orta gri
    primary: '#C5A059',                  // Altın/Toprak tonları vurgu
    primaryContainer: '#D4AF37',         // Vurgu
    onPrimary: '#ffffff',                // white text
    danger: '#ba1a1a',                   // error red
    success: '#2C4A2E',                  // forest green
    border: '#E8E3DA',                   // Subtle card border
    activeNav: '#704214',                // Aktif Navigasyon - Koyu Kahve/Sepya
  },
  // Dark: "The Nocturnal Bibliophile" – the primary palette from DESIGN.md
  dark: {
    background: '#131311',       // Deep Charcoal – the foundation
    backgroundDark: '#1E1C18',   // Surface Container Low – nested depth layer
    text: '#E8E0D0',             // Soft Cream – high legibility, no eye-strain
    textSecondary: '#A89A84',    // on_surface_variant – metadata & labels
    primary: '#B55310',          // Darker/deeper orange to fix "fazla parlak" bug
    primaryContainer: '#9F3C00', // Deep Rust – CTA gradient end
    onPrimary: '#F2E9D8',        // Switched text to light cream so it's readable on darker orange
    danger: '#E05A3A',           // Warm ember red, visible on dark backgrounds
    success: '#5A9E5E',          // Muted forest green
    border: '#4A3F33',           // outline_variant – Ghost Border base (use at 15% opacity)
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
    body: 15,
    quote: 18,
    headingSmall: 22,
    headingLarge: 30,
  },
  spacing: {
    bodyLineHeight: 26,
    badgeLetterSpacing: 0.5,
  }
};

export const layout = {
  radius: {
    button: 12,
    card: 15,
  },
  heights: {
    buttonPrimary: 48,
    buttonSecondary: 40,
  },
  padding: {
    horizontal: 20,
    vertical: 16,
    cardGap: 12,
  },
  borderWidth: 0.5,
};

export default {
  typography,
  layout,
};
