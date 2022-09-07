/** @type {import('next').NextConfig} */

const nextTranslate = require("next-translate");

const nextConfig = {
  // TODO react-tooltip is currently bugged with React18, technically its fixed, but not yet pushed to npm // until update goes live, reactStrictMode: false solves the issue
  // reactStrictMode: false,
  i18n: {
    locales: ["en", "de", "es", "zh", "hi", "pt", "ru"],
    defaultLocale: "en",
    localeDetection: true,
  },
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

// module.exports = nextConfig;

module.exports = nextTranslate(nextConfig);
