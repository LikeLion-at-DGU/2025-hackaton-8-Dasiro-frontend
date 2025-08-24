export const SAFEZONE_TEST_DATA = [
  { sigungu: "강남구", final_grade: "G1" },
  { sigungu: "서초구", final_grade: "G2" }
] as const;

export type SafezoneTestItem = (typeof SAFEZONE_TEST_DATA)[number];
