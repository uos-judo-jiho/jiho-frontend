import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.tsx";

const API_HOSTS = ["http://localhost:4000", "https://api.uosjudo.com"];

axios.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  if (typeof config.url === "string") {
    for (const host of API_HOSTS) {
      if (config.url.startsWith(host)) {
        config.url = config.url.replace(host, "");
        break;
      }
    }
  }

  return config;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
