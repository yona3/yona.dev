import type { NextConfig } from "next";

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
  eslint: {
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["react-share", "highlight.js", "cheerio", "dayjs"],
  },
  // パフォーマンス向上設定
  compress: true,
  productionBrowserSourceMaps: false,
  generateBuildId: async () => {
    // ビルドIDをgitコミットハッシュベースで生成
    return "build-" + Date.now().toString();
  },
  // バンドル分析用設定（環境変数で制御）
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any, { dev, isServer }: any) => {
      if (!dev && !isServer && process.env.ANALYZE === "true") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-analyzer-report.html",
          }),
        );
      }
      return config;
    },
  }),
};

export default nextConfig;
