---
name: expo-prebuild
description: 'Run Expo prebuild to regenerate native Android/iOS projects. Use when the user says prebuild yap, native dosyaları güncelle, expo prebuild, regenerate native, or similar.'
argument-hint: 'Optional: platform (android/ios/both)'
user-invocable: true
---

# Expo Prebuild

Use this skill to regenerate native project files from the Expo config.

## When to Use

- After modifying `app.json` or `app.config.js`
- After adding/removing native dependencies
- After changing Expo plugins
- The user says `prebuild yap`, `native güncelle`, `expo prebuild`

## Procedure

### Android Only (Default)
```powershell
npx expo prebuild --platform android
```

### iOS Only
```powershell
npx expo prebuild --platform ios
```

### Both Platforms
```powershell
npx expo prebuild
```

### Clean Prebuild (Full Regeneration)
```powershell
npx expo prebuild --clean
```

## When to Use `--clean`

- When switching Expo SDK versions
- When native files are in a broken state
- When removing native dependencies
- **Warning**: `--clean` deletes and recreates `android/` and/or `ios/` folders

## Notes

- Always run prebuild after code changes before building APK.
- This project workflow preference: run `npx expo prebuild --platform android` after every code change.
- If prebuild fails, check `app.json` for plugin configuration errors.
