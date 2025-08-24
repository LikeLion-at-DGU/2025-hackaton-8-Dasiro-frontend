// Sinkhole Map 섹션 - 서울 구별 싱크홀 위험도를 색상으로 표시하는 지도
import { useEffect, useState } from "react";
import { BaseMapSection, CaptionContent } from "@shared/components/BaseMapSection";
import { getRiskColorByDistrict } from "@features/sinkhole-map/utils/riskColorResolver";
import { SAFEZONE_TEST_DATA } from "@features/sinkhole-map/constants";
import { useSelectGrade } from "@entities/sinkhole/context";


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

    // forceViewMode가 "safezone"인 경우 최우선으로 테스트 데이터 사용
    if (forceViewMode === "safezone") {
      console.log(`District ${name}: Using test data for safezone mode`);
      const testItem = SAFEZONE_TEST_DATA.find((item) => item.sigungu === name);
      if (testItem) {
        if (testItem.final_grade === "G1") {
          return "rgba(76, 175, 80, 0.7)"; // 1등급 - 초록색 (매우 안전)
        } else if (testItem.final_grade === "G2") {
          return "rgba(139, 195, 74, 0.7)"; // 2등급 - 연한 초록색 (안전)
        }
      }
      // 나머지는 회색으로 비활성화 (opacity 0.7 적용)
      return "rgba(224, 224, 224, 0.7)";
    }

    // 안심존 데이터가 있는 경우
    if (viewMode === "safezone") {
      if (safezoneData && safezoneData.items.length > 0) {
        const safezoneItem = safezoneData.items.find(
          (item) => item.sigungu === name
        );
        if (safezoneItem) {
          // 안심존 구는 final_grade에 따른 색상 표시 (opacity 0.7 적용)
          if (safezoneItem.final_grade === "G1") {
            return "rgba(76, 175, 80, 0.7)"; // 1등급 - 초록색 (매우 안전)
          } else if (safezoneItem.final_grade === "G2") {
            return "rgba(139, 195, 74, 0.7)"; // 2등급 - 연한 초록색 (안전)
          }
          // 정의되지 않은 등급은 회색으로 표시
          return "rgba(224, 224, 224, 0.7)";
        } else {
          // 안심존이 아닌 구는 회색으로 비활성화 (opacity 0.7 적용)
          return "rgba(224, 224, 224, 0.7)";
        }
      }
    }

    // 선택된 등급 데이터가 있는 경우
    if (
      viewMode === "grade" &&
      selectedGradeData &&
      selectedGradeData.items.length > 0
    ) {
      const isSelectedDistrict = selectedGradeData.items.some(
        (item) => item.sigungu === name
      );
      if (isSelectedDistrict) {
        // 선택된 구는 위험도에 맞는 색상 표시
        return getRiskColorByDistrict(name, districtsData);
      } else {
        // 선택되지 않은 구는 회색으로 비활성화 (opacity 0.7 적용)
        return "rgba(224, 224, 224, 0.7)";
      }
    }

    // 기본 위험도 색상 적용
    return getRiskColorByDistrict(name, districtsData);
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
      getDistrictColor={getDistrictColor}
      onDistrictClick={handleDistrictClick}
      onMarkerClick={handleMarkerClick}
    />
  );
};