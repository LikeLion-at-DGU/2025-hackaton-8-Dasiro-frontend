// Sinkhole Entity API - delegates to feature APIs
import * as SinkholeMapAPI from "@features/sinkhole-map/api";
import type { Grade, DistrictSearchParams } from "./model";
import type { 
  SelectGradeResponse, 
  SafezoneResponse, 
  DistrictSearchResponse, 
  SafezoneDistrictsResponse 
} from "./response";

// Re-export types for backward compatibility
export type { SelectGradeResponse, SafezoneResponse, DistrictSearchResponse, SafezoneDistrictsResponse } from "./response";
export type { SelectGradeItem, SafezoneItem, DistrictSearchItem, SafezoneDistrictItem } from "./response";
export type { Grade } from "./model";

// 구 등급 필터 조회 API
export const getDistrictsGuByGrade = async (grade: Grade): Promise<SelectGradeResponse | null> => {
  return await SinkholeMapAPI.getDistrictsGuByGrade({ grade });
};

// 동 등급 필터 조회 API
export const getDistrictsByGrade = async (grade: Grade): Promise<SelectGradeResponse | null> => {
  return await SinkholeMapAPI.getDistrictsByGrade({ grade });
};

// 안심존 구 조회 API
export const getSafezones = async (): Promise<SafezoneResponse | null> => {
  return await SinkholeMapAPI.getSafezones();
};

// G1, G2 등급 안심구역 조회 API (구별) - getSafezones와 동일
export const getSafezoneGu = async (): Promise<SafezoneResponse | null> => {
  return await SinkholeMapAPI.getSafezoneGu();
};

// 안심존 행정동 조회 API (동별)
export const getSafezoneDistricts = async (): Promise<SafezoneDistrictsResponse | null> => {
  return await SinkholeMapAPI.getSafezoneDistricts();
};

// 행정동 검색 API
export const searchDistricts = async (params: DistrictSearchParams): Promise<DistrictSearchResponse | null> => {
  return await SinkholeMapAPI.searchDistricts(params);
};

