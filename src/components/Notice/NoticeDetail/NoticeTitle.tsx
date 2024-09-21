import React from "react";
import styled from "styled-components";
import Line from "../../../layouts/Line";
type NoticeTitleProps = {
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
};
const Container = styled.div`
  padding: 4rem 0 2rem 0;
`;

const NoticeTitleH3 = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
`;
const SubTitleWrapper = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  padding-top: 10px;
  display: flex;
`;
const SubTitleItem = styled.span`
  display: flex;
  color: ${(props) => props.theme.blackColor};
  &:not(:last-child)::after {
    content: "|";
    padding: 0 4px;
  }
`;

const TagWrapper = styled.p`
  color: ${(props) => props.theme.greyColor};
  &:not(:last-child) {
    padding-right: 4px;
  }
`;

function NoticeTitle({ title, author, dateTime, tags }: NoticeTitleProps) {
  return (
    <>
      <Container>
        <NoticeTitleH3>{title}</NoticeTitleH3>
        <SubTitleWrapper>
          <SubTitleItem>{author}</SubTitleItem>
          <SubTitleItem>{dateTime}</SubTitleItem>
          <SubTitleItem>
            {tags.map((tag) => (
              <TagWrapper key={title + tag}>#{tag}</TagWrapper>
            ))}
          </SubTitleItem>
        </SubTitleWrapper>
        <Line borderWidth="1px" margin="2rem 0" />
      </Container>
    </>
  );
}

export default NoticeTitle;
