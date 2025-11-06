import { useTrainingListQuery } from "@/api/trainings/query";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";

const TrainingList = atom<ArticleInfoType[]>({
  key: "trainingObject",
  default: [],
});

export const useTrainings = (year?: string) => {
  const [trainings, setTrainings] = useRecoilState(TrainingList);

  const { data, isLoading, refetch } = useTrainingListQuery(year);

  useEffect(() => {
    if (data) {
      const sortedData = [...data].sort((a, b) =>
        b.dateTime.localeCompare(a.dateTime)
      );

      setTrainings(sortedData);
    }
  }, [data, setTrainings]);

  return { trainings, isLoading, refetch };
};
