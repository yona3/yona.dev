// Base error interface
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// Error factory functions
export const createBlogNotFoundError = (
  id: string,
  details?: unknown,
): AppError & Error => {
  const error = new Error(`Blog post with id ${id} not found`) as AppError &
    Error;
  error.code = "BLOG_NOT_FOUND";
  error.timestamp = new Date();
  error.name = "BlogNotFoundError";
  error.details = details;
  (error as any).id = id;
  return error;
};

export const createExternalAPIError = (
  message: string,
  details?: unknown,
): AppError & Error => {
  const error = new Error(message) as AppError & Error;
  error.code = "EXTERNAL_API_ERROR";
  error.timestamp = new Date();
  error.name = "ExternalAPIError";
  error.details = details;
  return error;
};

export const createValidationError = (
  message: string,
  details?: unknown,
): AppError & Error => {
  const error = new Error(message) as AppError & Error;
  error.code = "VALIDATION_ERROR";
  error.timestamp = new Date();
  error.name = "ValidationError";
  error.details = details;
  return error;
};

// Type guards
export const isBlogNotFoundError = (error: any): error is AppError & Error => {
  return error?.code === "BLOG_NOT_FOUND";
};

export const isExternalAPIError = (error: any): error is AppError & Error => {
  return error?.code === "EXTERNAL_API_ERROR";
};

export const isValidationError = (error: any): error is AppError & Error => {
  return error?.code === "VALIDATION_ERROR";
};

// For backward compatibility, export factory functions as classes
export const BlogNotFoundError = (id: string, details?: unknown) =>
  createBlogNotFoundError(id, details);

export const ExternalAPIError = (message: string, details?: unknown) =>
  createExternalAPIError(message, details);

export const ValidationError = (message: string, details?: unknown) =>
  createValidationError(message, details);

// Error handler interface
export interface IErrorHandler {
  handle(error: Error): AppError;
  isRetryable(error: AppError): boolean;
  formatForLogging(error: AppError): string;
}

// Result type for error handling
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };
