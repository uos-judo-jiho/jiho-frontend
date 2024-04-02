import HomeAwards from "../components/Home/Info/HomeAwards";
import HomeInfo from "../components/Home/Info/HomeInfo";
import MyHelmet from "../helmet/MyHelmet";
import DefaultLayout from "../layouts/DefaultLayout";
import MobileRowColLayout from "../layouts/MobileRowColLayout";
import SheetWrapper from "../layouts/SheetWrapper";

const About = () => {
  return (
    <>
      <MyHelmet title="About" />
      <DefaultLayout>
        <SheetWrapper>
          <MobileRowColLayout rowJustifyContent="space-between">
            <HomeInfo />
            <HomeAwards />
          </MobileRowColLayout>
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
};

export default About;
