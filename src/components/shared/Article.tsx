import type { VFC } from "react";

import { formatDate } from "../../lib/day";
import type { Content } from "../../types";

type Props = {
  article: Content;
};

export const Article: VFC<Props> = ({ article }) => {
  return (
    <article className="text-left">
      <h1
        className="
          text-xl sm:text-2xl transition
          hover:opacity-70 cursor-pointer
        "
      >
        {article.title}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {formatDate(article.createdAt)}
      </p>
    </article>
  );
};
