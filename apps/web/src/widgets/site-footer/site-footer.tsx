import { Link, linkOptions, type LinkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AuthLink } from "@/features/auth";
import { useLatestNews } from "@/features/news";
import { SITE } from "@/shared/config/site";
import { InstagramIcon } from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";

/**
 * 사이트 푸터.
 * 이전에는 MobileRowColLayout 때문에 같은 내용이 DOM 에 두 벌(PC용 Row +
 * 모바일용 Col) 들어가 있었다. 여기서는 한 벌만 그리고 CSS 로 배치만 바꾼다.
 */
export const SiteFooter = () => {
  const { latestNewsYear } = useLatestNews();

  return (
    <footer className="border-t border-line bg-paper-sunken">
      <div className="mx-auto max-w-page px-gutter py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <Logo className="size-11" />
              <span className="jd-keep-all text-subheading text-ink-strong">
                {SITE.nameKo}
              </span>
            </Link>
            <p className="text-caption text-ink-muted">{SITE.nameEn}</p>
            <p className="text-micro tracking-[0.18em] text-ink-faint uppercase">
              {SITE.since}
            </p>
          </div>

          <FooterGroup title={SITE.practice.label}>
            <FooterText>{SITE.practice.time}</FooterText>
            <FooterText>{SITE.practice.address}</FooterText>
            <FooterText>{SITE.practice.place}</FooterText>
          </FooterGroup>

          <FooterGroup title="Connect">
            <li>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-strong"
              >
                <InstagramIcon className="size-4" decorative />
                {SITE.instagram.handle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="text-caption text-ink-muted transition-colors hover:text-ink-strong"
              >
                {SITE.email}
              </a>
            </li>
          </FooterGroup>
        </div>

        <nav
          aria-label="바로가기"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6"
        >
          <FooterLink link={linkOptions({ to: "/" })}>홈</FooterLink>
          <FooterLink link={linkOptions({ to: "/photo" })}>훈련일지</FooterLink>
          <FooterLink
            link={linkOptions({
              to: "/news/$id",
              params: { id: String(latestNewsYear) },
            })}
          >
            {latestNewsYear} 지호지
          </FooterLink>
          <FooterLink link={linkOptions({ to: "/album" })}>앨범</FooterLink>
          <FooterLink link={linkOptions({ to: "/notice" })}>
            공지사항
          </FooterLink>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-micro text-ink-faint">
          <FooterLink link={linkOptions({ to: "/terms" })} muted>
            이용약관
          </FooterLink>
          <FooterLink link={linkOptions({ to: "/privacy" })} muted>
            개인정보 처리방침
          </FooterLink>
          <a
            href={`${SITE.url}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink-muted"
          >
            사이트맵
          </a>
          <AuthLink className="transition-colors hover:text-ink-muted" />
          <span className="ml-auto">
            © {new Date().getFullYear()} {SITE.name}
          </span>
        </div>
      </div>
    </footer>
  );
};

const FooterGroup = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="jd-eyebrow">{title}</h2>
    <ul className="flex flex-col gap-2">{children}</ul>
  </div>
);

const FooterText = ({ children }: { children: ReactNode }) => (
  <li className="text-caption text-ink-muted">{children}</li>
);

const FooterLink = ({
  link,
  children,
  muted = false,
}: {
  link: LinkOptions;
  children: ReactNode;
  muted?: boolean;
}) => (
  <Link
    {...link}
    className={
      muted
        ? "transition-colors hover:text-ink-muted"
        : "text-caption font-medium text-ink-muted transition-colors hover:text-ink-strong"
    }
  >
    {children}
  </Link>
);
