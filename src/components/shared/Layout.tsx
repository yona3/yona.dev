import type { ReactNode, VFC } from "react";

import { Header } from "./Header";

interface Props {
  children: ReactNode;
}

export const Layout: VFC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-700">
      <Header />
      <div className="px-5">{children}</div>
    </div>
  );
};
