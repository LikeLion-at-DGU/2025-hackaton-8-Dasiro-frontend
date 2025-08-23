import { getResponse } from "@shared/lib/instance";

export interface RecoveryCounts {
  RECOVERING: number;
  TEMP_REPAIRED: number;
  RECOVERED: number;
}

export interface RecoveryDistrictItem {
  gu_code: number;
  sido: string;
  sigungu: string;
  center_lat: number;
  center_lng: number;
  recovery_counts: RecoveryCounts;
}

export interface RecoveryStatusResponse {
  status: string;
  message: string;
  code: number;
  data: RecoveryDistrictItem[];
}

export const getRecoveryStatus = async (): Promise<RecoveryStatusResponse | null> => {
  const url = `/api/v1/districts/gu/recovery-status`;
  return await getResponse<RecoveryStatusResponse>(url);
};