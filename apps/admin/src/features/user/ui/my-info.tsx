import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { RouterUrl } from "@/app/routers/router-url";
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">추가 정보</CardTitle>
        <Button asChild variant="outline" size="sm" className="h-8 gap-1">
          <Link to={RouterUrl.마이페이지.정보수정}>
            <Pencil className="size-3.5" />
            수정
          </Link>
        </Button>
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
