import { useParams } from "react-router-dom";

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return <div>회원 상세 페이지: {id}</div>;
};
