import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Article } from "../../components/shared/Article";
import { Layout } from "../../components/shared/Layout";
import { MyLinks } from "../../components/shared/MyLinks";
import { microcms } from "../../lib/microcms";
import type { Content } from "../../types";

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

const PAGE_SIZE = 10;

type BlogListResponse = {
  contents: Content[];
  totalCount: number;
  limit: number;
  offset: number;
};

type SearchParams = {
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const parsePage = (value?: string): number => {
  if (!value) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

const buildPageHref = (page: number): string => {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
};

async function getBlogData(page: number): Promise<BlogListResponse> {
  return microcms.get<BlogListResponse>({
    endpoint: "blog",
    customRequestInit: {
      next: {
        revalidate,
      },
    },
    queries: {
      orders: "-publishedAt",
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parsePage(page);
  const data = await getBlogData(currentPage);
  const totalPages = Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE));

  if (data.totalCount > 0 && currentPage > totalPages) {
    notFound();
  }

  return (
    <Layout>
      <div className="pt-12 text-center font-noto sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold sm:text-2xl">Blog</h2>

          <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
            {data.contents.map((article) => (
              <div key={article.id}>
                <Article article={article} />
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center space-x-6 text-sm">
            {currentPage > 1 ? (
              <Link
                className="underline transition hover:opacity-70"
                href={buildPageHref(currentPage - 1)}
              >
                ← Newer
              </Link>
            ) : (
              <span className="text-gray-500">← Newer</span>
            )}
            <span className="text-gray-400">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                className="underline transition hover:opacity-70"
                href={buildPageHref(currentPage + 1)}
              >
                Older →
              </Link>
            ) : (
              <span className="text-gray-500">Older →</span>
            )}
          </div>

          <div className="mt-12">
            <MyLinks />
          </div>
        </div>
      </div>
    </Layout>
  );
}
