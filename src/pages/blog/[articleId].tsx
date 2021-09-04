import cheerio from "cheerio";
import hljs from "highlight.js";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

import { Layout } from "../../components/shared/Layout";
import { formatDate } from "../../lib/day";
import { generateOGPUrl } from "../../lib/generageOGP";
import { microcms } from "../../lib/microcms";
import styles from "../../style/[articleId].module.css";
import type { Content } from "../../types";

type Props = {
  article: Content;
  prev: Content;
  next: Content;
};

const ArticleDetail: NextPage<Props> = ({ article, prev, next }) => {
  const title = article.title;
  const url = `https://yona.dev/blog/${article.id}`;
  const OGPUrl = generateOGPUrl(title);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content="yonaのブログ記事です。" />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={OGPUrl} />
        <meta property="og:description" content="yonaのブログ記事です。" />
        <meta property="og:url" content={url} />
        <meta name="twitter:site" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={OGPUrl} />
        <meta name="twitter:description" content="yonaのブログ記事です。" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="py-10 sm:py-24 font-noto">
        <div className="mx-auto max-w-2xl">
          {/* top */}
          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <div className="flex mt-5 text-sm text-gray-500">
              <p className="mr-5">公開日: {formatDate(article.publishedAt)}</p>
              <p className="">更新日: {formatDate(article.updatedAt)}</p>
            </div>
            {/* tags */}
            <ul className="flex mt-5 space-x-2">
              {article.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="
                py-1 px-3 text-sm border border-gray-400
                rounded-full cursor-pointer
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
          {/* share */}
          <div className="mt-12 space-x-2">
            <LineShareButton className="focus:outline-none" url={url}>
              <LineIcon size={36} round />
            </LineShareButton>
            <TwitterShareButton className="focus:outline-none" url={url}>
              <TwitterIcon size={36} round />
            </TwitterShareButton>
            <HatenaShareButton
              className="focus:outline-none"
              url={url}
              title={title}
            >
              <HatenaIcon size={36} round />
            </HatenaShareButton>
          </div>
          {/* footer */}
          <div className="mt-10">
            {/* prev, next */}
            <div
              className="
              flex flex-col sm:flex-row 
              space-y-5 sm:space-y-0
              sm:justify-between text-center
              "
            >
              <div
                className={`${
                  !prev && "sm:block hidden"
                } w-full sm:w-2/5 hover:opacity-80 transition cursor-pointer`}
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
                  !next && "sm:block hidden"
                } w-full sm:w-2/5 hover:opacity-80 transition cursor-pointer`}
              >
                {next && (
                  <Link href={`/blog/${next.id}`}>
                    <div className="flex justify-center sm:justify-end text-right">
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
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
  });
  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params.articleId;

  const data = await microcms.get<Content>({
    endpoint: "blog",
    contentId: id as string,
  });
  const prev = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    queries: {
      limit: 1,
      filters: `publishedAt[less_than]${data.publishedAt}`,
      orders: "-publishedAt",
    },
  });
  const next = await microcms.get<{ contents: Content[] }>({
    endpoint: "blog",
    queries: {
      limit: 1,
      orders: "publishedAt",
      filters: `publishedAt[greater_than]${data.publishedAt}`,
    },
  });

  // syntax highlighting
  const $ = cheerio.load(data.body);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  return {
    props: {
      article: { ...data, body: $("body").html() },
      prev: prev.contents[0] || null,
      next: next.contents[0] || null,
    },
  };
};

export default ArticleDetail;
