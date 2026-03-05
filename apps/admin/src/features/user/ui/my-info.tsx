import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { AdditionalMyInfo } from "./additional-my-info";
import { CommonMyInfo } from "./common-my-info";

export const MyInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense
          fallback={
            <div className="space-y-4">
              <SkeletonItem className="h-4 w-[30%]" />
              <SkeletonItem className="h-4 w-[50%]" />
              <SkeletonItem className="h-4 w-[40%]" />
            </div>
          }
        >
          <CommonMyInfo />
        </Suspense>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg">추가 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense
          fallback={
            <div className="space-y-4">
              <SkeletonItem className="h-4 w-[30%]" />
              <SkeletonItem className="h-4 w-[50%]" />
              <SkeletonItem className="h-4 w-[40%]" />
            </div>
          }
        >
          <AdditionalMyInfo />
        </Suspense>
      </CardContent>
    </Card>
  );
};
