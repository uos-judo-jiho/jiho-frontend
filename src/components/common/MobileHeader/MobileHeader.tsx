import { ArrowBackIosIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

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
    <header
      className={cn(
        "sticky top-0 left-0 z-[2]",
        "flex justify-center items-center gap-4 h-10",
        "px-4 py-2 border-b border-theme-light-grey bg-white",
      )}
    >
      <div className="w-6 h-6">
        <a href={backUrl}>
          <ArrowBackIosIcon title="Go back" />
        </a>
      </div>
      <div className="flex flex-col flex-grow text-center">
        <a href={subTitleUrl}>
          <h1 className="text-theme-default font-bold leading-theme-default text-theme-text tracking-[0.16px]">
            {subTitle}
          </h1>
        </a>
      </div>
      <div className="w-6 h-6" />
    </header>
  );
};

export default MobileHeader;
