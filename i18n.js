module.exports = {
  locales: ["en", "de"], // English, German,
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "rgx:/": ["index"],
    "rgx:/(location)s?/?([Country])?/?([State])?/?([City])?/?": ["location"], // no need for \ in front of / inside this regex string
    "rgx:/(subject)s?/?([SubjectCategory])?/?([Subject])?/?": ["subject"],
    "rgx:/(institution)s?/?([Country])?/?([Institution])?/?.*": ["institution"], // s? Can be removed if we ever decide to call List Pages without s, eg. locations -> location
    "rgx:/(account)s?/?.*": ["account"],
    "rgx:/(login|register)": ["loginLogout"]
  },
  defaultNS: "common"
};


