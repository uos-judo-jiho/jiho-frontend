import fs from "fs";
import path from "path";

const CACHE_TTL_MINUTES = Math.max(
  0,
  Number(process.env.SITE_DATA_CACHE_TTL_MINUTES ?? "10"),
);

/**
 * 사이트맵이 읽는 공개 API.
 *
 * 예전에는 `/api/news/{year}`·`/api/trainings`·`/api/notices` 를 불렀는데,
 * 백엔드 라우트는 전부 `/api/v2/*` 라서 매번 404 로 떨어지고 사이트맵에
 * 게시글이 한 건도 실리지 않고 있었다. 지금은 통합 목록 엔드포인트를 쓴다
 * (api#41) — 한 번에 최대 100건씩이라 total 까지 이어 받는다.
 */
const API_BASE_URL = (
  process.env.SITE_DATA_BASE_URL ?? "https://uosjudo.com/api"
).replace(/\/$/, "");

const PAGE_SIZE = 100;

const projectRoot = process.env.PWD || process.cwd();
const CACHE_DIR = path.join(projectRoot, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "site-data.json");

const cloneFallback = (value) =>
  value && typeof value === "object"
    ? JSON.parse(JSON.stringify(value))
    : value;

const fetchJson = async (url, fallbackValue) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[site-data] (${response.status}) ${url}`);
      return cloneFallback(fallbackValue);
    }
    return await response.json();
  } catch (error) {
    console.error(`[site-data] Request failed for ${url}`, error);
    return cloneFallback(fallbackValue);
  }
};

/** `GET /api/v2/boards` 를 total 까지 이어 받는다 */
const fetchAllBoards = async (type) => {
  const items = [];
  let offset = 0;

  for (;;) {
    const page = await fetchJson(
      `${API_BASE_URL}/v2/boards?type=${type}&limit=${PAGE_SIZE}&offset=${offset}`,
      { items: [], total: 0 },
    );
    const pageItems = Array.isArray(page?.items) ? page.items : [];
    items.push(...pageItems);

    offset += pageItems.length;
    if (pageItems.length === 0 || offset >= Number(page?.total ?? 0)) {
      return items;
    }
  }
};

/** 연도별 지호지. 연도는 게시글 날짜에서 나오므로 별도 상수가 필요 없다. */
const groupByYear = (articles) => {
  const byYear = {};
  for (const article of articles) {
    const year = String(article.dateTime ?? "").slice(0, 4);
    if (!year) continue;
    (byYear[year] ??= []).push(article);
  }
  return byYear;
};

const buildSiteData = async () => {
  const [newsArticles, trainingLogs, notices] = await Promise.all([
    fetchAllBoards("news"),
    fetchAllBoards("training"),
    fetchAllBoards("notice"),
  ]);

  return {
    fetchedAt: new Date().toISOString(),
    newsByYear: groupByYear(newsArticles),
    trainings: { trainingLogs },
    notices: { notices },
  };
};

const isCacheFresh = (cache) => {
  if (!cache?.fetchedAt || !CACHE_TTL_MINUTES) {
    return false;
  }
  const fetchedAt = new Date(cache.fetchedAt).getTime();
  if (Number.isNaN(fetchedAt)) {
    return false;
  }
  const ageMinutes = (Date.now() - fetchedAt) / 1000 / 60;
  return ageMinutes <= CACHE_TTL_MINUTES;
};

const readCache = () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (isCacheFresh(parsed)) {
      console.log("[site-data] Using cached payload");
      return parsed;
    }
  } catch (error) {
    console.warn("[site-data] Failed to read cache", error);
  }
  return null;
};

const writeCache = (payload) => {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(payload), "utf-8");
  } catch (error) {
    console.warn("[site-data] Failed to write cache", error);
  }
};

let memoized = null;

export const getSiteData = async ({
  forceRefresh = process.env.FORCE_REFRESH_SITE_DATA === "true",
} = {}) => {
  if (memoized && !forceRefresh) {
    return memoized;
  }

  if (!forceRefresh) {
    const cached = readCache();
    if (cached) {
      memoized = cached;
      return cached;
    }
  }

  const payload = await buildSiteData();
  memoized = payload;
  writeCache(payload);
  return payload;
};

export const clearSiteDataCache = () => {
  memoized = null;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
  } catch (error) {
    console.warn("[site-data] Failed to clear cache", error);
  }
};

export const getSiteDataCacheFile = () => CACHE_FILE;
