import Line from "@/components/layouts/Line";
import { MobileRowColLayout } from "@/components/layouts/MobileRowColLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { useLatestNews } from "@/features/seo/news/hooks/use-latest-news";
import { footerData } from "@/shared/lib/assets/data/footer";
import { cn } from "@/shared/lib/utils";
import { HTMLProps, ReactNode } from "react";
import { Link } from "react-router-dom";

const DescriptionList = ({
  className,
  ...props
}: HTMLProps<HTMLUListElement>) => (
  <ul
    className={cn(
      "mr-2 mb-2 flex flex-col gap-2 py-2 sm:p-0 sm:border-none border-t border-theme-light-grey ",
      className,
    )}
    {...props}
  />
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
  reload = false,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  target?: string;
  reload?: boolean;
}) => {
  const shouldUseAnchor =
    reload ||
    /^(https?:)?\/\//.test(to) ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:");

  if (shouldUseAnchor) {
    return (
      <a
        href={to}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn("hover:opacity-60", className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} target={target} className={cn("hover:opacity-60", className)}>
      {children}
    </Link>
  );
};

const Footer = () => {
  const { lastestNewsYear } = useLatestNews();
  return (
    <footer className="my-8">
      <SheetWrapper>
        <MobileRowColLayout
          rowJustifyContent="space-between"
          mobileProps={{
            className: "px-4",
          }}
        >
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
            <DescriptionItem>{"장소 | "}</DescriptionItem>
            <DescriptionItem>{footerData.exercise.address}</DescriptionItem>
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
        {/* MARK: Home 훈련 일지 지호지 */}
        <Line className="h-[1px] bg-theme-light-grey" />
        <ul className="flex flex-wrap gap-3 sm:px-0 px-4 mt-4 mb-16">
          <DescriptionItemTitle>
            <HyperLink to={"/"}>HOME으로 바로가기</HyperLink>
          </DescriptionItemTitle>
          <DescriptionItem>
            <HyperLink to={"/photo"}>훈련 일지로 바로가기</HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            <HyperLink
              to={`/news/${lastestNewsYear}`}
            >{`${lastestNewsYear} 지호지로 바로가기`}</HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            <HyperLink to={`/album`}>앨범으로 바로가기</HyperLink>
          </DescriptionItem>
          {/* 관리자 페이지로 */}
          {/* TODO admin.uosjudo.com */}
          {/* <DescriptionItem>
            <HyperLink
              to={"/admin"}
              reload
              className="text-gray-500 hover:text-gray-600 hover:underline"
            >
              {`관리자 페이지`}
            </HyperLink>
          </DescriptionItem> */}
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
        </ul>
      </SheetWrapper>
    </footer>
  );
};

export default Footer;
