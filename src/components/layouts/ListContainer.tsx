import { Link } from "react-router-dom";
import { Constants } from "@/lib/constant";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import Line from "./Line";

type ListContainerProps = {
  datas: Partial<ArticleInfoType>[];
  targetUrl: string;
  additionalTitle?: boolean;
};

function ListContainer({
  datas: data,
  targetUrl,
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
                <Link to={targetUrl + data.id}>
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
