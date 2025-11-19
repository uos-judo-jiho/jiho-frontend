import Col from "@/components/layouts/Col";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Link } from "react-router-dom";
import MyHelmet from "../seo/helmet/MyHelmet";

const NotFound = () => {
  return (
    <>
      <MyHelmet title="NotFound" />
      <DefaultLayout>
        <div className="flex justify-center items-center w-full h-[80vh]">
          <Col alignItems="center">
            <div>존재하지 않는 페이지입니다.</div>
            <Link to={"/"}>
              <div className="my-4 text-gray-500 hover:text-gray-600 hover:underline">
                홈으로 돌아가기
              </div>
            </Link>
          </Col>
        </div>
      </DefaultLayout>
    </>
  );
};

export default NotFound;
