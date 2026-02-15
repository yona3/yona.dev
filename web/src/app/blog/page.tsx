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

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav
                aria-label="ページネーション"
                className="inline-flex items-center rounded-lg border border-gray-700/90 bg-gray-900/70 p-1"
              >
                {currentPage > 1 ? (
                  <Link
                    className="
                      inline-flex items-center rounded-md px-3 py-2
                      text-sm font-medium text-gray-100 transition-colors duration-150
                      hover:bg-gray-800 focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-gray-200
                    "
                    href={buildPageHref(currentPage - 1)}
                  >
                    <span aria-hidden>←</span>
                    <span className="ml-1">前へ</span>
                  </Link>
                ) : (
                  <span
                    aria-disabled
                    className="
                      inline-flex cursor-not-allowed items-center rounded-md
                      px-3 py-2 text-sm font-medium text-gray-500
                    "
                  >
                    <span aria-hidden>←</span>
                    <span className="ml-1">前へ</span>
                  </span>
                )}
                <span aria-hidden className="mx-1 h-6 w-px bg-gray-700" />
                <div className="min-w-14 px-2 py-2 text-center text-xs font-medium text-gray-300 tabular-nums">
                  <span className="text-gray-100">{currentPage}</span>
                  <span className="mx-1 text-gray-500">/</span>
                  <span>{totalPages}</span>
                </div>
                <span aria-hidden className="mx-1 h-6 w-px bg-gray-700" />
                {currentPage < totalPages ? (
                  <Link
                    className="
                      inline-flex items-center rounded-md px-3 py-2
                      text-sm font-medium text-gray-100 transition-colors duration-150
                      hover:bg-gray-800 focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-gray-200
                    "
                    href={buildPageHref(currentPage + 1)}
                  >
                    <span className="mr-1">次へ</span>
                    <span aria-hidden>→</span>
                  </Link>
                ) : (
                  <span
                    aria-disabled
                    className="
                      inline-flex cursor-not-allowed items-center rounded-md
                      px-3 py-2 text-sm font-medium text-gray-500
                    "
                  >
                    <span className="mr-1">次へ</span>
                    <span aria-hidden>→</span>
                  </span>
                )}
              </nav>
            </div>
          )}

          <div className="mt-12">
            <MyLinks />
          </div>
        </div>
      </div>
    </Layout>
  );
}
