import type { NextConfig } from "next";

// Webpack設定の型定義
interface WebpackConfig {
  plugins?: any[];
}

interface WebpackContext {
  dev: boolean;
  isServer: boolean;
}

// バンドル分析用の型安全なインポート
// Webpackプラグインの型定義
interface WebpackPlugin {
  apply(compiler: any): void;
}

// バンドルアナライザーの型定義
interface BundleAnalyzerOptions {
  analyzerMode: "server" | "static" | "json" | "disabled";
  openAnalyzer: boolean;
  reportFilename: string;
}

// 条件付きでバンドルアナライザーをロード
const createBundleAnalyzerPlugin = (
  options: BundleAnalyzerOptions,
): WebpackPlugin | null => {
  if (process.env.ANALYZE !== "true") {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
    const { BundleAnalyzerPlugin: BundleAnalyzer } =
      require("webpack-bundle-analyzer") as {
        BundleAnalyzerPlugin: new (
          options: BundleAnalyzerOptions,
        ) => WebpackPlugin;
      };
    return new BundleAnalyzer(options);
  } catch {
    console.warn(
      "webpack-bundle-analyzer not installed. Install with: npm install --save-dev webpack-bundle-analyzer",
    );
    return null;
  }
};

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
    webpack: (config: WebpackConfig, { dev, isServer }: WebpackContext) => {
      if (!dev && !isServer) {
        const analyzerPlugin = createBundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "bundle-analyzer-report.html",
        });

        if (analyzerPlugin && config.plugins) {
          config.plugins.push(analyzerPlugin);
        }
      }
      return config;
    },
  }),
};

export default nextConfig;
