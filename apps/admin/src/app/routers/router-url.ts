export const RouterUrl = {
  홈: "/",
  로그인: "/login",
  회원가입: "/register",
  뉴스: {
    목록: "/news",
    년도별: ({ year }: { year: number }) => `/news/${year}`,
    갤러리: ({ year }: { year: number }) => `/news/${year}/gallery`,
    갤러리작성: ({ year }: { year: number }) => `/news/${year}/gallery/write`,
    상세: ({ year, id }: { year: number; id: number }) => `/news/${year}/${id}`,
    작성: ({ year }: { year: number }) => `/news/${year}/write`,
  },
  공지사항: {
    목록: "/notice",
    상세: ({ id }: { id: number }) => `/notice/${id}`,
    작성: "/notice/write",
  },
  수상내역: "/awards",
  훈련일지: {
    목록: "/training",
    상세: ({ id }: { id: number }) => `/training/${id}`,
    작성: "/training/write",
  },
  회원: {
    목록: "/users",
    상세: ({ id }: { id: number }) => `/users/${id}`,
    승인: "/users/approval",
  },
  마이페이지: {
    루트: "/mypage",
    정보수정: "/mypage/edit",
  },
} as const;
