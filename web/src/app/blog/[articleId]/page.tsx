import type { Metadata } from "next";

import { BlogDetail } from "@/features/blog";
import { Layout } from "@/shared/components/Layout";
import { generateOGPUrl } from "@/shared/utils/generateOGP";

type Params = {
  articleId: string;
};

type Props = {
  params: Promise<Params>;
};

// Generate static params for all blog articles
export async function generateStaticParams(): Promise<Params[]> {
  const { createBlogService } = await import("@/services/BlogService");
  const { createBlogFeatureService } = await import(
    "@/features/blog/services/BlogFeatureService"
  );
  const { MicroCmsBlogRepository } = await import(
    "@/repositories/MicroCmsBlogRepository"
  );
  const { microcmsClient } = await import("@/infrastructure/api/microcms");
  const { DefaultErrorHandler } = await import("@/services/ErrorHandler");

  const blogRepository = MicroCmsBlogRepository(microcmsClient);
  const errorHandler = DefaultErrorHandler();
  const blogService = createBlogService(blogRepository, errorHandler);
  const blogFeatureService = createBlogFeatureService(
    blogService,
    blogRepository,
  );

  const articlesResult = await blogFeatureService.getBlogList();
  if (!articlesResult.success) {
    return [];
  }
  const articles = articlesResult.data.contents;

  return articles.map((article) => ({
    articleId: article.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;

  const { createBlogService } = await import("@/services/BlogService");
  const { createBlogFeatureService } = await import(
    "@/features/blog/services/BlogFeatureService"
  );
  const { MicroCmsBlogRepository } = await import(
    "@/repositories/MicroCmsBlogRepository"
  );
  const { microcmsClient } = await import("@/infrastructure/api/microcms");
  const { DefaultErrorHandler } = await import("@/services/ErrorHandler");

  const blogRepository = MicroCmsBlogRepository(microcmsClient);
  const errorHandler = DefaultErrorHandler();
  const blogService = createBlogService(blogRepository, errorHandler);
  const blogFeatureService = createBlogFeatureService(
    blogService,
    blogRepository,
  );

  const articleResult = await blogFeatureService.getBlogDetail(articleId);
  if (!articleResult.success) {
    return {
      title: "記事が見つかりません",
      description: "指定された記事が見つかりません。",
    };
  }
  const article = articleResult.data;

  const title = article.title;
  const url = `https://yona.dev/blog/${article.id}`;
  const OGPUrl = generateOGPUrl(title);
  const description = "yonaのブログ記事です。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: OGPUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      siteName: "yona.dev",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OGPUrl],
      site: "@yona_tktks",
    },
    alternates: {
      canonical: url,
    },
  };
}

// Main page component
export default async function ArticleDetailPage({ params }: Props) {
  const { articleId } = await params;

  const { createBlogService } = await import("@/services/BlogService");
  const { createBlogFeatureService } = await import(
    "@/features/blog/services/BlogFeatureService"
  );
  const { MicroCmsBlogRepository } = await import(
    "@/repositories/MicroCmsBlogRepository"
  );
  const { microcmsClient } = await import("@/infrastructure/api/microcms");
  const { DefaultErrorHandler } = await import("@/services/ErrorHandler");

  const blogRepository = MicroCmsBlogRepository(microcmsClient);
  const errorHandler = DefaultErrorHandler();
  const blogService = createBlogService(blogRepository, errorHandler);
  const blogFeatureService = createBlogFeatureService(
    blogService,
    blogRepository,
  );

  const articleResult = await blogFeatureService.getBlogDetail(articleId);

  if (!articleResult.success) {
    return (
      <Layout>
        <div className="pt-12 text-center font-noto sm:pt-16">
          <h1 className="text-2xl font-semibold">記事が見つかりません</h1>
          <p className="mt-4">指定された記事は存在しません。</p>
        </div>
      </Layout>
    );
  }

  const article = articleResult.data;

  const adjacentArticles = await blogFeatureService.getAdjacentBlogs(
    article.publishedAt,
  );

  // Get university age for SSR consistency
  const { getUniversityAge } = await import(
    "@/features/profile/services/ProfileService"
  );
  const universityAge = getUniversityAge();

  return (
    <Layout>
      <BlogDetail
        article={{
          id: article.id,
          title: article.title,
          body: article.content,
          publishedAt: article.publishedAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
          tags: article.tags.map((tag) => ({
            id: tag,
            name: tag,
          })),
        }}
        prev={
          adjacentArticles.prev
            ? {
                id: adjacentArticles.prev.id,
                title: adjacentArticles.prev.title,
              }
            : null
        }
        next={
          adjacentArticles.next
            ? {
                id: adjacentArticles.next.id,
                title: adjacentArticles.next.title,
              }
            : null
        }
        universityAge={universityAge}
      />
    </Layout>
  );
}
