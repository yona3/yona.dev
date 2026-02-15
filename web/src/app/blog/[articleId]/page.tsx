import * as cheerio from "cheerio";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { JSDOM } from "jsdom";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { Author } from "../../../components/shared/Author";
import { Layout } from "../../../components/shared/Layout";
import { ShareButtonsLazy } from "../../../components/shared/ShareButtonsLazy";
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

export const revalidate = 60;

const purifyConfig = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "pre",
    "code",
    "span",
    "div",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ALLOW_DATA_ATTR: false,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FORBID_SCRIPTS: true,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FORBID_TAGS: ["script", "object", "embed", "form", "input", "iframe"],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  STRIP_COMMENTS: true,
};

const domPurify = (() => {
  const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  return DOMPurify(window);
})();

const getArticle = cache(async (articleId: string): Promise<Content> => {
  return microcms.get<Content>({
    endpoint: "blog",
    contentId: articleId,
    customRequestInit: {
      next: {
        revalidate,
      },
    },
  });
});

const getPreviousArticle = async (publishedAt: string): Promise<Content | null> => {
  const { contents } = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    customRequestInit: {
      next: {
        revalidate,
      },
    },
    queries: {
      limit: 1,
      filters: `publishedAt[less_than]${publishedAt}`,
      orders: "-publishedAt",
    },
  });

  return contents[0] ?? null;
};

const getNextArticle = async (publishedAt: string): Promise<Content | null> => {
  const { contents } = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    customRequestInit: {
      next: {
        revalidate,
      },
    },
    queries: {
      limit: 1,
      orders: "publishedAt",
      filters: `publishedAt[greater_than]${publishedAt}`,
    },
  });

  return contents[0] ?? null;
};

function processContent(data: Content): Content {
  const sanitizedBody = domPurify.sanitize(data.body, purifyConfig);

  const $ = cheerio.load(sanitizedBody);
  $("pre code").each((_, elm) => {
    const codeText = $(elm).text();
    const result = hljs.highlightAuto(codeText);

    const sanitizedHighlight = domPurify.sanitize(result.value, {
      ...purifyConfig,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ALLOWED_TAGS: [...purifyConfig.ALLOWED_TAGS, "span"],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ALLOWED_ATTR: [...purifyConfig.ALLOWED_ATTR, "class"],
    });

    $(elm).html(sanitizedHighlight);
    $(elm).addClass("hljs");
  });

  const processedBody = $("body").html() || "";
  const finalSanitizedBody = domPurify.sanitize(processedBody, purifyConfig);

  return { ...data, body: finalSanitizedBody };
}

export async function generateStaticParams(): Promise<Params[]> {
  const ids = await microcms.getAllContentIds({
    endpoint: "blog",
  });

  return ids.map((articleId) => ({
    articleId,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;
  const data = await getArticle(articleId);

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

export default async function ArticleDetailPage({ params }: Props) {
  const { articleId } = await params;
  const data = await getArticle(articleId);

  const prevPromise = getPreviousArticle(data.publishedAt);
  const nextPromise = getNextArticle(data.publishedAt);
  const article = processContent(data);
  const [prev, next] = await Promise.all([prevPromise, nextPromise]);

  const title = article.title;
  const url = `https://yona.dev/blog/${article.id}`;

  return (
    <Layout>
      <div className="pb-8 pt-10 font-noto text-gray-300 sm:pb-12 sm:pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            <div className="mt-5 flex text-sm text-gray-400">
              <p className="mr-5">公開日: {formatDate(article.publishedAt)}</p>
              <p>更新日: {formatDate(article.updatedAt)}</p>
            </div>
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
          <div
            className={styles.article}
            dangerouslySetInnerHTML={{
              __html: article.body,
            }}
          />
          <div className="mx-auto mt-8 max-w-2xl">
            <Author />
          </div>
          <ShareButtonsLazy url={url} title={title} />
          <div className="mt-10">
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
