module.exports = {
  locales: ["en","de"], // English, German,
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "rgx:/": ["index"],
    "rgx:/(location)s?/?([Country])?/?([State])?/?([City])?/?": ["location"], // no need for \ in front of / inside this regex string
    "rgx:/(category|categories)/?([Category])?/?([Subject])?/?": ["category"],
    "rgx:/(institution)s?/?([Country])?/?([Institution])?/?.*": ["institution"], // s? Can be removed if we ever decide to call List Pages without s, eg. locations -> location
    "rgx:/(account)s?/?.*": ["account"],
    "rgx:/(login|register)": ["loginLogout"],
    "rgx:/(analysis)/?.*": ["analysis"],
    "rgx:/(news)/?.*": ["news"],
    "rgx:/(search)/?.*": ["search"],
  },
  defaultNS: "common"
};


