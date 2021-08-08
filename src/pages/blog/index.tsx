import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { Article } from "../../components/shared/Article";
import { Layout } from "../../components/shared/Layout";
import { microcms } from "../../lib/microcms";
import type { Content } from "../../types";

type Props = {
  data: Content[];
};

const Blog: NextPage<Props> = ({ data }) => {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
        <meta name="description" content="yonaのブログです。" />
        <meta property="og:title" content="Blog" />
        <meta property="og:description" content="yonaのブログです。" />
        <meta property="og:url" content="https://yona.dev/blog" />
        <meta name="twitter:site" content="https://yona.dev/blog" />
        <meta name="twitter:title" content="Blog" />
        <meta name="twitter:description" content="yonaのブログです。" />
      </Head>
      <div className="pt-10 sm:pt-16 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">Blog</h2>
          <div className="mt-8 sm:mt-14 space-y-10">
            {data.map((article) => (
              <div key={article.id}>
                <Article article={article} />
              </div>
            ))}
          </div>
          <div className="mt-16">
            <Link href="/">
              <p className="text-base underline cursor-pointer">Home</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await microcms.get<{ contents: Content }>({
    endpoint: "blog",
  });

  return {
    props: {
      data: data.contents,
    },
  };
};

export default Blog;
