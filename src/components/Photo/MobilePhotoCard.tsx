import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import Slider from "@/components/layouts/Slider";
import { useToggle } from "@/hooks/useToggle";

type MobilePhotoCardProps = {
  id: string;
  articleInfo: ArticleInfoType;
};

const MobilePhotoCard = ({ articleInfo, id }: MobilePhotoCardProps) => {
  const [isMore, toggle] = useToggle(false);
  return (
    <div
      id={id}
      className="flex flex-col my-1 border-t border-b border-theme-light-grey"
    >
      <header className="p-3.5 px-4 flex flex-col gap-1">
        <h3 className="text-theme-default leading-theme-default text-theme-text font-bold tracking-[0.16px]">
          {articleInfo.title}
        </h3>
        <div className="flex gap-1">
          <span className="text-theme-default leading-theme-default text-theme-text tracking-[0.16px]">
            {articleInfo.author}
          </span>
          <span className="text-theme-default leading-theme-default text-theme-grey tracking-[0.16px]">
            {articleInfo.dateTime}
          </span>
        </div>
      </header>
      <div className="flex-grow">
        <Slider datas={articleInfo.imgSrcs} />
      </div>
      <div className="flex flex-col gap-2 p-3.5 px-4 text-theme-text">
        <div className="flex flex-wrap gap-2 text-theme-default leading-theme-default tracking-[0.14px]">
          {articleInfo.tags.map((tag) => (
            <span key={tag}>{`#${tag}`}</span>
          ))}
        </div>
        <p
          className="text-theme-default leading-theme-default tracking-[0.16px] break-words whitespace-pre-wrap"
          onClick={() => toggle()}
        >
          {isMore ? articleInfo.description : `${articleInfo.description.slice(0, 40)}...`}
          {!isMore && (
            <span className="text-theme-default leading-theme-default text-theme-grey tracking-[0.16px] ml-1">
              더보기
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default MobilePhotoCard;
