// Domain Entity - Business logic focused
export interface BlogEntity {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

// Data Transfer Object - API response focused
export interface BlogDTO {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
  tags: Array<{
    id: string;
    name: string;
    createdAt: string;
    publishedAt: string;
    revisedAt: string;
    updatedAt: string;
  }>;
  image?: {
    url: string;
    width: number;
    height: number;
  };
}

// Query parameters for blog listing
export interface BlogQueryOptions {
  limit?: number;
  offset?: number;
  orders?: string;
  filters?: string;
}

// Paginated response
export interface PaginatedBlogResponse {
  contents: BlogEntity[];
  totalCount: number;
  offset: number;
  limit: number;
}
