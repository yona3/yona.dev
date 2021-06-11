import type { NextPage } from "next";

import { Layout } from "../components/shared/Layout";
import { Top } from "../components/Top";

const Index: NextPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-sm">
        <Top />
      </div>
    </Layout>
  );
};

export default Index;
