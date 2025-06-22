const birthDate = new Date("2001-09-05");
const today = new Date();
export const age = Math.floor(
  (today.getTime() - birthDate.getTime()) / (1000 * 3600 * 24 * 365),
);

const admissionYear = new Date("2020-04-01");
export const universityAge =
  Math.floor(
    (today.getTime() - admissionYear.getTime()) / (1000 * 3600 * 24 * 365),
  ) +
  1 -
  1;
