module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@opentelemetry/api': './__mocks__/@opentelemetry/api.js',
          },
        },
      ],
    ],
  };
};