import { createClient } from "microcms-js-sdk";

import type {
  ApiClientConfig,
  ApiError,
  MicroCmsContent,
  MicroCmsGetDetailParams,
  MicroCmsGetListParams,
  MicroCmsListResponse,
} from "./types";

// Error handling utility
const handleError = (error: unknown, defaultMessage: string): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      details: { originalError: error },
    };
  }

  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return {
      message: (errorObj.message as string) || defaultMessage,
      status: errorObj.status as number,
      code: errorObj.code as string,
      details: errorObj,
    };
  }

  return {
    message: defaultMessage,
    details: { originalError: error },
  };
};

// Core API functions taking client as parameter
export const getContentList =
  (client: ReturnType<typeof createClient>) =>
  async (
    endpoint: string,
    params?: MicroCmsGetListParams,
  ): Promise<MicroCmsListResponse<MicroCmsContent>> => {
    try {
      const response = await client.getList<MicroCmsContent>({
        endpoint,
        queries: params as any,
      });

      return {
        contents: response.contents,
        totalCount: response.totalCount,
        offset: response.offset,
        limit: response.limit,
      };
    } catch (error) {
      throw handleError(error, "Failed to fetch content list");
    }
  };

export const getContentDetail =
  (client: ReturnType<typeof createClient>) =>
  async (
    endpoint: string,
    params: MicroCmsGetDetailParams,
  ): Promise<MicroCmsContent> => {
    try {
      const response = await client.getListDetail<MicroCmsContent>({
        endpoint,
        contentId: params.contentId,
        queries: {
          fields: params.fields,
          depth: params.depth as any,
          richEditorFormat: params.richEditorFormat,
        } as any,
      });

      return response;
    } catch (error) {
      throw handleError(error, "Failed to fetch content detail");
    }
  };

// Factory function to create API client with methods
export const createMicroCmsApiClient = (config: ApiClientConfig) => {
  const client = createClient({
    serviceDomain: config.serviceDomain,
    apiKey: config.apiKey,
  });

  return {
    getContentList: getContentList(client),
    getContentDetail: getContentDetail(client),
  };
};

// Type for the API client
export type MicroCmsApiClientType = ReturnType<typeof createMicroCmsApiClient>;

// Default client instance
const defaultConfig: ApiClientConfig = {
  serviceDomain: "yona-home-page",
  apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
};

export const microcmsClient = createMicroCmsApiClient(defaultConfig);
