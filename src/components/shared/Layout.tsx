import type { ReactNode, VFC } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: VFC<Props> = ({ children }) => {
  return (
    <div className="relative pb-28 min-h-screen text-gray-700">
      <Header />
      <div className="px-5 pb-10">{children}</div>
      <Footer />
    </div>
  );
};
