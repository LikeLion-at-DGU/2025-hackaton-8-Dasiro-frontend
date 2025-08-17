import type { DistrictRecovery } from "../types";

// 서울 25개 구의 가상 복구 현황 데이터
export const recoveryData: DistrictRecovery[] = [
  { name: "강남구", status: "복구완료" },
  { name: "강동구", status: "임시복구" },
  { name: "강북구", status: "복구중" },
  { name: "강서구", status: "복구완료" },
  { name: "관악구", status: "임시복구" },
  { name: "광진구", status: "복구완료" },
  { name: "구로구", status: "복구중" },
  { name: "금천구", status: "임시복구" },
  { name: "노원구", status: "복구완료" },
  { name: "도봉구", status: "복구중" },
  { name: "동대문구", status: "임시복구" },
  { name: "동작구", status: "복구완료" },
  { name: "마포구", status: "복구중" },
  { name: "서대문구", status: "복구완료" },
  { name: "서초구", status: "임시복구" },
  { name: "성동구", status: "복구완료" },
  { name: "성북구", status: "복구중" },
  { name: "송파구", status: "복구완료" },
  { name: "양천구", status: "임시복구" },
  { name: "영등포구", status: "복구중" },
  { name: "용산구", status: "복구완료" },
  { name: "은평구", status: "임시복구" },
  { name: "종로구", status: "복구완료" },
  { name: "중구", status: "복구중" },
  { name: "중랑구", status: "임시복구" },
];

// 복구 현황별 구 개수
export const getRecoveryStats = () => {
  const stats = {
    "복구완료": 0,
    "임시복구": 0,
    "복구중": 0,
  };
  
  recoveryData.forEach(district => {
    stats[district.status]++;
  });
  
  return stats;
};