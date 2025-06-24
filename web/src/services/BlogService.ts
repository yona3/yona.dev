import type { IBlogRepository } from "@/interfaces/IBlogRepository";
import type {
  BlogEntity,
  BlogQueryOptions,
  PaginatedBlogResponse,
} from "@/types/blog";
import type { IErrorHandler, Result } from "@/types/errors";

// Blog service functions containing business logic
export const getPublishedBlogs =
  (blogRepository: IBlogRepository, errorHandler: IErrorHandler) =>
  async (
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      const result = await blogRepository.findPublished({
        ...options,
        orders: options?.orders || "-publishedAt", // Default sort by published date
      });

      if (!result.success) {
        return result;
      }

      // Business logic: Filter out future posts
      const now = new Date();
      const filteredContents = result.data.contents.filter(
        (blog) => blog.publishedAt <= now,
      );

      return {
        success: true,
        data: {
          ...result.data,
          contents: filteredContents,
          totalCount: filteredContents.length,
        },
      };
    } catch (error) {
      const appError = errorHandler.handle(error as Error);
      return { success: false, error: appError };
    }
  };

export const getBlogById =
  (blogRepository: IBlogRepository, errorHandler: IErrorHandler) =>
  async (id: string): Promise<Result<BlogEntity>> => {
    try {
      // Business logic: Validate ID format
      if (!id || id.trim().length === 0) {
        return {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Blog ID is required and cannot be empty",
            timestamp: new Date(),
          },
        };
      }

      const result = await blogRepository.findById(id);

      if (!result.success) {
        return result;
      }

      // Business logic: Check if post is published
      const now = new Date();
      if (result.data.publishedAt > now) {
        return {
          success: false,
          error: {
            code: "BLOG_NOT_PUBLISHED",
            message: "Blog post is not yet published",
            timestamp: new Date(),
          },
        };
      }

      return result;
    } catch (error) {
      const appError = errorHandler.handle(error as Error);
      return { success: false, error: appError };
    }
  };

export const searchBlogs =
  (blogRepository: IBlogRepository, errorHandler: IErrorHandler) =>
  async (
    query: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      // Business logic: Sanitize search query
      const sanitizedQuery = query.trim();
      if (sanitizedQuery.length < 2) {
        return {
          success: false,
          error: {
            code: "INVALID_SEARCH_QUERY",
            message: "Search query must be at least 2 characters long",
            timestamp: new Date(),
          },
        };
      }

      return await blogRepository.search(sanitizedQuery, options);
    } catch (error) {
      const appError = errorHandler.handle(error as Error);
      return { success: false, error: appError };
    }
  };

export const getBlogsByTag =
  (blogRepository: IBlogRepository, errorHandler: IErrorHandler) =>
  async (
    tag: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    try {
      // Business logic: Validate tag
      const sanitizedTag = tag.trim();
      if (!sanitizedTag) {
        return {
          success: false,
          error: {
            code: "INVALID_TAG",
            message: "Tag cannot be empty",
            timestamp: new Date(),
          },
        };
      }

      return await blogRepository.findByTag(sanitizedTag, options);
    } catch (error) {
      const appError = errorHandler.handle(error as Error);
      return { success: false, error: appError };
    }
  };

// Create blog service object (for compatibility)
export const createBlogService = (
  blogRepository: IBlogRepository,
  errorHandler: IErrorHandler,
) => ({
  getPublishedBlogs: getPublishedBlogs(blogRepository, errorHandler),
  getBlogById: getBlogById(blogRepository, errorHandler),
  searchBlogs: searchBlogs(blogRepository, errorHandler),
  getBlogsByTag: getBlogsByTag(blogRepository, errorHandler),
});

// For backward compatibility, export the factory function as the default
export const BlogService = createBlogService;
