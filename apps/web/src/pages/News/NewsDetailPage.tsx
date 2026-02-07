import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { NewsParamsType } from "@/shared/lib/types/NewsParamsType";
import { v1Api } from "@packages/api";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { NewsDetailMobile } from "./NewsDetailMobile";
import { NewsDetailPc } from "./NewsDetailPc";

const NewsDetailPage = () => {
  const { id, index } = useParams<NewsParamsType>();
  const { data: response } = v1Api.useGetApiV1NewsYear(Number(id), {
    query: {
      enabled: Boolean(id),
      select: (result) => result.data,
    },
  });

  const news = useMemo(
    () => normalizeNewsResponse(response, id ?? ""),
    [response, id],
  );

  if (!news || !id || !index) {
    return null;
  }

  return (
    <ResponsiveBranch
      pcComponent={<NewsDetailPc year={id} newsId={index} news={news} />}
      mobileComponent={
        <NewsDetailMobile year={id} newsId={index} news={news} />
      }
    />
  );
};

export default NewsDetailPage;
