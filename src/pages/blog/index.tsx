import type { NextPage } from "next";
import Head from "next/head";

import { Layout } from "../../components/shared/Layout";

const Blog: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <div className="text-center">
        <h2 className="mt-12 text-sm">準備中です！</h2>
      </div>
    </Layout>
  );
};

export default Blog;
