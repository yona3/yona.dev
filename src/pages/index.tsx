import type { NextPage } from "next";
import Head from "next/head";

import { About } from "../components/About";
import { Layout } from "../components/shared/Layout";
import { Top } from "../components/Top";
import { Works } from "../components/Works";

const Index: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{"yona.dev"}</title>
      </Head>
      <div>
        <Top />
        <About />
        <Works />
      </div>
    </Layout>
  );
};

export default Index;
