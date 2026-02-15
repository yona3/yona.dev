import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["react-share", "highlight.js", "cheerio", "dayjs"],
  },
  // パフォーマンス向上設定
  compress: true,
  productionBrowserSourceMaps: false,
};

export default withBundleAnalyzer(nextConfig);
