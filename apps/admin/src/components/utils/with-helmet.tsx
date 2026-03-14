import Helmet from "../common/helmet/Helmet";

export const WithHelmet = (Component: React.ReactNode, title: string) => {
  return (
    <>
      <Helmet title={title} />
      {Component}
    </>
  );
};
