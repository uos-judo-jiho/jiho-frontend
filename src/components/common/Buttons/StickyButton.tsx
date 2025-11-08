import { useEffect, useState } from "react";
import { UpperArrowIcon } from "@/components/icons";

function StickyButton() {
  const [visible, setVisible] = useState<boolean>(false);
  const [isRender, setIsRender] = useState<boolean>(false);

  function toggleVisible() {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
      setIsRender(true);
    } else {
      setVisible(false);
    }
  }

  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);

    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 bg-transparent">
      {isRender && (
        <div
          className={`origin-center ${
            visible ? "animate-fadeIn" : "animate-fadeOut"
          }`}
        >
          <button
            onClick={handleClick}
            className="w-12 h-12 rounded-xl bg-theme-light-grey opacity-80"
          >
            <UpperArrowIcon title="Scroll to top" className="w-full h-full" />
          </button>
        </div>
      )}
    </div>
  );
}

export default StickyButton;
