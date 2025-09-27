import { MobileRowColLayout } from "@/components/layouts/MobileRowColLayout";
import Slider from "@/components/layouts/Slider";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";
import { cn } from "@/lib/utils";

type ModalArticleContainerProps = {
  info: ArticleInfoType;
  titles: string[];
};

function ModalArticleContainer({ info, titles }: ModalArticleContainerProps) {
  console.log("Rendering ModalArticleContainer with info:", info);
  return (
    <div
      className={cn(
        "w-full h-full bg-white rounded-lg overflow-hidden",
        "md:w-auto md:h-auto md:max-w-4xl md:max-h-[85vh]",
        "flex flex-col"
      )}
    >
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <MobileRowColLayout>
          {/* Image Slider */}
          <Slider datas={info.imgSrcs} />
          {/* Description Section */}
          <ModalDescriptionSection article={info} titles={titles} />
        </MobileRowColLayout>
      </div>
    </div>
  );
}

export default ModalArticleContainer;
