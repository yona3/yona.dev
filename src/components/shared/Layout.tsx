import type { ReactNode, VFC } from "react";

import { Header } from "./Header";

interface Props {
  children: ReactNode;
  refs?: { [key: string]: HTMLDivElement };
}

export const Layout: VFC<Props> = ({ children, refs }) => {
  return (
    <div className="pb-12 min-h-screen text-gray-700">
      <Header refs={refs} />
      <div className="px-5">{children}</div>
    </div>
  );
};
