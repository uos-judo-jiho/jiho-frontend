import FormContainer from "@/components/admin/form/FormContainer";
import NewsGalleryFrom from "@/components/admin/form/NewsGalleryFrom";
import { useParams } from "react-router-dom";

const GalleryWrite = () => {
  const { year } = useParams<{ year: string }>();

  if (!year) {
    return (
      <FormContainer title="갤러리 이미지 수정">
        <p>년도 정보가 없습니다.</p>
      </FormContainer>
    );
  }

  return (
    <FormContainer title={`${year}년 갤러리 이미지 수정`}>
      <NewsGalleryFrom year={year} />
    </FormContainer>
  );
};

export default GalleryWrite;
