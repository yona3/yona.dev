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

export const SiteShell = ({ children, currentPage }: Props) => {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            Koh Yonamine
          </Link>
          <nav className={styles.nav} aria-label="Primary navigation">
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
        <main>{children}</main>
        <footer className={styles.footer}>
          <p>Koh Yonamine</p>
          <span aria-hidden="true">☕</span>
        </footer>
      </div>
    </div>
  );
};
