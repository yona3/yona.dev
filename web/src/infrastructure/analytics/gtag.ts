import type { AnalyticsConfig, GtagEvent, IAnalyticsProvider } from "./types";

// State management for analytics config
let analyticsConfig: AnalyticsConfig | null = null;

// Core analytics functions
const initialize = (config: AnalyticsConfig): void => {
  analyticsConfig = config;
};

const trackPageView = (path: string): void => {
  if (!isEnabled() || typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;

  gtag("config", analyticsConfig!.trackingId, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    page_path: path,
  });
};

const trackEvent = ({
  action,
  category,
  label,
  value = "",
}: GtagEvent): void => {
  if (!isEnabled() || typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", action, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    event_category: category,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    event_label: JSON.stringify(label),
    value,
  });
};

const isEnabled = (): boolean => {
  return Boolean(
    analyticsConfig &&
      analyticsConfig.enabled &&
      analyticsConfig.trackingId &&
      typeof window !== "undefined",
  );
};

// Factory function to create analytics provider
export const createGtagAnalyticsProvider = (): IAnalyticsProvider => ({
  initialize,
  trackPageView,
  trackEvent,
  isEnabled,
});

// Default instance
export const gtagProvider = createGtagAnalyticsProvider();
