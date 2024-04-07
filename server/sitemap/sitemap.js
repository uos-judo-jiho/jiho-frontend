import fs from "fs";

import { getTrainings } from "../api/trainings";
import { getNews } from "../api/news";
import { getNotices } from "../api/notice";

const filePath = `${process.env.PWD}/public/sitemap.xml`;

const generateSitemap = async () => {
  const trainingData = await getTrainings();
  const newsData2022 = await getNews("2022").then((newsData) => newsData.articles);
  const newsData2023 = await getNews("2023").then((newsData) => newsData.articles);
  const noticeData = await getNotices();

  /**
   * @type {{loc: string, lastmod?: string, changefreq?: string, priority?: string}[]}
   */
  const sitemapMetaDataList = [
    { loc: "https://uosjudo.com/photo", changefreq: "weekly" },
    ...trainingData.map((trianing) => ({ loc: `https://uosjudo.com/photo/${trianing.id}`, lastmod: trianing.dateTime, changefreq: "never" })),
    { loc: "https://uosjudo.com/news", changefreq: "yearly" },
    { loc: "https://uosjudo.com/news/2022", changefreq: "never" },
    ...newsData2022.map((news) => ({ loc: `https://uosjudo.com/news/2022/${news.id}`, lastmod: news.dateTime, changefreq: "never" })),
    { loc: "https://uosjudo.com/news/2023", changefreq: "never" },
    ...newsData2023.map((news) => ({ loc: `https://uosjudo.com/news/2023/${news.id}`, lastmod: news.dateTime, changefreq: "never" })),
    { loc: "https://uosjudo.com/notice" },
    ...noticeData.map((notice) => ({ loc: `https://uosjudo.com/notice/${notice.id}`, lastmod: notice.dateTime, changefreq: "never" })),
  ];

  const sitemapURL = sitemapMetaDataList
    .map(
      (sitemapMetaData) =>
        ` <url>
    ${[
      `<loc>${sitemapMetaData.loc}</loc>`,
      `${sitemapMetaData?.lastmod ? `<lastmod>${sitemapMetaData.lastmod}</lastmod>` : ""}`,
      `${sitemapMetaData?.changefreq ? `<changefreq>${sitemapMetaData.changefreq}</changefreq>` : ""}`,
      `${sitemapMetaData?.priority ? `<priority>${sitemapMetaData.priority}</priority>` : ""}`,
    ]
      .filter((_) => _)
      .join("\n\t\t")}
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapURL}
</urlset>
`;

  fs.writeFile(filePath, sitemap, (err) => {
    if (err) {
      console.error("Error create sitemap:", err);
      return;
    }
    console.log("Sitemap created successfully!");
  });
};

(async () => await generateSitemap())();
