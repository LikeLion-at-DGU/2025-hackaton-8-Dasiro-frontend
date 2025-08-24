// Recovery Zone API implementations
import { getResponse } from "@shared/lib/instance";
import type { GetIncidentsParams } from "@entities/recovery/model";
import type { RecoveryStatusResponse, IncidentsResponse } from "@entities/recovery/response";

// Recovery status API
export const getRecoveryStatus = async (): Promise<RecoveryStatusResponse | null> => {
  const url = `/api/v1/districts/gu/recovery-status`;
  return await getResponse<RecoveryStatusResponse>(url);
};

// Incidents API
export const getIncidents = async (params?: GetIncidentsParams): Promise<IncidentsResponse | null> => {
  const statuses = params?.statuses || ["UNDER_REPAIR", "TEMP_REPAIRED"];
  const statusParam = statuses.join(',');
  
  // 위치 기반 파라미터가 있으면 near 엔드포인트 사용
  if (params?.lat && params?.lng && params?.radius) {
    const url = `/api/v1/incidents/near?lat=${params.lat}&lng=${params.lng}&radius=${params.radius}&status=${statusParam}`;
    return await getResponse<IncidentsResponse>(url);
  }
  
  // 기본 incidents 엔드포인트
  const url = `/api/v1/incidents?status=${statusParam}`;
  return await getResponse<IncidentsResponse>(url);
};