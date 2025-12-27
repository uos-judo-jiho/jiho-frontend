import { useNewsQuery } from "@/api/news/query";
import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import { NewsParamsType } from "@/shared/lib/types/NewsParamsType";
import { useParams } from "react-router-dom";
import { NewsDetailMobile } from "./NewsDetailMobile";
import { NewsDetailPc } from "./NewsDetailPc";

const NewsDetailPage = () => {
  const { id, index } = useParams<NewsParamsType>();
  const { data: news } = useNewsQuery(id);

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
