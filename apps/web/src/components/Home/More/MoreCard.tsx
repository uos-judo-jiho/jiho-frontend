import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";
import { Link, type LinkOptions } from "@tanstack/react-router";

type MoreCardItem = Pick<ArticleInfoType, "author" | "description"> & {
  id: string | number;
  dateTime?: string;
};

type MoreCardProps = {
  title: string;
  data: MoreCardItem[];
  /** "+ 더보기" 헤더 링크 — linkOptions() 로 생성해 컴파일 타임에 검증된다 */
  moreLink: LinkOptions;
  /** 목록 아이템별 상세 링크 생성기 */
  getItemLink: (item: MoreCardItem) => LinkOptions;
};

const DATA_LEN = 5;

const formatOnlyWord = (text: string, maxLength: number) => {
  // 문자, ".", ",", "!", "?", 괄호(),[],{},이모지만 허용하고 제거
  const pattern = new RegExp(
    `[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ.,!?()\\[\\]{}\\s]`,
    "g",
  );
  return `${text.replace(pattern, "").slice(0, maxLength)}...`;
};

export const MoreCard = ({ title, moreLink, getItemLink, data }: MoreCardProps) => {
  const boardData = data.slice(0, DATA_LEN);

  return (
    <div className="w-full h-[260px]">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <Link {...moreLink}>
          <div className="flex items-center justify-start">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="pl-2.5 text-theme-grey leading-theme-description hover:text-theme-black transition-colors">
              + 더보기
            </p>
          </div>
        </Link>
      </div>
      <div>
        <ul className="w-full my-2">
          {boardData.map((item) => {
            return (
              <li
                key={item.id}
                className={cn(
                  "hover:bg-gray-100 active:bg-gray-200",
                  "p-2 rounded-md transition-colors duration-200",
                )}
              >
                <Link {...getItemLink(item)}>
                  <div className="flex justify-between items-end gap-4">
                    <div
                      className="
                      block flex-1
                      whitespace-nowrap break-all overflow-hidden text-ellipsis
                      text-theme-description leading-theme-description
                    "
                    >
                      {`[${item.author}] ${formatOnlyWord(
                        item.description,
                        100,
                      )}`}
                    </div>
                    <div className="min-w-[100px] text-theme-grey text-right">
                      {item.dateTime}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
