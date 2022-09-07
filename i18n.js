module.exports = {
  locales: ["en", "de", "es", "zh", "hi", "pt", "ru"], // English, German, Spanish, Chinese, Hindi, Portoguese, Russian, 
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "rgx:/(location)s?/?([Country])?/?([State])?/?([City])?/?": ["location"], // no need for \ in front of / inside this regex string
    "rgx:/(subject)s?/?([SubjectCategory])?/?([Subject])?/?": ["subject"],
    "rgx:/(institution)s?/?([Country])?/?([Institution])?/?.*": ["institution"], // s? Can be removed if we ever decide to call List Pages without s, eg. locations -> location
    "rgx:/(account)s?/?.*": ["account"],
    "rgx:/(login|register)": ["loginLogout"]
  },
  defaultNS: "common"
};


