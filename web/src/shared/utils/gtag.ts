import { gtagProvider } from "@/infrastructure/analytics/gtag";
import type { GtagEvent } from "@/infrastructure/analytics/types";
import { configManager } from "@/infrastructure/config/env";

/* eslint-disable @typescript-eslint/naming-convention */
export const GA_ID = configManager.getAnalyticsConfig().googleAnalyticsId;

// Initialize analytics provider
const analyticsConfig = configManager.getAnalyticsConfig();
gtagProvider.initialize({
  trackingId: analyticsConfig.googleAnalyticsId,
  enabled: analyticsConfig.enabled,
});

export const pageview = (path: string) => {
  gtagProvider.trackPageView(path);
};

export const event = (gtagEvent: GtagEvent) => {
  gtagProvider.trackEvent(gtagEvent);
};
