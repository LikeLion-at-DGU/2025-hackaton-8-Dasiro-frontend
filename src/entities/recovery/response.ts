// Recovery API Response Types

// Recovery status counts
export interface RecoveryCounts {
  RECOVERING: number;
  TEMP_REPAIRED: number;
  RECOVERED: number;
}

// Recovery district item
export interface RecoveryDistrictItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  recovery_counts: RecoveryCounts;
}

// getRecoveryStatus API response
export interface RecoveryStatusResponse {
  status: string;
  message: string;
  code: number;
  data: RecoveryDistrictItem[];
}

// Incident item
export interface IncidentItem {
  id: number;
  occurred_at: string;
  address: string;
  lat: number;
  lng: number;
  cause: string;
  method: string;
  status: "UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED";
  images_count: number;
  distance_m: number;
}

// getIncidents API response
export interface IncidentsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: IncidentItem[];
    count: number;
  };
}