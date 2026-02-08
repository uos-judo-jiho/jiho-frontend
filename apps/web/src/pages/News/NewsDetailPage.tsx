import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import { NewsDetailMobile } from "./NewsDetailMobile";
import { NewsDetailPc } from "./NewsDetailPc";

const NewsDetailPage = () => {
  return (
    <ResponsiveBranch
      pcComponent={<NewsDetailPc />}
      mobileComponent={<NewsDetailMobile />}
    />
  );
};

export default NewsDetailPage;
