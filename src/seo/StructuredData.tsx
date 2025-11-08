import { useEffect } from "react";

interface StructuredDataProps {
  data: object;
}

/**
 * Component to inject JSON-LD structured data into the page
 * Works in both SSR and CSR environments
 */
const StructuredData = ({ data }: StructuredDataProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Create script element with JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.id = "structured-data";

    // Remove existing structured data script if present
    const existingScript = document.getElementById("structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    // Append to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      script.remove();
    };
  }, [data]);

  // For SSR: render script tag directly
  if (typeof window === "undefined") {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }

  return null;
};

export default StructuredData;
