import "highlight.js/styles/base16/atelier-sulphurpool.css";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ArticleLayout({ children }: Props) {
  return children;
}
