// Recovery Zone 지도 섹션 - 서울 구별 복구 현황을 색상으로 표시하는 지도
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import { createD3SeoulMap } from "@shared/lib/SeoulMap/d3SeoulMap";
import {
  getRecoveryColor,
  loadRecoveryData,
  recoveryColors,
} from "../utils/recoveryColorResolver";
import { getRiskColorByDistrict } from "../utils/riskColorResolver";
import { processSeoulDistricts } from "../utils/districtProcessor";
import { fetchSeoulGeoJson } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { useSelectGrade } from "@entities/sinkhole/context";
import { useRecovery } from "../context/RecoveryContext";
import { getIncidents, type IncidentItem } from "@entities/recovery/incidents";
import {
  TEMP_REPAIRED_TEST_DATA,
  UNDER_REPAIR_TEST_DATA,
} from "../constants/testData";
import marker from "/images/icons/marker.png";

// 지도 캡션을 위한 styled component
interface MapCaptionProps {
  $isVisible: boolean;
}

const MapCaption = styled(BasicElement.Overlay)<MapCaptionProps>`
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none !important")};
  gap: 10px;
  padding: 4px 8px;
  font-size: 10px;
  color: #666;
  font-weight: 500;
`;

const CaptionContent = ({ color, title }: { color: string; title: string }) => {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      <img
        src={`/images/icons/${color}.svg`}
        alt="색상 캡션"
        style={{ width: "8px", height: "8px" }}
      />
      <div className="caption-title">{title}</div>
    </div>
  );
};

const RiskCaption = () => {
  console.log(
    "RiskCaption 렌더링됨 - 이 로그가 보이면 캡션이 화면에 표시되고 있는 것입니다."
  );
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

const RecoveryCaption = () => {
  return (
    <>
      <CaptionContent color="orange01" title="복구중" />
      <CaptionContent color="orange02" title="임시복구" />
      <CaptionContent color="orange04" title="복구완료" />
    </>
  );
};

interface MapSectionProps {
  colorMode?: "recovery" | "risk"; // 색상 모드 (복구 현황 vs 위험도)
  forceViewMode?: "grade" | "safezone"; // 강제로 viewMode 지정
  showIncidents?: boolean; // incidents 마커 표시 여부
  incidentStatuses?: ("UNDER_REPAIR" | "TEMP_REPAIRED" | "RECOVERED")[]; // 표시할 incident 상태
  id?: string; // 디버깅용 지도 식별자
}

export const MapSection = ({
  colorMode = "recovery",
  forceViewMode,
  id = "unknown",
}: MapSectionProps) => {
  // Recovery용 Context (colorMode가 recovery일 때만 사용)
  let selectedLocation = null;
  let selectedRecoveryStatus = "전체";
  let places: any[] = [];
  try {
    if (colorMode === "recovery") {
      const recoveryContext = useRecovery();
      selectedLocation = recoveryContext.selectedLocation;
      selectedRecoveryStatus = recoveryContext.selectedRecoveryStatus;
      places = recoveryContext.places;
    }
  } catch {
    // RecoveryContext가 없는 경우
    selectedLocation = null;
    selectedRecoveryStatus = "전체";
    places = [];
  }

  // Sinkhole용 Context (colorMode가 risk일 때만 사용)
  let selectedGradeData = null;
  let safezoneData = null;
  let viewMode = "grade";
  let isBadgeActive = false;
  try {
    if (colorMode === "risk") {
      const sinkholeContext = useSelectGrade();
      selectedGradeData = sinkholeContext.selectedGradeData;
      safezoneData = sinkholeContext.safezoneData;
      viewMode = forceViewMode || sinkholeContext.viewMode;
      isBadgeActive = sinkholeContext.isBadgeActive;
    }
  } catch {
    // SinkholeContext가 없는 경우
    selectedGradeData = null;
    safezoneData = null;
    viewMode = "grade";
    isBadgeActive = false;
  }

  // D3 Map 인스턴스를 저장하는 ref
  const mapInstanceRef = useRef<any>(null);
  // 지도가 렌더링될 DOM 컨테이너 ref
  const containerRef = useRef<HTMLDivElement>(null);
  // incidents 데이터 상태
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  // 캡션 표시 여부 상태
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);

  // 필터 선택 여부에 따라 캡션 표시 제어
  useEffect(() => {
    // 뱃지 모드(안심존)일 때만 캡션 숨김
    setIsCaptionVisible(false);
  }, [isBadgeActive]);

  // incidents 데이터 로드 - 복구 현황 필터에 따라 자동으로 마커 표시
  useEffect(() => {
    const shouldShowIncidents =
      colorMode === "recovery" &&
      (selectedRecoveryStatus === "임시복구" ||
        selectedRecoveryStatus === "복구중" ||
        selectedRecoveryStatus === "복구완료");

    if (shouldShowIncidents) {
      const fetchIncidents = async () => {
        try {
          let status: "TEMP_REPAIRED" | "UNDER_REPAIR" | "RECOVERED";
          let testData: any[];

          if (selectedRecoveryStatus === "임시복구") {
            status = "TEMP_REPAIRED";
            testData = TEMP_REPAIRED_TEST_DATA;
          } else if (selectedRecoveryStatus === "복구중") {
            status = "UNDER_REPAIR";
            testData = UNDER_REPAIR_TEST_DATA;
          } else {
            // 복구완료
            status = "RECOVERED";
            // 복구완료 테스트 데이터 (testData.ts에 없으므로 임시 생성)
            testData = [
              {
                id: 6,
                occurred_at: "2024-07-01",
                address: "서울특별시 종로구 종로 111",
                lat: 37.5703,
                lng: 126.977,
                cause: "지하수 누수",
                method: "완전 복구",
                status: "RECOVERED" as const,
                images_count: 2,
                distance_m: 50,
              },
              {
                id: 7,
                occurred_at: "2024-06-20",
                address: "서울특별시 영등포구 여의도동 222",
                lat: 37.5219,
                lng: 126.9245,
                cause: "도로 침하",
                method: "완전 복구",
                status: "RECOVERED" as const,
                images_count: 1,
                distance_m: 80,
              },
            ];
          }

          const response = await getIncidents([status]);
          if (response?.data?.items && response.data.items.length > 0) {
            setIncidents(response.data.items);
          } else {
            // API 데이터가 없으면 테스트 데이터 사용
            setIncidents(testData);
          }
        } catch (error) {
          console.error(
            "Incidents 데이터 로드 실패, 테스트 데이터 사용:",
            error
          );
          // API 호출 실패시 테스트 데이터 사용
          let testData: any[];
          if (selectedRecoveryStatus === "임시복구") {
            testData = TEMP_REPAIRED_TEST_DATA;
          } else if (selectedRecoveryStatus === "복구중") {
            testData = UNDER_REPAIR_TEST_DATA;
          } else {
            // 복구완료
            testData = [
              {
                id: 6,
                occurred_at: "2024-07-01",
                address: "서울특별시 종로구 종로 111",
                lat: 37.5703,
                lng: 126.977,
                cause: "지하수 누수",
                method: "완전 복구",
                status: "RECOVERED" as const,
                images_count: 2,
                distance_m: 50,
              },
            ];
          }
          setIncidents(testData);
        }
      };
      fetchIncidents();
    } else {
      setIncidents([]);
    }
  }, [colorMode, selectedRecoveryStatus]);

  // 컴포넌트 마운트 시 D3 서울 지도 초기화
  useEffect(() => {
    const initD3SeoulMap = async () => {
      try {
        // DOM 컨테이너가 준비되지 않은 경우 종료
        if (!containerRef.current) return;

        // Recovery 모드일 때 API 데이터 로드
        if (colorMode === "recovery") {
          await loadRecoveryData();
        }

        // 기존 맵 인스턴스 정리
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }

        // 컨테이너 초기화
        containerRef.current.innerHTML = "";

        // 컨테이너 크기 가져오기
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width || 800;
        const containerHeight = 241;

        // D3 서울 지도 생성
        const mapInstance = await createD3SeoulMap({
          width: containerWidth,
          height: containerHeight,
          container: containerRef.current,
          strokeColor: "#666",
          strokeWidth: 0.5,
          fillColor: "#e8f4fd",
          hoverColor: "#2196f3",
          enableZoom: false, // 정적 지도로 사용
          enableTooltip: true,
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
            const name =
              feature.properties?.name || feature.properties?.SIG_KOR_NM || "";

            // 디버깅용 로그 (첫 번째 구역에서만 출력)
            if (name === "종로구") {
              console.log("MapSection Debug:", {
                colorMode,
                viewMode,
                selectedRecoveryStatus,
                incidentsLength: incidents.length,
              });
            }

            // Recovery 모드에서 복구중/임시복구/복구완료 필터가 선택된 경우 해당 지역만 색칠
            if (
              colorMode === "recovery" &&
              (selectedRecoveryStatus === "임시복구" ||
                selectedRecoveryStatus === "복구중" ||
                selectedRecoveryStatus === "복구완료")
            ) {
              let hasDataInDistrict = false;

              if (selectedRecoveryStatus === "복구완료") {
                // 복구완료일 때는 places 데이터로 확인 - 마커가 있는 모든 구역 색칠
                hasDataInDistrict = places.some((place) => {
                  const addressParts = place.address.split(" ");
                  const district = addressParts.find((part: string) =>
                    part.endsWith("구")
                  );
                  return district === name;
                });
              } else {
                // 임시복구/복구중일 때는 incidents 데이터로 확인
                hasDataInDistrict = incidents.some((incident) => {
                  const addressParts = incident.address.split(" ");
                  const district = addressParts.find((part: string) =>
                    part.endsWith("구")
                  );
                  return district === name;
                });
              }

              if (hasDataInDistrict) {
                // 해당 구에 데이터가 있으면 recoveryColorResolver의 색상 사용
                let statusColor;
                if (selectedRecoveryStatus === "임시복구") {
                  statusColor = recoveryColors["임시복구"];
                } else if (selectedRecoveryStatus === "복구중") {
                  statusColor = recoveryColors["복구중"];
                } else {
                  // 복구완료
                  statusColor = recoveryColors["복구완료"];
                }
                return statusColor;
              } else {
                // 데이터가 없는 구는 회색으로 비활성화 (opacity 0.7 적용)
                return "rgba(224, 224, 224, 0.7)";
              }
            }

            // forceViewMode가 "safezone"인 경우 최우선으로 테스트 데이터 사용
            if (forceViewMode === "safezone") {
              console.log(
                `District ${name}: Using test data for safezone mode`
              );
              // 테스트: 강남구와 서초구만 G1, G2로 색칠 (opacity 0.7 적용)
              if (name === "강남구") {
                return "rgba(76, 175, 80, 0.7)"; // 1등급 - 초록색 (매우 안전)
              } else if (name === "서초구") {
                return "rgba(139, 195, 74, 0.7)"; // 2등급 - 연한 초록색 (안전)
              } else {
                // 나머지는 회색으로 비활성화 (opacity 0.7 적용)
                return "rgba(224, 224, 224, 0.7)";
              }
            }

            // Sinkhole 모드에서 안심존 데이터가 있는 경우
            if (colorMode === "risk" && viewMode === "safezone") {
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
                  // fallback
                  return getRiskColorByDistrict(name, districtsData);
                } else {
                  // 안심존이 아닌 구는 회색으로 비활성화 (opacity 0.7 적용)
                  return "rgba(224, 224, 224, 0.7)";
                }
              }
            }

            // Sinkhole 모드에서 선택된 등급 데이터가 있는 경우
            if (
              colorMode === "risk" &&
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

          // 지도 렌더링 후 즉시 마커 추가
          const svg = mapInstance.svg;

          // 아무 필터도 선택하지 않았을 때 (전체) 현재 위치 표시
          if (selectedRecoveryStatus === "전체" && selectedLocation) {
            console.log("현재 위치 표시:", selectedLocation);
            const [x, y] = mapInstance.projection([
              selectedLocation.lng,
              selectedLocation.lat,
            ]) || [0, 0];

            // 빨간색 원형 점으로 현재 위치 표시 (SafeRouteMap의 drawMyLocationDot과 동일한 스타일)
            svg
              .append("circle")
              .attr("class", "current-location-dot")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 8) // 16px을 반지름 8로 변환
              .attr("fill", "#FF7765")
              .attr("stroke", "#fff6f0")
              .attr("stroke-width", 4)
              .style(
                "filter",
                "drop-shadow(0 0 5px rgba(255, 119, 101, 0.30))"
              );

            console.log(`현재 위치 점 추가됨: x=${x}, y=${y}`);
          }

          // 현재 incidents 데이터가 있으면 즉시 마커 추가
          if (incidents.length > 0) {
            console.log("지도 렌더링 후 즉시 마커 추가:", incidents);
            incidents.forEach((incident, index) => {
              const [x, y] = mapInstance.projection([
                incident.lng,
                incident.lat,
              ]) || [0, 0];
              console.log(
                `즉시 마커 ${index}: lat=${incident.lat}, lng=${incident.lng}, x=${x}, y=${y}`
              );

              const testX =
                x > 0 && x < containerWidth ? x : containerWidth / 2;
              const testY =
                y > 0 && y < containerHeight ? y : containerHeight / 2;

              svg
                .append("image")
                .attr("class", "immediate-marker")
                .attr("x", testX - 6.4) // 중앙 정렬을 위해 width/2만큼 왼쪽으로
                .attr("y", testY - 16) // 마커의 끝점이 위치를 가리키도록 height만큼 위로
                .attr("width", 12.8)
                .attr("height", 16)
                .attr("href", marker)
                .style("opacity", "1")
                .style("cursor", "pointer");

              console.log(`즉시 마커 추가됨: x=${testX}, y=${testY}`);
            });
          }

          // places 데이터가 있으면 즉시 마커 추가 (복구완료 필터만)
          if (places.length > 0 && selectedRecoveryStatus === "복구완료") {
            console.log("지도 렌더링 후 즉시 places 마커 추가:", places);
            places.forEach((place, index) => {
              const [x, y] = mapInstance.projection([place.lng, place.lat]) || [
                0, 0,
              ];
              console.log(
                `즉시 places 마커 ${index}: lat=${place.lat}, lng=${place.lng}, x=${x}, y=${y}`
              );

              const testX =
                x > 0 && x < containerWidth ? x : containerWidth / 2;
              const testY =
                y > 0 && y < containerHeight ? y : containerHeight / 2;

              svg
                .append("image")
                .attr("class", "immediate-place-marker")
                .attr("x", testX - 6.4) // 중앙 정렬을 위해 width/2만큼 왼쪽으로
                .attr("y", testY - 16) // 마커의 끝점이 위치를 가리키도록 height만큼 위로
                .attr("width", 12.8)
                .attr("height", 16)
                .attr("href", marker)
                .style("opacity", "1")
                .style("cursor", "pointer");

              console.log(`즉시 places 마커 추가됨: x=${testX}, y=${testY}`);
            });
          }

          // 구역 클릭 이벤트 리스너 추가
          containerRef.current.addEventListener(
            "district-click",
            (event: any) => {
              const { district } = event.detail;
              console.log("클릭된 구:", district);
            }
          );

          // 마커 클릭 이벤트 리스너 추가
          containerRef.current.addEventListener(
            "marker-click",
            (event: any) => {
              const { marker } = event.detail;
              console.log("클릭된 마커:", marker);
            }
          );

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
  }, [
    selectedLocation,
    colorMode,
    selectedGradeData,
    safezoneData,
    viewMode,
    forceViewMode,
    selectedRecoveryStatus,
    incidents,
    places,
  ]); // 상태 변경 시 지도 재초기화

  return (
    <div style={{ position: "relative", height: "241px", width: "100%" }}>
      <div
        id="map"
        ref={containerRef}
        style={{ height: "241px", width: "100%" }}
      >
        {/* 서울 25개 구의 복구 현황을 색상으로 표시하는 정적 지도 컨테이너 */}
      </div>

      {/* 지도 캡션 - 오른쪽 아래 (필터 선택 시 숨김) */}
      <MapCaption
        $position="absolute"
        $bottom={-30}
        $right={0}
        $backgroundColor="transparent"
        $isVisible={isCaptionVisible}
      >
        {(() => {
          console.log(`[${id}] 캡션 표시:`, {
            isBadgeActive,
            selectedGradeData: selectedGradeData?.items?.length,
            forceViewMode,
            isVisible: isCaptionVisible,
          });
          return null;
        })()}
        {colorMode === "recovery" ? <RecoveryCaption /> : <RiskCaption />}
      </MapCaption>
    </div>
  );
};
