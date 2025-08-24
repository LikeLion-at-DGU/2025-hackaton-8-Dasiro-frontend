import { colors } from "@shared/styles/colors";
import type { DistrictData } from "./districtProcessor";

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

// 위험도에 따른 색상 매핑 (1-100) - opacity 0.7 적용
export const getRiskColor = (riskData: number): string => {
  if (riskData >= 80) {
    return addOpacityToColor(colors.orange01);  // 매우 위험 (가장 진한 주황색)
  } else if (riskData >= 60) {
    return addOpacityToColor(colors.orange02);  // 위험 (진한 주황색)
  } else if (riskData >= 40) {
    return addOpacityToColor(colors.orange04);  // 보통 위험 (연한 주황색)
  } else if (riskData >= 20) {
    return addOpacityToColor(colors.green02);   // 낮은 위험 (연한 초록색)
  } else {
    return addOpacityToColor(colors.green01);   // 매우 낮은 위험 (진한 초록색)
  }
};

// 구 이름으로 위험도 색상 반환 (districts 데이터 필요) - opacity 0.7 적용
export const getRiskColorByDistrict = (districtName: string, districts: DistrictData[]): string => {
  const district = districts.find(d => 
    d.GuName === districtName || 
    d.GuName === districtName.replace(/구$/, "") + "구"
  );
  
  return district ? getRiskColor(district.riskData) : addOpacityToColor(colors.orange04);
};

// 위험도별 색상 범례 - opacity 0.7 적용
export const riskColorLegend = [
  { range: "80-100", color: addOpacityToColor(colors.orange01), description: "매우 위험" },
  { range: "60-79", color: addOpacityToColor(colors.orange02), description: "위험" },
  { range: "40-59", color: addOpacityToColor(colors.orange04), description: "보통" },
  { range: "20-39", color: addOpacityToColor(colors.green02), description: "낮음" },
  { range: "1-19", color: addOpacityToColor(colors.green01), description: "매우 낮음" },
] as const;