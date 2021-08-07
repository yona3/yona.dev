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
      <div className="pt-10 sm:pt-20 text-center">
        <div className="mx-auto space-y-10 max-w-2xl text-center">
          {data.map((article) => (
            <div key={article.id}>
              <Article article={article} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await microcms.get({
    endpoint: "blog",
  });

  return {
    props: {
      data: (data as { contents: Content[] }).contents,
    },
  };
};

export default Blog;
