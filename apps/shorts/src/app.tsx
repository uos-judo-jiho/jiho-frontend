import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ShortsPage } from "@/pages/shorts-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShortsPage />
    <Toaster
      position="top-center"
      toastOptions={{
        style: { background: "#1c1c1c", color: "#fff", border: "1px solid #333" },
      }}
    />
  </QueryClientProvider>
);

export default App;
