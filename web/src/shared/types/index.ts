// Re-export all shared types
export * from "./common";

// Re-export legacy types for backward compatibility
export type {
  ClickEvent,
  ContactEvent,
  GtagEvent,
} from "@/infrastructure/analytics/types";
export type {
  MicroCmsContent as Content,
  MicroCmsImage,
  MicroCmsTag as Tag,
} from "@/infrastructure/api/types";
