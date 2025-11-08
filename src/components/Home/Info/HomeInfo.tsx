import styled, { css } from "styled-components";
import { footerData } from "@/lib/assets/data/footer";
import Title from "@/components/layouts/Title";
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
            <Title title={footerData.title.krTitle} heading={2} />
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{footerData.title.since}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{footerData.exercise.title}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>{footerData.exercise.time}</DescriptionItem>
          <DescriptionItem>{footerData.exercise.place}</DescriptionItem>
        </DescriptionContainer>
      </div>
    </Container>
  );
}

export default HomeInfo;
