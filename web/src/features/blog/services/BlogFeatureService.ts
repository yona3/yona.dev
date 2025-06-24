import * as cheerio from "cheerio";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { JSDOM } from "jsdom";

import type { IBlogRepository } from "@/interfaces/IBlogRepository";
import type { createBlogService } from "@/services/BlogService";

type BlogServiceType = ReturnType<typeof createBlogService>;
import type { BlogProcessingResult } from "@/features/blog/types";
import type {
  BlogEntity,
  BlogQueryOptions,
  PaginatedBlogResponse,
} from "@/types/blog";
import type { Result } from "@/types/errors";

// Content processing utilities
const processContent = async (
  content: string,
): Promise<BlogProcessingResult> => {
  // Create a virtual DOM for server-side processing
  const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  const purify = DOMPurify(window);

  // Configure DOMPurify to allow only safe HTML elements and attributes
  const purifyConfig = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "pre",
      "code",
      "span",
      "div",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "target",
      "rel",
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ALLOW_DATA_ATTR: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FORBID_SCRIPTS: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FORBID_TAGS: ["script", "object", "embed", "form", "input", "iframe"],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    STRIP_COMMENTS: true,
  };

  // First sanitize the raw content
  const sanitizedBody = purify.sanitize(content, purifyConfig);

  // Apply syntax highlighting to sanitized content
  const $ = cheerio.load(sanitizedBody);
  $("pre code").each((_, elm) => {
    const codeText = $(elm).text();
    const result = hljs.highlightAuto(codeText);

    // Sanitize the highlighted result before inserting
    const sanitizedHighlight = purify.sanitize(result.value, {
      ...purifyConfig,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ALLOWED_TAGS: [...purifyConfig.ALLOWED_TAGS, "span"],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ALLOWED_ATTR: [...purifyConfig.ALLOWED_ATTR, "class"],
    });

    $(elm).html(sanitizedHighlight);
    $(elm).addClass("hljs");
  });

  const processedBody = $("body").html() || "";

  // Final sanitization pass
  const finalSanitizedBody = purify.sanitize(processedBody, purifyConfig);

  return { body: finalSanitizedBody };
};

/**
 * Get blog list for display
 */
export const getBlogList =
  (blogService: BlogServiceType) =>
  async (
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    return await blogService.getPublishedBlogs(options);
  };

/**
 * Get single blog with processing
 */
export const getBlogDetail =
  (blogService: BlogServiceType) =>
  async (id: string): Promise<Result<BlogEntity>> => {
    const result = await blogService.getBlogById(id);

    if (!result.success) {
      return result;
    }

    // Process content for display
    const processedContent = await processContent(result.data.content);

    return {
      success: true,
      data: {
        ...result.data,
        content: processedContent.body,
      },
    };
  };

/**
 * Get previous and next blog posts
 */
export const getAdjacentBlogs =
  (blogRepository: IBlogRepository) =>
  async (
    publishedAt: Date,
  ): Promise<{
    prev: BlogEntity | null;
    next: BlogEntity | null;
  }> => {
    const [prevResult, nextResult] = await Promise.all([
      blogRepository.findAll({
        limit: 1,
        filters: `publishedAt[less_than]${publishedAt.toISOString()}`,
        orders: "-publishedAt",
      }),
      blogRepository.findAll({
        limit: 1,
        filters: `publishedAt[greater_than]${publishedAt.toISOString()}`,
        orders: "publishedAt",
      }),
    ]);

    return {
      prev:
        prevResult.success && prevResult.data.contents.length > 0
          ? prevResult.data.contents[0]
          : null,
      next:
        nextResult.success && nextResult.data.contents.length > 0
          ? nextResult.data.contents[0]
          : null,
    };
  };

/**
 * Search blogs
 */
export const searchBlogs =
  (blogService: BlogServiceType) =>
  async (
    query: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    return await blogService.searchBlogs(query, options);
  };

/**
 * Get blogs by tag
 */
export const getBlogsByTag =
  (blogService: BlogServiceType) =>
  async (
    tag: string,
    options?: BlogQueryOptions,
  ): Promise<Result<PaginatedBlogResponse>> => {
    return await blogService.getBlogsByTag(tag, options);
  };

/**
 * Factory function to create blog feature service with all methods
 */
export const createBlogFeatureService = (
  blogService: BlogServiceType,
  blogRepository: IBlogRepository,
) => ({
  getBlogList: getBlogList(blogService),
  getBlogDetail: getBlogDetail(blogService),
  getAdjacentBlogs: getAdjacentBlogs(blogRepository),
  searchBlogs: searchBlogs(blogService),
  getBlogsByTag: getBlogsByTag(blogService),
});

// Type for the feature service
export type BlogFeatureServiceType = ReturnType<
  typeof createBlogFeatureService
>;
