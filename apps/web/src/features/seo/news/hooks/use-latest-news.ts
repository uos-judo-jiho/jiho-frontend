import { v2Api } from "@packages/api";

export const useLatestNews = (limit = 5) => {
  const { data: news } = v2Api.useGetApiV2NewsLatestSuspense(
    { limit },
    {
      query: {
        select: (response) => response.data.articles,
      },
    },
  );

  const lastestNewsYear = new Date(
    news[0]?.dateTime ?? Date.now(),
  ).getFullYear();

  return { news, lastestNewsYear };
};
