import { Constants } from "@/shared/lib/constant";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Link, type LinkOptions } from "@tanstack/react-router";
import Line from "./Line";

type ListItem = Pick<Partial<ArticleInfoType>, "title" | "author" | "dateTime"> & {
  id?: string | number;
};

type ListContainerProps = {
  datas: ListItem[];
  /** 아이템별 상세 링크 생성기 — linkOptions() 로 생성해 컴파일 타임에 검증된다 */
  buildItemLink: (id: string | number) => LinkOptions;
  additionalTitle?: boolean;
};

function ListContainer({
  datas: data,
  buildItemLink,
  additionalTitle = false,
}: ListContainerProps) {
  return (
    <div>
      <ul className="text-base text-foreground">
        <li className="flex py-5 text-center">
          <div className="flex-[10%] text-center">번호</div>
          <div className="flex-[80%]">제목</div>
          <div className="whitespace-nowrap text-center flex-[10%]">작성일</div>
        </li>
        <Line borderColor={Constants.LIGHT_GREY_COLOR} borderWidth="1px" />

        {data.map((data, index) => (
          <div key={data?.id}>
            <li className="flex py-5 text-center">
              <div className="flex-[10%] text-center">{index + 1}</div>
              <div className="flex-[80%]">
                <Link {...buildItemLink(data.id ?? "")}>
                  <div className="bg-transparent text-start pr-3 hover:underline">
                    {data.title}
                    {additionalTitle ? " " + data.author : ""}
                  </div>
                </Link>
              </div>
              <div className="whitespace-nowrap text-center flex-[10%]">
                {data.dateTime}
              </div>
            </li>
            <Line borderColor={Constants.LIGHT_GREY_COLOR} borderWidth="1px" />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ListContainer;
