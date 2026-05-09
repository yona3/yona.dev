import Link from "next/link";
import type { ReactNode } from "react";

import {
  siteCopy,
  siteInfo,
  siteNavigationItems,
  type SitePage,
} from "../../constants/site";
import layoutStyles from "./layout.module.css";
import navigationStyles from "./navigation.module.css";

type Props = {
  children: ReactNode;
  currentPage: SitePage;
};

const CoffeeEmoji = () => {
  return (
    <svg
      aria-hidden="true"
      className={layoutStyles.coffeeEmoji}
      focusable="false"
      viewBox="0 0 64 64"
    >
      <path
        d="M16 30h30v9.5C46 49.2 39.2 55 31 55s-15-5.8-15-15.5V30Z"
        fill="#F7F0E4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M18 31.5h26c-.8 3.5-6.1 5.7-13 5.7s-12.2-2.2-13-5.7Z"
        fill="#8B5E3C"
      />
      <path
        d="M46 34h4.5c4 0 6.5 2.5 6.5 6.2 0 3.9-2.7 6.8-7.2 6.8H45"
        fill="none"
        stroke="#E7DCCB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M15 56.5c3.2 2 26.8 2 32 0"
        fill="none"
        stroke="#D9C8B6"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M24 8c-3 4 3 5.5 0 10M33 7c-3.4 4.6 3.4 6.2 0 11M42 9c-2.5 3.5 2.5 5 0 8.5"
        fill="none"
        stroke="#B9A690"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
};

export const SiteShell = ({ children, currentPage }: Props) => {
  return (
    <div className={layoutStyles.page}>
      <div className={layoutStyles.shell}>
        <header className={layoutStyles.header}>
          <Link className={navigationStyles.brand} href="/">
            {siteInfo.name}
          </Link>
          <nav
            className={navigationStyles.nav}
            aria-label={siteCopy.layout.navigationLabel}
          >
            {siteNavigationItems.map((item) => (
              <Link
                aria-current={currentPage === item.page ? "page" : undefined}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main id="main">{children}</main>
        <p className={layoutStyles.constructionNotice} role="note">
          <span aria-hidden="true">🚧</span>
          <span>{siteCopy.layout.constructionNotice}</span>
        </p>
        <div className={layoutStyles.footer} aria-hidden="true">
          <CoffeeEmoji />
        </div>
      </div>
    </div>
  );
};
