import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

/**
 * Sistem hareket tercihini canlı olarak izler. Career yüzeyleri bu değeri
 * animasyon tipini seçmek için kullanır; tercih değiştiğinde yeni modal/overlay
 * açılışları da hemen uyum sağlar.
 */
const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReduceMotion(Boolean(enabled));
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (enabled) => setReduceMotion(Boolean(enabled)));
    return () => {
      active = false;
      subscription?.remove?.();
    };
  }, []);

  return reduceMotion;
};

export default useReducedMotion;
