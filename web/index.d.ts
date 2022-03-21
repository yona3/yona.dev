/* eslint-disable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  gtag(type: "config", googleAnalyticsId: string, { page_path: string });
  gtag(
    type: "event",
    eventAction: string,
    fieldObject: {
      event_label: string;
      event_category: string;
      value?: string;
    }
  );
}
