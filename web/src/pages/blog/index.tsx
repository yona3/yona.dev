import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import { Article } from "../../components/shared/Article";
import { Layout } from "../../components/shared/Layout";
import { MyLinks } from "../../components/shared/MyLinks";
import { microcms } from "../../lib/microcms";
import type { Content } from "../../types";

type Props = {
  data: Content[];
};

const Blog: NextPage<Props> = ({ data }) => {
  return (
    <Layout>
      <Head>
        <title>{"yona.blog"}</title>
        <meta name="description" content="yonaのブログです。" />
        <meta property="og:title" content="Blog" />
        <meta property="og:description" content="yonaのブログです。" />
        <meta property="og:url" content="https://yona.dev/blog" />
        <meta name="twitter:site" content="https://yona.dev/blog" />
        <meta name="twitter:title" content="Blog" />
        <meta name="twitter:description" content="yonaのブログです。" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="pt-12 font-noto text-center sm:pt-16">
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
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await microcms.get<{ contents: Content }>({
    endpoint: "blog",
    queries: {
      orders: "-publishedAt",
    },
  });

  return {
    props: {
      data: data.contents,
    },
  };
};

export default Blog;
