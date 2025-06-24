// Common UI types used across multiple features
export interface ShareableContent {
  title: string;
  url: string;
  description?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

// Common layout props
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface SectionProps extends LayoutProps {
  title?: string;
  subtitle?: string;
}

// Common component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Date and time utilities
export interface DateFormatOptions {
  locale?: string;
  format?: "short" | "medium" | "long" | "full";
  includeTime?: boolean;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Pagination types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Generic list response
export interface ListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
