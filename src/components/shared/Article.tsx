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
            text-lg font-medium 
            text-gray-700 hover:opacity-70 transition
            cursor-pointer sm:text-xl
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
