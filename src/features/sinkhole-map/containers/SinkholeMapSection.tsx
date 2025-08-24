// Sinkhole Map 섹션 - 서울 구별 싱크홀 위험도를 색상으로 표시하는 지도
import { useEffect, useState } from "react";
import { BaseMapSection, CaptionContent } from "@shared/components/BaseMapSection";
import { getRiskColorByDistrict, getRiskColorByGrade } from "@features/sinkhole-map/utils/riskColorResolver";
import { useSelectGrade } from "@entities/sinkhole/context";
import { getDistrictsGuColor } from "@features/sinkhole-map/api";
import type { DistrictColorItem } from "@entities/sinkhole/response";


const RiskCaption = () => {
  console.log("RiskCaption 렌더링됨 - 이 로그가 보이면 캡션이 화면에 표시되고 있는 것입니다.");
  return (
    <>
      <CaptionContent color="green01" title="1등급" />
      <CaptionContent color="green02" title="2등급" />
      <CaptionContent color="orange04" title="3등급" />
      <CaptionContent color="orange02" title="4등급" />
      <CaptionContent color="orange01" title="5등급" />
    </>
  );
};

interface SinkholeMapSectionProps {
  forceViewMode?: "grade" | "safezone"; // 강제로 viewMode 지정
  id?: string; // 디버깅용 지도 식별자
}

export const SinkholeMapSection = ({
  forceViewMode,
  id = "sinkhole-map",
}: SinkholeMapSectionProps) => {
  // Sinkhole Context
  const { selectedGradeData, safezoneData, viewMode: contextViewMode, isBadgeActive } = useSelectGrade();
  
  // 실제 사용할 viewMode 결정
  const viewMode = forceViewMode || contextViewMode;
  
  // 캡션 표시 여부 상태
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);
  
  // 초기 위험등급 데이터 상태
  const [initialDistrictData, setInitialDistrictData] = useState<DistrictColorItem[]>([]);
  
  // 지도 인스턴스 저장을 위한 상태
  const [mapData, setMapData] = useState<{
    mapInstance: any;
    geoJsonData: any;
    districtsData: any;
  } | null>(null);

  // 초기 위험등급 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await getDistrictsGuColor();
        if (response?.data?.items) {
          setInitialDistrictData(response.data.items);
          console.log("초기 위험등급 데이터 로드 완료:", response.data.items);
        }
      } catch (error) {
        console.error("초기 위험등급 데이터 로드 실패:", error);
      }
    };

    loadInitialData();
  }, []);

  // 지도 준비 완료 핸들러
  const handleMapReady = (mapInstance: any, geoJsonData: any, districtsData: any) => {
    setMapData({ mapInstance, geoJsonData, districtsData });
  };

  // initialDistrictData가 로드되면 지도 색상 업데이트
  useEffect(() => {
    if (mapData && initialDistrictData.length > 0) {
      console.log("지도 색상 업데이트 실행:", initialDistrictData.length);
      mapData.mapInstance.setFillColor((feature: any) =>
        getDistrictColor(feature, mapData.districtsData)
      );
    }
  }, [initialDistrictData, mapData]);

  // 필터 선택 여부에 따라 캡션 표시 제어
  useEffect(() => {
    // 뱃지 모드(안심존)일 때만 캡션 숨김
    setIsCaptionVisible(!isBadgeActive);
  }, [isBadgeActive]);

  // 구별 색상 결정 함수
  const getDistrictColor = (feature: any, districtsData: any) => {
    const name = feature.properties?.name || feature.properties?.SIG_KOR_NM || "";

    // 디버깅용 로그 (첫 번째 구역에서만 출력)
    if (name === "종로구") {
      console.log("SinkholeMapSection Debug:", {
        viewMode,
        selectedGradeDataLength: selectedGradeData?.items?.length || 0,
        safezoneDataLength: safezoneData?.items?.length || 0,
        isBadgeActive,
      });
    }


    // 선택된 등급 데이터가 있는 경우 (특정 등급 버튼 클릭)
    if (viewMode === "grade" && selectedGradeData !== null) {
      if (selectedGradeData.items.length > 0) {
        const isSelectedDistrict = selectedGradeData.items.some(
          (item) => item.sigungu === name
        );
        if (isSelectedDistrict) {
          // 선택된 등급의 구만 색칠 - initialDistrictData에서 해당 구의 등급 확인
          if (initialDistrictData.length > 0) {
            const districtData = initialDistrictData.find(item => item.sigungu === name);
            if (districtData) {
              return getRiskColorByGrade(districtData.final_grade);
            }
          }
          // fallback
          return getRiskColorByDistrict(name, districtsData);
        } else {
          // 선택되지 않은 구는 회색으로 비활성화
          return "rgba(224, 224, 224, 0.7)";
        }
      } else {
        // 선택된 등급에 해당하는 데이터가 없으면 모든 구를 회색으로 표시
        return "rgba(224, 224, 224, 0.7)";
      }
    }

    // 안심존 데이터가 있는 경우 (안심존 버튼 클릭)
    if (viewMode === "safezone") {
      if (safezoneData && safezoneData.items.length > 0) {
        const safezoneItem = safezoneData.items.find(
          (item) => item.sigungu === name
        );
        if (safezoneItem) {
          // 안심존 구는 final_grade에 따른 색상 표시
          return getRiskColorByGrade(safezoneItem.final_grade);
        } else {
          // 안심존이 아닌 구는 회색으로 비활성화
          return "rgba(224, 224, 224, 0.7)";
        }
      }
    }

    // 기본: initialDistrictData로 모든 구 색칠 (초기 로드 시)
    if (initialDistrictData.length > 0) {
      const districtData = initialDistrictData.find(item => item.sigungu === name);
      if (districtData) {
        return getRiskColorByGrade(districtData.final_grade);
      }
    }

    // 데이터에 없는 구역은 회색으로 표시
    return "rgba(224, 224, 224, 0.7)";
  };

  const handleDistrictClick = (district: string) => {
    console.log("클릭된 구:", district);
  };

  const handleMarkerClick = (marker: any) => {
    console.log("클릭된 마커:", marker);
  };

  return (
    <BaseMapSection
      id={id}
      showCaption={isCaptionVisible}
      captionContent={<RiskCaption />}
      onMapReady={handleMapReady}
      getDistrictColor={getDistrictColor}
      onDistrictClick={handleDistrictClick}
      onMarkerClick={handleMarkerClick}
    />
  );
};