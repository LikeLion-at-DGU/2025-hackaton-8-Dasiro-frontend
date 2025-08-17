// Recovery Zone 위치 선택 지도 - 모달 내에서 현재 위치를 표시하고 위치 정보를 반환
import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { getNowLocation } from "@features/safe-route/lib/getLocation";
import { createDasiroPin } from "@shared/components/LocationPin";
import styled from "styled-components";

// 지도 컨테이너 스타일 - 모달 내 지도 영역 정의
const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
`;

type Props = {
  // 위치 선택 시 호출되는 콜백 함수 (위도, 경도, 주소 정보 전달)
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  // 모달 표시 여부 - 모달이 열렸을 때만 지도 초기화
  isVisible?: boolean;
};

export const LocationPickerMap = ({ onLocationSelect, isVisible = true }: Props) => {
  // 지도가 렌더링될 DOM 컨테이너 참조
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Kakao Map 인스턴스 참조
  const mapRef = useRef<any>(null);
  // 지도 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 상태 메시지
  const [error, setError] = useState<string | null>(null);

  // 모달 표시 상태 변경 시 지도 초기화
  useEffect(() => {
    console.log("LocationPickerMap useEffect 실행됨, isVisible:", isVisible);
    
    // 모달이 숨겨져 있으면 지도 초기화하지 않음 (성능 최적화)
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
        
        // 환경변수에서 Kakao Map API 키 가져오기
        const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
        console.log("사용할 API 키:", kakaoApiKey ? "키 존재" : "키 없음");
        
        if (!kakaoApiKey) {
          throw new Error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
        }
        
        // Kakao Maps API 동적 로드
        await loadKakaoMaps(kakaoApiKey);
        console.log("kakao map API 로드 성공");
        
        // DOM 컨테이너가 준비될 때까지 재시도 로직 (최대 1초)
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

        // 기본 위치는 서울시청으로 설정
        let lat = 37.5665;
        let lng = 126.9780;
        let isCurrentLocation = false;

        try {
          // 사용자의 현재 위치 가져오기 시도 (GPS 또는 네트워크 기반)
          console.log("현재 위치 요청 중...");
          const position = await getNowLocation({
            enableHighAccuracy: true,  // 고정밀 위치 요청
            timeout: 10000,           // 10초 타임아웃
            maximumAge: 60000         // 1분 이내 캐시된 위치 허용
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          isCurrentLocation = true;
          console.log("현재 위치 가져오기 성공:", { lat, lng });
        } catch (locationError) {
          console.warn("위치 정보를 가져올 수 없습니다. 기본 위치(서울시청)를 사용합니다:", locationError);
        }

        // Kakao Map 인스턴스 생성
        const kakao = (window as any).kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(lat, lng),
          level: 3, // 적당한 줌 레벨 (숫자가 클수록 넓은 범위)
        });

        // 지도 인스턴스를 ref에 저장
        mapRef.current = map;

        // 다시로 브랜드 스타일의 위치 핀 생성
        const pinElement = createDasiroPin();

        // 현재 위치에 커스텀 핀 표시
        new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(lat, lng),
          content: pinElement,
          xAnchor: 0.5,  // 핀의 중심점 X 위치
          yAnchor: 0.5,  // 핀의 중심점 Y 위치
          map: map,
        });

        // 좌표를 주소로 변환하는 Geocoder 객체 생성
        const geocoder = new kakao.maps.services.Geocoder();

        // 현재 위치의 좌표를 주소로 변환
        geocoder.coord2Address(lng, lat, (result: any, status: any) => {
          let address = "주소를 찾을 수 없습니다";
          
          // 주소 변환 성공 시 주소 정보 추출
          if (status === kakao.maps.services.Status.OK && result[0]) {
            address = result[0].address?.address_name || result[0].road_address?.address_name || address;
          } else if (!isCurrentLocation) {
            // 현재 위치가 아닌 기본 위치일 때 서울시청 주소 설정
            address = "서울특별시 중구 태평로1가 31";
          }
          
          // 부모 컴포넌트에 위치 정보 전달
          onLocationSelect?.({ lat, lng, address });
        });

        setIsLoading(false);
      } catch (error) {
        console.error("지도 초기화 실패:", error);
        setError("지도를 불러올 수 없습니다.");
        setIsLoading(false);
      }
    };

    // DOM 렌더링 완료 후 지도 초기화 (100ms 지연)
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [isVisible]); // isVisible 변경 시에만 effect 재실행

  // 모달이 숨겨져 있으면 컴포넌트를 렌더링하지 않음
  if (!isVisible) {
    return null;
  }

  return (
    <MapContainer ref={containerRef}>
      {/* 지도 로딩 중 오버레이 */}
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
      {/* 에러 발생 시 오버레이 */}
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