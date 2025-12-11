import { useMemo, useState } from "react";

import BGImageWebp from "@/lib/assets/images/background-img-group.webp";

import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";
import HomeSectionExercise from "@/components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "@/components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "@/components/Home/Main/HomeSectionMain";
import HomeSectionMore from "@/components/Home/More/HomeSectionMore";
import HomeSectionNews from "@/components/Home/News/HomeSectionNews";
import ScrollSnap from "@/components/layouts/ScrollSnap";

import { awardsData } from "@/lib/assets/data/awards";
import { footerData } from "@/lib/assets/data/footer";

import { StructuredData, createOrganizationData } from "@/seo";
import MyHelmet from "@/seo/helmet/MyHelmet";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  // Create structured data for organization with LocalBusiness
  const structuredData = useMemo(() => {
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://uosjudo.com";

    const awardTitles = awardsData.awards.map((award) => award.title);
    const description = awardTitles.join(", ");

    return createOrganizationData({
      name: "서울시립대학교 유도부 지호",
      description,
      address: {
        addressCountry: "KR",
        addressLocality: "서울특별시",
        addressRegion: "동대문구",
        postalCode: "02504",
        streetAddress: footerData.exercise.address,
        extendedAddress: footerData.exercise.place,
      },
      openingHours: [
        {
          dayOfWeek: ["Monday", "Wednesday", "Friday"],
          opens: "18:00",
          closes: "20:00",
        },
      ],
      url: currentUrl,
      logo: `${currentUrl}/favicon-96x96.png`,
      foundingDate: "1985",
      email: "uosjudojiho@gmail.com",
      sameAs: ["https://www.instagram.com/uos_judo"],
      sport: "유도 (Judo)",
      memberOf: {
        name: "서울시립대학교 (University of Seoul)",
      },
      award: awardTitles,
      geo: {
        latitude: 37.5837,
        longitude: 127.0594,
      },
      includeLocalBusiness: true,
    });
  }, []);

  // Create helmet metadata
  const metaDescription = awardsData.awards
    .map((award) => award.title)
    .join(", ");

  return (
    <>
      <MyHelmet
        title="서울시립대학교 유도부 지호 | Home"
        description={metaDescription}
        imgUrl={BGImageWebp}
      />
      <StructuredData data={structuredData} />

      <Navbar isDark={isDark} />

      <ScrollSnap setIsDark={setIsDark}>
        <HomeSectionMain />
        <HomeSectionInfo />
        <HomeSectionNews />
        <HomeSectionExercise />
        <HomeSectionMore />
        <Footer />
      </ScrollSnap>
    </>
  );
};

export default Home;
