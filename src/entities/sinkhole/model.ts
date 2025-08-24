// Sinkhole API Request Parameter Types

// Grade type
export type Grade = "G1" | "G2" | "G3" | "G4" | "G5";

// getDistrictsGuByGrade and getDistrictsByGrade parameters
export interface GetDistrictsByGradeParams {
  grade: Grade;
}

// searchDistricts parameters
export interface DistrictSearchParams {
  q: string;
  sido?: string;
  sigungu?: string;
  limit?: number;
}

// No parameters needed for getSafezones, getSafezoneGu, getSafezoneDistricts APIs