import { Link } from "react-router-dom";
import styled from "styled-components";
import MyHelmet from "../helmet/MyHelmet";
import Col from "@/components/layouts/Col";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80vh;
`;
const Description = styled.div``;
const BackDescription = styled.div`
  margin: 1rem 0;
  text-decoration-line: underline;

  &:hover {
    opacity: 0.6;
  }
`;

const NotFound = () => {
  return (
    <>
      <MyHelmet title="NotFound" />
      <DefaultLayout>
        <Container>
          <Col alignItems="center">
            <Description>존재하지 않는 페이지입니다.</Description>
            <Link to={"/"}>
              <BackDescription>홈으로 돌아가기</BackDescription>
            </Link>
          </Col>
        </Container>
      </DefaultLayout>
    </>
  );
};

export default NotFound;
