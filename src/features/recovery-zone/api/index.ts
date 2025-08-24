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
  const url = `/api/v1/incidents?status=${statusParam}`;
  return await getResponse<IncidentsResponse>(url);
};