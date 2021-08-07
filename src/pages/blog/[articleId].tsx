import cheerio from "cheerio";
import hljs from "highlight.js";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { Layout } from "../../components/shared/Layout";
import { formatDate } from "../../lib/day";
import { microcms } from "../../lib/microcms";
import styles from "../../style/[articleId].module.css";
import type { Content } from "../../types";

type Props = {
  article: Content;
};

const ArticleDetail: NextPage<Props> = ({ article }) => {
  return (
    <Layout>
      <div className="py-10 sm:py-24">
        <div className="mx-auto max-w-2xl">
          {/* top */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div className="flex mt-5 text-sm text-gray-500">
              <p className="mr-5">公開日: {formatDate(article.publishedAt)}</p>
              <p className="">更新日: {formatDate(article.updatedAt)}</p>
            </div>
            {/* tags */}
            <ul className="flex mt-5 space-x-3">
              {article.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="
                      py-1 px-2 text-sm border border-gray-300
                      rounded cursor-pointer
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
    },
  };
};

export default ArticleDetail;
