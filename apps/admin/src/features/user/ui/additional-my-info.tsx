import { Badge } from "@/components/common/badge";
import { v2Admin } from "@packages/api";

export const AdditionalMyInfo = () => {
  const { data: additionalInfo } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user.additionalInfo,
    },
  });

  return (
    <>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">이름</span>
        <span className="col-span-2 text-sm font-semibold">
          {additionalInfo?.name ?? "-"}
        </span>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">기수</span>
        <span className="col-span-2 text-sm">
          {additionalInfo?.generation ? `${additionalInfo?.generation}기` : "-"}
        </span>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">학번</span>
        <span className="col-span-2 text-sm">
          {additionalInfo?.studentId ?? "-"}
        </span>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">학과</span>
        <span className="col-span-2 text-sm">
          {additionalInfo?.major ?? "-"}
        </span>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">연락처</span>
        <span className="col-span-2 text-sm">
          {additionalInfo?.phoneNumber
            ? additionalInfo.phoneNumber.replace(
                /(\d{3})(\d{4})(\d{4})/,
                "$1-$2-$3",
              )
            : "-"}
        </span>
      </div>
      <div className="grid grid-cols-3">
        <span className="text-sm font-medium text-neutral-500">졸업 여부</span>
        <span className="col-span-2 text-sm">
          {additionalInfo?.isGraduated === "Y" && <Badge>졸업생</Badge>}
          {additionalInfo?.isGraduated === "N" && (
            <Badge theme="green">재학생</Badge>
          )}
          {additionalInfo?.isGraduated == null && "-"}
        </span>
      </div>
    </>
  );
};
