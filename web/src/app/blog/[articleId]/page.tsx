import * as cheerio from "cheerio";
import hljs from "highlight.js";
import type { Metadata } from "next";
import Link from "next/link";

import { Author } from "../../../components/shared/Author";
import { Layout } from "../../../components/shared/Layout";
import { ShareButtons } from "../../../components/shared/ShareButtons";
import { formatDate } from "../../../lib/day";
import { microcms } from "../../../lib/microcms";
import type { Content } from "../../../types";
import { generateOGPUrl } from "../../../utils/generateOGP";
import styles from "./page.module.css";

type Params = {
  articleId: string;
};

type Props = {
  params: Promise<Params>;
};

// Content processing function
async function processContent(data: Content): Promise<Content> {
  // syntax highlighting
  const $ = cheerio.load(data.body);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  return { ...data, body: $("body").html() || "" };
}

// Generate static params for all blog articles
export async function generateStaticParams(): Promise<Params[]> {
  const data = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
  });

  return data.contents.map((content) => ({
    articleId: content.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;

  const data = await microcms.get<Content>({
    endpoint: "blog",
    contentId: articleId,
  });

  const title = data.title;
  const url = `https://yona.dev/blog/${data.id}`;
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

  // Fetch article data
  const data = await microcms.get<Content>({
    endpoint: "blog",
    contentId: articleId,
  });

  // Fetch previous article
  const prevResponse = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    queries: {
      limit: 1,
      filters: `publishedAt[less_than]${data.publishedAt}`,
      orders: "-publishedAt",
    },
  });

  // Fetch next article
  const nextResponse = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    queries: {
      limit: 1,
      orders: "publishedAt",
      filters: `publishedAt[greater_than]${data.publishedAt}`,
    },
  });

  // Process content for syntax highlighting
  const article = await processContent(data);
  const prev = prevResponse.contents[0] || null;
  const next = nextResponse.contents[0] || null;

  const title = article.title;
  const url = `https://yona.dev/blog/${article.id}`;

  return (
    <Layout>
      <div className="pb-8 pt-10 font-noto text-gray-300 sm:pb-12 sm:pt-24">
        <div className="mx-auto max-w-2xl">
          {/* top */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            <div className="mt-5 flex text-sm text-gray-400">
              <p className="mr-5">公開日: {formatDate(article.publishedAt)}</p>
              <p className="">更新日: {formatDate(article.updatedAt)}</p>
            </div>
            {/* tags */}
            <ul className="mt-5 flex space-x-2">
              {article.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="
                    cursor-pointer rounded-full border border-gray-400 px-3
                    py-1 text-sm
                  "
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
          {/* article */}
          <div
            className={styles.article}
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __html: `${article.body}`,
            }}
          />
          {/* author */}
          <div className="mx-auto mt-8 max-w-2xl">
            <Author />
          </div>
          {/* share */}
          <ShareButtons url={url} title={title} />
          {/* footer */}
          <div className="mt-10">
            {/* prev, next */}
            <div
              className="
              flex flex-col space-y-5 
              text-center sm:flex-row
              sm:justify-between sm:space-y-0
              "
            >
              <div
                className={`${
                  !prev && "hidden sm:block"
                } w-full cursor-pointer transition hover:opacity-80 sm:w-2/5`}
              >
                {prev && (
                  <Link href={`/blog/${prev.id}`}>
                    <div className="flex justify-center sm:justify-start">
                      <span className="mr-2 font-bold">←</span>
                      <p className="text-center sm:text-left">{prev.title}</p>
                    </div>
                  </Link>
                )}
              </div>
              <div
                className={`${
                  !next && "hidden sm:block"
                } w-full cursor-pointer transition hover:opacity-80 sm:w-2/5`}
              >
                {next && (
                  <Link href={`/blog/${next.id}`}>
                    <div className="flex justify-center text-right sm:justify-end">
                      <p className="text-center sm:text-left">{next.title}</p>
                      <span className="ml-2 font-bold">→</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
