import { Navigate } from "react-router-dom";
import { Constants } from "@/lib/constant";

const News = () => {
  return <Navigate to={`/news/${Constants.LATEST_NEWS_YEAR}`} />;
};

export default News;
