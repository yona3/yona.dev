import "tailwindcss/tailwind.css";
import Head from "next/head";

import type { AppProps } from "next/dist/next-server/lib/router/router";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🦔</text></svg>"
        />
        <link
          rel="icon alternate"
          type="image/png"
          href="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f994.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
