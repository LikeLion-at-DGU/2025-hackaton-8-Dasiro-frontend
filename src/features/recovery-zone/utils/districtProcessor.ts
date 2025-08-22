import type { FC, Feature } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { extractDistrictKey } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { recoveryData } from "../constants/recoveryData";
import type { RecoveryStatus } from "../types";

// 구별 데이터 타입 정의
export interface DistrictData {
  GuName: string;
  coordinates: number[][][]; // Polygon coordinates
  riskData: number;
  restoreLevel: "low" | "medium" | "high";
  recoveryStatus?: RecoveryStatus;
}

// 복구 현황을 복구 레벨로 매핑
const getRestoreLevel = (status: RecoveryStatus): "low" | "medium" | "high" => {
  switch (status) {
    case "복구중":
      return "low";
    case "임시복구":
      return "medium";
    case "복구완료":
      return "high";
    default:
      return "medium";
  }
};

// 가상의 위험도 데이터 생성 (실제 데이터로 교체 가능)
const generateRiskData = (guName: string): number => {
  // 구 이름의 해시값을 기반으로 1-100 범위의 위험도 생성
  let hash = 0;
  for (let i = 0; i < guName.length; i++) {
    const char = guName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash % 100) + 1;
};

// GeoJSON Feature를 DistrictData로 변환
const convertFeatureToDistrict = (feature: Feature): DistrictData | null => {
  const { name } = extractDistrictKey(feature.properties);
  
  if (!name || !feature.geometry) {
    return null;
  }

  // 복구 데이터에서 해당 구 찾기
  const recoveryInfo = recoveryData.find(d => d.name === name);
  const recoveryStatus = recoveryInfo?.status || "복구완료";

  // 좌표 추출 (Polygon만 처리, MultiPolygon은 첫 번째 폴리곤만 사용)
  let coordinates: number[][][];
  if (feature.geometry.type === "Polygon") {
    coordinates = feature.geometry.coordinates;
  } else if (feature.geometry.type === "MultiPolygon") {
    coordinates = feature.geometry.coordinates[0] || [];
  } else {
    return null;
  }

  return {
    GuName: name,
    coordinates,
    riskData: generateRiskData(name),
    restoreLevel: getRestoreLevel(recoveryStatus),
    recoveryStatus
  };
};

// GeoJSON을 구별 데이터 배열로 변환
export const processSeoulDistricts = (geoJsonData: FC): DistrictData[] => {
  const districts: DistrictData[] = [];
  
  for (const feature of geoJsonData.features) {
    const district = convertFeatureToDistrict(feature);
    if (district) {
      districts.push(district);
    }
  }
  
  return districts.sort((a, b) => a.GuName.localeCompare(b.GuName));
};

// 특정 구의 데이터만 가져오기
export const getDistrictByName = (districts: DistrictData[], guName: string): DistrictData | undefined => {
  return districts.find(d => d.GuName === guName || d.GuName === guName.replace(/구$/, "") + "구");
};

// 복구 레벨별 구 목록 가져오기
export const getDistrictsByRestoreLevel = (districts: DistrictData[], level: "low" | "medium" | "high"): DistrictData[] => {
  return districts.filter(d => d.restoreLevel === level);
};

// 위험도 기준으로 정렬된 구 목록
export const getDistrictsSortedByRisk = (districts: DistrictData[], ascending: boolean = false): DistrictData[] => {
  return [...districts].sort((a, b) => 
    ascending ? a.riskData - b.riskData : b.riskData - a.riskData
  );
};