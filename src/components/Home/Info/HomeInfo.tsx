import styled, { css } from "styled-components";
import FooterInfo from "../../../assets/jsons/footerData.json";
import Title from "../../../layouts/Title";
import Logo from "../../Logo";

const Container = styled.div`
  margin-bottom: 10px;

  flex: 1;
`;

const MobileInvisible = css`
  @media (max-width: 539px) {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  border: 2px solid ${(props) => props.theme.textColor};
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.bgColor};

  display: flex;
  justify-content: center;
  align-items: center;

  ${MobileInvisible}
`;

const DescriptionContainer = styled.ul``;
const DescriptionItem = styled.li`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

const DescriptionTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  margin-bottom: 12px;
`;

function HomeInfo() {
  return (
    <Container>
      <div className="flex flex-col">
        <LogoWrapper>
          <Logo size={"100px"} isDark={true} />
        </LogoWrapper>
        <DescriptionContainer>
          <DescriptionItem>
            <Title title={FooterInfo.title.krTitle} />
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.title.since}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.exercise.title}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
        </DescriptionContainer>
      </div>
    </Container>
  );
}

export default HomeInfo;
