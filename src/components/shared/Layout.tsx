import type { ReactNode, VFC } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface Props {
  children: ReactNode;
}

export const Layout: VFC<Props> = ({ children }) => {
  return (
    <div className="relative pb-24 min-h-screen text-gray-700">
      <Header />
      <div className="px-5">{children}</div>
      <Footer />
    </div>
  );
};
