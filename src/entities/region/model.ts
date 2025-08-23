export type RiskInfoDTO = {
  district_id?: number | string;
  sido?: string;
  sigungu?: string;
  dong?: string;
  as_of_date?: string;
  total_grade?: string;
  recent_incidents?: number | string;
  analysis_text?: string;
};

// UI로 반환할 타입(필요한 것만)
export type RegionInfoData = {
  title: string;
  content: string;
};
