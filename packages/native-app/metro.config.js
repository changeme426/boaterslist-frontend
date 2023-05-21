// Learn more https://docs.expo.io/guides/customizing-metro
//const { getDefaultConfig } = require('expo/metro-config');

//module.exports = getDefaultConfig(__dirname);

// yarn module support
const { createMetroConfiguration } = require('expo-yarn-workspaces');

module.exports = createMetroConfiguration(__dirname)

module.exports.transformer = {
  ...module.exports.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
}
module.exports.resolver = {
  ...module.exports.resolver,
  assetExts: module.exports.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...module.exports.resolver.sourceExts, "svg"],
}
