module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'inline-dotenv',
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
            '@styles': './src/styles',
            '@models': './src/models',
            '@mutation': './src/mutation',
            '@query': './src/query',
            '@type': './src/type',
          },
        },
      ],
    ],
  };
};
