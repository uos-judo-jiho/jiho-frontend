import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import { PhotoDetailMobile } from "./PhotoDetailMobile";
import { PhotoDetailPc } from "./PhotoDetailPc";

const PhotoPage = () => {
  return (
    <ResponsiveBranch
      pcComponent={<PhotoDetailPc />}
      mobileComponent={<PhotoDetailMobile />}
    />
  );
};

export default PhotoPage;
