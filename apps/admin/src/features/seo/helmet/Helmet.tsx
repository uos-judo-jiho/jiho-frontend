import { useEffect } from "react";

type HelmetProps = {
  title: string;
};

/**
 * Helmet component for admin pages
 * Adds noindex, nofollow meta tags to prevent crawling
 */
const Helmet = ({ title }: HelmetProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Set title
    document.title = `관리자 - ${title}`;

    // Add or update noindex meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", "noindex, nofollow");

    // Cleanup on unmount (restore to default if needed)
    return () => {
      const meta = document.querySelector('meta[name="robots"]');
      if (meta) {
        meta.remove();
      }
    };
  }, [title]);

  return null;
};

export default Helmet;
