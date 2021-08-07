import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

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
