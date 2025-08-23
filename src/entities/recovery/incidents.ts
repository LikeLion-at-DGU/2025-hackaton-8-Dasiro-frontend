import { getResponse } from "@shared/lib/instance";

export interface IncidentItem {
  id: number;
  occurred_at: string;
  address: string;
  lat: number;
  lng: number;
  cause: string;
  method: string;
  status: "UNDER_REPAIR" | "TEMP_REPAIRED";
  images_count: number;
  distance_m: number;
}

export interface IncidentsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: IncidentItem[];
    count: number;
  };
}

// 복구중/임시복구 사고 목록 조회 API
export const getIncidents = async (statuses: ("UNDER_REPAIR" | "TEMP_REPAIRED")[] = ["UNDER_REPAIR", "TEMP_REPAIRED"]): Promise<IncidentsResponse | null> => {
  const statusParam = statuses.join(',');
  const url = `/api/v1/incidents?status=${statusParam}`;
  return await getResponse<IncidentsResponse>(url);
};