import { Constants } from "@/shared/lib/constant";
import { ReactionCount, useBulkBoardReactions } from "@/features/reaction";
import { v2ApiModel } from "@packages/api/model";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import Line from "./Line";

type ListContainerProps = {
  datas: Partial<v2ApiModel.Board>[];
  targetUrl: string;
  additionalTitle?: boolean;
};

function ListContainer({
  datas: data,
  targetUrl,
  additionalTitle = false,
}: ListContainerProps) {
  // 목록의 게시글 반응을 한 번에 받아 온다. 행마다 조회하면 N+1 이 된다.
  const boardIds = useMemo(
    () => data.map((item) => Number(item?.id)).filter(Number.isFinite),
    [data],
  );
  const { data: reactions } = useBulkBoardReactions(boardIds);

  return (
    <div>
      <ul className="text-base text-foreground">
        <li className="flex py-5 text-center">
          <div className="flex-[10%] text-center">번호</div>
          <div className="flex-[70%]">제목</div>
          <div className="whitespace-nowrap text-center flex-[10%]">반응</div>
          <div className="whitespace-nowrap text-center flex-[10%]">작성일</div>
        </li>
        <Line borderColor={Constants.LIGHT_GREY_COLOR} borderWidth="1px" />

        {data.map((data, index) => (
          <div key={data?.id}>
            <li className="flex py-5 text-center">
              <div className="flex-[10%] text-center">{index + 1}</div>
              <div className="flex-[70%]">
                <Link to={targetUrl + data.id}>
                  <div className="bg-transparent text-start pr-3 hover:underline">
                    {data.title}
                    {additionalTitle ? " " + data.author : ""}
                  </div>
                </Link>
              </div>
              <div className="whitespace-nowrap text-center flex-[10%]">
                <ReactionCount summary={reactions?.get(Number(data.id))} />
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
