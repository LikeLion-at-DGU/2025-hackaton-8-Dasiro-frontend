/**
 * 위치 관련 유틸리티 함수들
 */

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

/**
 * 서울시청 기본 위치 정보
 */
export const SEOUL_CITY_HALL: LocationData = {
  lat: 37.5665,
  lng: 126.9780,
  address: "서울특별시 중구 태평로1가 31"
};

/**
 * 서울 행정구역 경계 좌표 (대략적인 범위)
 */
const SEOUL_BOUNDS = {
  north: 37.7013,   // 최북단 (도봉구)
  south: 37.4269,   // 최남단 (서초구)
  east: 127.1847,   // 최동단 (강동구)
  west: 126.7641    // 최서단 (강서구)
};

/**
 * 주어진 좌표가 서울 범위 내에 있는지 확인
 * @param lat 위도
 * @param lng 경도
 * @returns 서울 범위 내 여부
 */
export const isInSeoul = (lat: number, lng: number): boolean => {
  return (
    lat >= SEOUL_BOUNDS.south &&
    lat <= SEOUL_BOUNDS.north &&
    lng >= SEOUL_BOUNDS.west &&
    lng <= SEOUL_BOUNDS.east
  );
};

/**
 * 현재 위치를 가져오고, 서울 밖이거나 실패하면 서울시청을 반환
 * @param options Geolocation API 옵션
 * @returns Promise<LocationData>
 */
export const getValidatedLocation = async (options?: PositionOptions): Promise<LocationData> => {
  try {
    // 현재 위치 가져오기 시도
    const position = await getCurrentPosition(options);
    const { latitude: lat, longitude: lng } = position.coords;
    
    console.log("현재 위치 가져오기 성공:", { lat, lng });
    
    // 서울 범위 체크
    if (isInSeoul(lat, lng)) {
      console.log("서울 범위 내 위치입니다.");
      return {
        lat,
        lng,
        address: "" // 주소는 별도로 조회 필요
      };
    } else {
      console.warn("서울 범위 밖 위치입니다. 서울시청을 기본 위치로 사용합니다.");
      return SEOUL_CITY_HALL;
    }
  } catch (error) {
    console.warn("위치 정보를 가져올 수 없습니다. 서울시청을 기본 위치로 사용합니다:", error);
    return SEOUL_CITY_HALL;
  }
};

/**
 * Geolocation API를 Promise로 래핑
 * @param options Geolocation API 옵션
 * @returns Promise<GeolocationPosition>
 */
const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

/**
 * 두 지점 간의 거리를 계산 (단위: km)
 * @param lat1 첫 번째 지점의 위도
 * @param lng1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lng2 두 번째 지점의 경도
 * @returns 거리 (km)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 각도를 라디안으로 변환
 * @param degrees 각도
 * @returns 라디안
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 좌표가 유효한지 검사
 * @param lat 위도
 * @param lng 경도
 * @returns 유효성 여부
 */
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};