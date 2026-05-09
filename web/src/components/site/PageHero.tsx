import type { ReactNode } from "react";

import homeStyles from "./home.module.css";

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
      ? `${homeStyles.hero} ${homeStyles.heroAbout}`
      : homeStyles.hero;

  return (
    <section className={className} aria-labelledby={labelledBy}>
      {title && (
        <h1 id={labelledBy} className={homeStyles.pageTitle}>
          {title}
        </h1>
      )}
      {children}
    </section>
  );
};
