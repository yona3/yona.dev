import type { BlogListProps } from "@/features/blog/types";

import { BlogArticle } from "./BlogArticle";

export const BlogList = ({ articles }: BlogListProps) => {
  return (
    <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
      {articles.map((article) => (
        <div key={article.id}>
          <BlogArticle
            article={{
              id: article.id,
              title: article.title,
              body: "",
              createdAt: article.publishedAt,
              publishedAt: article.publishedAt,
              revisedAt: article.updatedAt,
              updatedAt: article.updatedAt,
              tags: article.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                createdAt: article.publishedAt,
                publishedAt: article.publishedAt,
                revisedAt: article.updatedAt,
                updatedAt: article.updatedAt,
              })),
              image: {
                url: "",
                width: 0,
                height: 0,
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};
