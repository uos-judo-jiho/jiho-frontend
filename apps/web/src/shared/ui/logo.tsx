import logoDark from "@/shared/lib/assets/images/logo/logo-removebg.webp";
import logoLight from "@/shared/lib/assets/images/logo/logo-removebg-white.webp";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
  /** 로고 자체의 색. 밝은 배경 위에는 "dark", 사진·어두운 배경 위에는 "light". */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * 이전 Logo 는 `isDark` 라는 이름으로 "배경이 어두운가"가 아니라 "로고가 검은가"를
 * 뜻해서 호출부마다 의미가 헷갈렸다. tone 으로 바꿔 로고 색을 직접 말하게 했다.
 */
export const Logo = ({ tone = "dark", className }: LogoProps) => (
  <img
    src={tone === "dark" ? logoDark : logoLight}
    alt="서울시립대학교 유도부 지호"
    className={cn("size-12 object-contain", className)}
  />
);
