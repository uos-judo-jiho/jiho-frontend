import { useEffect } from "react";

type MyHelmetProps = {
  helmet: string;
};

function MyHelmet({ helmet }: MyHelmetProps) {
  useEffect(() => {
    document.title = "Uos Judo Team Jiho | " + helmet;
  }, []);

  return <></>;
}

export default MyHelmet;
