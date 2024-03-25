import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { getTrainings } from "../api/training";
import { ArticleInfoType } from "../types/ArticleInfoType";

const TrainingList = atom<ArticleInfoType[]>({
  key: "trainingObject",
  default: [],
});
const isTrainingFecthed = atom<boolean>({
  key: "isTrainingFecthed",
  default: false,
});

export const useTrainings = () => {
  const [trainings, setTrainings] = useRecoilState(TrainingList);
  const [isLoad, setIsLoad] = useRecoilState(isTrainingFecthed);

  const fetch = useCallback(
    async (year?: string) => {
      if (isLoad) {
        return;
      }
      const newTrainingList = await getTrainings(year);
      if (!newTrainingList) {
        return;
      }

      setTrainings(
        newTrainingList.sort((a, b) => (a.dateTime > b.dateTime ? -1 : 1))
      );
      setIsLoad(true);
    },
    [isLoad, setIsLoad, setTrainings]
  );

  const refreshTraining = useCallback(() => {
    setIsLoad(false);
    fetch();
  }, [fetch, setIsLoad]);

  return { fetch, refreshTraining, trainings, isLoad };
};
