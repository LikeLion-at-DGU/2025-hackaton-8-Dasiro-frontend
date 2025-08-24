// Recovery API Request Parameter Types

// getIncidents API parameters
export interface GetIncidentsParams {
  statuses?: ("UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED")[];
  lat?: number;
  lng?: number;
  radius?: number;
}

// Recovery status types
export type RecoveryStatus = "UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED";

// No parameters needed for getRecoveryStatus API