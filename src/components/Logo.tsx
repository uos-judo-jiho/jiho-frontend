import LogoWhite from "@/lib/assets/images/logo/logo-removebg-white.webp";
import LogoBlack from "@/lib/assets/images/logo/logo-removebg.webp";

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
        src={isDark ? LogoBlack : LogoWhite}
        alt="서울시립대학교 유도부 지호 로고"
        className="w-full h-full"
      />
    </div>
  );
};

export default Logo;
