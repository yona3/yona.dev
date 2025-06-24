import type { AppError, IErrorHandler } from "@/types/errors";
import { createExternalAPIError } from "@/types/errors";

// Type guard utility
const isAppError = (error: any): error is AppError => {
  return (
    error && typeof error.code === "string" && typeof error.message === "string"
  );
};

// Error handling functions
export const handleError = (error: Error): AppError => {
  // Already handled errors
  if (isAppError(error)) {
    return error;
  }

  // Handle specific error types
  if (error.name === "BlogNotFoundError") {
    return error as unknown as AppError;
  }

  if (error.name === "ExternalAPIError") {
    return error as unknown as AppError;
  }

  if (error.name === "ValidationError") {
    return error as unknown as AppError;
  }

  // Handle network errors
  if (error.message.includes("fetch") || error.message.includes("network")) {
    return createExternalAPIError("Network error occurred", error);
  }

  // Handle timeout errors
  if (error.message.includes("timeout")) {
    return createExternalAPIError("Request timeout", error);
  }

  // Generic error
  return {
    code: "UNKNOWN_ERROR",
    message: error.message || "An unknown error occurred",
    details: error,
    timestamp: new Date(),
  };
};

export const isRetryable = (error: AppError): boolean => {
  const retryableCodes = [
    "EXTERNAL_API_ERROR",
    "NETWORK_ERROR",
    "TIMEOUT_ERROR",
  ];

  return retryableCodes.includes(error.code);
};

export const formatForLogging = (error: AppError): string => {
  return JSON.stringify(
    {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp.toISOString(),
      details: error.details,
    },
    null,
    2,
  );
};

// Create error handler object (for compatibility with existing DI pattern)
export const createDefaultErrorHandler = (): IErrorHandler => ({
  handle: handleError,
  isRetryable,
  formatForLogging,
});

// For backward compatibility, export the factory function as the default
export const DefaultErrorHandler = createDefaultErrorHandler;
