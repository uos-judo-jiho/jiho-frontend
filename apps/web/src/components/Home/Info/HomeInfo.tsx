import Title from "@/components/layouts/Title";
import { footerData } from "@/shared/lib/assets/data/footer";
import Logo from "../../Logo";

function HomeInfo() {
  return (
    <div className="mb-2.5 flex-1">
      <div className="flex flex-col">
        <div
          className="hidden sm:flex justify-center items-center rounded-full w-[120px] h-[120px] mb-5"
          style={{
            border: "2px solid var(--theme-text)",
            backgroundColor: "var(--theme-bg)",
          }}
        >
          <Logo size={"100px"} isDark={true} />
        </div>
        <ul>
          <li className="text-white">
            <Title title={footerData.title.krTitle} heading={2} />
          </li>
          <li className="text-white">
            <h3 className="mb-3 text-theme-light-grey text-lg">
              {footerData.title.since}
            </h3>
          </li>
          <li className="text-white">
            <h3 className="mb-3 text-theme-light-grey text-lg ">
              {footerData.exercise.title}
            </h3>
          </li>
          <li className="text-white">{footerData.exercise.time}</li>
          <li className="text-white">{footerData.exercise.place}</li>
        </ul>
      </div>
    </div>
  );
}

export default HomeInfo;
