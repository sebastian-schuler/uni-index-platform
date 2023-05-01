/** @type {import('next').NextConfig} */

const nextTranslate = require("next-translate-plugin");

const nextConfig = {
  i18n: {
    locales: ["en", "de", "es", "zh", "hi", "pt", "ru"],
    defaultLocale: "en",
    localeDetection: true,
  },
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  eslint: {
    dirs: ["pages", "components", "lib", "features", "theme"],
  }
};

module.exports = nextTranslate(nextConfig);
