import type { LinkOptions } from "@tanstack/react-router";

export interface MenuItemInfoType {
  /** linkOptions() 로 생성해 라우트/파라미터가 컴파일 타임에 검증된 링크 */
  link: LinkOptions;
  title: string;
}
