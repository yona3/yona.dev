import type { NextPage } from "next";

import { Layout } from "../components/Layout";

const Index: NextPage = () => {
  return (
    <Layout>
      <div className="text-center">
        <p className="mt-12 text-xl text-blue-500">
          Next.js + TypeScript + Tailwind CSS{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default Index;
