// 구 등급 필터 조회 API 응답 타입 정의

export interface SelectGradeItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  matching_district_count: number;
}

export interface SelectGradeData {
  items: SelectGradeItem[];
  as_of_date: string;
  count: number;
}

export interface SelectGradeResponse {
  status: string;
  message: string;
  code: number;
  data: SelectGradeData;
}

// 등급 타입 정의
export type Grade = "G1" | "G2" | "G3" | "G4" | "G5";