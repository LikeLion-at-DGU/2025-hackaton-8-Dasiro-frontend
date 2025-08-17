import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { getNowLocation } from "@features/safe-route/lib/getLocation";
import { createDasiroPin } from "@shared/components/LocationPin";
import styled from "styled-components";

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
`;

type Props = {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  isVisible?: boolean; // 모달이 보이는지 여부
};

export const LocationPickerMap = ({ onLocationSelect, isVisible = true }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("LocationPickerMap useEffect 실행됨, isVisible:", isVisible);
    
    // 모달이 보이지 않으면 지도를 초기화하지 않음
    if (!isVisible) {
      console.log("모달이 보이지 않아 지도 초기화하지 않음");
      return;
    }

    const initMap = async () => {
      console.log("지도 초기화 시작");
      setIsLoading(true);
      setError(null);

      try {
        console.log("kakao map API 로드 시작");
        
        // Kakao Map API 로드
        const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
        console.log("사용할 API 키:", kakaoApiKey ? "키 존재" : "키 없음");
        
        if (!kakaoApiKey) {
          throw new Error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
        }
        
        await loadKakaoMaps(kakaoApiKey);
        console.log("kakao map API 로드 성공");
        
        // containerRef가 준비될 때까지 최대 1초 기다림
        let retries = 10;
        while (!containerRef.current && retries > 0) {
          console.log(`containerRef 대기 중... 남은 시도: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          retries--;
        }
        
        if (!containerRef.current) {
          console.log("containerRef.current를 찾을 수 없습니다");
          setError("지도 컨테이너를 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }
        console.log("containerRef 확인 완료");

        let lat = 37.5665; // 서울시청 기본 좌표
        let lng = 126.9780;
        let isCurrentLocation = false;

        try {
          // 현재 위치 가져오기 시도
          console.log("현재 위치 요청 중...");
          const position = await getNowLocation({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          isCurrentLocation = true;
          console.log("현재 위치 가져오기 성공:", { lat, lng });
        } catch (locationError) {
          console.warn("위치 정보를 가져올 수 없습니다. 기본 위치(서울시청)를 사용합니다:", locationError);
        }

        // 지도 생성
        const kakao = (window as any).kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(lat, lng),
          level: 3,
        });

        mapRef.current = map;

        // 다시로 스타일 핀 생성
        const pinElement = createDasiroPin();

        // 커스텀 오버레이로 현재 위치 표시
        new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(lat, lng),
          content: pinElement,
          xAnchor: 0.5,
          yAnchor: 0.5,
          map: map,
        });

        // 주소 변환 객체 생성
        const geocoder = new kakao.maps.services.Geocoder();

        // 현재 위치의 주소 가져오기
        geocoder.coord2Address(lng, lat, (result: any, status: any) => {
          let address = "주소를 찾을 수 없습니다";
          
          if (status === kakao.maps.services.Status.OK && result[0]) {
            address = result[0].address?.address_name || result[0].road_address?.address_name || address;
          } else if (!isCurrentLocation) {
            address = "서울특별시 중구 태평로1가 31"; // 기본 위치 주소
          }
          
          onLocationSelect?.({ lat, lng, address });
        });

        setIsLoading(false);
      } catch (error) {
        console.error("지도 초기화 실패:", error);
        setError("지도를 불러올 수 없습니다.");
        setIsLoading(false);
      }
    };

    // DOM이 렌더링된 후 실행
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <MapContainer ref={containerRef}>
      {isLoading && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          color: '#666',
          zIndex: 10
        }}>
          현재 위치를 찾는 중...
        </div>
      )}
      {error && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          color: '#ff6b6b',
          zIndex: 10
        }}>
          {error}
        </div>
      )}
    </MapContainer>
  );
};