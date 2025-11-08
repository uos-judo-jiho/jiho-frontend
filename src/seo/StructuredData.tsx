import { useEffect, useContext, createContext } from "react";

interface StructuredDataProps {
  data: object;
}

export interface StructuredDataContextType {
  setStructuredData?: (data: object) => void;
}

// Context for SSR
export const StructuredDataContext = createContext<StructuredDataContextType>({});

/**
 * Component to inject JSON-LD structured data into the page
 * Works in both SSR and CSR environments
 *
 * For SSR: Uses context to pass data to server renderer
 * For CSR: Directly injects into <head>
 */
const StructuredData = ({ data }: StructuredDataProps) => {
  const { setStructuredData } = useContext(StructuredDataContext);

  // SSR: Store structured data in context
  if (setStructuredData) {
    setStructuredData(data);
  }

  // Client: Inject into <head>
  useEffect(() => {
    if (typeof document === "undefined") return;

    const newDataString = JSON.stringify(data);

    // Check if SSR-generated script exists and has same data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      const existingData = existingScript.textContent;
      // If the data is the same, don't replace (avoid SSR/CSR duplication)
      if (existingData === newDataString) {
        return;
      }
      // If data is different, remove old script
      existingScript.remove();
    }

    // Create new script element with JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = newDataString;

    // Append to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove && scriptToRemove.textContent === newDataString) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
};

export default StructuredData;
