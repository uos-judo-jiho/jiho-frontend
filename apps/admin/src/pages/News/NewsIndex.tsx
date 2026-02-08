import FormContainer from "@/components/admin/form/FormContainer";
import Col from "@/components/layouts/Col";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { Link } from "react-router-dom";

const NewsIndex = () => {
  const yearList = vaildNewsYearList().reverse();

  return (
    <FormContainer title="지호지 관리 - 년도 선택">
      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>관리하실 년도를 선택해주세요</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5">
          {yearList.map((year) => (
            <Link to={`/news/${year}`} key={year}>
              <div className="p-6 border border-gray-500 rounded-lg bg-gray-50 transition-all cursor-pointer hover:border-blue-500">
                <h2 className="text-lg leading-normal m-0 text-gray-800">
                  {year}년
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </Col>
    </FormContainer>
  );
};

export default NewsIndex;
