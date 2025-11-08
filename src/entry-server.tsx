import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { ServerStyleSheet, ThemeProvider } from "styled-components";
import AppRouter from "./routers/AppRouter";
import { lightTheme } from "./lib/theme/theme";
import { getTrainings } from "./api/trainings/client";
import { getNews } from "./api/news/client";

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

    // Match news routes: /news/:year or /news/:year/:index
    const newsMatch = url.match(/^\/news\/(\d{4})/);
    if (newsMatch) {
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

  // Create styled-components ServerStyleSheet to collect styles during SSR
  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(
      sheet.collectStyles(
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <ThemeProvider theme={lightTheme}>
              <StaticRouter location={url}>
                <AppRouter />
              </StaticRouter>
            </ThemeProvider>
          </RecoilRoot>
        </QueryClientProvider>
      )
    );

    // Extract the style tags from styled-components
    const styleTags = sheet.getStyleTags();

    // Dehydrate the query cache to send to client
    const dehydratedState = dehydrate(queryClient);

    return { html, dehydratedState, styleTags };
  } finally {
    // Always seal the sheet to prevent memory leaks
    sheet.seal();
  }
}