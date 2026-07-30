---
name: "Release iOS"
description: "iOS release build oluştur. Spark veya başka bir React Native / Expo projesi için .ipa veya archive build üretir."
argument-hint: "Proje yolu (varsayılan: d:\\CL\\Projects\\Spark)"
agent: "agent"
---

Aşağıdaki adımlarla iOS release build oluştur.

## Proje Bilgileri

Eğer kullanıcı bir proje yolu belirttiyse onu kullan. Belirtmediyse varsayılan yol: `d:\CL\Projects\Spark`

> **Not:** iOS build yalnızca macOS üzerinde çalışır. Bu adımlar bir Mac terminali veya CI ortamı (Xcode yüklü) gerektirmektedir.

1. Projenin `ios/` klasörünün var olup olmadığını kontrol et.
2. `ios/Podfile` dosyasının var olduğunu doğrula.
3. Pod bağımlılıklarını yükle:

```bash
cd /path/to/project/ios
pod install --repo-update
```

4. Aşağıdaki komutla release archive oluştur:

```bash
PROJECT_DIR="/path/to/project/ios"
SCHEME="Spark"            # app.json içindeki "name" ile eşleşmeli
WORKSPACE="$PROJECT_DIR/Spark.xcworkspace"
ARCHIVE_PATH="$PROJECT_DIR/build/Spark.xcarchive"
IPA_DIR="$PROJECT_DIR/build/ipa"

xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -archivePath "$ARCHIVE_PATH" \
  clean archive

# Archive başarılıysa .ipa dışa aktar
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$IPA_DIR" \
  -exportOptionsPlist "$PROJECT_DIR/ExportOptions.plist"

# Sonuç
IPA=$(find "$IPA_DIR" -name "*.ipa" | head -1)
if [ -n "$IPA" ]; then
  SIZE=$(du -sh "$IPA" | cut -f1)
  echo "✅ IPA hazır: $IPA"
  echo "   Boyut: $SIZE"
else
  echo "❌ IPA bulunamadı, build başarısız."
fi
```

5. `ExportOptions.plist` dosyası yoksa `ios/` klasöründe oluştur:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>ad-hoc</string>       <!-- ad-hoc | app-store | development | enterprise -->
  <key>teamID</key>
  <string>XXXXXXXXXX</string>   <!-- Apple Developer Team ID -->
  <key>compileBitcode</key>
  <false/>
  <key>stripSwiftSymbols</key>
  <true/>
  <key>thinning</key>
  <string>&lt;none&gt;</string>
</dict>
</plist>
```

6. **Cihaza yüklemek için** (USB bağlı, `cfgutil` veya `ios-deploy` ile):

```bash
# ios-deploy ile:
ios-deploy --bundle "$IPA" --debug

# Alternatif: Apple Configurator 2 veya Xcode Devices penceresinden sürükle-bırak
```

## Expo ile Kolaylaştırılmış Yöntem

Eğer proje Expo kullanıyorsa EAS Build tercih edilebilir:

```bash
# EAS CLI kurulumu (bir kez)
npm install -g eas-cli

# Giriş
eas login

# Release build (bulutta)
eas build --platform ios --profile production

# Yerel build (Mac gerekir)
eas build --platform ios --profile production --local
```

`eas.json` dosyasında `production` profili tanımlı olmalı:

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "credentialsSource": "local"
      }
    }
  }
}
```

## Sık Karşılaşılan Hatalar

| Hata | Çözüm |
|------|-------|
| `No signing certificate` | Xcode → Signing & Capabilities → Team seç; `Automatically manage signing` aç |
| `Pod install failed` | `sudo gem install cocoapods` ile CocoaPods güncelle |
| `xcodebuild: error: workspace not found` | `pod install` çalıştırıldı mı kontrol et; `.xcworkspace` kullanıldığından emin ol |
| `Provisioning profile doesn't include entitlement` | Apple Developer portalında Provisioning Profile'ı yenile |
| `Command PhaseScriptExecution failed` | `ios/` klasöründe `pod deintegrate && pod install` dene |
| EAS build sırasında `credentials` hatası | `eas credentials` ile sertifika ve provisioning profile yükle |
| Build başarısız, log uzunsa | `xcodebuild ... 2>&1 \| tee build.log` ile log dosyasına yaz, son 50 satırı incele |
