// microCMS API Types
export type MicroCmsTag = {
  createdAt: string;
  id: string;
  name: string;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
};

export type MicroCmsImage = {
  url: string;
  width: number;
  height: number;
};

export type MicroCmsContent = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  image: MicroCmsImage;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
  tags: MicroCmsTag[];
};

export type MicroCmsListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type MicroCmsGetListParams = {
  limit?: number;
  offset?: number;
  orders?: string;
  q?: string;
  fields?: string;
  ids?: string;
  filters?: string;
  depth?: number;
  richEditorFormat?: "object" | "html";
};

export type MicroCmsGetDetailParams = {
  contentId: string;
  fields?: string;
  depth?: number;
  richEditorFormat?: "object" | "html";
};

// API Client Configuration
export type ApiClientConfig = {
  serviceDomain: string;
  apiKey: string;
  baseUrl?: string;
};

// API Error Types
export type ApiError = {
  message: string;
  details?: Record<string, unknown>;
  status?: number;
  code?: string;
};
