// Google Analytics Types
export type ContactEvent = {
  action: "submit_form";
  category: "contact";
  label: string;
  value?: string;
};

export type ClickEvent = {
  action: "click";
  category: "other";
  label: string;
  value?: string;
};

export type GtagEvent = ContactEvent | ClickEvent;

export type PageViewEvent = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_path: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_title?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_location?: string;
};

export type AnalyticsConfig = {
  trackingId: string;
  enabled: boolean;
  debug?: boolean;
};

export interface IAnalyticsProvider {
  initialize(config: AnalyticsConfig): void;
  trackPageView(path: string): void;
  trackEvent(event: GtagEvent): void;
  isEnabled(): boolean;
}
