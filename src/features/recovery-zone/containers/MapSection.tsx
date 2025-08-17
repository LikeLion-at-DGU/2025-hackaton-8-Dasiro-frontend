// Recovery Zone 지도 섹션 - 서울 구별 복구 현황을 색상으로 표시하는 지도
import { useEffect, useRef } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { fetchSeoulGeoJson, type FC } from "@shared/lib/SeoulMap/SeoulGeoJson";
import { renderSeoulMask } from "@shared/lib/SeoulMap/renderSeoulMask";
import { renderDistrictPolygons } from "@shared/lib/SeoulMap/renderDistrictPolygons";
import { getRecoveryColor } from "../utils/recoveryColorResolver";

export const MapSection = () => {
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

        // 서울 전체 중심 좌표 (서울의 지리적 중심점)
        const seoulCenter = new (window as any).kakao.maps.LatLng(37.5518, 126.9917);
        
        // Kakao Map 인스턴스 생성 - 서울 전체가 보이도록 설정
        const kakao = (window as any).kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: seoulCenter,
          level: 10, // 서울 전체가 한 화면에 들어오는 줌 레벨
        });

        // 지도 상호작용 완전 비활성화 (정적 지도로 사용)
        map.setDraggable(false);    // 드래그(이동) 비활성화
        map.setZoomable(false);     // 줌(확대/축소) 비활성화
        
        // 줌 레벨 변경 시 강제로 원래 레벨로 복원
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          map.setLevel(10); // 줌 레벨을 강제로 10으로 고정
        });
        
        // 중심 좌표 변경 시 강제로 서울 중심으로 복원
        kakao.maps.event.addListener(map, 'center_changed', function() {
          map.setCenter(seoulCenter); // 중심을 강제로 서울 중심으로 고정
        });

        // 지도 인스턴스를 ref에 저장
        mapRef.current = map;

        // 서울 행정구역 GeoJSON 데이터 로드 및 복구 현황 시각화
        try {
          const geoJsonData: FC = await fetchSeoulGeoJson();
          
          // 서울 외부 지역 마스킹 처리 (서울 경계만 표시)
          renderSeoulMask(kakao, map, geoJsonData);
          
          // 각 구별 복구 현황에 따른 색상 폴리곤 렌더링
          // getRecoveryColor 함수가 구 이름에 따라 복구 상태별 색상 반환
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

    // 비동기 지도 초기화 실행
    initSeoulMap();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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