
export interface DistrictSearchItem {
  id: number;
  sido: string;
  sigungu: string;
  dong: string;
  center_lat: number;
  center_lng: number;
  is_safezone: boolean;
}

export interface DistrictSearchResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: DistrictSearchItem[];
    count: number;
  };
}

export interface DistrictSearchParams {
  q: string;
  sido?: string;
  sigungu?: string;
  limit?: number;
}

// Safezone districts API response types
export interface SafezoneDistrictItem {
  id: number;
  sido: string;
  sigungu: string;
  dong: string;
  center_lat: number;
  center_lng: number;
  is_safezone: boolean;
}

export interface SafezoneDistrictsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: SafezoneDistrictItem[];
    count: number;
  };
}