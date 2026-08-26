import { HomeAwards } from "@/components/Home/Info/HomeAwards";
import HomeInfo from "@/components/Home/Info/HomeInfo";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { MobileRowColLayout } from "@/components/layouts/MobileRowColLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";

const About = () => {
  return (
    <>
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
