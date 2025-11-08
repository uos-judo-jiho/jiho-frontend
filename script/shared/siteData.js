import fs from "fs";
import path from "path";

const CACHE_TTL_MINUTES = Math.max(
  0,
  Number(process.env.SITE_DATA_CACHE_TTL_MINUTES ?? "10"),
);

const projectRoot = process.env.PWD || process.cwd();
const CACHE_DIR = path.join(projectRoot, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "site-data.json");

export const yearCandidates = Array.from(
  { length: new Date().getFullYear() - 2021 },
  (_, i) => 2022 + i,
);

const cloneFallback = (value) =>
  value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;

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

const normalizeArticles = (raw) => {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw?.articles && Array.isArray(raw.articles)) {
    return raw.articles;
  }
  return [];
};

const fetchNewsByYear = async () => {
  const entries = await Promise.all(
    yearCandidates.map(async (year) => {
      const raw = await fetchJson(`https://uosjudo.com/api/news/${year}`, {
        articles: [],
      });
      return [year, normalizeArticles(raw)];
    }),
  );
  return Object.fromEntries(entries);
};

const fetchTrainings = async () => {
  const raw = await fetchJson(`https://uosjudo.com/api/trainings`, {
    trainingLogs: [],
  });
  return {
    trainingLogs: Array.isArray(raw?.trainingLogs) ? raw.trainingLogs : [],
  };
};

const fetchNotices = async () => {
  const raw = await fetchJson(`https://uosjudo.com/api/notices`, {
    notices: [],
  });
  return { notices: Array.isArray(raw?.notices) ? raw.notices : [] };
};

const buildSiteData = async () => {
  const [newsByYear, trainings, notices] = await Promise.all([
    fetchNewsByYear(),
    fetchTrainings(),
    fetchNotices(),
  ]);

  return {
    fetchedAt: new Date().toISOString(),
    newsByYear,
    trainings,
    notices,
    yearCandidates,
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
