import type { FC, ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-900 pb-28 tracking-[0.04rem] text-gray-100">
      <Header />
      <div className="px-5 pb-10">{children}</div>
      <Footer />
    </div>
  );
};
