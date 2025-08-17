import { useEffect, useRef } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { fetchSeoulGeoJson, type FC } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { renderSeoulMask } from "@shared/lib/SeoulMap/renderSeoulMask";
import { renderDistrictPolygons } from "@shared/lib/SeoulMap/renderDistrictPolygons";
import { getRecoveryColor } from "../utils/recoveryColorResolver";

export const MapSection = () => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSeoulMap = async () => {
      try {
        // Kakao Map API 로드
        const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
        if (!kakaoApiKey) {
          console.error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
          return;
        }

        await loadKakaoMaps(kakaoApiKey);
        
        if (!containerRef.current) return;

        // 서울 전체 중심 좌표 (서울의 지리적 중심)
        const seoulCenter = new (window as any).kakao.maps.LatLng(37.5518, 126.9917);
        
        // 지도 생성 - 서울 전체가 보이도록 레벨 설정
        const kakao = (window as any).kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: seoulCenter,
          level: 10, // 서울 전체가 한 화면에 들어오는 줌 레벨
        });

        // 지도 상호작용 비활성화
        map.setDraggable(false);    // 드래그(이동) 비활성화
        map.setZoomable(false);     // 줌(확대/축소) 비활성화
        
        // 마우스 이벤트 비활성화
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          map.setLevel(10); // 줌 레벨을 강제로 10으로 고정
        });
        
        // 중심 좌표 고정
        kakao.maps.event.addListener(map, 'center_changed', function() {
          map.setCenter(seoulCenter); // 중심을 강제로 서울 중심으로 고정
        });

        mapRef.current = map;

        // 서울 GeoJSON 데이터 가져오기 및 경계 렌더링
        try {
          const geoJsonData: FC = await fetchSeoulGeoJson();
          
          // 서울 외부 지역을 마스킹 (서울만 보이도록)
          renderSeoulMask(kakao, map, geoJsonData);
          
          // 서울 구역별 복구 현황 색상 표시
          renderDistrictPolygons(kakao, map, geoJsonData, ({ name }) => {
            return getRecoveryColor(name);
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

    initSeoulMap();
  }, []);

  return (
    <div 
      id="map" 
      ref={containerRef}
      style={{ height: "241px", width: "100%" }}
    >
      {/* 서울 지역 Kakao Map */}
    </div>
  );
};