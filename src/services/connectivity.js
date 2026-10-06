// connectivity — one place to ask "are we online?" and to hear "we're back
// online". Everything that talks to Supabase uses it so the app never waits on
// the network: when offline it works from SQLite / the offline queue, and the
// reconnect listeners push or pull what was missed.
//
// NetInfo is required lazily so plain Node tests (no native module) treat the
// device as online and let the request itself decide.

const loadNetInfo = () => {
  try {
    return require('@react-native-community/netinfo').default;
  } catch {
    return null;
  }
};

const isConnectedState = (state) =>
  Boolean(state?.isConnected) && state?.isInternetReachable !== false;

/** Best-effort reachability check. Defaults to true when it can't tell. */
export const isOnline = async () => {
  const NetInfo = loadNetInfo();
  if (!NetInfo?.fetch) return true;
  try {
    return isConnectedState(await NetInfo.fetch());
  } catch {
    return true;
  }
};

/**
 * Calls `callback` every time the device goes from offline to online.
 * Returns an unsubscribe function.
 */
export const onReconnect = (callback) => {
  const NetInfo = loadNetInfo();
  if (!NetInfo?.addEventListener) return () => {};
  let wasOnline = null;
  const unsubscribe = NetInfo.addEventListener((state) => {
    const online = isConnectedState(state);
    if (online && wasOnline === false) callback();
    wasOnline = online;
  });
  return typeof unsubscribe === 'function' ? unsubscribe : () => {};
};

/** Calls `callback(online)` on every connectivity change. */
export const onConnectivityChange = (callback) => {
  const NetInfo = loadNetInfo();
  if (!NetInfo?.addEventListener) return () => {};
  const unsubscribe = NetInfo.addEventListener((state) => callback(isConnectedState(state)));
  return typeof unsubscribe === 'function' ? unsubscribe : () => {};
};
