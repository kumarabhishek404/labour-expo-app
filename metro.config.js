const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // keep default assetExts and sourceExts
  const { assetExts, sourceExts } = config.resolver;

  return {
    ...config,

    watchFolders: [],

    resolver: {
      // include your custom blacklist
      blacklistRE: /node_modules\/.*\/node_modules|\.git|logs|tmp/,

      // merge with Expo default required extensions
      assetExts,
      sourceExts,
    },
  };
})();