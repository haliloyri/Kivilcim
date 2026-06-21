---
name: run-ios
description: 'Run the Spark app on an iOS simulator. Use when the user says ios çalıştır, ios aç, simulatörde aç, run ios, start ios, test on ios, or similar.'
argument-hint: 'No arguments needed'
user-invocable: true
---

# Run on iOS

Use this skill to launch the app on an iOS simulator.

## When to Use

- The user wants to test the app on iOS simulator
- The user says `ios çalıştır`, `ios aç`, `simulatörde aç`, `run ios`, `test on ios`

## Procedure

1. Run `npx expo run:ios` from the repo root.
2. If Xcode build fails, try `npx expo prebuild --platform ios --clean` first.

## Quick Commands

```powershell
# Option 1: Expo dev server
npx expo start
# Then press 'i' for iOS simulator

# Option 2: Direct native run
npx expo run:ios

# Option 3: With specific simulator
npx expo run:ios --device "iPhone 16"
```

## Prerequisites

- macOS with Xcode installed
- iOS Simulator available
- CocoaPods installed (`sudo gem install cocoapods`)

## Troubleshooting

- Pod install issues: `cd ios && pod install --repo-update`
- Clean build: `npx expo prebuild --platform ios --clean`
- Simulator not found: Open Xcode > Settings > Platforms to download simulators
