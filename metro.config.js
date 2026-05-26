const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Supabase-ийн OTEL_PKG алдааг устгах хэсэг
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@opentelemetry/api')) {
    return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;