import fs from "fs";

const filePath = `${process.env.PWD}/public/sitemap.xml`;

// 2022, 2023, 2024
const yearCandidates = Array.from(
  { length: new Date().getFullYear() - 2021 },
  (_, i) => 2022 + i
);

/**
 * 현재 년도까지의 뉴스 데이터를 불러와서 사이트맵에 추가
 * /news/{year}/{id} 형식으로 추가
 */
const fetchHistoricalNews = async (year) => {
  const res = await fetch(`https://uosjudo.com/api/news/${year}`);
  if (!res.ok) {
    console.warn(`Failed to fetch historical news for ${year}`);
    return [];
  }
  return await res.json();
};

const fetchHistoricalTrainings = async () => {
  const res = await fetch(`https://uosjudo.com/api/trainings`);

  if (!res.ok) {
    console.warn(`Failed to fetch historical trainings`);
    return [];
  }
  return await res.json();
};

const generateSitemap = async () => {
  const trainings = await fetchHistoricalTrainings();

  const latestTrainingDate = trainings.trainingLogs.length
    ? new Date(trainings.trainingLogs[0].dateTime).toISOString()
    : null;

  const currentYear = new Date().getFullYear();

  const latestNews = await fetchHistoricalNews(currentYear);
  const latestNewsDate = latestNews.length
    ? new Date(latestNews[0].dateTime).toISOString()
    : null;

  const newsByYear = {};
  for (const year of yearCandidates) {
    newsByYear[year] = await fetchHistoricalNews(year).then(
      (news) => news.articles
    );
  }

  /**
   * @type {{loc: string, lastmod?: string, Lastmod?: string, priority?: string}[]}
   */
  const sitemapMetaDataList = [
    {
      loc: "https://uosjudo.com/photo",
      lastmod: latestTrainingDate,
      priority: "0.9",
    },
    ...trainings.trainingLogs.map((training) => ({
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
      newsList.map((news) => ({
        loc: `https://uosjudo.com/news/${year}/${news.id}`,
        lastmod: new Date(news.dateTime).toISOString(),
        priority: "0.8",
      }))
    ),
    { loc: "https://uosjudo.com/notice" },
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

generateSitemap();
