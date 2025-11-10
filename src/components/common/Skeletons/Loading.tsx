import { useEffect, useState } from "react";

type LoadingProps = {
  deferTime?: number;
  loading?: boolean;
};

const Loading = ({ deferTime = 237, loading = true }: LoadingProps) => {
  const [isVisible, setIsVisible] = useState(loading);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(loading);
    }, deferTime);
    return () => clearTimeout(timer);
  }, [deferTime, loading]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="inline-block relative w-20 h-20">
        <div className="box-border block absolute w-16 h-16 my-2 mx-2 border-[8px] border-[#4c4ce7ff] rounded-full animate-ring border-t-[#4c4ce7ad] border-r-[#4a4ae06c] border-b-[#5656db14] border-l-transparent [animation-delay:-0.45s]" />
        <div className="box-border block absolute w-16 h-16 my-2 mx-2 border-[8px] border-[#4c4ce7ff] rounded-full animate-ring border-t-[#4c4ce7ad] border-r-[#4a4ae06c] border-b-[#5656db14] border-l-transparent [animation-delay:-0.3s]" />
        <div className="box-border block absolute w-16 h-16 my-2 mx-2 border-[8px] border-[#4c4ce7ff] rounded-full animate-ring border-t-[#4c4ce7ad] border-r-[#4a4ae06c] border-b-[#5656db14] border-l-transparent [animation-delay:-0.15s]" />
        <div className="box-border block absolute w-16 h-16 my-2 mx-2 border-[8px] border-[#4c4ce7ff] rounded-full animate-ring border-t-[#4c4ce7ad] border-r-[#4a4ae06c] border-b-[#5656db14] border-l-transparent" />
      </div>
    </div>
  );
};

export default Loading;
