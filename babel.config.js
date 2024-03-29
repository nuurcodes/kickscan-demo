module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@containers': './src/containers',
            '@config': './src/config',
            '@hooks': './src/hooks',
            '@lib': './src/lib',
            '@utils': './src/utils',
            '@navigators': './src/navigators',
            '@screens': './src/screens',
            '@services': './src/services',
            '@store': './src/store',
            '@theme': './src/theme',
            '@models': './src/models',
            '@mutation': './src/mutation',
            '@query': './src/query',
            '@type': './src/type',
          },
        },
      ],
      [
        'react-native-reanimated/plugin',
        {
          globals: ['__scanCodes'],
        },
      ],
    ],
  };
};
