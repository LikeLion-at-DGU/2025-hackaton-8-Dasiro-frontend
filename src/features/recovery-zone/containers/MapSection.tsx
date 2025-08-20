// Recovery Zone 지도 섹션 - 서울 구별 복구 현황을 색상으로 표시하는 지도
import { useEffect, useRef } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { fetchSeoulGeoJson, type FC } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { renderSeoulMask } from "@shared/lib/SeoulMap/renderSeoulMask";
import { renderDistrictPolygons } from "@shared/lib/SeoulMap/renderDistrictPolygons";
import { getRecoveryColor } from "../utils/recoveryColorResolver";
import { getRiskColorByDistrict } from "../utils/riskColorResolver";
import { processSeoulDistricts } from "../utils/districtProcessor";

// 서울 경계 좌표 (대략적인 경계)
const SEOUL_BOUNDS = {
  north: 37.715133,
  south: 37.413294,
  east: 127.269311,
  west: 126.734086
};

// 위치가 서울 내부에 있는지 확인하는 함수
const isWithinSeoul = (lat: number, lng: number): boolean => {
  return lat >= SEOUL_BOUNDS.south && 
         lat <= SEOUL_BOUNDS.north && 
         lng >= SEOUL_BOUNDS.west && 
         lng <= SEOUL_BOUNDS.east;
};

interface MapSectionProps {
  selectedLocation?: { lat: number; lng: number; address: string } | null;
  colorMode?: "recovery" | "risk"; // 색상 모드 (복구 현황 vs 위험도)
}

export const MapSection = ({ selectedLocation, colorMode = "recovery" }: MapSectionProps) => {
  // Kakao Map 인스턴스를 저장하는 ref
  const mapRef = useRef<any>(null);
  // 지도가 렌더링될 DOM 컨테이너 ref
  const containerRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 서울 지도 초기화
  useEffect(() => {
    const initSeoulMap = async () => {
      try {
        // 환경변수에서 Kakao Map API 키 가져오기
        const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
        if (!kakaoApiKey) {
          console.error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
          return;
        }

        // Kakao Maps API 동적 로드
        await loadKakaoMaps(kakaoApiKey);
        
        // DOM 컨테이너가 준비되지 않은 경우 종료
        if (!containerRef.current) return;

        // 서울 전체 중심 좌표 (항상 고정)
        const seoulCenter = new (window as any).kakao.maps.LatLng(37.5518, 126.9917);
        
        // Kakao Map 인스턴스 생성 - 항상 서울 전체 보기
        const kakao = (window as any).kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: seoulCenter,
          level: 10, // 항상 서울 전체가 보이는 줌 레벨로 고정
        });

        // 지도 상호작용 완전 비활성화 (정적 지도로 사용)
        map.setDraggable(false);    // 드래그(이동) 비활성화
        map.setZoomable(false);     // 줌(확대/축소) 비활성화
        
        // 줌 레벨 변경 시 강제로 원래 레벨로 복원
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          map.setLevel(10); // 줌 레벨을 항상 10으로 고정
        });
        
        // 중심 좌표 변경 시 강제로 서울 중심으로 복원
        kakao.maps.event.addListener(map, 'center_changed', function() {
          map.setCenter(seoulCenter); // 중심을 서울 중심으로 고정
        });

        // 지도 인스턴스를 ref에 저장
        mapRef.current = map;

        // 선택된 위치에 마커 추가 (서울 내부인 경우만)
        if (selectedLocation && isWithinSeoul(selectedLocation.lat, selectedLocation.lng)) {
          const markerPosition = new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map
          });
          
          console.log("선택된 위치에 마커 추가:", selectedLocation.address);
        } else{
          console.log("선택된 위치가 서울 내부가 아닙니다.");
        }

        // 서울 행정구역 GeoJSON 데이터 로드 및 복구 현황 시각화
        try {
          const geoJsonData: FC = await fetchSeoulGeoJson();
          
          // GeoJSON을 구별 데이터 객체로 변환
          const districtsData = processSeoulDistricts(geoJsonData);
          console.log("서울 구별 데이터:", districtsData);
          
          // 서울 외부 지역 마스킹 처리 (서울 경계만 표시)
          renderSeoulMask(kakao, map, geoJsonData);
          
          // 색상 모드에 따라 구별 색상 결정
          const getDistrictColor = (name: string) => {
            console.log(`색상 모드: ${colorMode}, 구: ${name}`);
            if (colorMode === "risk") {
              const color = getRiskColorByDistrict(name, districtsData);
              console.log(`${name} 위험도 색상: ${color}`);
              return color;
            } else {
              const color = getRecoveryColor(name);
              console.log(`${name} 복구 색상: ${color}`);
              return color;
            }
          };

          // 각 구별 색상에 따른 폴리곤 렌더링
          renderDistrictPolygons(kakao, map, geoJsonData, ({ name }) => {
            return getDistrictColor(name || "");
          });
          
          console.log("서울 경계 및 복구 현황 렌더링 완료");
        } catch (geoError) {
          console.error("서울 경계 렌더링 실패:", geoError);
        }

        console.log("서울 지역 지도 초기화 완료");
      } catch (error) {
        console.error("서울 지도 초기화 실패:", error);
      }
    };

    // 비동기 지도 초기화 실행
    initSeoulMap();
  }, [selectedLocation, colorMode]); // selectedLocation, colorMode 변경 시 지도 재초기화

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