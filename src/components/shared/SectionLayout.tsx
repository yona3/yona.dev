import type { ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
};

export const SectionLayout: VFC<Props> = ({ children }) => {
  return <section className="py-16 text-center">{children}</section>;
};
