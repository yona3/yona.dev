import "tailwindcss/tailwind.css";
import "highlight.js/styles/androidstudio.css";

import type { AppProps } from "next/dist/shared/lib/router/router";
import Head from "next/head";

import { usePageView } from "../hooks/usePageView";

const App = ({ Component, pageProps }: AppProps) => {
  usePageView();

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
        <meta name="description" content="yonaのホームページです。" />
        <meta property="og:title" content="yona's home" />
        <meta property="og:image" content="https://yona.dev/icon.jpeg" />
        <meta property="og:description" content="yonaのホームページです。" />
        <meta property="og:url" content="https://yona.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="yona's home" />
        <meta name="twitter:site" content="https://yona.dev" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="yona's home" />
        <meta name="twitter:image" content="https://yona.dev/icon.jpeg" />
        <meta name="twitter:description" content="yonaのホームページです。" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
