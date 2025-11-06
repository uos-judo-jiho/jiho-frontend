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

  // SSR에서는 useEffect가 실행되지 않으므로 data를 직접 사용
  // 클라이언트에서는 Recoil state를 사용 (hydration 이후)
  const sortedData = data ? [...data].sort((a, b) =>
    b.dateTime.localeCompare(a.dateTime)
  ) : [];

  const effectiveTrainings = trainings.length > 0 ? trainings : sortedData;

  return { trainings: effectiveTrainings, isLoading, refetch };
};
