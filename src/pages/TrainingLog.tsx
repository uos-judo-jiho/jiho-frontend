import React from "react";
import ThumbnailCard from "../components/TrainingLog/ThumbnailCard";
import TrainingLogCardContainer from "../components/TrainingLog/TrainingLogCardContainer";
import DefaultLayout from "../layouts/DefaultLayout";

function TrainingLog() {
  return (
    <DefaultLayout>
      <TrainingLogCardContainer>
        <ThumbnailCard imgSrc={""}></ThumbnailCard>
      </TrainingLogCardContainer>
    </DefaultLayout>
  );
}

export default TrainingLog;
