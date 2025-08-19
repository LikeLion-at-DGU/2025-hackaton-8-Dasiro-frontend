import example from "/images/image351.png";

// 필터 버튼 목록 - 복구현황 및 업종별 필터링 기능
export const FILTER_BUTTONS = [
  { 
    label: "복구현황",
    dropdownOptions: ["전체", "복구중", "임시복구", "복구완료"]
  },
  { label: "업종",
    dropdownOptions: ["전체", "음식점", "카페", "편의점"]
   },
];

// 복구 완료 상점 목록 - 실제 데이터는 API에서 가져올 예정
export const STORE_CARDS = [
  {
    id: 1,
    image: example,
    title: "미묘",
    address: "서울 서대문구 연희로 11길 41 1층",
    hasCoupon: true,
  },
  {
    id: 2,
    image: example,
    title: "카페 드림",
    address: "서울 강남구 테헤란로 123길 45 2층",
    hasCoupon: false,
  },
  {
    id: 3,
    image: example,
    title: "행복한 베이커리",
    address: "서울 마포구 홍대입구역 5번 출구",
    hasCoupon: true,
  },
  {
    id: 4,
    image: example,
    title: "스시 맛집",
    address: "서울 종로구 인사동길 12",
    hasCoupon: false,
  },
  {
    id: 5,
    image: example,
    title: "피자 하우스",
    address: "서울 영등포구 여의도동 25-3",
    hasCoupon: true,
  },
  {
    id: 6,
    image: example,
    title: "치킨 천국",
    address: "서울 송파구 잠실동 123-45",
    hasCoupon: true,
  },
  {
    id: 7,
    image: example,
    title: "한식당 맛나",
    address: "서울 중구 명동2가 54-1",
    hasCoupon: false,
  },
  {
    id: 8,
    image: example,
    title: "이탈리안 레스토랑",
    address: "서울 강동구 천호대로 456",
    hasCoupon: true,
  },
  {
    id: 9,
    image: example,
    title: "분식집 맛터",
    address: "서울 관악구 신림동 789-12",
    hasCoupon: false,
  },
  {
    id: 10,
    image: example,
    title: "카페 라떼",
    address: "서울 동작구 사당로 321",
    hasCoupon: true,
  },
  {
    id: 11,
    image: example,
    title: "햄버거 킹덤",
    address: "서울 은평구 불광동 567-89",
    hasCoupon: false,
  },
  {
    id: 12,
    image: example,
    title: "중식당 용궁",
    address: "서울 성북구 정릉동 234-56",
    hasCoupon: true,
  },
];