/** @type {import('expo/metro-config').MetroConfig} */
import { getDefaultConfig } from "expo/metro-config";
// const config = getDefaultConfig(__dirname);
// module.exports = config;

module.exports = {
  ...getDefaultConfig(__dirname),
  watchFolders: [],
  resolver: {
    blacklistRE: /node_modules\/.*\/node_modules|\.git|logs|tmp/,
  },
};
