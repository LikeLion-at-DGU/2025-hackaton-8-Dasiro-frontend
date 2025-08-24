// Base Map Section - 서울 GeoJson 로딩과 지도 초기화를 담당하는 공통 컴포넌트
import { useEffect, useRef } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import { createD3SeoulMap } from "@shared/lib/SeoulMap/d3SeoulMap";
import { fetchSeoulGeoJson } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { processSeoulDistricts } from "@features/recovery-zone/utils/districtProcessor";

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

export interface BaseMapSectionProps {
  id?: string;
  showCaption?: boolean;
  captionContent?: React.ReactNode;
  onMapReady?: (mapInstance: any, geoJsonData: any, districtsData: any) => void;
  getDistrictColor?: (feature: any, districtsData: any) => string;
  onDistrictClick?: (district: string) => void;
  onMarkerClick?: (marker: any) => void;
}

export const BaseMapSection = ({
  showCaption = true,
  captionContent,
  onMapReady,
  getDistrictColor,
  onDistrictClick,
  onMarkerClick,
}: BaseMapSectionProps) => {
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

          // 지도 렌더링
          await mapInstance.render(geoJsonData);

          // 색상 적용 (상위 컴포넌트에서 제공한 함수 사용)
          if (getDistrictColor) {
            mapInstance.setFillColor((feature: any) => 
              getDistrictColor(feature, districtsData)
            );
          }

          // 구역 클릭 이벤트 리스너 추가
          if (onDistrictClick) {
            containerRef.current.addEventListener(
              "district-click",
              (event: any) => {
                const { district } = event.detail;
                onDistrictClick(district);
              }
            );
          }

          // 마커 클릭 이벤트 리스너 추가
          if (onMarkerClick) {
            containerRef.current.addEventListener(
              "marker-click",
              (event: any) => {
                const { marker } = event.detail;
                onMarkerClick(marker);
              }
            );
          }

          // 상위 컴포넌트에 지도 준비 완료 알림
          if (onMapReady) {
            onMapReady(mapInstance, geoJsonData, districtsData);
          }

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
  }, []); // 최초 한번만 초기화

  return (
    <div style={{ position: "relative", height: "241px", width: "100%" }}>
      <div
        id="map"
        ref={containerRef}
        style={{ height: "241px", width: "100%" }}
      >
        {/* 서울 25개 구의 현황을 색상으로 표시하는 정적 지도 컨테이너 */}
      </div>

      {/* 지도 캡션 - 오른쪽 아래 */}
      {showCaption && captionContent && (
        <MapCaption
          $position="absolute"
          $bottom={-30}
          $right={0}
          $backgroundColor="transparent"
          $isVisible={showCaption}
        >
          {captionContent}
        </MapCaption>
      )}
    </div>
  );
};

export { CaptionContent };