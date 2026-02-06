import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import Line from "@/components/layouts/Line";
import { cn } from "@/shared/lib/utils";

function NoticeFooter() {
  return (
    <>
      <Line borderWidth="1px" margin="2rem 0" />
      <div className="w-max text-theme-default text-theme-grey">
        <div
          className={cn(
            "px-3 py-2 border-radius-md",
            "hover:bg-gray-100 hover:text-theme-text",
            "active:scale-95",
            "transition-all duration-500 ease-in-out animate-in fade-in"
          )}
        >
          <Link to="/notice" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </div>
      </div>
    </>
  );
}

export default NoticeFooter;
