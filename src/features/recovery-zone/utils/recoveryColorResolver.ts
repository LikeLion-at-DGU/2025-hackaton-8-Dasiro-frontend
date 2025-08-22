import { colors } from "@shared/styles/colors";
import type { RecoveryStatus } from "../types";
import { recoveryData } from "../constants/recoveryData";

// 복구 현황에 따른 색상 매핑
const recoveryColorMap: Record<RecoveryStatus, string> = {
  "복구중": colors.orange01,     // #ff7765
  "임시복구": colors.orange02,   // #ffa18a  
  "복구완료": colors.orange04,   // #ffd8c0
};

// 구 이름으로 복구 현황을 찾아 색상 반환
export const getRecoveryColor = (districtName?: string): string => {
  if (!districtName) {
    return colors.orange04; // 기본값: 복구완료 색상
  }

  // 구 이름에서 '구' 제거하여 매칭 시도
  const normalizedName = districtName.replace(/구$/, "") + "구";
  
  const district = recoveryData.find(d => 
    d.name === districtName || d.name === normalizedName
  );

  return district ? recoveryColorMap[district.status] : colors.orange04;
};

// 복구 현황별 색상 정보
export const recoveryColors = {
  "복구중": colors.orange01,
  "임시복구": colors.orange02,
  "복구완료": colors.orange04,
};

// 색상 범례용 데이터
export const recoveryLegend = [
  { status: "복구중", color: colors.orange01, description: "복구 작업이 진행 중인 지역" },
  { status: "임시복구", color: colors.orange02, description: "임시 복구가 완료된 지역" },
  { status: "복구완료", color: colors.orange04, description: "완전 복구가 완료된 지역" },
] as const;