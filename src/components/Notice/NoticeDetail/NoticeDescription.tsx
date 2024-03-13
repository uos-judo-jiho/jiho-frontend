import styled from "styled-components";
type NoticeDescriptionProps = {
  description: string;
};

const Container = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: 160%;
  text-align: justify;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: keep-all;
`;

function NoticeDescription({ description }: NoticeDescriptionProps) {
  return (
    <Container>
      {description.split("\n").map((line, index) => {
        return (
          <p key={"noticeText" + index.toString()}>
            {line}
            <br />
          </p>
        );
      })}
    </Container>
  );
}

export default NoticeDescription;
