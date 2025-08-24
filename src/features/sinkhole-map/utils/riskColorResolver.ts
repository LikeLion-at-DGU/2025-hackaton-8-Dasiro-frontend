import { colors } from "@shared/styles/colors";

// 위험도 데이터 타입 정의 (필요한 속성만 포함)
interface DistrictData {
  GuName: string;
  riskData: number;
}

const addOpacityToColor = (color: string, opacity: number = 0.7): string => {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const getRiskColor = (riskData: number): string => {
  if (riskData >= 80) {
    return addOpacityToColor(colors.orange01);
  } else if (riskData >= 60) {
    return addOpacityToColor(colors.orange02);
  } else if (riskData >= 40) {
    return addOpacityToColor(colors.orange04);
  } else if (riskData >= 20) {
    return addOpacityToColor(colors.green02);
  } else {
    return addOpacityToColor(colors.green01);
  }
};

export const getRiskColorByDistrict = (
  districtName: string,
  districts: DistrictData[]
): string => {
  const district = districts.find(
    (d) =>
      d.GuName === districtName ||
      d.GuName === districtName.replace(/구$/, "") + "구"
  );

  return district ? getRiskColor(district.riskData) : addOpacityToColor(colors.orange04);
};

export const riskColorLegend = [
  { range: "80-100", color: addOpacityToColor(colors.orange01), description: "매우 위험" },
  { range: "60-79", color: addOpacityToColor(colors.orange02), description: "위험" },
  { range: "40-59", color: addOpacityToColor(colors.orange04), description: "보통" },
  { range: "20-39", color: addOpacityToColor(colors.green02), description: "낮음" },
  { range: "1-19", color: addOpacityToColor(colors.green01), description: "매우 낮음" },
] as const;

