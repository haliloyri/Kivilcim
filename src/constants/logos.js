// Single source for every Albor logo the app draws. All files live in
// assets/logo/; screens import from here instead of requiring paths directly.
// (app.json points at the same folder for the app icon, splash and notification icon.)

export const LOGO_LIGHT = require('../../assets/logo/albor_logo.png');
export const LOGO_DARK = require('../../assets/logo/albor_logo_dark.png');

// Mark used on generated share cards.
export const SHARE_CARD_ICON = require('../../assets/logo/share_card_icon.png');

export const getLogo = (isDark) => (isDark ? LOGO_DARK : LOGO_LIGHT);
