import { colors } from "@shared/styles/colors";
import type { RecoveryStatus } from "../types";
import { recoveryData } from "../constants/recoveryData";
import { getRecoveryStatus } from "@entities/recovery/api";
import { getRegionColor, getMaxCounts } from "@entities/recovery/colorUtils";

// 색상에 opacity를 적용하는 helper 함수
const addOpacityToColor = (color: string, opacity: number = 0.7): string => {
  // hex 색상을 rgba로 변환
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color; // 이미 rgba인 경우 그대로 반환
};

// 복구 현황에 따른 색상 매핑 (opacity 0.7 적용)
const recoveryColorMap: Record<RecoveryStatus, string> = {
  "복구중": addOpacityToColor(colors.orange01),     // #ff7765 with opacity 0.7
  "임시복구": addOpacityToColor(colors.orange02),   // #ffa18a with opacity 0.7
  "복구완료": addOpacityToColor(colors.orange04),   // #ffd8c0 with opacity 0.7
};

// API 데이터를 저장할 변수
let apiRecoveryData: any[] | null = null;
let maxCounts: any = null;

// API 데이터 로드
export const loadRecoveryData = async (): Promise<void> => {
  try {
    const response = await getRecoveryStatus();
    if (response && response.status === "success") {
      apiRecoveryData = response.data;
      maxCounts = getMaxCounts(response.data);
    }
  } catch (error) {
    console.error("복구 상태 데이터 로드 실패:", error);
  }
};

// 구 이름으로 복구 현황을 찾아 색상 반환
export const getRecoveryColor = (districtName?: string): string => {
  if (!districtName) {
    return addOpacityToColor(colors.orange04); // 기본값: 복구완료 색상 with opacity
  }

  // API 데이터가 있으면 사용
  if (apiRecoveryData && maxCounts) {
    const districtData = apiRecoveryData.find(d => d.sigungu === districtName);
    if (districtData && districtData.recovery_counts) {
      // theme을 직접 접근할 수 없으므로 colors 객체 사용
      const theme = { colors };
      const regionColor = getRegionColor(districtData.recovery_counts, maxCounts, theme);
      return addOpacityToColor(regionColor);
    }
  }

  // 기존 하드코딩된 데이터 사용 (fallback)
  const normalizedName = districtName.replace(/구$/, "") + "구";
  
  const district = recoveryData.find(d => 
    d.name === districtName || d.name === normalizedName
  );

  return district ? recoveryColorMap[district.status] : addOpacityToColor(colors.orange04);
};

// 복구 현황별 색상 정보 (opacity 0.7 적용)
export const recoveryColors = {
  "복구중": addOpacityToColor(colors.orange01),
  "임시복구": addOpacityToColor(colors.orange02),
  "복구완료": addOpacityToColor(colors.orange04),
};

// 색상 범례용 데이터 (opacity 0.7 적용)
export const recoveryLegend = [
  { status: "복구중", color: addOpacityToColor(colors.orange01), description: "복구 작업이 진행 중인 지역" },
  { status: "임시복구", color: addOpacityToColor(colors.orange02), description: "임시 복구가 완료된 지역" },
  { status: "복구완료", color: addOpacityToColor(colors.orange04), description: "완전 복구가 완료된 지역" },
] as const;