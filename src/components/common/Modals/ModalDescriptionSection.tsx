import { useEffect, useState } from "react";
import Line from "@/components/layouts/Line";
import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { cn } from "@/lib/utils";

type ModalDescriptionSectionProps = {
  article: ArticleInfoType;
  titles: string[];
};

function ModalDescriptionSection({
  article,
  titles,
}: ModalDescriptionSectionProps) {
  const [isDisplay, setIsDisplay] = useState<boolean>(true);

  useEffect(() => {
    if (titles[1] === "태그") {
      setIsDisplay(false);
    }
  }, [titles]);

  return (
    <section className="h-full w-full relative flex flex-col p-5">
      <div className="w-full flex-[0_0_auto]">
        <table className="text-base w-full">
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
        <h3 className="font-bold text-sm mb-[10px]">{article.title}</h3>
        <MarkdownRenderer content={article.description} />
      </div>
      <div className="flex-[0]">
        <Line margin={"10px 0"} borderWidth={"1px"} />
      </div>
    </section>
  );
}

export default ModalDescriptionSection;
