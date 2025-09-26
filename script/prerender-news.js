import fs from "fs";
import path from "path";

// News 연도 목록 (sitemap.js와 동일한 값 사용)
const NEWS_YEARS = ["2022", "2023", "2024"];
const API_BASE_URL = "https://uosjudo.com/api";

/**
 * 뉴스 데이터를 미리 가져와서 정적 JSON 파일로 저장
 */
const prerenderNewsData = async () => {
  console.log("Starting news data prerendering...");

  // build/client/prerendered 디렉토리 생성 (빌드 결과물과 함께)
  const outputDir = path.join(process.cwd(), "build", "server", "prerendered");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const year of NEWS_YEARS) {
    try {
      console.log(`Fetching news data for year ${year}...`);

      // public/prerendered/news-<year>.json 파일이 이미 존재하면 건너뜀
      const existingFilePath = path.join(outputDir, `news-${year}.json`);
      if (fs.existsSync(existingFilePath)) {
        console.log(
          `✓ News data for ${year} already exists at ${existingFilePath}, skipping fetch.`
        );
        continue;
      }

      // API에서 뉴스 데이터 가져오기

      const response = await fetch(`${API_BASE_URL}/news/${year}`);
      if (!response.ok) {
        console.warn(`Failed to fetch news for ${year}: ${response.status}`);
        continue;
      }

      const newsData = await response.json();

      // 데이터를 JSON 파일로 저장
      const filePath = path.join(outputDir, `news-${year}.json`);
      fs.writeFileSync(filePath, JSON.stringify(newsData, null, 2));

      console.log(`✓ Saved news data for ${year} to ${filePath}`);
    } catch (error) {
      console.error(`Error fetching news for ${year}:`, error);
    }
  }

  console.log("News data prerendering completed!");
};

prerenderNewsData();
