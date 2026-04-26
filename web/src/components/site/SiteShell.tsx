import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./site.module.css";

type CurrentPage = "home" | "about" | "notes";

type Props = {
  children: ReactNode;
  currentPage: CurrentPage;
};

const navItems: { href: string; label: string; page: CurrentPage }[] = [
  { href: "/", label: "Home", page: "home" },
  { href: "/about", label: "About", page: "about" },
  { href: "/notes", label: "Notes", page: "notes" },
];

const CoffeeEmoji = () => {
  return (
    <svg
      aria-hidden="true"
      className={styles.coffeeEmoji}
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
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            yona.dev
          </Link>
          <nav className={styles.nav} aria-label="主要ナビゲーション">
            {navItems.map((item) => (
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
        <p className={styles.constructionNotice} role="note">
          <span aria-hidden="true">🚧</span>
          <span>このサイトは現在工事中です</span>
        </p>
        <div className={styles.footer} aria-hidden="true">
          <CoffeeEmoji />
        </div>
      </div>
    </div>
  );
};
