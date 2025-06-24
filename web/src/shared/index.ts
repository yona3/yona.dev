// Shared Components
export { Footer } from "./components/Footer";
export { Header } from "./components/Header";
export { Layout } from "./components/Layout";
export { MyLinks } from "./components/MyLinks";
export { SectionLayout } from "./components/SectionLayout";
export { ShareButtons } from "./components/ShareButtons";

// Shared Utilities
export { generateOGPUrl } from "./utils/generateOGP";
export { event, GA_ID, pageview } from "./utils/gtag";

// Re-export profile calculation functions for shared use
export {
  calculateAge,
  calculateUniversityAge,
} from "@/features/profile/utils/age";

// Shared Hooks
export { usePageView } from "./hooks/usePageView";

// Shared Constants
export * from "./constants";

// Shared Types
export * from "./types";
