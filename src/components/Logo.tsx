import { Constants } from "@/shared/lib/constant";

type LogoProps = {
  size?: string;
  margin?: string;
  isDark?: boolean;
};

const Logo = ({
  size = "6rem",
  margin = "0rem",
  isDark = false,
}: LogoProps) => {
  const { LOGO_BLACK, LOGO_WHITE } = Constants;
  return (
    <div
      className="flex"
      style={{
        margin,
        width: size,
        height: size,
      }}
    >
      <img
        src={isDark ? LOGO_BLACK : LOGO_WHITE}
        alt="서울시립대학교 유도부 지호 로고"
        className="w-full h-full"
      />
    </div>
  );
};

export default Logo;
