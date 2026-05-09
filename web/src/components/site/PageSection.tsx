import type { ReactNode } from "react";

import pageStyles from "./page.module.css";

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
      className={pageStyles.section}
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {title && labelledBy && (
        <div className={pageStyles.sectionHeader}>
          <h2 id={labelledBy}>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
