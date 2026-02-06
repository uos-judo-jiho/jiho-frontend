import fs from "fs";
import { getSiteData, yearCandidates } from "./shared/siteData.js";

const filePath = `${process.env.PWD}/public/sitemap.xml`;

const generateSitemap = async () => {
  const { trainings, newsByYear, notices } = await getSiteData();

  const trainingLogs = trainings?.trainingLogs ?? [];
  const noticeList = notices?.notices ?? [];
  const currentYear = new Date().getFullYear();

  const latestTrainingDate = trainingLogs.length
    ? new Date(trainingLogs[0].dateTime).toISOString()
    : null;

  const latestNewsArticles = newsByYear?.[currentYear] ?? [];
  const latestNewsDate = latestNewsArticles.length
    ? new Date(latestNewsArticles[0].dateTime).toISOString()
    : null;

  /**
   * @type {{loc: string, lastmod?: string, Lastmod?: string, priority?: string}[]}
   */
  const sitemapMetaDataList = [
    {
      loc: "https://uosjudo.com/photo",
      lastmod: latestTrainingDate,
      priority: "0.9",
    },
    ...trainingLogs.map((training) => ({
      loc: `https://uosjudo.com/photo/${training.id}`,
      lastmod: new Date(training.dateTime).toISOString(),
      priority: "0.7",
    })),
    {
      loc: "https://uosjudo.com/news",
      lastmod: latestNewsDate,
      priority: "0.9",
    },
    ...yearCandidates.map((year) => ({
      loc: `https://uosjudo.com/news/${year}`,
      lastmod: new Date(`${year}-12-31`).toISOString(),
      priority: "0.8",
    })),
    ...Object.entries(newsByYear).flatMap(([year, newsList]) =>
      (newsList ?? []).map((news) => ({
        loc: `https://uosjudo.com/news/${year}/${news.id}`,
        lastmod: new Date(news.dateTime).toISOString(),
        priority: "0.8",
      })),
    ),
    {
      loc: "https://uosjudo.com/notice",
      lastmod: noticeList.length
        ? new Date(noticeList[0].dateTime).toISOString()
        : undefined,
      priority: "0.6",
    },
    ...noticeList.map((notice) => ({
      loc: `https://uosjudo.com/notice/${notice.id}`,
      lastmod: notice.dateTime
        ? new Date(notice.dateTime).toISOString()
        : undefined,
      priority: "0.5",
    })),
  ];

  const sitemapURL = sitemapMetaDataList
    .map(
      (sitemapMetaData) =>
        ` <url>
    ${[
      `<loc>${sitemapMetaData.loc}</loc>`,
      `${
        sitemapMetaData?.lastmod
          ? `<lastmod>${sitemapMetaData.lastmod}</lastmod>`
          : ""
      }`,
      `${
        sitemapMetaData?.changefreq
          ? `<changefreq>${sitemapMetaData.changefreq}</changefreq>`
          : ""
      }`,
      `${
        sitemapMetaData?.priority
          ? `<priority>${sitemapMetaData.priority}</priority>`
          : ""
      }`,
    ]
      .filter((_) => _)
      .join("\n")}
  </url>`,
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

generateSitemap();
