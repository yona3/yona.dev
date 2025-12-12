import { About } from "../components/About";
import { Layout } from "../components/shared/Layout";
import { Top } from "../components/Top";
import { Works } from "../components/Works";

export default function HomePage() {
  return (
    <Layout>
      <div>
        <Top />
        <About />
        <Works />
      </div>
    </Layout>
  );
}
