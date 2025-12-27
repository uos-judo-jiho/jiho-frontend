import { awardsData } from "@/lib/assets/data/awards";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { RecoilRoot } from "recoil";
import { getNews } from "./api/news/client";
import { getTrainings } from "./api/trainings/client";
import { HelmetContext } from "./features/seo/helmet/MyHelmet";
import { StructuredDataContext } from "./features/seo/StructuredData";
import { vaildNewsYearList } from "./lib/utils/Utils";
import AppRouter from "./routers/AppRouter";

type HelmetData = {
  title: string;
  description: string;
  imgUrl: string;
  url?: string;
};

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

  // Prefetch data based on route
  try {
    // Match photo routes: /photo or /photo/:id
    const photoMatch = url.match(/^\/photo/);
    if (photoMatch) {
      console.log("[SSR] Prefetching trainings for photo page");
      await queryClient.prefetchQuery({
        queryKey: ["trainings", "all"],
        queryFn: async () => {
          const data = await getTrainings();
          console.log("[SSR] Prefetched trainings count:", data.length);
          return data;
        },
      });
    }

    // Match news routes:
    // - /news
    // - /news/:year
    // - /news/:year/:index
    const newsMatch = url.match(/^\/news\/(\d{4})/);
    const newsMatchRoot = url === "/news";
    if (newsMatchRoot) {
      console.log("[SSR] Prefetching latest news for news root page");

      const allNewsQueryPromises = vaildNewsYearList().map((year) =>
        queryClient.prefetchQuery({
          queryKey: ["news", year],
          queryFn: async () => {
            const data = await getNews(year);
            console.log(
              "[SSR] Prefetched news for year:",
              data?.year || "Not found"
            );
            return data;
          },
        })
      );

      await Promise.all(allNewsQueryPromises);
    } else if (newsMatch) {
      const year = newsMatch[1];
      console.log("[SSR] Prefetching news for year:", year);
      await queryClient.prefetchQuery({
        queryKey: ["news", year],
        queryFn: async () => {
          const data = await getNews(year);
          console.log("[SSR] Prefetched news:", data?.year || "Not found");
          return data;
        },
      });
    }

    // Add more route-specific prefetching as needed
    // e.g., notices, etc.
  } catch (error) {
    // Always log errors even in production
    console.error("[SSR] Prefetch error:", error);
    // Continue rendering even if prefetch fails
  }

  // Helmet data collector for SSR
  // Default metadata for home page
  const defaultDescription = awardsData.awards
    .map((award) => award.title)
    .join(", ");

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

  const html = renderToString(
    <StructuredDataContext.Provider value={{ setStructuredData }}>
      <HelmetContext.Provider value={{ setHelmetData }}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <StaticRouter location={url}>
              <AppRouter />
            </StaticRouter>
          </RecoilRoot>
        </QueryClientProvider>
      </HelmetContext.Provider>
    </StructuredDataContext.Provider>
  );

  // Dehydrate the query cache to send to client
  const dehydratedState = dehydrate(queryClient);

  console.log("[SSR] Helmet data");
  console.table(helmetData);
  console.log("[SSR] Structured data:", structuredData ? "Present" : "None");

  return { html, dehydratedState, helmetData, structuredData };
}
