---
name: add-screen
description: 'Add a new screen to the Spark React Native app with proper navigation, theming, i18n, and analytics. Use when the user says yeni ekran ekle, yeni sayfa ekle, ekran oluştur, create new screen, add screen, or similar.'
argument-hint: 'Screen name and purpose (e.g. SettingsScreen - user settings page)'
user-invocable: true
---

# Add New Screen

Use this skill to scaffold a new screen with all required integrations.

## When to Use

- The user asks to add a new screen or page
- The user says `yeni ekran ekle`, `yeni sayfa`, `ekran oluştur`, `create new screen`

## Procedure

1. **Create the screen file** at `src/screens/<ScreenName>.js` using the template below.
2. **Register in AppNavigator** by adding the import and `<Stack.Screen>` entry in `src/navigation/AppNavigator.js`.
3. **Add i18n keys** for any user-facing text in all 4 language blocks in `src/locales/i18n.js` (en ~line 2, tr ~line 501, es ~line 956, de ~line 1418).
4. **Run prebuild**: `npx expo prebuild --platform android`

## Screen Template

```jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { Ionicons } from '@expo/vector-icons';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const __SCREEN_NAME__ = ({ navigation, route }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: layout.padding.horizontal,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Text style={{
          fontFamily: typography.heading.fontFamily,
          fontSize: typography.heading.fontSize,
          color: colors.text,
          marginBottom: 16,
        }}>
          {t('__screen_title_key__')}
        </Text>
        {/* Screen content here */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default __SCREEN_NAME__;
```

## Navigation Registration Pattern

In `src/navigation/AppNavigator.js`:

```jsx
// Add import
import __SCREEN_NAME__ from '../screens/__SCREEN_NAME__';

// Add Stack.Screen inside the Stack.Navigator
<Stack.Screen name="__SCREEN_NAME__" component={__SCREEN_NAME__} options={{ headerShown: false }} />
```

## Rules

- Replace `__SCREEN_NAME__` with the actual screen name (PascalCase).
- Replace `__screen_title_key__` with a proper i18n key.
- Use `useTheme()` colors — never hardcode colors.
- Use `t('key')` — never hardcode user-facing text.
- Add analytics tracking for key user actions with `trackEvent()`.
- If the screen needs tab navigation, add a `Tab.Screen` entry instead.

## Checklist

- [ ] Screen file created at `src/screens/<Name>.js`
- [ ] Screen imported and registered in `AppNavigator.js`
- [ ] i18n keys added in all 4 language blocks (en, tr, es, de)
- [ ] Theme tokens used for all colors
- [ ] `npx expo prebuild --platform android` passes
