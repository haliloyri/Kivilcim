export const colors = {
  // Light: "Digital Hearth+" – cleaner cream tones, premium editorial feel
  light: {
    background: '#F7F3ED',              // Daha temiz, daha az sarı
    backgroundDark: '#EFE9DF',          // Kart kontrastı artırıldı
    surfaceContainerLowest: '#FFFFFF',   // lifted card surface
    surfaceContainerHigh: '#E6DFD4',     // hafif derinlik
    text: '#181716',                     // Daha doğal siyah
    textSecondary: '#8F8A80',            // Daha okunabilir secondary
    primary: '#C29B4C',                  // Altın daha sofistike
    primaryContainer: '#E0B95B',         // Gradient için optimize
    onPrimary: '#FFFFFF',                // white text
    danger: '#B3261E',                   // Material uyumlu
    success: '#3A5F3C',                  // Daha doğal yeşil
    border: '#E4DED4',                   // Daha soft border
    activeNav: '#6B3E1E',                // Biraz daha modern kahve
    quoteHighlight: '#FFD166',           // Alıntı vurguları
    overlaySoft: 'rgba(0,0,0,0.03)',     // Açık mod depth
    ctaGradientStart: '#C29B4C',         // CTA başlangıç
    ctaGradientEnd: '#E0B95B',           // CTA bitiş
  },
  // Dark: "Nocturnal Bibliophile+" – softer contrast, more controlled accents
  dark: {
    background: '#12110F',       // Daha soft siyah
    backgroundDark: '#1A1814',   // Kart ayrımı arttı
    text: '#E6DCC8',             // Daha sıcak krem
    textSecondary: '#9C8F78',    // Daha net secondary
    primary: '#D06A1B',          // Daha canlı ama abartısız
    primaryContainer: '#A94E10', // Gradient uyumu
    onPrimary: '#F4EBDD',        // Kontrast iyileştirildi
    danger: '#F06A4A',           // Daha görünür
    success: '#6FBF73',          // Daha canlı yeşil
    border: '#3F362C',           // Daha görünür border
    quoteHighlight: '#FFD166',   // Alıntı vurguları
    overlayDark: 'rgba(0,0,0,0.4)',  // Koyu mod depth
    ctaGradientStart: '#D06A1B',     // CTA başlangıç
    ctaGradientEnd: '#A94E10',       // CTA bitiş
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
    quoteLineHeight: 30,
    badgeLetterSpacing: 0.5,
    bodyLetterSpacing: 0.2,
  }
};

export const layout = {
  radius: {
    button: 14,
    card: 18,
  },
  heights: {
    buttonPrimary: 48,
    buttonSecondary: 40,
  },
  padding: {
    horizontal: 20,
    vertical: 16,
    cardGap: 14,
  },
  borderWidth: 0.5,
};

export default {
  typography,
  layout,
};
