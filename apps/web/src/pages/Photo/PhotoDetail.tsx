import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import Loading from "@/components/common/Skeletons/Loading";
import { v2Api } from "@packages/api";
import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import { PhotoDetailMobile } from "./PhotoDetailMobile";
import { PhotoDetailPc } from "./PhotoDetailPc";

const routeApi = getRouteApi("/photo/$id");

const PhotoPage = () => {
  const { id } = routeApi.useParams();
  const { data } = v2Api.useGetApiV2Trainings(undefined, {
    query: {
      select: (response) => response.data.trainingLogs,
    },
  });

  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  const current =
    trainings?.findIndex((item) => item.id.toString() === id?.toString()) ?? -1;

  const info = trainings?.find((item) => item.id.toString() === id?.toString());

  if (!info || !trainings) {
    return <Loading />;
  }

  return (
    <>
      <ResponsiveBranch
        pcComponent={
          <PhotoDetailPc
            training={info}
            current={current}
            trainings={trainings}
          />
        }
        mobileComponent={
          <PhotoDetailMobile
            training={info}
            current={current}
            trainings={trainings}
          />
        }
      />
    </>
  );
};

export default PhotoPage;
