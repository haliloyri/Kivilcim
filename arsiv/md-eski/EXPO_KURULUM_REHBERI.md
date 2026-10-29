# Expo Go & React Native İlk Kurulum ve Sorun Giderme Rehberi (GÜNCEL)

Bu dosya, Expo projelerinin ilk kurulumunda karşılaşılan emülatör, paket sürüm uyuşmazlığı, mimari hatalar ve kütüphane çakışmalarını önlemek için oluşturulmuştur. Yeni bir proje başlatırken bu adımlar **Kritik Kontrol Listesi** olarak kullanılmalıdır.

---

## 🚀 1. Temel Paket ve SDK Uyum Yönetimi
Expo SDK sürümleri ile yerel (native) paket sürümlerinin uyuşması zorunludur.

- **Otomatik Düzeltme:** Paket yüklerken her zaman `npm install` yerine Expo'nun doğrulama aracını kullan:
  ```bash
  npx expo install <paket-adı>
  # Projedeki tüm paketlerin SDK ile uyumunu doğrular
  npx expo install --check
  ```
- **Expo Go Versiyonu:** Telefonunuzdaki Expo Go uygulaması ile projenin SDK sürümü (örn. SDK 54) uyuşmalıdır. Uyumsuzluk durumunda Metro bundler hata verir.

---

## 🧪 2. Reanimated v4 ve Worklets Yapılandırması (Kritik)
React Native Reanimated v4 sürümü, harici bir `react-native-worklets` (0.5.x+) paketine ihtiyaç duyar ve özel yapılandırma gerektirir.

### **Sürüm Eşleşme Hatası (Mismatch)**
**Sorun:** `WorkletsError: Mismatch between JavaScript part and native part...`
**Çözüm:** Expo Go (SDK 54) yerel kodunda gömülü olan sürümle (genellikle `0.5.1`) projedeki paketi sabitle:
```bash
npx expo install react-native-worklets@0.5.1 --save-exact
```

### **Babel Çakışmaları**
**Sorun:** `Duplicate plugin/preset detected`
**Çözüm:** `babel.config.js` dosyasında Reanimated plugin'ine benzersiz bir isim verin ve her zaman **en sona** ekleyin. `react-native-worklets/plugin` eklentisini Reanimated 4 genellikle kendi içinde yönettiği için manuel eklemek çakışmaya yol açabilir.
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-reanimated/plugin', {}, 'reanimated-unique'],
    ],
  };
};
```

### **Metro Çözümleme Hatası**
**Sorun:** `Unable to resolve "react-native-worklets"`
**Çözüm:** Proje köküne bir `metro.config.js` ekleyerek paket yolunu açıkça tanımlayın:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'react-native-worklets': path.resolve(__dirname, 'node_modules/react-native-worklets'),
};

module.exports = config;
```

---

## 🅰️ 3. Google Fonts ve Varlık Yönetimi
Expo'da `@expo-google-fonts` paketlerini kullanırken `.ttf` dosyalarına doğrudan `require` ile erişmek derleme hatalarına (`Unable to resolve .ttf`) yol açabilir.

- **Doğru Yükleme Yöntemi:** Fontları kütüphaneden gelen hazır sabitler (constants) olarak import edin.
  ```javascript
  import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
  
  // useFonts içinde doğrudan objeyi değil, sabiti kullanın
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular, // 'font_name': require(...) yerine bu yöntem güvenlidir.
  });
  ```

---

## 🛠 4. Kod Mimarisi ve Dosya Bozulmaları (Refactoring)
Uygulama büyüdükçe `App.js` dosyasının şişmesi performans ve hata ayıklama zorluğu yaratır.

- **Modüler Yapı:** Ekranları `src/screens/`, bileşenleri `src/components/`, durum yönetimini `src/context/` klasörlerine ayırın.
- **Dosya Bütünlüğü ve Encoding:** Windows üzerinde Metro Bundler bazen dosyaları "kilitli" tutup eski içeriği bellekte tutabilir. Eğer kodda yaptığınız değişiklik terminal hatasına yansımıyorsa:
  1. Dosyayı silip (`hard delete`) yeniden oluşturun.
  2. Karakter bozulması (UTF-8 uyuşmazlığı) varsa dosyayı baştan yazın.

---

## 🧹 5. Özet: Derin Önbellek Temizleme (Windows)
`npx expo start -c` komutu her zaman yeterli olmayabilir. Özellikle kütüphane değişikliklerinden sonra projenin "temiz bir sayfa" açması için:

1.  Çalışan tüm Metro terminallerini kapatın.
2.  Aşağıdaki komutu (PowerShell) çalıştırın:
    ```powershell
    # .expo önbellek klasörünü zorla sil ve temiz başlat
    rm -r -fo .expo; npx expo start -c
    ```
3.  Telefondaki **Expo Go** uygulamasını kapatıp (history'den silerek) tekrar açın.

---

## 📂 6. Sabit Başlangıç Ayarları (Checklist)

1.  **Entry Point:** `package.json` içindeki `"main"` her zaman `"node_modules/expo/AppEntry.js"` olmalıdır.
2.  **Splash Screen:** `SplashScreen.preventAutoHideAsync()` mutlaka kodun en başında çağrılmalı ve fontlar yüklendikten sonra `SplashScreen.hideAsync()` ile gizlenmelidir.
3.  **ThemeProvider:** Tema desteği (Karanlık/Açık mod) için tüm uygulamayı bir `Context.Provider` ile sarmalamak en sürdürülebilir yöntemdir.

---

## 🎨 7. Tasarım ve Performans Prensipleri
- **Styling:** Hız ve modülerlik için `Vanilla CSS` yerine React Native'in `StyleSheet` API'sini kullanın.
- **Güvenli Alanlar:** Android ve iOS çentik (notch) yönetimi için her zaman `SafeAreaView` kullanın.
- **Animasyonlar:** Performans için her zaman `useNativeDriver: true` veya `react-native-reanimated` kütüphanesini tercih edin.
