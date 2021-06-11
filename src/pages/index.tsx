import type { NextPage } from "next";

import { About } from "../components/About";
import { Products } from "../components/Products";
import { Layout } from "../components/shared/Layout";
import { Top } from "../components/Top";

const Index: NextPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-sm">
        <Top />
        <About />
        <Products />
      </div>
    </Layout>
  );
};

export default Index;
