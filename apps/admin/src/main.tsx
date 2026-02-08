import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/app/index.css";
import "@/shared/lib/api/config";

import StandaloneApp from "@/app/StandaloneApp";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element for admin app");
}

createRoot(rootElement).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
);
