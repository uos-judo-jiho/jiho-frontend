import { WithHelmet } from "@/components/utils/with-helmet";
import { WithSuspense } from "@/components/utils/WithSuspense";
import { Awards } from "@/pages/Awards";
import { HomePage } from "@/pages/home-page";
import { MyPage } from "@/pages/my-page";
import Gallery from "@/pages/News/Gallery/Gallery";
import { GalleryList } from "@/pages/News/Gallery/GalleryList";
import GalleryWrite from "@/pages/News/Gallery/GalleryWrite";
import NewsDetail from "@/pages/News/NewsDetail";
import NewsIndex from "@/pages/News/NewsIndex";
import NewsYear from "@/pages/News/NewsYear";
import Notice from "@/pages/Notice/Notice";
import NoticeDetail from "@/pages/Notice/NoticeDetail";
import { TrainingLogPage } from "@/pages/training-log";
import { TrainingLogDetail } from "@/pages/training-log/training-log-detail";
import { UserPage } from "@/pages/user";
import { UserDetailPage } from "@/pages/user/detail";
import WriteArticlePage from "@/pages/WriteArticlePage";
import { v2Admin } from "@packages/api";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouterUrl } from "./router-url";

const StaffAndAbove = ["root", "president", "manager", "staff"];
const GeneralAndAbove = [...StaffAndAbove, "general"];

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  return (
    <WithSuspense>
      <ProtectedRouteInner allowedRoles={allowedRoles}>
        {children}
      </ProtectedRouteInner>
    </WithSuspense>
  );
};

const ProtectedRouteInner = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data,
    },
  });

  const userRole = meData.user.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={RouterUrl.홈} replace />;
  }

  return <>{children}</>;
};

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path={RouterUrl.홈} element={WithHelmet(<HomePage />, "홈")} />

      {/* 마이페이지 */}
      <Route
        path={RouterUrl.마이페이지.루트}
        element={WithHelmet(<MyPage />, "마이페이지")}
      />

      {/* 회원 관리 - Staff 이상 */}
      <Route
        path={RouterUrl.회원.목록}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<UserPage />, "회원 관리")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.회원.상세({ id: ":id" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<UserDetailPage />, "회원 상세")}
          </ProtectedRoute>
        }
      />

      {/* 훈련일지 - General 이상 */}
      <Route
        path={RouterUrl.훈련일지.목록}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<TrainingLogPage />, "훈련일지")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.훈련일지.상세({ id: ":id" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<TrainingLogDetail />, "훈련일지 상세")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.훈련일지.작성}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<WriteArticlePage />, "훈련일지 작성")}
          </ProtectedRoute>
        }
      />

      {/* 지호지 (뉴스) - General 이상 */}
      <Route
        path={RouterUrl.뉴스.목록}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<NewsIndex />, "지호지")}
          </ProtectedRoute>
        }
      />
      <Route
        path="news/gallery"
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<GalleryList />, "지호지 갤러리")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.뉴스.년도별({ year: ":year" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<NewsYear />, "지호지 년도별")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.뉴스.갤러리({ year: ":year" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<Gallery />, "지호지 갤러리 상세")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.뉴스.갤러리작성({ year: ":year" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<GalleryWrite />, "지호지 갤러리 작성")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.뉴스.상세({
          year: ":year" as unknown as number,
          id: ":id" as unknown as number,
        })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<NewsDetail />, "지호지 상세")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.뉴스.작성({ year: ":year" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={GeneralAndAbove}>
            {WithHelmet(<WriteArticlePage />, "지호지 작성")}
          </ProtectedRoute>
        }
      />

      {/* 공지사항 - Staff 이상 */}
      <Route
        path={RouterUrl.공지사항.목록}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<Notice />, "공지사항")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.공지사항.상세({ id: ":id" as unknown as number })}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<NoticeDetail />, "공지사항 상세")}
          </ProtectedRoute>
        }
      />
      <Route
        path={RouterUrl.공지사항.작성}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<WriteArticlePage />, "공지사항 작성")}
          </ProtectedRoute>
        }
      />

      {/* 수상내역 - Staff 이상 */}
      <Route
        path={RouterUrl.수상내역}
        element={
          <ProtectedRoute allowedRoles={StaffAndAbove}>
            {WithHelmet(<Awards />, "수상내역")}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
