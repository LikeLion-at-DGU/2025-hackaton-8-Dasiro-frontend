// 복구 관련 공통 타입 정의

export interface IncidentDisplay {
  id: number;
  title: string;           // cause + method 조합
  address: string;
  lat: number;
  lng: number;
  distance_m: number;
  occurred_at: string;
  cause: string;
  method: string;
  status: "UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED";
  images_count: number;
}

// UI에서 사용할 공통 카드 아이템 타입 (Place와 IncidentDisplay를 통합)
export type CardItem = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance_m: number;
  type: "place" | "incident";
  // Place 전용 필드 (type: "place"일 때만 사용)
  category?: "FOOD" | "CAFE" | "CONVENIENCE" | "OTHER";
  main_image_url?: string;
  kakao_url?: string | null;
  has_active_coupons?: boolean;
  // Incident 전용 필드 (type: "incident"일 때만 사용)
  occurred_at?: string;
  cause?: string;
  method?: string;
  status?: "UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED";
  images_count?: number;
};