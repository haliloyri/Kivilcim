# Android APK Oluşturma Rehberi (Debug & Release)

Bu rehber, React Native (Expo) projesi için Android APK oluşturma sürecindeki tüm adımları, kontrolleri ve karşılaşılan sorunları tek bir yerde toplar. Yeni bir projede aynı süreci tekrarlamak için bu listeyi sırasıyla takip edin.

## 0. Hızlı Uygulama Listesi (Başka Projeye Kopyala)

Bu bölüm, farklı bir React Native/Expo projesine en hızlı şekilde uyarlaman için kısa reçetedir.

### 0.1 Sorun -> Çözüm Eşlemesi

| Sorun | Neden | Hızlı Çözüm |
|------|-------|-------------|
| "make sure you're running Metro" / "index.android.bundle" hatası | Debug APK JS bundle'ı APK içine gömmez | Metro aç (`npx expo start`) veya Metro'suz kullanım için `assembleRelease` üret |
| `Unsupported class file major version ...` | Java sürümü çok yeni (örn. JDK 25) | Build'i JDK 17 ile çalıştır |
| `adb is not recognized` | platform-tools PATH'te yok | `...\\Android\\Sdk\\platform-tools\\adb.exe` tam yolunu kullan |
| `no devices/emulators found` | Cihaz bağlı değil/izin yok | USB debugging aç, kabloyu değiştir, `adb devices` ile yetki ver |

### 0.2 Windows İçin Kopyala-Çalıştır (Expo Projesi)

```powershell
# 1) Ortam
$env:JAVA_HOME    = "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8"
$env:PATH         = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_OPTS  = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"

# 2) Native android klasorunu üret (Expo managed için)
npx expo prebuild --platform android

# 3) Metro'suz, cihazda direkt açılan APK üret
cd android
.\gradlew.bat assembleRelease --no-daemon

# 4) Cihaza kur
& "$env:ANDROID_HOME\platform-tools\adb.exe" install -r ".\app\build\outputs\apk\release\app-release.apk"
```

### 0.3 Debug ve Release Farkı (Kritik)

- `assembleDebug`: Metro gerekir. Metro kapalıysa uygulama açılışta bundle hatası verir.
- `assembleRelease`: Bundle APK içine gömülür. Metro olmadan açılır.

### 0.4 Son Kontrol

- APK yolu: `android/app/build/outputs/apk/release/app-release.apk`
- Bundle dosyası var mı: `android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle`
- Kurulum sonrası açılış testi:

```powershell
& "$env:ANDROID_HOME\platform-tools\adb.exe" shell monkey -p com.yourcompany.yourapp -c android.intent.category.LAUNCHER 1
```

---

## 1. Ön Gereksinimler

### 1.1 Yazılım Kurulumları

| Yazılım | Minimum Versiyon | Kontrol Komutu | Kurulum |
|---------|-----------------|----------------|---------|
| Node.js | 18+ | `node -v` | [nodejs.org](https://nodejs.org) |
| JDK | **17** (25 uyumsuz!) | `java -version` | `winget install Microsoft.OpenJDK.17 --source winget` |
| Android Studio | Son sürüm | — | [developer.android.com/studio](https://developer.android.com/studio) |
| Android SDK | API 36 | `$env:ANDROID_HOME` kontrol | Android Studio → SDK Manager |

> **⚠️ JDK Uyarısı:** JDK 25, Gradle 8.x ile class file uyumsuzluğu verir. JDK 21 (Android Studio JBR) da kullanılabilir ama **JDK 17 en güvenilir** seçenektir.

### 1.2 JDK 17 Kurulumu (Admin Olmadan)

Eğer `winget install` yönetici izni istiyorsa, ZIP ile kurulum yapılabilir:

```powershell
$zipUrl = "https://aka.ms/download-jdk/microsoft-jdk-17.0.18-windows-x64.zip"
$zipPath = "$env:TEMP\jdk17.zip"
Invoke-WebRequest $zipUrl -OutFile $zipPath -UseBasicParsing
Expand-Archive $zipPath -DestinationPath "$env:LOCALAPPDATA\Programs\Microsoft" -Force
# Çıktı: $env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8
```

### 1.3 Ortam Değişkenleri

Her terminal oturumunda ayarlanması gereken değişkenler:

```powershell
$env:JAVA_HOME   = "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_OPTS  = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"
```

Kalıcı yapmak için (bir kez çalıştır):

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
```

---

## 2. Proje Hazırlık Kontrol Listesi

Aşağıdaki maddeleri **sırasıyla** kontrol edin:

### 2.1 Gradle Sürümü

```
Dosya: android/gradle/wrapper/gradle-wrapper.properties
```

| Sorun | Açıklama |
|-------|----------|
| Gradle 9.0.0 | RN Gradle plugin `IBM_SEMERU` hatası verir → **8.13'e düşür** |
| Gradle 8.12.x | Android SDK Plugin 36 minimum 8.13 ister |
| ✅ Gradle 8.13 | Expo SDK 55 + RN 0.83.x ile uyumlu |

```properties
# Doğru değer:
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

### 2.2 AsyncStorage Local Maven Repo

`@react-native-async-storage/async-storage` v3+ sürümü `shared_storage` artifact'ını kendi `local_repo` klasöründe barındırır. Maven Central'da yok.

```
Dosya: android/build.gradle
```

`allprojects.repositories` bloğuna ekle:

```gradle
allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
    // ↓ AsyncStorage shared_storage için zorunlu
    maven { url "$rootDir/../node_modules/@react-native-async-storage/async-storage/android/local_repo" }
  }
}
```

### 2.3 SSL Sertifika Sorunu (Kurumsal Ağ / Proxy)

Gradle, Node.js ve winget HTTPS bağlantılarında `PKIX path building failed` hatası alıyorsan:

| Araç | Çözüm |
|------|-------|
| **Gradle Wrapper** | `$env:GRADLE_OPTS = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"` |
| **Gradle Daemon** | `gradle.properties` → `org.gradle.jvmargs` sonuna `-Djavax.net.ssl.trustStoreType=Windows-ROOT` ekle |
| **Node.js / npm** | `$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"` |

> **Not:** `Windows-ROOT` JDK 17'de çalışır, Android Studio JBR 21'de `Windows-ROOT not found` hatası verir. **JDK 17 kullanın.**

### 2.4 npm install

```powershell
# react-native-svg-charts peer dependency çakışması var
npm install --legacy-peer-deps
```

---

## 3. OneDrive Projesi İçin Build Yöntemi

Proje OneDrive klasöründeyse, Gradle cache yazma hatası alırsınız:

```
java.io.IOException: The cloud operation is invalid
Unable to delete directory '...\build\kotlin\compileKotlin\cacheable'
```

### Çözüm: Projeyi geçici klasöre kopyala

```powershell
$src = "C:\...\OneDrive\...\Moodly"    # Proje yolu
$dst = "C:\Temp\MoodlyBuild"           # OneDrive dışı hedef

# 1. Kaynak kodu kopyala (node_modules hariç)
if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
robocopy $src $dst /E /XD node_modules .gradle build /XF "*.apk" "*.aab" /NFL /NDL /NJH /NJS /NC /NS

# 2. Bağımlılıkları yükle
cd $dst
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npm install --legacy-peer-deps

# 3. Build yap (aşağıdaki adımlara geç)
```

> Build bittikten sonra APK'yı geri kopyala:
> ```powershell
> Copy-Item "$dst\android\app\build\outputs\apk\debug\app-debug.apk" "$src\android\app\build\outputs\apk\debug\" -Force
> ```

---

## 4. Debug APK Oluşturma

```powershell
cd C:\Temp\MoodlyBuild\android                # veya proje/android

$env:JAVA_HOME    = "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_OPTS  = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"

.\gradlew assembleDebug --no-daemon
```

**Çıktı:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Tek Mimari Build (Daha Hızlı)

```powershell
# Fiziksel cihaz (ARM):
.\gradlew assembleDebug --no-daemon -PreactNativeArchitectures=arm64-v8a

# Emülatör (x86):
.\gradlew assembleDebug --no-daemon -PreactNativeArchitectures=x86_64
```

### Cihaza Yükleme

```powershell
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 5. Release APK Oluşturma

### 5.1 Keystore Oluşturma (Bir Kez)

```powershell
keytool -genkeypair -v `
  -storetype PKCS12 `
  -keystore android/app/moodly-release.keystore `
  -alias moodly-key `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

### 5.2 gradle.properties'e Ekle

```properties
MOODLY_UPLOAD_STORE_FILE=moodly-release.keystore
MOODLY_UPLOAD_KEY_ALIAS=moodly-key
MOODLY_UPLOAD_STORE_PASSWORD=<şifre>
MOODLY_UPLOAD_KEY_PASSWORD=<şifre>
```

### 5.3 build.gradle Signing Config

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MOODLY_UPLOAD_STORE_FILE')) {
            storeFile file(MOODLY_UPLOAD_STORE_FILE)
            storePassword MOODLY_UPLOAD_STORE_PASSWORD
            keyAlias MOODLY_UPLOAD_KEY_ALIAS
            keyPassword MOODLY_UPLOAD_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### 5.4 Release Build

```powershell
.\gradlew assembleRelease --no-daemon      # APK
.\gradlew bundleRelease --no-daemon        # AAB (Play Store için)
```

---

## 6. Versiyon Güncelleme

Release öncesi üç dosyada güncelle:

| Dosya | Alan | Örnek |
|-------|------|-------|
| `app.json` | `expo.version` | `"1.1.0"` |
| `android/app/build.gradle` | `versionCode` | `2` (her zaman artan tam sayı) |
| `android/app/build.gradle` | `versionName` | `"1.1.0"` |
| `package.json` | `version` | `"1.1.0"` |

---

## 7. Sorun Giderme

### Temiz Build

```powershell
cd android
.\gradlew clean --no-daemon
cd ..
Remove-Item android\app\build -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item android\.gradle -Recurse -Force -ErrorAction SilentlyContinue

# node_modules içindeki Gradle build artıkları
Remove-Item node_modules\expo-modules-autolinking\android\expo-gradle-plugin\*\build -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\@react-native\gradle-plugin\*\build -Recurse -Force -ErrorAction SilentlyContinue
```

### Sık Karşılaşılan Hatalar

| Hata | Sebep | Çözüm |
|------|-------|-------|
| `Unsupported class file major version 69` | JDK 25 + Gradle 8.x | JDK 17 kullan |
| `IBM_SEMERU` not found | Gradle 9.0.0 + RN plugin | Gradle 8.13'e düşür |
| `Minimum supported Gradle version is 8.13` | Gradle 8.12.x | gradle-wrapper.properties → 8.13 |
| `PKIX path building failed` | SSL sertifika (proxy) | `GRADLE_OPTS` + `Windows-ROOT` |
| `Windows-ROOT not found` | JBR 21 desteklemiyor | JDK 17 kullan (JBR değil) |
| `The cloud operation is invalid` | OneDrive dosya kilidi | Projeyi `C:\Temp\` altına kopyala |
| `Unable to delete directory` | OneDrive veya önceki build | Build artıklarını temizle |
| `Could not find shared_storage:storage-android` | AsyncStorage local repo eksik | `build.gradle`'a local_repo maven ekle |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Farklı imza ile APK | `adb uninstall com.anonymous.MoodlyApp` |
| `SDK location not found` | ANDROID_HOME yok | `$env:ANDROID_HOME` ayarla |
| `unable to get local issuer certificate` (Node) | SSL proxy | `$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"` |
| Peer dep conflict (`react-native-svg-charts`) | SVG sürüm çakışması | `npm install --legacy-peer-deps` |

---

## 8. Hızlı Referans — Tam Build Komutu

Tüm adımlar tek blokta (OneDrive projesi için):

```powershell
# === ORTAM ===
$env:JAVA_HOME    = "$env:LOCALAPPDATA\Programs\Microsoft\jdk-17.0.18+8"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_OPTS  = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# === KOPYALA (OneDrive projesi ise) ===
$src = "C:\Users\hoyri\OneDrive - architecht365\Documents\CL\MobilApps\Moodly"
$dst = "C:\Temp\MoodlyBuild"
if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
robocopy $src $dst /E /XD node_modules .gradle build /XF "*.apk" "*.aab" /NFL /NDL /NJH /NJS /NC /NS
cd $dst
npm install --legacy-peer-deps

# === BUILD ===
cd android
.\gradlew assembleDebug --no-daemon

# === SONUÇ ===
$apk = "app\build\outputs\apk\debug\app-debug.apk"
Write-Host "APK boyutu: $([math]::Round((Get-Item $apk).Length / 1MB, 2)) MB"

# === GERİ KOPYALA ===
$dstApk = "$src\android\app\build\outputs\apk\debug\"
New-Item $dstApk -ItemType Directory -Force | Out-Null
Copy-Item $apk $dstApk -Force
Write-Host "APK kopyalandı: $dstApk"
```

---

## 9. Güvenlik Kontrol Listesi (Release)

- [ ] Production keystore oluşturuldu (debug keystore DEĞİL)
- [ ] `.keystore` dosyası `.gitignore`'a eklendi
- [ ] Şifreler `gradle.properties`'te (commit edilmiyor) veya env variable'da
- [ ] `gradle.properties` hassas veri içeriyorsa `.gitignore`'a eklendi
- [ ] ProGuard/R8 minification aktif (`minifyEnabled true`)
- [ ] Kaynak kodda hardcoded API key yok
- [ ] Release manifest'te `android:debuggable` false
