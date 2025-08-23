// Recovery Zone 지도 섹션 - 서울 구별 복구 현황을 색상으로 표시하는 지도
import { useEffect, useRef } from "react";
import { createD3SeoulMap } from "@shared/lib/SeoulMap/d3SeoulMap";
import { getRecoveryColor } from "../utils/recoveryColorResolver";
import { getRiskColorByDistrict } from "../utils/riskColorResolver";
import { processSeoulDistricts } from "../utils/districtProcessor";
import { fetchSeoulGeoJson } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { useSelectGrade } from "@entities/sinkhole/context";
import { useRecovery } from "../context/RecoveryContext";


interface MapSectionProps {
  colorMode?: "recovery" | "risk"; // 색상 모드 (복구 현황 vs 위험도)
  forceViewMode?: "grade" | "safezone"; // 강제로 viewMode 지정
}

export const MapSection = ({ colorMode = "recovery", forceViewMode }: MapSectionProps) => {
  // Recovery용 Context (colorMode가 recovery일 때만 사용)
  let selectedLocation = null;
  try {
    if (colorMode === "recovery") {
      const recoveryContext = useRecovery();
      selectedLocation = recoveryContext.selectedLocation;
    }
  } catch {
    // RecoveryContext가 없는 경우
    selectedLocation = null;
  }
  
  // Sinkhole용 Context (colorMode가 risk일 때만 사용)
  let selectedGradeData = null;
  let safezoneData = null;
  let viewMode = "grade";
  try {
    if (colorMode === "risk") {
      const sinkholeContext = useSelectGrade();
      selectedGradeData = sinkholeContext.selectedGradeData;
      safezoneData = sinkholeContext.safezoneData;
      viewMode = forceViewMode || sinkholeContext.viewMode;
    }
  } catch {
    // SinkholeContext가 없는 경우
    selectedGradeData = null;
    safezoneData = null;
    viewMode = "grade";
  }
  
  // D3 Map 인스턴스를 저장하는 ref
  const mapInstanceRef = useRef<any>(null);
  // 지도가 렌더링될 DOM 컨테이너 ref
  const containerRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 D3 서울 지도 초기화
  useEffect(() => {
    const initD3SeoulMap = async () => {
      try {
        // DOM 컨테이너가 준비되지 않은 경우 종료
        if (!containerRef.current) return;

        // 기존 맵 인스턴스 정리
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }

        // 컨테이너 초기화
        containerRef.current.innerHTML = '';

        // 컨테이너 크기 가져오기
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width || 800;
        const containerHeight = 241;

        // D3 서울 지도 생성
        const mapInstance = await createD3SeoulMap({
          width: containerWidth,
          height: containerHeight,
          container: containerRef.current,
          strokeColor: '#666',
          strokeWidth: 0.5,
          fillColor: '#e8f4fd',
          hoverColor: '#2196f3',
          enableZoom: false, // 정적 지도로 사용
          enableTooltip: true
        });

        // 지도 인스턴스를 ref에 저장
        mapInstanceRef.current = mapInstance;

        // 서울 행정구역 GeoJSON 데이터 로드 및 색상 적용
        try {
          const geoJsonData = await fetchSeoulGeoJson();
          
          // GeoJSON을 구별 데이터 객체로 변환
          const districtsData = processSeoulDistricts(geoJsonData);
          // console.log("서울 구별 데이터:", districtsData);

          // 색상 모드에 따라 구별 색상 결정
          const getDistrictColor = (feature: any) => {
            const name = feature.properties?.name || feature.properties?.SIG_KOR_NM || '';
            
            // 디버깅용 로그 (첫 번째 구역에서만 출력)
            if (name === '종로구') {
              console.log("MapSection Debug:", { colorMode, viewMode, safezoneDataLength: safezoneData?.items?.length || 0, forceViewMode });
            }
            
            // forceViewMode가 "safezone"인 경우 최우선으로 테스트 데이터 사용
            if (forceViewMode === "safezone") {
              console.log(`District ${name}: Using test data for safezone mode`);
              // 테스트: 강남구와 서초구만 G1, G2로 색칠
              if (name === "강남구") {
                return "#4CAF50"; // 1등급 - 초록색 (매우 안전)
              } else if (name === "서초구") {
                return "#8BC34A"; // 2등급 - 연한 초록색 (안전)
              } else {
                // 나머지는 회색으로 비활성화
                return "#E0E0E0";
              }
            }
            
            // Sinkhole 모드에서 안심존 데이터가 있는 경우
            if (colorMode === "risk" && viewMode === "safezone") {
              
              if (safezoneData && safezoneData.items.length > 0) {
                const safezoneItem = safezoneData.items.find(item => item.sigungu === name);
                if (safezoneItem) {
                  // 안심존 구는 final_grade에 따른 색상 표시
                  if (safezoneItem.final_grade === "G1") {
                    return "#4CAF50"; // 1등급 - 초록색 (매우 안전)
                  } else if (safezoneItem.final_grade === "G2") {
                    return "#8BC34A"; // 2등급 - 연한 초록색 (안전)
                  }
                  // fallback
                  return getRiskColorByDistrict(name, districtsData);
                } else {
                  // 안심존이 아닌 구는 회색으로 비활성화
                  return "#E0E0E0";
                }
              }
            }
            
            // Sinkhole 모드에서 선택된 등급 데이터가 있는 경우
            if (colorMode === "risk" && viewMode === "grade" && selectedGradeData && selectedGradeData.items.length > 0) {
              const isSelectedDistrict = selectedGradeData.items.some(item => item.sigungu === name);
              if (isSelectedDistrict) {
                // 선택된 구는 위험도에 맞는 색상 표시
                return getRiskColorByDistrict(name, districtsData);
              } else {
                // 선택되지 않은 구는 회색으로 비활성화
                return "#E0E0E0";
              }
            }
            
            // 기본 색상 모드 적용
            if (colorMode === "risk") {
              const color = getRiskColorByDistrict(name, districtsData);
              return color;
            } else {
              const color = getRecoveryColor(name);
              return color;
            }
          };

          // 지도 렌더링
          await mapInstance.render(geoJsonData);
          
          // 색상 적용
          mapInstance.setFillColor(getDistrictColor);
          
          // 구역 클릭 이벤트 리스너 추가
          containerRef.current.addEventListener('district-click', (event: any) => {
            const { district } = event.detail;
            console.log('클릭된 구:', district);
          });
          
          console.log("D3 서울 지도 렌더링 완료");
        } catch (geoError) {
          console.error("서울 지도 데이터 로드 실패:", geoError);
        }

        console.log("D3 서울 지도 초기화 완료");
      } catch (error) {
        console.error("D3 서울 지도 초기화 실패:", error);
      }
    };

    // 비동기 지도 초기화 실행
    initD3SeoulMap();

    // cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [selectedLocation, colorMode, selectedGradeData, safezoneData, viewMode, forceViewMode]); // 상태 변경 시 지도 재초기화

  return (
    <div 
      id="map" 
      ref={containerRef}
      style={{ height: "241px", width: "100%" }}
    >
      {/* 서울 25개 구의 복구 현황을 색상으로 표시하는 정적 지도 컨테이너 */}
    </div>
  );
};