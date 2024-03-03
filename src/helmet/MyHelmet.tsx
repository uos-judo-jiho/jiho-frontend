import { useEffect } from "react";

type MyHelmetProps = {
  helmet: string;
};

const MyHelmet = ({ helmet }: MyHelmetProps) => {
  useEffect(() => {
    document.title = "Uos Judo Team Jiho | " + helmet;
  }, [helmet]);

  return <></>;
};

export default MyHelmet;
