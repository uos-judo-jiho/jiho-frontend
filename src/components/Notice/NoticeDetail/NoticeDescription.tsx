import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";
import styled from "styled-components";
type NoticeDescriptionProps = {
  description: string;
};

const Container = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: 160%;

  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: keep-all;
`;

function NoticeDescription({ description }: NoticeDescriptionProps) {
  return (
    <Container>
      <MarkdownRenderer content={description} />
    </Container>
  );
}

export default NoticeDescription;
