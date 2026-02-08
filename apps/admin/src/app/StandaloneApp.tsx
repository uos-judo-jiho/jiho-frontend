import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import { queryClient } from "../shared/context/QueryClient";

const StandaloneApp = () => {
  const baseName = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={baseName}>
        <HomePage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default StandaloneApp;
