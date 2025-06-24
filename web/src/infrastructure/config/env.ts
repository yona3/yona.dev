// Environment variable configuration
export type EnvironmentConfig = {
  // API Configuration
  microCms: {
    apiKey: string;
    serviceDomain: string;
  };
  // Analytics Configuration
  analytics: {
    googleAnalyticsId: string;
    enabled: boolean;
  };
  // Application Configuration
  app: {
    environment: "development" | "production" | "test";
    baseUrl: string;
  };
};

let cachedConfig: EnvironmentConfig | null = null;

const loadConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || "development";
  const microCmsApiKey = process.env.NEXT_PUBLIC_API_KEY;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yona.dev";

  // Validate required environment variables
  if (!microCmsApiKey) {
    throw new Error("NEXT_PUBLIC_API_KEY is required");
  }

  return {
    microCms: {
      apiKey: microCmsApiKey,
      serviceDomain: "yona-home-page",
    },
    analytics: {
      googleAnalyticsId,
      enabled: Boolean(googleAnalyticsId) && nodeEnv === "production",
    },
    app: {
      environment: nodeEnv as "development" | "production" | "test",
      baseUrl,
    },
  };
};

export const getConfig = (): EnvironmentConfig => {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
};

export const getMicroCmsConfig = () => {
  const config = getConfig();
  return config.microCms;
};

export const getAnalyticsConfig = () => {
  const config = getConfig();
  return config.analytics;
};

export const getAppConfig = () => {
  const config = getConfig();
  return config.app;
};

export const isProduction = (): boolean => {
  const config = getConfig();
  return config.app.environment === "production";
};

export const isDevelopment = (): boolean => {
  const config = getConfig();
  return config.app.environment === "development";
};

// Backward compatibility
export const configManager = {
  getConfig,
  getMicroCmsConfig,
  getAnalyticsConfig,
  getAppConfig,
  isProduction,
  isDevelopment,
};
