---
name: run-android
description: 'Run the Spark app on an Android device or emulator. Use when the user says android çalıştır, android aç, android emülatöre yükle, run android, start android, test on android, or similar.'
argument-hint: 'No arguments needed'
user-invocable: true
---

# Run on Android

Use this skill to launch the app on an Android emulator or connected device.

## When to Use

- The user wants to test the app on Android
- The user says `android çalıştır`, `android aç`, `run android`, `test on android`

## Procedure

1. Ensure the Expo dev server is running with `npx expo start`.
2. Press `a` in the Expo dev server terminal to open on Android, OR run `npx expo run:android` directly.

## Quick Commands

```powershell
# Option 1: Expo dev server (hot reload)
npx expo start

# Option 2: Direct run (native build)
npx expo run:android
```

## Prerequisites

- Android emulator running or physical device connected via USB/Wi-Fi
- `JAVA_HOME` pointing to JDK 17
- Android SDK installed with correct `sdk.dir` in `android/local.properties`

## Troubleshooting

- If Metro bundler port is busy: `npx expo start --port 8082`
- If native build fails: run `npx expo prebuild --platform android --clean` first
- For build environment issues, see [ANDROID_APK_REHBERI.md](../../../ANDROID_APK_REHBERI.md)
