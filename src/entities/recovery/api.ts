// Recovery Entity API - delegates to feature APIs
import * as RecoveryZoneAPI from "@features/recovery-zone/api";
import type { GetIncidentsParams } from "./model";
import type { RecoveryStatusResponse, IncidentsResponse } from "./response";

// Re-export types for backward compatibility
export type { RecoveryStatusResponse, IncidentsResponse } from "./response";
export type { IncidentItem } from "./response";

// Recovery status API
export const getRecoveryStatus = async (): Promise<RecoveryStatusResponse | null> => {
  return await RecoveryZoneAPI.getRecoveryStatus();
};

// Incidents API
export const getIncidents = async (params?: GetIncidentsParams): Promise<IncidentsResponse | null> => {
  return await RecoveryZoneAPI.getIncidents(params);
};