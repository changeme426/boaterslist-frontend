module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      [
        'formatjs', {
          "idInterpolationPattern": "[sha512:contenthash:base64:6]",
          "ast": true
        }],
    ],
  };
};
