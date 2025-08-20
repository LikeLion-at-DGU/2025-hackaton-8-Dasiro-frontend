import { colors } from "@shared/styles/colors";
import type { DistrictData } from "./districtProcessor";

// 위험도에 따른 색상 매핑 (1-100)
export const getRiskColor = (riskData: number): string => {
  if (riskData >= 80) {
    return colors.orange01;  // 매우 위험 (가장 진한 주황색)
  } else if (riskData >= 60) {
    return colors.orange02;  // 위험 (진한 주황색)
  } else if (riskData >= 40) {
    return colors.orange04;  // 보통 위험 (연한 주황색)
  } else if (riskData >= 20) {
    return colors.green02;   // 낮은 위험 (연한 초록색)
  } else {
    return colors.green01;   // 매우 낮은 위험 (진한 초록색)
  }
};

// 구 이름으로 위험도 색상 반환 (districts 데이터 필요)
export const getRiskColorByDistrict = (districtName: string, districts: DistrictData[]): string => {
  const district = districts.find(d => 
    d.GuName === districtName || 
    d.GuName === districtName.replace(/구$/, "") + "구"
  );
  
  return district ? getRiskColor(district.riskData) : colors.orange04;
};

// 위험도별 색상 범례
export const riskColorLegend = [
  { range: "80-100", color: colors.orange01, description: "매우 위험" },
  { range: "60-79", color: colors.orange02, description: "위험" },
  { range: "40-59", color: colors.orange04, description: "보통" },
  { range: "20-39", color: colors.green02, description: "낮음" },
  { range: "1-19", color: colors.green01, description: "매우 낮음" },
] as const;