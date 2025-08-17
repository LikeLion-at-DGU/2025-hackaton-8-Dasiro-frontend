export * from './ui';

// 복구 현황 타입
export type RecoveryStatus = "복구중" | "임시복구" | "복구완료";

export interface DistrictRecovery {
  name: string; // 구 이름 (예: "강남구")
  status: RecoveryStatus; // 복구 현황
}