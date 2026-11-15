import { useUserData } from '../context/UserDataContext';
import { shouldShowAd } from '../utils/ads';

/**
 * True when native ad slots may be added to a screen for this user. Screens
 * insert slots only when this is true, so Premium users (and builds without a
 * native unit, Expo Go, restricted regions) get no extra gaps in their lists.
 */
export default function useNativeAdsEnabled() {
  const { isPremium, isOnboarded } = useUserData();
  return shouldShowAd({ isPremium, isOnboarded, kind: 'native' });
}
