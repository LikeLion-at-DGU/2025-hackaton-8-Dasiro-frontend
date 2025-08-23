import type { IncidentItem } from "@entities/recovery/incidents";
import type { Place } from "@entities/report/places";

// 임시복구 테스트 데이터
export const TEMP_REPAIRED_TEST_DATA: IncidentItem[] = [
  {
    id: 1,
    occurred_at: "2024-07-15",
    address: "서울특별시 강남구 테헤란로 123",
    lat: 37.5665,
    lng: 127.0317,
    cause: "지반 침하",
    method: "임시 복구",
    status: "TEMP_REPAIRED",
    images_count: 3,
    distance_m: 150
  },
  {
    id: 2,
    occurred_at: "2024-08-01",
    address: "서울특별시 서초구 서초대로 456",
    lat: 37.4837,
    lng: 127.0324,
    cause: "하수관 파열",
    method: "임시 복구",
    status: "TEMP_REPAIRED",
    images_count: 2,
    distance_m: 280
  },
  {
    id: 3,
    occurred_at: "2024-08-10",
    address: "서울특별시 송파구 올림픽로 789",
    lat: 37.5133,
    lng: 127.1028,
    cause: "도로 함몰",
    method: "임시 복구",
    status: "TEMP_REPAIRED",
    images_count: 1,
    distance_m: 95
  }
];

// 복구중 테스트 데이터
export const UNDER_REPAIR_TEST_DATA: IncidentItem[] = [
  {
    id: 4,
    occurred_at: "2024-08-20",
    address: "서울특별시 중구 을지로 321",
    lat: 37.5660,
    lng: 126.9784,
    cause: "지하수 침투",
    method: "완전 복구",
    status: "UNDER_REPAIR",
    images_count: 4,
    distance_m: 200
  },
  {
    id: 5,
    occurred_at: "2024-08-22",
    address: "서울특별시 마포구 홍대입구로 654",
    lat: 37.5563,
    lng: 126.9236,
    cause: "싱크홀 발생",
    method: "완전 복구",
    status: "UNDER_REPAIR",
    images_count: 5,
    distance_m: 320
  }
];

// 전체 테스트 데이터
export const ALL_INCIDENT_TEST_DATA = [
  ...TEMP_REPAIRED_TEST_DATA,
  ...UNDER_REPAIR_TEST_DATA
];

// 복구완료/전체 상점 테스트 데이터
export const STORE_TEST_DATA: Place[] = [
  {
    name: "테스트 식당 1",
    category: "FOOD",
    address: "서울시 중구 명동길 1",
    lat: 37.5665,
    lng: 126.9780,
    distance_m: 50,
    main_image_url: "/images/image351.png",
    kakao_place_id: "12345",
    kakao_url: "https://place.map.kakao.com/12345"
  },
  {
    name: "테스트 카페 1",
    category: "CAFE",
    address: "서울시 중구 명동길 2",
    lat: 37.5670,
    lng: 126.9785,
    distance_m: 100,
    main_image_url: null,
    kakao_place_id: null,
    kakao_url: null
  },
  {
    name: "테스트 편의점 1",
    category: "CONVENIENCE",
    address: "서울시 중구 명동길 3",
    lat: 37.5675,
    lng: 126.9790,
    distance_m: 120,
    main_image_url: null,
    kakao_place_id: null,
    kakao_url: null
  },
  {
    name: "테스트 식당 2",
    category: "FOOD",
    address: "서울시 중구 명동길 4",
    lat: 37.5680,
    lng: 126.9795,
    distance_m: 80,
    main_image_url: "/images/image351.png",
    kakao_place_id: "54321",
    kakao_url: "https://place.map.kakao.com/54321"
  }
];