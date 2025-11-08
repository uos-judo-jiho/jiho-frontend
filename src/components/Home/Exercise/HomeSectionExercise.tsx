import BGImage from "@/lib/assets/images/background-img-training.jpg";
import BGImageWebp from "@/lib/assets/images/background-img-training.webp";

import HomeSectionBG from "../HomeSectionBG";

import SheetWrapper from "@/components/layouts/SheetWrapper";
import ExerciseThumbnail from "./ExerciseThumbnail";

const HomeSectionExercise = () => {
  return (
    <HomeSectionBG
      bgImageSrc={BGImage}
      bgImageSrcWebp={BGImageWebp}
      bgImageAlt="exercise-background"
      id="sectionExercise"
    >
      <SheetWrapper>
        <div className="w-full relative">
          <ExerciseThumbnail />
          {/* <ExerciseVideo /> */}
        </div>
      </SheetWrapper>
    </HomeSectionBG>
  );
};

export default HomeSectionExercise;
