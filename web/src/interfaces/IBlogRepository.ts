import type {
  BlogEntity,
  BlogQueryOptions,
  PaginatedBlogResponse,
} from "@/types/blog";
import type { Result } from "@/types/errors";

/**
 * Blog repository interface for abstracting data access layer
 */
export interface IBlogRepository {
  /**
   * Get all blog posts with optional query parameters
   */
  findAll(options?: BlogQueryOptions): Promise<Result<PaginatedBlogResponse>>;

  /**
   * Get a single blog post by ID
   */
  findById(id: string): Promise<Result<BlogEntity>>;

  /**
   * Get blog posts by tag
   */
  findByTag(
    tag: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>>;

  /**
   * Search blog posts by title or content
   */
  search(
    query: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>>;

  /**
   * Get published blog posts only
   */
  findPublished(
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>>;
}
