import { useEffect, useState } from "react";
import styled from "styled-components";
import Line from "@/components/layouts/Line";
import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";

type ModalDescriptionSectionProps = {
  article: ArticleInfoType;
  titles: string[];
};

const DescriptionSection = styled.section`
  height: inherit;
  width: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const DescriptionHeader = styled.div`
  width: 100%;

  flex: 0 0 auto;
`;
const DescriptionHeaderTable = styled.table`
  font-size: ${(props) => props.theme.defaultFontSize};
  width: 100%;
`;

type DescriptionHeaderTableTrProps = {
  isDisplay: boolean;
};

const DescriptionHeaderTableTr = styled.tr<DescriptionHeaderTableTrProps>`
  display: ${(props) => (props.isDisplay ? "block" : "none")};
`;

const DescriptionHeaderTableTdTitle = styled.td`
  width: 100px;
`;

const DescriptionHeaderTdContent = styled.td`
  word-break: keep-all;
`;

const DescriptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;

  overflow-y: auto;
  overflow-x: hidden;
`;

const DescriptionTitle = styled.h3`
  font-weight: bold;
  font-size: ${(props) => props.theme.descriptionFontSize};
  margin-bottom: 10px;
`;

const DescriptionFooter = styled.div`
  flex: 0;
  /* position: absolute;
  bottom: 0;
  left: 1em;
  right: 1em; */
`;

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
    <DescriptionSection>
      <DescriptionHeader>
        <DescriptionHeaderTable>
          <tbody>
            <DescriptionHeaderTableTr isDisplay={true}>
              <DescriptionHeaderTableTdTitle>
                {titles[0]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {article.author}
              </DescriptionHeaderTdContent>
            </DescriptionHeaderTableTr>
            <DescriptionHeaderTableTr isDisplay={true}>
              <DescriptionHeaderTableTdTitle>
                {titles[1]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {/* TODO html space 처리하기 */}
                {article.tags.join(" ")}
              </DescriptionHeaderTdContent>
            </DescriptionHeaderTableTr>
            <DescriptionHeaderTableTr isDisplay={isDisplay}>
              <DescriptionHeaderTableTdTitle>
                {titles[2]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {article.dateTime}
              </DescriptionHeaderTdContent>
            </DescriptionHeaderTableTr>
          </tbody>
        </DescriptionHeaderTable>
        <Line margin={"1rem 0"} borderWidth={"1px"} />
      </DescriptionHeader>
      <DescriptionWrapper>
        <DescriptionTitle>{article.title}</DescriptionTitle>
        <MarkdownRenderer content={article.description} />
      </DescriptionWrapper>
      <DescriptionFooter>
        <Line margin={"10px 0"} borderWidth={"1px"} />
      </DescriptionFooter>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
