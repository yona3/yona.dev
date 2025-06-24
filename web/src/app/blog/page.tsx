import type { Metadata } from "next";

import { BlogList } from "@/features/blog";
import { Layout } from "@/shared/components/Layout";
import { MyLinks } from "@/shared/components/MyLinks";

export const metadata: Metadata = {
  title: "yona.blog",
  description: "yonaのブログです。",
  openGraph: {
    title: "Blog",
    description: "yonaのブログです。",
    url: "https://yona.dev/blog",
    siteName: "yona.dev",
    images: [
      {
        url: "https://yona.dev/icon.jpeg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog",
    description: "yonaのブログです。",
    images: ["https://yona.dev/icon.jpeg"],
    site: "@yonakinTV",
  },
};

// ISR with revalidation every 60 seconds
export const revalidate = 60;

export default async function BlogPage() {
  const { createBlogService } = await import("@/services/BlogService");
  const { MicroCmsBlogRepository } = await import(
    "@/repositories/MicroCmsBlogRepository"
  );
  const { microcmsClient } = await import("@/infrastructure/api/microcms");
  const { DefaultErrorHandler } = await import("@/services/ErrorHandler");
  const { createBlogFeatureService } = await import(
    "@/features/blog/services/BlogFeatureService"
  );

  const blogRepository = MicroCmsBlogRepository(microcmsClient);
  const errorHandler = DefaultErrorHandler();
  const blogService = createBlogService(blogRepository, errorHandler);
  const blogFeatureService = createBlogFeatureService(
    blogService,
    blogRepository,
  );

  const articlesResult = await blogFeatureService.getBlogList();
  if (!articlesResult.success) {
    throw new Error("Failed to fetch articles");
  }
  const articles = articlesResult.data.contents;

  return (
    <Layout>
      <div className="pt-12 text-center font-noto sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold sm:text-2xl">Blog</h2>

          <BlogList
            articles={articles.map((article) => ({
              id: article.id,
              title: article.title,
              publishedAt: article.publishedAt.toISOString(),
              updatedAt: article.updatedAt.toISOString(),
              tags: article.tags.map((tag) => ({
                id: tag,
                name: tag,
              })),
            }))}
          />

          <div className="mt-12">
            <MyLinks />
          </div>
        </div>
      </div>
    </Layout>
  );
}
