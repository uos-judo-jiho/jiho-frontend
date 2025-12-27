import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import Loading from "@/components/common/Skeletons/Loading";
import { useTrainingListQuery } from "@/features/api/trainings/query";
import { createArticleData, StructuredData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PhotoDetailMobile } from "./PhotoDetailMobile";
import { PhotoDetailPc } from "./PhotoDetailPc";

const PhotoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useTrainingListQuery();

  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  const current =
    trainings?.findIndex((item) => item.id.toString() === id?.toString()) ?? -1;

  const info = trainings?.find((item) => item.id.toString() === id?.toString());

  const metaDescription = [info?.title, info?.description.slice(0, 140)].join(
    " | "
  );

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!info) return null;

    return createArticleData({
      headline: [info.title, info.author].join(" - ") || "",
      description: metaDescription,
      images: info.imgSrcs || [],
      datePublished: info.dateTime
        ? new Date(info.dateTime).toISOString()
        : undefined,
      dateModified: info?.dateTime
        ? new Date(info.dateTime).toISOString()
        : undefined,
    });
  }, [info, metaDescription]);

  if (!info || !trainings) {
    return <Loading />;
  }

  const metaImgUrl = info.imgSrcs.at(0);

  // Format date for meta tags (ISO 8601 format)
  const publishedDate = info.dateTime
    ? new Date(info.dateTime).toISOString()
    : undefined;

  return (
    <>
      <MyHelmet
        title={`훈련일지 - ${info.author}`}
        description={metaDescription}
        imgUrl={metaImgUrl}
        datePublished={publishedDate}
        dateModified={publishedDate}
        author={info.author}
        articleType="article"
      />
      {structuredData && <StructuredData data={structuredData} />}
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
