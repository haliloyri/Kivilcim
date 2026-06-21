---
name: build-apk
description: 'Build a release APK for the Spark Android app. Use when the user says apk build et, apk üret, release apk al, android build yap, or similar.'
argument-hint: 'No arguments needed'
user-invocable: true
---

# Build Release APK

Use this skill to produce a signed release APK from the current source tree.

## When to Use

- The user asks to build an APK
- The user says `apk build et`, `apk üret`, `release apk al`, `android build yap`
- The user wants to install the latest code on a device

## Procedure

1. Run `npx expo prebuild --platform android` from the repo root.
2. Run `cd .\android\` to enter the Android project folder.
3. Run `.\gradlew.bat assembleRelease --no-daemon` to compile the signed release APK.
4. Report the result and the APK path.

## Commands

```powershell
npx expo prebuild --platform android
cd .\android\
.\gradlew.bat assembleRelease --no-daemon
```

## Output

- APK path: `android\app\build\outputs\apk\release\app-release.apk`

## Notes

- Ensure `JAVA_HOME` points to JDK 17 before running the Gradle command.
- The keystore and signing credentials are configured in `android/gradle.properties`.
- If the build fails, consult [ANDROID_APK_REHBERI.md](../../../ANDROID_APK_REHBERI.md) for troubleshooting steps.
