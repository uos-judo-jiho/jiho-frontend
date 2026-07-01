import { AUTH_PATHS, LoginPage, Register } from "@packages/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ShortsPage } from "@/pages/shorts/shorts-page";
import { lockPortrait } from "@/shared/lib/lock-orientation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const App = () => {
  // 물리 방향을 세로로 고정 — 가로 모드는 CSS 90° 회전으로 직접 처리하므로
  // OS 자동회전으로 뷰포트가 함께 돌아 이중 회전되는 것을 막는다.
  useEffect(() => {
    lockPortrait();
  }, []);

  return (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 로그인/회원가입은 공유 패키지(@packages/auth) 페이지를 shorts 서브도메인에서 직접 서빙 */}
        <Route path={AUTH_PATHS.login} element={<LoginPage />} />
        <Route path={AUTH_PATHS.register} element={<Register />} />
        <Route path="*" element={<ShortsPage />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#1c1c1c", color: "#fff", border: "1px solid #333" },
        }}
      />
    </QueryClientProvider>
  </BrowserRouter>
  );
};

export default App;
