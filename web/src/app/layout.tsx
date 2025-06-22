import "highlight.js/styles/base16/atelier-sulphurpool.css";
import "tailwindcss/tailwind.css";

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";

import { GA_ID } from "../utils/gtag";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "yona.dev",
  description: "yonaのホームページです。",
  openGraph: {
    title: "yona.dev",
    description: "yonaのホームページです。",
    url: "https://yona.dev",
    siteName: "yona.dev",
    images: [
      {
        url: "https://yona.dev/icon.jpeg",
        width: 1200,
        height: 630,
        alt: "yona.dev",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "yona.dev",
    description: "yonaのホームページです。",
    images: ["https://yona.dev/icon.jpeg"],
    site: "@yonakinTV",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🦔</text></svg>",
        type: "image/svg+xml",
      },
      {
        url: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f994.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <head>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              `}
            </Script>
            <Script id="google-analytics-config" strategy="afterInteractive">
              {`
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
