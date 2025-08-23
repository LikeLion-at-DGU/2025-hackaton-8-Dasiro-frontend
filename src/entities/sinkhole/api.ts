import { getResponse } from "@shared/lib/instance";
import type { SelectGradeResponse, Grade } from "./selectgrade";
import type { SafezoneResponse } from "./safezones";
import type { DistrictSearchResponse, DistrictSearchParams, SafezoneDistrictsResponse } from "@features/sinkhole-map/constants";

// 구 등급 필터 조회 API
export const getDistrictsByGrade = async (grade: Grade): Promise<SelectGradeResponse | null> => {
  const url = `/api/v1/districts/gu/metrics/by-grade?grade=${grade}`;
  return await getResponse<SelectGradeResponse>(url);
};

// 안심존 구 조회 API
export const getSafezones = async (): Promise<SafezoneResponse | null> => {
  const url = `/api/v1/districts/safezones/gu`;
  return await getResponse<SafezoneResponse>(url);
};

// 행정동 검색 API
export const searchDistricts = async (params: DistrictSearchParams): Promise<DistrictSearchResponse | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.sido) searchParams.append('sido', params.sido);
  if (params.sigungu) searchParams.append('sigungu', params.sigungu);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  
  const url = `/api/v1/districts/search?${searchParams.toString()}`;
  return await getResponse<DistrictSearchResponse>(url);
};

// G1, G2 등급 안심구역 조회 API (구별)
export const getSafezoneGu = async (): Promise<SafezoneResponse | null> => {
  const url = `/api/v1/districts/safezones/gu`;
  return await getResponse<SafezoneResponse>(url);
};

// 안심존 행정동 조회 API (동별)
export const getSafezoneDistricts = async (): Promise<SafezoneDistrictsResponse | null> => {
  const url = `/api/v1/districts/safezones`;
  return await getResponse<SafezoneDistrictsResponse>(url);
};