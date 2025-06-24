/**
 * Calculate age from birth date
 */
export const calculateAge = (): number => {
  const birthDate = new Date("2001-09-05");
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred this year, subtract 1
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Calculate university year (Japanese academic year: April to March)
 * Uses server-side consistent calculation to prevent hydration errors
 */
export const calculateUniversityAge = (): number => {
  // Use a consistent date for SSR/CSR consistency
  // This calculation assumes 2025 academic year
  const admissionYear = 2020;
  const currentAcademicYear = 2025; // TODO: Update this annually to prevent hydration errors

  const universityYear = currentAcademicYear - admissionYear + 1;

  return Math.max(1, Math.min(universityYear, 6)); // Clamp between 1-6 years
};

// Note: Pre-calculated values removed to prevent hydration errors
// Use calculateAge() and calculateUniversityAge() functions instead
// or ProfileService.getAge() and ProfileService.getUniversityAge()
