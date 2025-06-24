// Re-export from existing blog types
export * from "@/types/blog";

// Blog feature specific types
export interface BlogListProps {
  articles: Array<{
    id: string;
    title: string;
    publishedAt: string;
    updatedAt: string;
    tags: Array<{ id: string; name: string }>;
  }>;
}

export interface BlogDetailProps {
  article: {
    id: string;
    title: string;
    body: string;
    publishedAt: string;
    updatedAt: string;
    tags: Array<{ id: string; name: string }>;
  };
  prev?: {
    id: string;
    title: string;
  } | null;
  next?: {
    id: string;
    title: string;
  } | null;
  universityAge: number;
}

export interface BlogProcessingResult {
  body: string;
}
