// Recovery Zone 지도 섹션 - 서울 구별 복구 현황을 색상으로 표시하는 지도
import { useEffect, useState } from "react";
import { BaseMapSection, CaptionContent } from "@shared/components/BaseMapSection";
import {
  getRecoveryColor,
  loadRecoveryData,
  recoveryColors,
} from "../utils/recoveryColorResolver";
import { useRecovery } from "../context/RecoveryContext";
import { getIncidents, type IncidentItem } from "@entities/recovery/incidents";
import {
  TEMP_REPAIRED_TEST_DATA,
  UNDER_REPAIR_TEST_DATA,
} from "../constants/testData";
import marker from "/images/icons/marker.png";

const RecoveryCaption = () => {
  return (
    <>
      <CaptionContent color="orange01" title="복구중" />
      <CaptionContent color="orange02" title="임시복구" />
      <CaptionContent color="orange04" title="복구완료" />
    </>
  );
};

export const RecoveryMapSection = () => {
  // Recovery Context
  const { selectedLocation, selectedRecoveryStatus, places } = useRecovery();
  
  // incidents 데이터 상태
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  
  // 지도 인스턴스와 데이터를 저장
  const [mapData, setMapData] = useState<{
    mapInstance: any;
    geoJsonData: any;
    districtsData: any;
  } | null>(null);

  // incidents 데이터 로드 - 복구 현황 필터에 따라 자동으로 마커 표시
  useEffect(() => {
    const shouldShowIncidents =
      selectedRecoveryStatus === "임시복구" ||
      selectedRecoveryStatus === "복구중" ||
      selectedRecoveryStatus === "복구완료";

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

          const response = await getIncidents({ statuses: [status] });
          if (response?.data?.items && response.data.items.length > 0) {
            setIncidents(response.data.items);
          } else {
            // API 데이터가 없으면 테스트 데이터 사용
            setIncidents(testData);
          }
        } catch (error) {
          console.error("Incidents 데이터 로드 실패, 테스트 데이터 사용:", error);
          // API 호출 실패시 테스트 데이터 사용
          let testData: any[];
          if (selectedRecoveryStatus === "임시복구") {
            testData = TEMP_REPAIRED_TEST_DATA;
          } else if (selectedRecoveryStatus === "복구중") {
            testData = UNDER_REPAIR_TEST_DATA;
          } else {
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
  }, [selectedRecoveryStatus]);

  // 지도 준비 완료 시 호출
  const handleMapReady = async (mapInstance: any, geoJsonData: any, districtsData: any) => {
    // Recovery 모드 데이터 로드
    await loadRecoveryData();
    
    setMapData({ mapInstance, geoJsonData, districtsData });
  };

  // 마커 추가 및 업데이트
  useEffect(() => {
    if (!mapData || !mapData.mapInstance || !mapData.mapInstance.container) return;
    
    const { mapInstance } = mapData;
    const svg = mapInstance.svg;
    const containerRect = mapInstance.container.getBoundingClientRect();
    const containerWidth = containerRect.width || 800;
    const containerHeight = 241;

    // 기존 마커들 제거
    svg.selectAll(".current-location-dot").remove();
    svg.selectAll(".immediate-marker").remove();
    svg.selectAll(".immediate-place-marker").remove();

    // 아무 필터도 선택하지 않았을 때 (전체) 현재 위치 표시
    if (selectedRecoveryStatus === "전체" && selectedLocation) {
      console.log("현재 위치 표시:", selectedLocation);
      const [x, y] = mapInstance.projection([
        selectedLocation.lng,
        selectedLocation.lat,
      ]) || [0, 0];

      svg
        .append("circle")
        .attr("class", "current-location-dot")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", "#FF7765")
        .attr("stroke", "#fff6f0")
        .attr("stroke-width", 4)
        .style("filter", "drop-shadow(0 0 5px rgba(255, 119, 101, 0.30))");

      console.log(`현재 위치 점 추가됨: x=${x}, y=${y}`);
    }

    // incidents 마커 추가
    if (incidents.length > 0) {
      console.log("마커 추가:", incidents);
      incidents.forEach((incident) => {
        const [x, y] = mapInstance.projection([incident.lng, incident.lat]) || [0, 0];
        
        const testX = x > 0 && x < containerWidth ? x : containerWidth / 2;
        const testY = y > 0 && y < containerHeight ? y : containerHeight / 2;

        svg
          .append("image")
          .attr("class", "immediate-marker")
          .attr("x", testX - 6.4)
          .attr("y", testY - 16)
          .attr("width", 12.8)
          .attr("height", 16)
          .attr("href", marker)
          .style("opacity", "1")
          .style("cursor", "pointer");

        console.log(`마커 추가됨: x=${testX}, y=${testY}`);
      });
    }

    // places 마커 추가 (복구완료 필터만)
    if (places.length > 0 && selectedRecoveryStatus === "복구완료") {
      console.log("places 마커 추가:", places);
      places.forEach((place) => {
        const [x, y] = mapInstance.projection([place.lng, place.lat]) || [0, 0];
        
        const testX = x > 0 && x < containerWidth ? x : containerWidth / 2;
        const testY = y > 0 && y < containerHeight ? y : containerHeight / 2;

        svg
          .append("image")
          .attr("class", "immediate-place-marker")
          .attr("x", testX - 6.4)
          .attr("y", testY - 16)
          .attr("width", 12.8)
          .attr("height", 16)
          .attr("href", marker)
          .style("opacity", "1")
          .style("cursor", "pointer");

        console.log(`places 마커 추가됨: x=${testX}, y=${testY}`);
      });
    }
  }, [mapData, incidents, places, selectedLocation, selectedRecoveryStatus]);

  // 구별 색상 결정 함수
  const getDistrictColor = (feature: any) => {
    const name = feature.properties?.name || feature.properties?.SIG_KOR_NM || "";

    // Recovery 모드에서 복구중/임시복구/복구완료 필터가 선택된 경우 해당 지역만 색칠
    if (
      selectedRecoveryStatus === "임시복구" ||
      selectedRecoveryStatus === "복구중" ||
      selectedRecoveryStatus === "복구완료"
    ) {
      let hasDataInDistrict = false;

      if (selectedRecoveryStatus === "복구완료") {
        // 복구완료일 때는 places 데이터로 확인 - 마커가 있는 모든 구역 색칠
        hasDataInDistrict = places.some((place) => {
          const addressParts = place.address.split(" ");
          const district = addressParts.find((part: string) => part.endsWith("구"));
          return district === name;
        });
      } else {
        // 임시복구/복구중일 때는 incidents 데이터로 확인
        hasDataInDistrict = incidents.some((incident) => {
          const addressParts = incident.address.split(" ");
          const district = addressParts.find((part: string) => part.endsWith("구"));
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

    // 기본 복구 색상 적용
    return getRecoveryColor(name);
  };

  const handleDistrictClick = (district: string) => {
    console.log("클릭된 구:", district);
  };

  const handleMarkerClick = (marker: any) => {
    console.log("클릭된 마커:", marker);
  };

  return (
    <BaseMapSection
      id="recovery-map"
      showCaption={true}
      captionContent={<RecoveryCaption />}
      onMapReady={handleMapReady}
      getDistrictColor={getDistrictColor}
      onDistrictClick={handleDistrictClick}
      onMarkerClick={handleMarkerClick}
    />
  );
};