import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  poweredByHeader: false,
  // パフォーマンス向上設定
  compress: true,
  productionBrowserSourceMaps: false,
};

export default withBundleAnalyzer(nextConfig);
