import { Suspense } from "react";
import Loading from "../common/Skeletons/Loading";

export const WithSuspense = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};
