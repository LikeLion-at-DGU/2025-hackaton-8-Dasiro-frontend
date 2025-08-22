import { getResponse } from "@shared/lib/instance";
import type { SelectGradeResponse, Grade } from "./selectgrade";

// 구 등급 필터 조회 API
export const getDistrictsByGrade = async (grade: Grade): Promise<SelectGradeResponse | null> => {
  const url = `/api/v1/districts/gu/metrics/by-grade?grade=${grade}`;
  return await getResponse<SelectGradeResponse>(url);
};