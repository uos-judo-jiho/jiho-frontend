import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/app/index.css";

import AdminStandaloneApp from "@/app/AdminStandaloneApp";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element for admin app");
}

createRoot(rootElement).render(
  <StrictMode>
    <AdminStandaloneApp />
  </StrictMode>,
);
