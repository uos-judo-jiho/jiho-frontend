import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import AppRouter from "./routers/AppRouter";
import { lightTheme } from "./lib/theme/theme";
import { getTrainings } from "./api/trainings/client";
import { getNews } from "./api/news/client";

// SSR logger - only logs in development
const ssrLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
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

  ssrLog("[SSR] Rendering URL:", url);

  // Prefetch data based on route
  try {
    // Match photo routes: /photo or /photo/:id
    const photoMatch = url.match(/^\/photo/);
    if (photoMatch) {
      ssrLog("[SSR] Prefetching trainings for photo page");
      await queryClient.prefetchQuery({
        queryKey: ["trainings", "all"],
        queryFn: async () => {
          const data = await getTrainings();
          ssrLog("[SSR] Prefetched trainings count:", data.length);
          return data;
        },
      });
    }

    // Match news routes: /news/:year or /news/:year/:index
    const newsMatch = url.match(/^\/news\/(\d{4})/);
    if (newsMatch) {
      const year = newsMatch[1];
      ssrLog("[SSR] Prefetching news for year:", year);
      await queryClient.prefetchQuery({
        queryKey: ["news", year],
        queryFn: async () => {
          const data = await getNews(year);
          ssrLog("[SSR] Prefetched news:", data?.year || "Not found");
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

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={lightTheme}>
          <StaticRouter location={url}>
            <AppRouter />
          </StaticRouter>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );

  // Dehydrate the query cache to send to client
  const dehydratedState = dehydrate(queryClient);

  return { html, dehydratedState };
}