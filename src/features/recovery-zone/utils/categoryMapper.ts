import type { PlaceCategory } from "@entities/report/places";

// 필터 이름을 API 카테고리로 매핑
export const mapFilterToCategory = (filterName: string): PlaceCategory | undefined => {
  const categoryMap: Record<string, PlaceCategory> = {
    "음식점": "FOOD",
    "카페": "CAFE", 
    "편의점": "CONVENIENCE"
  };
  
  return categoryMap[filterName];
};

// API 카테고리를 필터 이름으로 매핑 (역방향)
export const mapCategoryToFilter = (category: PlaceCategory): string => {
  const filterMap: Record<PlaceCategory, string> = {
    "FOOD": "음식점",
    "CAFE": "카페",
    "CONVENIENCE": "편의점", 
    "OTHER": "기타"
  };
  
  return filterMap[category] || "기타";
};