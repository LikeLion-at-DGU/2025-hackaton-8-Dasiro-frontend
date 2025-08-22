import { getResponse } from "@shared/lib/instance";
import type { SelectGradeResponse, Grade } from "./selectgrade";
import type { SafezoneResponse } from "./safezones";

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