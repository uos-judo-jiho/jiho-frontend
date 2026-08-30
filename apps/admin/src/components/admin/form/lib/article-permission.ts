import {
  GeneralAndAbove,
  ManagerAndAbove,
  StaffAndAbove,
} from "@/shared/auth/roles";

export type ArticleBoardType = "news" | "training" | "notice";

type ArticlePermissionParams = {
  /** 게시판 종류 */
  type: ArticleBoardType;
  /** 로그인한 사용자의 등급 */
  role?: string;
  /** 로그인한 사용자의 이름(추가 정보). 없으면 본인 글 여부를 가릴 수 없다. */
  myName?: string | null;
  /** 수정 중인 글의 작성자. 새 글이면 undefined. */
  articleAuthor?: string;
};

export type ArticlePermission = {
  /** 글을 저장·삭제할 수 있는가 */
  canEdit: boolean;
  /** 작성자 필드를 직접 입력할 수 있는가 */
  canEditAuthor: boolean;
};

/**
 * 글 작성/수정 폼의 권한을 계산한다.
 *
 * - 지호지·훈련일지는 회원 이상, 공지사항은 운영 부원 이상이 쓸 수 있다.
 * - 관리자/회장은 모든 글을, 그 외에는 본인 명의의 글만 수정할 수 있다.
 * - 지호지의 작성자는 임원(운영진) 이상만 직접 고를 수 있고,
 *   그 아래 등급은 본인 명의로 고정된다. 훈련일지·공지사항은 기존 정책을 유지한다.
 */
export const getArticlePermission = ({
  type,
  role = "",
  myName,
  articleAuthor,
}: ArticlePermissionParams): ArticlePermission => {
  const isRootOrPresident = ["root", "president"].includes(role);

  // 새 글이거나, 글의 작성자에 본인 이름이 들어 있으면 본인 글로 본다.
  const isAuthor =
    articleAuthor === undefined ||
    myName != null && articleAuthor.includes(myName);

  const roleCanEditType =
    type === "notice"
      ? StaffAndAbove.includes(role)
      : GeneralAndAbove.includes(role);

  const canEdit = roleCanEditType && (isRootOrPresident || isAuthor);

  const canEditAuthor =
    canEdit && (type !== "news" || ManagerAndAbove.includes(role));

  return { canEdit, canEditAuthor };
};
