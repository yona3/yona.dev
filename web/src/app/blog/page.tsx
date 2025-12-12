import type { Metadata } from "next";

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

async function getBlogData(): Promise<Content[]> {
  const data = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    queries: {
      orders: "-publishedAt",
    },
  });

  return data.contents;
}

export default async function BlogPage() {
  const data = await getBlogData();

  return (
    <Layout>
      <div className="pt-12 text-center font-noto sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold sm:text-2xl">Blog</h2>

          <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
            {data.map((article) => (
              <div key={article.id}>
                <Article article={article} />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <MyLinks />
          </div>
        </div>
      </div>
    </Layout>
  );
}
