/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true, // (optional)
  sitemapSize: 20000,

  exclude: [
    '/server-sitemap-index.xml',
    '/categories',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.SITE_URL}/server-sitemap-index.xml`,
    ],
  },
}