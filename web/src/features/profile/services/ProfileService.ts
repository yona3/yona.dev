import { LIKES } from "@/features/profile/constants/likes";
import type { Like, ProfileData } from "@/features/profile/types";
import {
  calculateAge,
  calculateUniversityAge,
} from "@/features/profile/utils/age";

/**
 * Get complete profile data
 */
export const getProfileData = (): ProfileData => ({
  age: getAge(),
  universityAge: getUniversityAge(),
  likes: getLikes(),
});

/**
 * Get current age
 */
export const getAge = (): number => calculateAge();

/**
 * Get university year
 */
export const getUniversityAge = (): number => calculateUniversityAge();

/**
 * Get likes/interests
 */
export const getLikes = (): Like[] => LIKES;

/**
 * Get likes by category
 */
export const getLikesByCategory = (
  category: Like["category"],
): Like | undefined => LIKES.find((like) => like.category === category);

/**
 * Get all like categories
 */
export const getLikeCategories = (): Like["category"][] =>
  LIKES.map((like) => like.category);

/**
 * Get profile summary
 */
export const getProfileSummary = (): string => {
  const age = getAge();
  const universityAge = getUniversityAge();

  return `私は琉球大学の理学部に所属している大学生です。現在${universityAge}年生の${age}歳です。趣味はバスケットボールとギターと個人開発です。`;
};

/**
 * Check if still in university
 */
export const isCurrentStudent = (): boolean => {
  const universityAge = getUniversityAge();
  return universityAge >= 1 && universityAge <= 4;
};

/**
 * Get formatted university status
 */
export const getUniversityStatus = (): string => {
  const universityAge = getUniversityAge();
  const isStudent = isCurrentStudent();

  if (isStudent) {
    return `大学${universityAge}年生`;
  } else if (universityAge > 4) {
    return "大学卒業";
  } else {
    return "大学生";
  }
};
