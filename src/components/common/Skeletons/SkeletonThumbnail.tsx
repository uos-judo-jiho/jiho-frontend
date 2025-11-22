import SkeletonItem from "./SkeletonItem";

const SkeletonThumbnail = () => {
  return (
    <div className="w-full h-full overflow-hidden relative">
      <SkeletonItem></SkeletonItem>
    </div>
  );
};

export default SkeletonThumbnail;
