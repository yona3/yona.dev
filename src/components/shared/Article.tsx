import Link from "next/link";
import type { VFC } from "react";

import { formatDate } from "../../lib/day";
import type { Content } from "../../types";

type Props = {
  article: Content;
};

export const Article: VFC<Props> = ({ article }) => {
  return (
    <article className="text-left">
      <Link href={`/blog/${article.id}`}>
        <h1
          className="
            text-lg sm:text-xl transition
            hover:opacity-70 cursor-pointer
          "
        >
          {article.title}
        </h1>
      </Link>
      <p className="mt-2 text-sm text-gray-500">
        {formatDate(article.publishedAt)}
      </p>
    </article>
  );
};
