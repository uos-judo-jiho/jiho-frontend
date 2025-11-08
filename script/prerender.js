import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(process.env.PWD, "build", "prerendered");

// 2022년부터 현재 연도까지
const yearCandidates = Array.from(
  { length: new Date().getFullYear() - 2021 },
  (_, i) => 2022 + i,
);

/**
 * API에서 뉴스 데이터를 가져옴
 */
const fetchNews = async (year) => {
  try {
    const res = await fetch(`https://uosjudo.com/api/news/${year}`);
    if (!res.ok) {
      console.warn(`Failed to fetch news for ${year}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching news for ${year}:`, error);
    return null;
  }
};

/**
 * API에서 트레이닝 로그 데이터를 가져옴
 */
const fetchTrainings = async () => {
  try {
    const res = await fetch(`https://uosjudo.com/api/trainings`);
    if (!res.ok) {
      console.warn(`Failed to fetch trainings`);
      return { trainingLogs: [] };
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching trainings:`, error);
    return { trainingLogs: [] };
  }
};

/**
 * API에서 공지사항 데이터를 가져옴
 */
const fetchNotices = async () => {
  try {
    const res = await fetch(`https://uosjudo.com/api/notices`);
    if (!res.ok) {
      console.warn(`Failed to fetch notices`);
      return { notices: [] };
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching notices:`, error);
    return { notices: [] };
  }
};

/**
 * SSG 대상 라우트를 결정
 */
const getStaticRoutes = async () => {
  const routes = [];
  const currentYear = new Date().getFullYear();

  // 1. 과거 연도 뉴스 페이지 (현재 연도는 제외 - SSR로 처리)
  const newsByYear = {};
  for (const year of yearCandidates) {
    if (year >= currentYear) continue; // 현재 연도는 SSR

    const newsData = await fetchNews(year);
    if (newsData && newsData.articles) {
      newsByYear[year] = newsData.articles;

      // /news/{year}
      routes.push({
        path: `/news/${year}`,
        type: 'news-list',
        year: year.toString(),
      });

      // /news/{year}/{id}
      newsData.articles.forEach((article) => {
        routes.push({
          path: `/news/${year}/${article.id}`,
          type: 'news-detail',
          year: year.toString(),
          id: article.id.toString(),
        });
      });
    }
  }

  // 2. 트레이닝 로그 (사진) 페이지
  const trainingsData = await fetchTrainings();
  if (trainingsData.trainingLogs && trainingsData.trainingLogs.length > 0) {
    // /photo 페이지는 항상 최신 데이터를 보여주므로 SSR로 처리
    // /photo/{id} 상세 페이지만 SSG
    trainingsData.trainingLogs.forEach((training) => {
      routes.push({
        path: `/photo/${training.id}`,
        type: 'photo-detail',
        id: training.id.toString(),
      });
    });
  }

  // 3. 공지사항 페이지
  const noticesData = await fetchNotices();
  if (noticesData.notices && noticesData.notices.length > 0) {
    // /notice 목록 페이지
    routes.push({
      path: `/notice`,
      type: 'notice-list',
    });

    // /notice/{id} 상세 페이지
    noticesData.notices.forEach((notice) => {
      routes.push({
        path: `/notice/${notice.id}`,
        type: 'notice-detail',
        id: notice.id.toString(),
      });
    });
  }

  return routes;
};

/**
 * 단일 페이지를 렌더링
 */
const renderPage = async (route, render, template) => {
  try {
    console.log(`[SSG] Rendering: ${route.path}`);

    const {
      html,
      dehydratedState,
      styleTags,
      helmetData,
      structuredData,
    } = await render(route.path);

    // React Query state 주입
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
      dehydratedState,
    ).replace(/</g, "\\u003c")};</script>`;

    // Structured data 주입
    const structuredDataScript = structuredData
      ? `\n    <script type="application/ld+json">${JSON.stringify(
          structuredData,
        )}</script>`
      : "";

    // HTML 조합
    let finalHtml = template
      .replace(`<!--app-html-->`, html)
      .replace(`<!--app-styles-->`, styleTags)
      .replace(`</head>`, `${stateScript}${structuredDataScript}\n  </head>`);

    // Meta tags 업데이트
    if (helmetData) {
      const fullUrl = `https://uosjudo.com${route.path}`;

      finalHtml = finalHtml
        .replace(/<title>.*?<\/title>/, `<title>${helmetData.title}</title>`)
        .replace(
          /<meta property="og:type" content=".*?" \/>/,
          `<meta property="og:type" content="${helmetData.articleType || "website"}" />`,
        )
        .replace(
          /<meta property="og:title" content=".*?" \/>/,
          `<meta property="og:title" content="${helmetData.title}" />`,
        )
        .replace(
          /<meta name="description" content=".*?" \/>/,
          `<meta name="description" content="${helmetData.description}" />`,
        )
        .replace(
          /<meta property="og:description" content=".*?" \/>/,
          `<meta property="og:description" content="${helmetData.description}" />`,
        )
        .replace(
          /<meta property="og:url" content=".*?" \/>/,
          `<meta property="og:url" content="${fullUrl}" />`,
        )
        .replace(
          /<meta property="og:image" content=".*?" \/>/,
          `<meta property="og:image" content="${helmetData.imgUrl}" />`,
        );

      // Article-specific tags
      if (helmetData.articleType === "article") {
        let articleTags = "";
        if (helmetData.datePublished) {
          articleTags += `\n    <meta property="article:published_time" content="${helmetData.datePublished}" />`;
        }
        if (helmetData.dateModified) {
          articleTags += `\n    <meta property="article:modified_time" content="${helmetData.dateModified}" />`;
        }
        if (helmetData.author) {
          articleTags += `\n    <meta property="article:author" content="${helmetData.author}" />`;
        }
        if (articleTags) {
          finalHtml = finalHtml.replace("</head>", `${articleTags}\n  </head>`);
        }
      }
    }

    return finalHtml;
  } catch (error) {
    console.error(`[SSG] Error rendering ${route.path}:`, error);
    return null;
  }
};

/**
 * 모든 페이지를 프리렌더
 */
const prerenderAll = async () => {
  console.log("[SSG] Starting pre-rendering...");

  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // SSG 대상 라우트 가져오기
  const routes = await getStaticRoutes();
  console.log(`[SSG] Found ${routes.length} routes to pre-render`);

  // SSR entry 모듈 로드
  const serverBuildPath = path.join(process.env.PWD, "build", "server", "entry-server.js");
  if (!fs.existsSync(serverBuildPath)) {
    console.error("[SSG] Server build not found. Run build:server first.");
    process.exit(1);
  }

  const { render } = await import(serverBuildPath);

  // HTML 템플릿 로드
  const templatePath = path.join(process.env.PWD, "build", "client", "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("[SSG] Client build not found. Run build:client first.");
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");

  // 각 라우트 렌더링
  let successCount = 0;
  let failCount = 0;

  for (const route of routes) {
    const html = await renderPage(route, render, template);

    if (html) {
      // 파일 경로 생성 (예: /news/2023 -> news/2023.html)
      const filePath = path.join(
        outputDir,
        route.path.replace(/^\//, "") + ".html",
      );

      // 디렉토리 생성
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // HTML 파일 저장
      fs.writeFileSync(filePath, html, "utf-8");
      console.log(`[SSG] ✓ ${route.path} -> ${filePath}`);
      successCount++;
    } else {
      console.log(`[SSG] ✗ ${route.path} - Failed`);
      failCount++;
    }
  }

  console.log(`\n[SSG] Pre-rendering complete!`);
  console.log(`[SSG] Success: ${successCount}, Failed: ${failCount}`);
  console.log(`[SSG] Output directory: ${outputDir}`);
};

// 실행
prerenderAll().catch((error) => {
  console.error("[SSG] Fatal error:", error);
  process.exit(1);
});
