/**
 * Blog Service Usage Example
 *
 * This file demonstrates how to use the new Repository Pattern architecture
 * for blog data access and business logic.
 */

/* eslint-disable func-style, no-console */

import { microcmsClient } from "@/infrastructure";
import { MicroCmsBlogRepository } from "@/repositories/MicroCmsBlogRepository";
import { BlogService } from "@/services/BlogService";
import { DefaultErrorHandler } from "@/services/ErrorHandler";

// Setup dependencies using new Infrastructure layer
const blogRepository = MicroCmsBlogRepository(microcmsClient);
const errorHandler = DefaultErrorHandler();
const blogService = BlogService(blogRepository, errorHandler);

// Usage examples
export async function getBlogListExample() {
  const result = await blogService.getPublishedBlogs({
    limit: 10,
    orders: "-publishedAt",
  });

  if (result.success) {
    console.log("Blog posts:", result.data.contents);
    return result.data.contents;
  } else {
    console.error("Error:", errorHandler.formatForLogging(result.error));
    return [];
  }
}

export async function getBlogDetailExample(id: string) {
  const result = await blogService.getBlogById(id);

  if (result.success) {
    console.log("Blog post:", result.data);
    return result.data;
  } else {
    console.error("Error:", errorHandler.formatForLogging(result.error));
    return null;
  }
}

export async function searchBlogsExample(query: string) {
  const result = await blogService.searchBlogs(query, {
    limit: 5,
  });

  if (result.success) {
    console.log("Search results:", result.data.contents);
    return result.data.contents;
  } else {
    console.error("Error:", errorHandler.formatForLogging(result.error));
    return [];
  }
}

export async function getBlogsByTagExample(tag: string) {
  const result = await blogService.getBlogsByTag(tag, {
    limit: 10,
  });

  if (result.success) {
    console.log("Tagged blogs:", result.data.contents);
    return result.data.contents;
  } else {
    console.error("Error:", errorHandler.formatForLogging(result.error));
    return [];
  }
}
