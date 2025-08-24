import type { RecoveryCounts } from "./response";

// 복구 상태별 색상 정의 (theme 색상 사용)
export const RECOVERY_COLORS = {
  RECOVERING: 'orange04',      // 복구중 - 가장 진한 오렌지
  TEMP_REPAIRED: 'orange02',   // 임시복구 - 중간 오렌지
  RECOVERED: 'orange01'        // 복구완료 - 밝은 오렌지
} as const;

// 최대값을 기준으로 투명도 계산
export const calculateOpacity = (count: number, maxCount: number): number => {
  if (maxCount === 0) return 0.1;
  return Math.max(0.1, Math.min(1, count / maxCount));
};

// 복구 상태별 최대값 계산
export const getMaxCounts = (data: Array<{ recovery_counts: RecoveryCounts }>) => {
  const maxRecovering = Math.max(...data.map(item => item.recovery_counts.RECOVERING));
  const maxTempRepaired = Math.max(...data.map(item => item.recovery_counts.TEMP_REPAIRED));
  const maxRecovered = Math.max(...data.map(item => item.recovery_counts.RECOVERED));
  
  return {
    RECOVERING: maxRecovering,
    TEMP_REPAIRED: maxTempRepaired,
    RECOVERED: maxRecovered
  };
};

// 지역별 주요 복구 상태 결정 (가장 많은 건수 기준)
export const getDominantRecoveryStatus = (counts: RecoveryCounts): keyof RecoveryCounts => {
  const { RECOVERING, TEMP_REPAIRED, RECOVERED } = counts;
  
  if (RECOVERING >= TEMP_REPAIRED && RECOVERING >= RECOVERED) {
    return 'RECOVERING';
  }
  if (TEMP_REPAIRED >= RECOVERED) {
    return 'TEMP_REPAIRED';
  }
  return 'RECOVERED';
};

// 지역별 색상 계산 (주요 상태 + 투명도)
export const getRegionColor = (
  counts: RecoveryCounts, 
  maxCounts: ReturnType<typeof getMaxCounts>,
  theme: any
): string => {
  const dominantStatus = getDominantRecoveryStatus(counts);
  const dominantCount = counts[dominantStatus];
  const maxCount = maxCounts[dominantStatus as keyof typeof maxCounts];
  
  const opacity = calculateOpacity(dominantCount, maxCount);
  const colorKey = RECOVERY_COLORS[dominantStatus as keyof typeof RECOVERY_COLORS];
  const hexColor = theme.colors[colorKey];
  
  // hex to rgba 변환
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};