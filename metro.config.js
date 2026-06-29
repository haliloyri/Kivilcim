const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'react-native-worklets': path.resolve(__dirname, 'node_modules/react-native-worklets'),
};

config.resolver.assetExts.push('db', 'sqlite', 'wasm');

module.exports = config;
