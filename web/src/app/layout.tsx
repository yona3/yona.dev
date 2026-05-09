import "../styles/globals.css";

import type { Metadata, Viewport } from "next";
import {
  M_PLUS_Rounded_1c,
  Noto_Color_Emoji,
  Noto_Sans_JP,
} from "next/font/google";
import Script from "next/script";

import { siteCopy, siteInfo } from "../constants/site";
import { GA_ID } from "../utils/gtag";

const faviconSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M18 28h24v12a12 12 0 0 1-12 12 12 12 0 0 1-12-12V28Z" fill="none" stroke="#6c4d35" stroke-width="4" stroke-linejoin="round"/><path d="M42 32h5a6 6 0 0 1 0 12h-5" fill="none" stroke="#6c4d35" stroke-width="4" stroke-linecap="round"/><path d="M25 12c-3 5 3 7 0 12M35 12c-3 5 3 7 0 12" fill="none" stroke="#7a6e60" stroke-width="3" stroke-linecap="round"/></svg>',
)}`;

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-rounded",
});

const notoColorEmoji = Noto_Color_Emoji({
  subsets: ["emoji"],
  weight: ["400"],
  display: "swap",
  variable: "--font-emoji",
});

export const metadata: Metadata = {
  title: {
    default: siteInfo.ownerName,
    template: "%s",
  },
  description: siteCopy.metadata.description,
  openGraph: {
    title: siteInfo.ownerName,
    description: siteCopy.metadata.description,
    url: siteInfo.url,
    siteName: siteInfo.name,
    images: [
      {
        url: siteInfo.imageUrl,
        width: 1200,
        height: 630,
        alt: siteInfo.name,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteInfo.ownerName,
    description: siteCopy.metadata.description,
    images: [siteInfo.imageUrl],
    site: siteInfo.twitterSite,
  },
  icons: {
    icon: [
      {
        url: faviconSvg,
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#fcf8f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${mPlusRounded.variable} ${notoColorEmoji.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          {siteCopy.layout.skipLinkLabel}
        </a>
        {children}
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
      </body>
    </html>
  );
}
