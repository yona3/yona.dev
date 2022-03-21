import type { ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
};

export const SectionLayout: VFC<Props> = ({ children }) => {
  return <section className="py-12 text-center md:py-16">{children}</section>;
};
