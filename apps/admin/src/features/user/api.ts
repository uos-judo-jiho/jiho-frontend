import { v2Api } from "@packages/api";

/**
 * 일반 사용자에게 공개되는 부원 정보.
 *
 * 관리자 API(`/api/v2/admin/users`)와 달리 이메일·전화번호·학번 같은 개인 식별
 * 정보는 내려오지 않는다 (API PR #37). 훈련일지 참여 인원 선택처럼 "이름을 고르는"
 * 화면은 이 스코프만 있으면 충분하다.
 */
export type PublicUser = {
  id: number;
  name: string | null;
  generation: number | null;
  major: string | null;
  graduated: boolean;
};

/** 서버가 한 번에 내려주는 최대 인원 수. */
export const MAX_PUBLIC_USER_PAGE_SIZE = 100;

/** 검색어 없이 목록을 펼쳤을 때 보여줄 인원 수. */
export const DEFAULT_PUBLIC_USER_PAGE_SIZE = 50;

/** `users.name` 컬럼이 varchar(20) 이라 서버도 20자까지만 받는다. */
export const MAX_PUBLIC_USER_NAME_QUERY_LENGTH = 20;

type UsePublicUsersOptions = {
  /** 이름 부분 일치 검색어. 빈 문자열이면 필터 없이 첫 페이지를 받는다. */
  name?: string;
  limit?: number;
  enabled?: boolean;
};

/**
 * 공개 부원 목록 조회.
 *
 * 반응 API 와 마찬가지로 admin 스코프에 없고 api 스코프에만 있어서 v2Api 를 쓴다.
 * 로그인은 필요하므로 다른 admin 호출과 같이 쿠키를 실어 보낸다.
 */
export const usePublicUsers = ({
  name,
  limit = DEFAULT_PUBLIC_USER_PAGE_SIZE,
  enabled = true,
}: UsePublicUsersOptions = {}) => {
  // 서버가 1자 미만/20자 초과 검색어를 400 으로 막으므로 여기서 미리 잘라 보낸다.
  const keyword = name?.trim().slice(0, MAX_PUBLIC_USER_NAME_QUERY_LENGTH);

  return v2Api.useGetApiV2Users(
    {
      ...(keyword ? { name: keyword } : {}),
      limit: Math.min(limit, MAX_PUBLIC_USER_PAGE_SIZE),
    },
    {
      axios: { withCredentials: true },
      query: {
        enabled,
        // 부원 명부는 자주 바뀌지 않는다. 글 하나 쓰는 동안 다시 받을 이유가 없다.
        staleTime: 5 * 60 * 1000,
        // 검색어가 바뀔 때 목록이 비었다가 다시 차는 깜빡임을 막는다.
        placeholderData: (previous) => previous,
        select: (response) => response.data,
      },
    },
  );
};

/** 드롭다운 항목에 표시할 이름 (예: `34기 김영민`). */
export const formatPublicUserLabel = (user: PublicUser) =>
  [user.generation ? `${user.generation}기` : null, user.name]
    .filter(Boolean)
    .join(" ");
