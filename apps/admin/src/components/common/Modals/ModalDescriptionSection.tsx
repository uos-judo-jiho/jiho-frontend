import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";
import Line from "@/components/layouts/Line";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";

type ModalDescriptionSectionProps = {
  article: ArticleInfoType;
  titles: string[];
};

function ModalDescriptionSection({
  article,
  titles,
}: ModalDescriptionSectionProps) {
  // titles[1] 이 "태그" 이면 날짜 행을 숨긴다. props 로부터 곧바로 계산되는 값이라
  // 별도 state 로 들고 있을 필요가 없다.
  const isDisplay = titles[1] !== "태그";

  return (
    <section className="h-full w-full relative flex flex-col p-5">
      <div className="w-full flex-[0_0_auto]">
        <table className="text-base w-full border-b border-color-gray-200 pb-2 mb-2">
          <tbody>
            <tr>
              <td className="w-[100px] align-top py-1">{titles[0]}</td>
              <td className="break-keep-all py-1">{article.author}</td>
            </tr>
            <tr>
              <td className="w-[100px] align-top py-1">{titles[1]}</td>
              <td className="break-keep-all py-1">
                {/* TODO html space 처리하기 */}
                {article.tags.join(" ")}
              </td>
            </tr>
            <tr className={cn(!isDisplay && "hidden")}>
              <td className="w-[100px] align-top py-1">{titles[2]}</td>
              <td className="break-keep-all py-1">{article.dateTime}</td>
            </tr>
          </tbody>
        </table>
        <Line margin={"1rem 0"} borderWidth={"1px"} />
      </div>
      <div className="flex-1 flex flex-col w-full overflow-y-auto overflow-x-hidden">
        <h1 className="font-bold text-lg mb-[10px]">{article.title}</h1>
        <MarkdownRenderer content={article.description} />
      </div>
      <div className="flex-[0]">
        <Line margin={"10px 0"} borderWidth={"1px"} />
      </div>
    </section>
  );
}

export default ModalDescriptionSection;
