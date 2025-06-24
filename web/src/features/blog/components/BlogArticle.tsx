import Link from "next/link";
import type { FC } from "react";

import { formatDate } from "@/shared/utils/date";
import type { Content } from "@/types";

type Props = {
  article: Content;
};

export const BlogArticle: FC<Props> = ({ article }) => {
  return (
    <article className="text-left">
      <Link href={`/blog/${article.id}`}>
        <h1
          className="
            cursor-pointer text-lg 
            font-medium transition
            hover:opacity-70 sm:text-xl
          "
        >
          {article.title}
        </h1>
      </Link>
      <p className="mt-2 text-sm text-gray-400">
        {formatDate(article.publishedAt)}
      </p>
    </article>
  );
};
