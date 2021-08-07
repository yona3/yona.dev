import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import { About } from "../components/About";
import { BlogLink } from "../components/BlogLink";
import { Products } from "../components/Products";
import { Layout } from "../components/shared/Layout";
import { Top } from "../components/Top";

const Index: NextPage = () => {
  const [refs, setRefs] = useState<{ [key: string]: HTMLDivElement }>(null);
  const aboutSection = useRef<HTMLDivElement>(null);
  const productsSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aboutSection.current && productsSection.current)
      setRefs({
        about: aboutSection.current,
        products: productsSection.current,
      });
  }, [aboutSection, productsSection]);

  return (
    <Layout refs={refs}>
      <Head>
        <title>{"yona's home"}</title>
      </Head>
      <div className="mx-auto max-w-sm">
        <Top />
        <About ref={aboutSection} />
        <Products ref={productsSection} />
        <BlogLink />
      </div>
    </Layout>
  );
};

export default Index;
