import type { MicroCmsApiClientType } from "@/infrastructure/api/microcms";
import type { IBlogRepository } from "@/interfaces/IBlogRepository";
import type {
  BlogEntity,
  BlogQueryOptions,
  PaginatedBlogResponse,
} from "@/types/blog";
import type { Result } from "@/types/errors";
import {
  createBlogNotFoundError,
  createExternalAPIError,
} from "@/types/errors";

// Utility functions
const mapDtoToEntity = (dto: any): BlogEntity => {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.body,
    excerpt: generateExcerpt(dto.body),
    publishedAt: new Date(dto.publishedAt),
    updatedAt: new Date(dto.updatedAt),
    tags: dto.tags.map((tag: any) => tag.name),
    imageUrl: dto.image?.url,
    imageWidth: dto.image?.width,
    imageHeight: dto.image?.height,
  };
};

const buildQueries = (options?: BlogQueryOptions): any => {
  const queries: any = {};

  if (options?.limit) queries.limit = options.limit;
  if (options?.offset) queries.offset = options.offset;
  if (options?.orders) queries.orders = options.orders;
  if (options?.filters) queries.filters = options.filters;

  return queries;
};

const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "");

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
};

// Repository functions
export const findAllBlogs =
  (client: MicroCmsApiClientType) =>
  async (
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      const queries = buildQueries(options);
      const response = await client.getContentList("blog", queries);

      const entities = response.contents.map((dto) => mapDtoToEntity(dto));

      return {
        success: true,
        data: {
          contents: entities,
          totalCount: response.totalCount,
          offset: response.offset,
          limit: response.limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createExternalAPIError("Failed to fetch blog posts", error),
      };
    }
  };

export const findBlogById =
  (client: MicroCmsApiClientType) =>
  async (id: string): Promise<Result<BlogEntity>> => {
    try {
      const response = await client.getContentDetail("blog", {
        contentId: id,
      });

      return {
        success: true,
        data: mapDtoToEntity(response),
      };
    } catch (error: any) {
      if (error.status === 404) {
        return {
          success: false,
          error: createBlogNotFoundError(id, error),
        };
      }

      return {
        success: false,
        error: createExternalAPIError(`Failed to fetch blog post ${id}`, error),
      };
    }
  };

export const findBlogsByTag =
  (client: MicroCmsApiClientType) =>
  async (
    tag: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      const queries = buildQueries(options);
      queries.filters = `tags[contains]${tag}`;

      const response = await client.getContentList("blog", queries);

      const entities = response.contents.map((dto) => mapDtoToEntity(dto));

      return {
        success: true,
        data: {
          contents: entities,
          totalCount: response.totalCount,
          offset: response.offset,
          limit: response.limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createExternalAPIError(
          `Failed to fetch blogs by tag ${tag}`,
          error,
        ),
      };
    }
  };

export const searchBlogs =
  (client: MicroCmsApiClientType) =>
  async (
    query: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      const queries = buildQueries(options);
      queries.q = query;

      const response = await client.getContentList("blog", queries);

      const entities = response.contents.map((dto) => mapDtoToEntity(dto));

      return {
        success: true,
        data: {
          contents: entities,
          totalCount: response.totalCount,
          offset: response.offset,
          limit: response.limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createExternalAPIError(
          `Failed to search blogs with query ${query}`,
          error,
        ),
      };
    }
  };

export const findPublishedBlogs =
  (client: MicroCmsApiClientType) =>
  async (
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    // MicroCMS automatically filters published content
    return findAllBlogs(client)(options);
  };

// Create repository object (for compatibility with existing pattern)
export const createMicroCmsBlogRepository = (
  client: MicroCmsApiClientType,
): IBlogRepository => ({
  findAll: findAllBlogs(client),
  findById: findBlogById(client),
  findByTag: findBlogsByTag(client),
  search: searchBlogs(client),
  findPublished: findPublishedBlogs(client),
});

// For backward compatibility, export the factory function as the default
export const MicroCmsBlogRepository = createMicroCmsBlogRepository;
