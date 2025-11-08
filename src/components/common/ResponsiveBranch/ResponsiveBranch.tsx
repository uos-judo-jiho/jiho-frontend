import styled from "styled-components";

const PcContainer = styled.div`
  @media (max-width: 539px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  @media (min-width: 540px) {
    display: none;
  }
`;

interface ResponsiveBranchProps {
  pcComponent: React.ReactNode;
  mobileComponent: React.ReactNode;
}

const ResponsiveBranch = ({
  pcComponent,
  mobileComponent,
}: ResponsiveBranchProps) => {
  return (
    <>
      <MobileContainer>{mobileComponent}</MobileContainer>
      <PcContainer>{pcComponent}</PcContainer>
    </>
  );
};

export default ResponsiveBranch;
