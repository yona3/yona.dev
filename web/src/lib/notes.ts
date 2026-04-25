import { promises as fs } from "node:fs";
import path from "node:path";

import { cache } from "react";

export type NoteType = "article" | "note" | "log";

export type NoteMeta = {
  title: string;
  slug: string;
  date: string;
  type: NoteType;
  description: string;
  published: boolean;
};

export type Note = NoteMeta & {
  content: string;
};

const notesDirectory = path.join(process.cwd(), "content", "notes");

export const noteTypeLabels: Record<NoteType, string> = {
  article: "記事",
  note: "ノート",
  log: "記録",
};

const noteTypes = new Set<NoteType>(["article", "note", "log"]);

const normalizeNoteContent = (content: string, title: string): string => {
  const trimmed = content.trim();
  const firstLineEnd = trimmed.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd);

  if (firstLine.trim() !== `# ${title}`) {
    return trimmed;
  }

  return firstLineEnd === -1 ? "" : trimmed.slice(firstLineEnd + 1).trimStart();
};

const parseFrontmatterValue = (value: string): string | boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const parseFrontmatter = (
  source: string,
  fileName: string,
): { meta: NoteMeta; content: string } => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${fileName}`);
  }

  const [, frontmatter, content] = match;
  const entries = frontmatter.split("\n").map((line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line in ${fileName}: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    return [key, parseFrontmatterValue(value)] as const;
  });

  const data = Object.fromEntries(entries);

  if (
    typeof data.title !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.date !== "string" ||
    typeof data.type !== "string" ||
    typeof data.description !== "string" ||
    typeof data.published !== "boolean"
  ) {
    throw new Error(`Invalid frontmatter shape in ${fileName}`);
  }

  if (!noteTypes.has(data.type as NoteType)) {
    throw new Error(`Invalid note type in ${fileName}: ${data.type}`);
  }

  return {
    meta: {
      title: data.title,
      slug: data.slug,
      date: data.date,
      type: data.type as NoteType,
      description: data.description,
      published: data.published,
    },
    content: normalizeNoteContent(content, data.title),
  };
};

export const formatNoteDate = (date: string): string => {
  return date.replaceAll("-", ".");
};

export const getAllNotes = cache(async (): Promise<Note[]> => {
  const fileNames = await fs.readdir(notesDirectory);
  const notes = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const source = await fs.readFile(path.join(notesDirectory, fileName), "utf8");
        const { meta, content } = parseFrontmatter(source, fileName);
        return { ...meta, content };
      }),
  );

  return notes
    .filter((note) => note.published)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getNoteBySlug = cache(async (slug: string): Promise<Note | null> => {
  const notes = await getAllNotes();
  return notes.find((note) => note.slug === slug) ?? null;
});

export const getNoteSlugs = cache(async (): Promise<string[]> => {
  const notes = await getAllNotes();
  return notes.map((note) => note.slug);
});
