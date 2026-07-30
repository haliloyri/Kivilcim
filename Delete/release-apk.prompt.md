---
name: "Release APK"
description: "Android release APK oluştur. Spark veya başka bir React Native / Expo projesi için test amaçlı APK build komutu üretir."
argument-hint: "Proje yolu (varsayılan: d:\\CL\\Projects\\Spark)"
agent: "agent"
---

Aşağıdaki adımlarla Android release APK oluştur.

## Proje Bilgileri

Eğer kullanıcı bir proje yolu belirttiyse onu kullan. Belirtmediyse varsayılan yol: `d:\CL\Projects\Spark`

1. Projenin `android/` klasörünün var olup olmadığını kontrol et.
2. `android/gradle/wrapper/gradle-wrapper.properties` dosyasında Gradle sürümünü kontrol et. `8.13` olmalı.
3. Aşağıdaki PowerShell komut bloğunu kullanıcıya ver ve terminalde çalıştır:

```powershell
# Ortam değişkenleri
$env:JAVA_HOME    = "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_OPTS  = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"

# Build
Set-Location "d:\CL\Projects\Spark\android"
.\gradlew.bat assembleRelease --no-daemon

# Sonuç
$apk = "app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apk) {
    Write-Host "✅ APK hazır: $apk"
    Write-Host "   Boyut: $([math]::Round((Get-Item $apk).Length / 1MB, 2)) MB"
} else {
    Write-Host "❌ APK bulunamadı, build başarısız."
}
```

4. Build başarılıysa APK'yı cihaza yüklemek için:

```powershell
& "$env:ANDROID_HOME\platform-tools\adb.exe" install -r "d:\CL\Projects\Spark\android\app\build\outputs\apk\release\app-release.apk"
```

## Sık Karşılaşılan Hatalar

| Hata | Çözüm |
|------|-------|
| `Unsupported class file major version` | `$env:JAVA_HOME` JDK 17'yi göstermeli |
| `SDK location not found` | `android/local.properties` içinde `sdk.dir` doğru mu kontrol et |
| `Could not find shared_storage` | `android/build.gradle`'a AsyncStorage local_repo maven ekle |
| `PKIX path building failed` | `$env:GRADLE_OPTS = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"` |
| Build başarısız, log uzunsa | `cd android; .\gradlew.bat clean --no-daemon` ile temizle, tekrar dene |
