import type { ReactNode } from "react";

import pageStyles from "./page.module.css";

type Props = {
  children?: ReactNode;
  labelledBy: string;
  title?: ReactNode;
  variant?: "default" | "about";
};

export const PageHero = ({
  children,
  labelledBy,
  title,
  variant = "default",
}: Props) => {
  const className =
    variant === "about"
      ? `${pageStyles.hero} ${pageStyles.heroAbout}`
      : pageStyles.hero;

  return (
    <section className={className} aria-labelledby={labelledBy}>
      {title && (
        <h1 id={labelledBy} className={pageStyles.pageTitle}>
          {title}
        </h1>
      )}
      {children}
    </section>
  );
};
