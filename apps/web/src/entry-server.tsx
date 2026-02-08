import { v1Api, v2Api } from "@packages/api";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import axios from "axios";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRouter from "./app/routers/AppRouter";
import { HelmetContext } from "./features/seo/helmet/MyHelmet";
import { StructuredDataContext } from "./features/seo/StructuredData";
import { normalizeNewsResponse } from "./shared/lib/api/news";
import { vaildNewsYearList } from "./shared/lib/utils/Utils";

type HelmetData = {
  title: string;
  description: string;
  imgUrl: string;
  url?: string;
};

const SSR_AXIOS_INTERCEPTOR_KEY = "__SSR_AXIOS_INTERCEPTOR__";

if (typeof window === "undefined") {
  const globalAny = globalThis as typeof globalThis & {
    [SSR_AXIOS_INTERCEPTOR_KEY]?: boolean;
  };

  if (!globalAny[SSR_AXIOS_INTERCEPTOR_KEY]) {
    axios.interceptors.response.use(
      (response) => {
        if (response && "request" in response) {
          delete (response as { request?: unknown }).request;
        }
        return response;
      },
      (error) => {
        if (error?.response && "request" in error.response) {
          delete (error.response as { request?: unknown }).request;
        }
        return Promise.reject(error);
      },
    );
    globalAny[SSR_AXIOS_INTERCEPTOR_KEY] = true;
  }
}

export async function render(url: string) {
  // Create a new QueryClient for each SSR request
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 24 * 60 * 60 * 1000, // 1 day
        retry: false, // Don't retry on SSR
      },
    },
  });

  console.log("[SSR] Rendering URL:", url);

  let awardsForMeta: { title: string }[] = [];

  // Prefetch data based on route
  try {
    // Match photo routes: /photo or /photo/:id
    const photoMatch = url.match(/^\/photo/);
    if (photoMatch) {
      console.log("[SSR] Prefetching trainings for photo page");
      const trainingOptions = v1Api.getGetApiV1TrainingsQueryOptions();
      const trainingsResponse = await queryClient.fetchQuery(trainingOptions);
      const trainings = trainingsResponse.data.trainingLogs ?? [];
      console.log("[SSR] Prefetched trainings count:", trainings.length);
    }

    // Match news routes:
    // - /news
    // - /news/:year
    // - /news/:year/:index
    const newsMatch = url.match(/^\/news\/(\d{4})/);
    const newsMatchRoot = url === "/news";
    if (newsMatchRoot) {
      console.log("[SSR] Prefetching latest news for news root page");

      const allNewsQueryPromises = vaildNewsYearList().map(async (year) => {
        const newsOptions = v1Api.getGetApiV1NewsYearQueryOptions(Number(year));
        const newsResponse = await queryClient.fetchQuery(newsOptions);
        const data = normalizeNewsResponse(newsResponse.data, year);
        console.log(
          "[SSR] Prefetched news for year:",
          data?.year || "Not found",
        );
        return data;
      });

      await Promise.all(allNewsQueryPromises);
    } else if (newsMatch) {
      const year = newsMatch[1];
      console.log("[SSR] Prefetching news for year:", year);
      const newsOptions = v1Api.getGetApiV1NewsYearQueryOptions(Number(year));
      const newsResponse = await queryClient.fetchQuery(newsOptions);
      const data = normalizeNewsResponse(newsResponse.data, year);
      console.log("[SSR] Prefetched news:", data?.year || "Not found");
    }

    // Add more route-specific prefetching as needed
    // e.g., notices, etc.

    if (url === "/") {
      console.log("[SSR] Prefetching awards for home page");
      const awardsOptions = v2Api.getGetApiV2AwardsQueryOptions();
      const awardsResponse = await queryClient.fetchQuery(awardsOptions);
      awardsForMeta = awardsResponse.data.awards ?? [];
      console.log("[SSR] Prefetched awards count:", awardsForMeta.length);
    }
  } catch (error) {
    // Always log errors even in production
    console.error("[SSR] Prefetch error:", error);
    // Continue rendering even if prefetch fails
  }

  // Helmet data collector for SSR
  // Default metadata for home page
  const defaultDescription =
    awardsForMeta.length > 0
      ? awardsForMeta.map((award) => award.title).join(", ")
      : "서울시립대학교 유도부 지호";

  let helmetData: HelmetData = {
    title: "서울시립대학교 유도부 지호 | Home",
    description:
      url === "/" ? defaultDescription : "서울시립대학교 유도부 지호",
    imgUrl: "/favicon-96x96.png",
  };

  const setHelmetData = (data: HelmetData) => {
    helmetData = data;
  };

  // Structured data collector for SSR
  let structuredData: object | null = null;

  const setStructuredData = (data: object) => {
    structuredData = data;
  };

  const html = await new Promise<string>((resolve, reject) => {
    const stream = new PassThrough();
    let result = "";

    let timeoutId: NodeJS.Timeout | null = null;

    stream.on("data", (chunk) => {
      result += chunk.toString();
    });

    stream.on("end", () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resolve(result);
    });

    stream.on("error", (error) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      reject(error);
    });

    const { pipe, abort } = renderToPipeableStream(
      <StructuredDataContext.Provider value={{ setStructuredData }}>
        <HelmetContext.Provider value={{ setHelmetData }}>
          <QueryClientProvider client={queryClient}>
            <StaticRouter location={url}>
              <AppRouter />
            </StaticRouter>
          </QueryClientProvider>
        </HelmetContext.Provider>
      </StructuredDataContext.Provider>,
      {
        onAllReady() {
          pipe(stream);
        },
        onShellError(error) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          reject(error);
        },
        onError(error) {
          console.error("[SSR] Render error:", error);
        },
      },
    );

    timeoutId = setTimeout(() => {
      abort();
    }, 10000);
  });

  // Dehydrate the query cache to send to client
  const dehydratedState = dehydrate(queryClient);

  console.log("[SSR] Helmet data");
  console.table(helmetData);
  console.log("[SSR] Structured data:", structuredData ? "Present" : "None");

  return { html, dehydratedState, helmetData, structuredData };
}
