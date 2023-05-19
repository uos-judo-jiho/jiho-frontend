import useGoogleAnalytics from "../ga/googleAnalytics";
import SitemapRoutes from "../seo/sitemapRoutes";

function AppRouter() {
  useGoogleAnalytics();
  return <>{SitemapRoutes}</>;
}

export default AppRouter;
