// 안심존 API 응답 타입 정의

export interface SafezoneItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  safe_district_count: number;
  final_grade: "G1" | "G2"; // 안심존은 G1, G2만
}

export interface SafezoneData {
  items: SafezoneItem[];
  as_of_date: string;
  count: number;
}

export interface SafezoneResponse {
  status: string;
  message: string;
  code: number;
  data: SafezoneData;
}