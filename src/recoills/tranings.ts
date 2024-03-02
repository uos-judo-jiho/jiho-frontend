import { useCallback, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { getTrainings } from "../api/trainingApi";
import { ArticleInfoType } from "../types/ArticleInfoType";

const TrainingList = atom<ArticleInfoType[]>({
  key: "trainingObject",
  default: [],
});

export const useTrainings = () => {
  const [trainings, setTrainings] = useRecoilState(TrainingList);
  const [isLoad, setIsLoad] = useState(false);

  const fetch = useCallback(async () => {
    if (isLoad) {
      return;
    }
    const newTrainingList = await getTrainings("2022");

    if (!newTrainingList) {
      return;
    }

    setTrainings(newTrainingList);
    setIsLoad(true);
  }, [isLoad, setTrainings]);

  const refreshTraining = useCallback(() => {
    setIsLoad(false);
    fetch();
  }, [fetch]);

  return { fetch, refreshTraining, trainings };
};
