import Line from "@/components/layouts/Line";
import { Link } from "react-router-dom";

function NoticeFooter() {
  return (
    <>
      <Line borderWidth="1px" margin="2rem 0" />
      <div className="w-max text-theme-default text-theme-grey">
        <div className="px-3 py-2 hover:bg-theme-light-grey hover:text-theme-text transition-all duration-500 ease-in-out animate-in fade-in">
          <Link to="/notice">목록으로</Link>
        </div>
      </div>
    </>
  );
}

export default NoticeFooter;
