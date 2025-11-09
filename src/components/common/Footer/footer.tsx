import { MobileRowColLayout } from "@/components/layouts/MobileRowColLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { footerData } from "@/lib/assets/data/footer";
import { Constants } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { HTMLProps } from "react";
import { Link } from "react-router-dom";

const DescriptionList = ({
  className,
  ...props
}: HTMLProps<HTMLUListElement>) => (
  <ul className={cn("mr-5 mb-3 flex flex-col gap-2", className)} {...props} />
);

const DescriptionItem = ({
  className,
  children,
  ...rest
}: HTMLProps<HTMLLIElement>) => (
  <li
    className={cn(
      "text-sm text-theme-black break-keep-all wrap-break",
      className,
    )}
    {...rest}
  >
    {children}
  </li>
);

const DescriptionItemTitle = ({
  className,
  children,
  ...rest
}: HTMLProps<HTMLLIElement>) => (
  <li className={cn("font-bold text-sm text-theme-black", className)} {...rest}>
    {children}
  </li>
);

const HyperLink = ({
  to,
  className,
  children,
  target,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
}) => (
  <Link to={to} target={target} className={cn("hover:opacity-60", className)}>
    {children}
  </Link>
);

const Footer = () => {
  return (
    <footer className="my-8">
      <SheetWrapper>
        <MobileRowColLayout
          rowJustifyContent="space-between"
          mobileProps={{
            className: "px-4",
          }}
        >
          {/* MARK: Home 훈련 일지 지호지 */}
          <DescriptionList>
            <DescriptionItemTitle>
              <HyperLink to={"/"}>HOME으로 바로가기</HyperLink>
            </DescriptionItemTitle>
            <DescriptionItem>
              <HyperLink to={"/photo"}>훈련 일지로 바로가기</HyperLink>
            </DescriptionItem>
            <DescriptionItem>
              <HyperLink
                to={`/news/${Constants.LATEST_NEWS_YEAR}`}
              >{`${Constants.LATEST_NEWS_YEAR} 지호지로 바로가기`}</HyperLink>
            </DescriptionItem>
            {/* 관리자 페이지로 */}
            <DescriptionItem>
              <HyperLink
                to={"/admin"}
                className="text-gray-500 hover:text-gray-600 hover:underline"
              >
                {`관리자 페이지`}
              </HyperLink>
            </DescriptionItem>
            {/* 사이트맵 */}
            <DescriptionItem>
              <HyperLink
                to={"https://uosjudo.com/sitemap.xml"}
                target="_blank"
                className="text-gray-500 hover:text-gray-600 hover:underline"
              >
                {`사이트맵`}
              </HyperLink>
            </DescriptionItem>
          </DescriptionList>
          {/* 지호 이름 */}
          <DescriptionList>
            <DescriptionItemTitle>
              {footerData.title.krTitle}
            </DescriptionItemTitle>
            <DescriptionItem>{footerData.title.enTitle}</DescriptionItem>
            <DescriptionItem>{footerData.title.since}</DescriptionItem>
          </DescriptionList>
          {/* 정규 운동 */}
          <DescriptionList>
            <DescriptionItemTitle>
              {footerData.exercise.title}
            </DescriptionItemTitle>
            <DescriptionItem>{footerData.exercise.time}</DescriptionItem>
            <DescriptionItem>{footerData.exercise.place}</DescriptionItem>
          </DescriptionList>
          {/* Connect Us */}
          <DescriptionList>
            <DescriptionItemTitle>
              {footerData.connetUs.title}
            </DescriptionItemTitle>
            <DescriptionItem>
              {footerData.connetUs.instagram.title}
              <HyperLink
                to="https://www.instagram.com/uos_judo/"
                target="_blank"
              >
                {footerData.connetUs.instagram.href}
              </HyperLink>
            </DescriptionItem>
            <DescriptionItem>
              {footerData.connetUs.email.title}
              <HyperLink to="mailto: uosjudojiho@gmail.com">
                {footerData.connetUs.email.href}
              </HyperLink>
            </DescriptionItem>
            <DescriptionItem>
              {footerData.connetUs.dev.title}
              <HyperLink to="mailto: uosjudojiho@gmail.com">
                {footerData.connetUs.dev.href}
              </HyperLink>
            </DescriptionItem>
          </DescriptionList>
        </MobileRowColLayout>
      </SheetWrapper>
    </footer>
  );
};

export default Footer;
