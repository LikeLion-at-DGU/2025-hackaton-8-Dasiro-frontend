// Sinkhole API Response Types

// Select grade item
export interface SelectGradeItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  matching_district_count: number;
}

// Select grade data
export interface SelectGradeData {
  items: SelectGradeItem[];
  as_of_date: string;
  count: number;
}

// getDistrictsGuByGrade and getDistrictsByGrade API response
export interface SelectGradeResponse {
  status: string;
  message: string;
  code: number;
  data: SelectGradeData;
}

// Safezone item
export interface SafezoneItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  safe_district_count: number;
  final_grade: "G1" | "G2";
}

// Safezone data
export interface SafezoneData {
  items: SafezoneItem[];
  as_of_date: string;
  count: number;
}

// getSafezones, getSafezoneGu API response
export interface SafezoneResponse {
  status: string;
  message: string;
  code: number;
  data: SafezoneData;
}

// District search item
export interface DistrictSearchItem {
  id: number;
  sido: string;
  sigungu: string;
  dong: string;
  center_lat: number;
  center_lng: number;
  is_safezone: boolean;
  ground_stability: string;
  groundwater_impact: string;
  underground_densityj: string;
  old_building_dist: string;
  incident_history: string;
}

// searchDistricts API response
export interface DistrictSearchResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: DistrictSearchItem[];
    count: number;
  };
}

// District color item for getDistrictsGuColor API
export interface DistrictColorItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  final_grade: "G1" | "G2" | "G3" | "G4" | "G5";
}

// District color data
export interface DistrictColorData {
  items: DistrictColorItem[];
}

// getDistrictsGuColor API response
export interface DistrictColorResponse {
  status: string;
  message: string;
  code: number;
  data: DistrictColorData;
}

// Safezone district item
export interface SafezoneDistrictItem {
  id: number;
  sido: string;
  sigungu: string;
  dong: string;
  center_lat: number;
  center_lng: number;
  is_safezone: boolean;
}

// getSafezoneDistricts API response
export interface SafezoneDistrictsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: SafezoneDistrictItem[];
    count: number;
  };
}