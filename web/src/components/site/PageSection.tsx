import type { ReactNode } from "react";

import homeStyles from "./home.module.css";

type Props = {
  action?: ReactNode;
  children: ReactNode;
  label?: string;
  labelledBy?: string;
  title?: ReactNode;
};

export const PageSection = ({
  action,
  children,
  label,
  labelledBy,
  title,
}: Props) => {
  return (
    <section
      className={homeStyles.section}
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {title && labelledBy && (
        <div className={homeStyles.sectionHeader}>
          <h2 id={labelledBy}>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
