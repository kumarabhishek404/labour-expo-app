const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// DO NOT blacklist node_modules
// DO NOT override watchFolders unless you know why

module.exports = config;