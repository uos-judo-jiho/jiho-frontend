import Row from "@/components/layouts/Row";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import styled from "styled-components";

type MoreCardProps = {
  title: string;
  data: ArticleInfoType[];
  linkTo: string;
  isLinkToQuery?: boolean;
};

const DATA_LEN = 4;

const ItemList = styled.ul`
  width: 100%;
  margin: 8px 0;
`;

const ItemWrapper = styled.div`
  display: block;

  flex: 1;

  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};
`;

const TimeContent = styled.div`
  min-width: 100px;

  color: ${(props) => props.theme.greyColor};
  text-align: right;
`;

const More = styled.p`
  padding-left: 10px;
  color: ${(props) => props.theme.greyColor};
  line-height: ${(props) => props.theme.descriptionLineHeight};

  &:hover {
    color: ${(props) => props.theme.blackColor};
  }
`;

const formatOnlyWord = (text: string, maxLength: number) => {
  // 문자, ".", ",", "!", "?", 괄호(),[],{},이모지만 허용하고 제거
  const pattern = new RegExp(
    `[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ.,!?()\\[\\]{}\\s]`,
    "g"
  );
  return `${text.replace(pattern, "").slice(0, maxLength)}...`;
};

const MoreCard = ({ title, linkTo, data }: MoreCardProps) => {
  const boardData = data.slice(0, DATA_LEN);

  return (
    <div className="w-full h-[260px]">
      <div className="mb-4 border-b-[1px] border-gray-300 pb-2">
        <Link to={linkTo}>
          <div className="flex items-center justify-start">
            <h3 className="text-base font-semibold">{title}</h3>
            <More>+ 더보기</More>
          </div>
        </Link>
      </div>
      <div>
        <ItemList>
          {boardData.map((item) => {
            return (
              <li
                key={item.id}
                className={cn(
                  "hover:bg-gray-100 active:bg-gray-200",
                  "p-2 rounded-md transition-colors duration-200"
                )}
              >
                <Link to={`${linkTo}/${item.id}`}>
                  <Row
                    justifyContent="space-between"
                    alignItems="flex-end"
                    gap={16}
                  >
                    <ItemWrapper>{`[${item.author}] ${formatOnlyWord(
                      item.description,
                      100
                    )}`}</ItemWrapper>
                    <TimeContent>{item.dateTime}</TimeContent>
                  </Row>
                </Link>
              </li>
            );
          })}
        </ItemList>
      </div>
    </div>
  );
};

export default MoreCard;
