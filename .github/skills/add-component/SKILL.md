---
name: add-component
description: 'Add a new reusable component to the Spark React Native app with proper theming and patterns. Use when the user says bileşen ekle, component ekle, component oluştur, create component, yeni component, or similar.'
argument-hint: 'Component name and purpose (e.g. BadgeCard - displays user badges)'
user-invocable: true
---

# Add New Component

Use this skill to scaffold a new reusable component following project conventions.

## When to Use

- The user asks to add a new component
- The user says `bileşen ekle`, `component ekle`, `component oluştur`, `create component`

## Procedure

1. **Create the component file** at `src/components/<ComponentName>.js` using the template below.
2. **Add i18n keys** if the component has user-facing text — in all 4 language blocks in `src/locales/i18n.js`.
3. **Import and use** in the target screen or parent component.
4. **Run prebuild**: `npx expo prebuild --platform android`

## Component Template

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const __COMPONENT_NAME__ = ({ /* props */ }) => {
  const { colors, typography, layout, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.cardBackground,
      borderRadius: layout.borderRadius,
      padding: layout.padding.horizontal,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    }}>
      {/* Component content */}
    </View>
  );
};

export default __COMPONENT_NAME__;
```

## Rules

- Replace `__COMPONENT_NAME__` with the actual name (PascalCase).
- Use `useTheme()` colors — never hardcode colors.
- Use `t('key')` for any user-facing text.
- Keep components focused on a single responsibility.
- Accept data via props, not direct context access (unless shared state is needed).
- Follow existing component patterns in `src/components/`.

## Checklist

- [ ] Component file created at `src/components/<Name>.js`
- [ ] Theme tokens used for all visual properties
- [ ] i18n keys added in all 4 blocks if text is shown
- [ ] Component imported and used in target file
- [ ] `npx expo prebuild --platform android` passes
