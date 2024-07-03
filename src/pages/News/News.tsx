import { Navigate } from "react-router-dom";
import { Constants } from "../../constant/constant";

const News = () => {
  return <Navigate to={`/news/${Constants.LATEST_NEWS_YEAR}`} />;
};

export default News;
