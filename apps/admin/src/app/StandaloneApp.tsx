import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";

import { router } from "@/app/router";
import { queryClient } from "@/shared/context/QueryClient";

const StandaloneApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </OverlayProvider>
    </QueryClientProvider>
  );
};

export default StandaloneApp;
