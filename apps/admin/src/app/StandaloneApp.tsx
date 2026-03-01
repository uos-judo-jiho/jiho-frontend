import { App } from "@/app/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "../shared/context/QueryClient";

const StandaloneApp = () => {
  const baseName = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
      <Toaster position="top-center" richColors />
      <BrowserRouter basename={baseName}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default StandaloneApp;
