import { WORKS } from "@/features/portfolio/constants/works";
import type { Work } from "@/features/portfolio/types";

/**
 * Get all portfolio works
 */
export const getAllWorks = (): Work[] => WORKS;

/**
 * Get work by name
 */
export const getWorkByName = (name: string): Work | undefined =>
  WORKS.find((work) => work.name === name);

/**
 * Get works filtered by technology
 */
export const getWorksByTech = (tech: string): Work[] =>
  WORKS.filter((work) => work.tech.toLowerCase().includes(tech.toLowerCase()));

/**
 * Get featured works (first 3 works)
 */
export const getFeaturedWorks = (): Work[] => WORKS.slice(0, 3);

/**
 * Get total number of works
 */
export const getTotalWorksCount = (): number => WORKS.length;

/**
 * Get unique technologies used across all works
 */
export const getUniqueTechnologies = (): string[] => {
  const allTechs = WORKS.flatMap((work) =>
    work.tech.split(", ").map((tech) => tech.trim()),
  );
  return [...new Set(allTechs)].sort();
};

/**
 * Search works by name or description
 */
export const searchWorks = (query: string): Work[] => {
  const lowerQuery = query.toLowerCase();
  return WORKS.filter(
    (work) =>
      work.name.toLowerCase().includes(lowerQuery) ||
      work.description.toLowerCase().includes(lowerQuery),
  );
};
