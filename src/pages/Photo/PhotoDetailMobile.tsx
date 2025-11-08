import MobilePhotoCard from "@/components/Photo/MobilePhotoCard";
import Feed from "@/components/common/Feed/Feed";
import Footer from "@/components/common/Footer/footer";
import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import Loading from "@/components/common/Skeletons/Loading";
import { useTrainingListQuery } from "@/api/trainings/query";
import { useMemo } from "react";

export const PhotoDetailMobile = () => {
  const { data, isLoading } = useTrainingListQuery();

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  if (!trainings && isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <MobileHeader backUrl="/photo" subTitle="훈련일지" subTitleUrl="/photo" />
      <Feed>
        {trainings && trainings.length > 0 ? (
          trainings.map((trainingInfo) => (
            <div key={trainingInfo.id}>
              <MobilePhotoCard
                articleInfo={trainingInfo}
                id={`training-mobile-card-${trainingInfo.id}`}
              />
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            훈련일지를 불러오는 중...
          </div>
        )}
      </Feed>
      <Footer />
    </div>
  );
};
