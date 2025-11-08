import { ArrowBackIosIcon } from "@/components/icons";

// TODO: 모바일 헤더 높이 44px 고정 상수화

interface MobileHeaderProps {
  backUrl: string;
  subTitle: string;
  subTitleUrl: string;
}

const MobileHeader = ({
  backUrl,
  subTitle,
  subTitleUrl,
}: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 left-0 z-[2] flex justify-center items-center gap-4 h-11 px-4 border-b border-theme-light-grey bg-white">
      <div className="w-6 h-6">
        <a href={backUrl}>
          <ArrowBackIosIcon title="Go back" />
        </a>
      </div>
      <div className="flex flex-col flex-grow text-center">
        <a href="/">
          <h1 className="text-theme-tiny leading-theme-tiny text-theme-grey tracking-[0.32px]">
            서울시립대학교 유도부 지호
          </h1>
        </a>
        <a href={subTitleUrl}>
          <h2 className="text-theme-default leading-theme-default text-theme-text tracking-[0.16px]">
            {subTitle}
          </h2>
        </a>
      </div>
      <div className="w-6 h-6" />
    </header>
  );
};

export default MobileHeader;
