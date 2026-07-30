---
name: "Build APK"
description: "Release APK üret. Sırasıyla prebuild, android klasörüne geç ve assembleRelease çalıştır."
argument-hint: "Argüman gerekmez"
agent: "agent"
---

Aşağıdaki üç komutu sırayla çalıştır ve her birinin çıktısını kontrol et. Hata alırsan duraksayıp kullanıcıya bildir.

```powershell
npx expo prebuild --platform android
cd .\android\
.\gradlew.bat assembleRelease --no-daemon
```

Build başarıyla tamamlandıysa APK yolunu bildir:
`android\app\build\outputs\apk\release\app-release.apk`
