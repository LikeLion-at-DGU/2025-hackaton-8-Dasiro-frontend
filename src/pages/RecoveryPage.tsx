// Recovery Zone 페이지 - 복구 상권 현황을 보여주는 메인 페이지
import { useState } from "react";
import * as S from "@widget/MapWithOverlay/MapWithOverlay.styles";
import {
  MainElement,
  MapSection,
  BottomSheet,
  BackgroundCircles,
} from "@features/recovery-zone";
import { PageHeader, NoticeBar } from "@shared/components";

const RecoveryPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
  };
  return (
    <S.Wrap>
      {/* 메인 콘텐츠 영역 - 헤더, 지도, 기타 UI 요소들을 포함 */}
      <MainElement.MainWrapper style={{ margin: "0 auto", marginTop: "3.4vh" }}>
        {/* 상단 헤더 - 로고, 위치 설정 버튼, 공지사항 포함 */}
        <PageHeader
          showLocationSet
          locationSetText="위치 설정"
          onLocationSelect={handleLocationSelect}
          noticeBar={<NoticeBar />}
        />
        
        {/* 메인 콘텐츠 컨테이너 (현재 빈 상태) */}
        <MainElement.MainContent />
        
        {/* 서울 지역 복구 현황 지도 - 구별 색상 표시 */}
        <MapSection selectedLocation={selectedLocation} />
      </MainElement.MainWrapper>

      {/* 하단 슬라이드 시트 - 필터 버튼과 상점 리스트 */}
      <BottomSheet />

      {/* 배경 장식용 원형 요소들 */}
      <BackgroundCircles />
    </S.Wrap>
  );
};

export default RecoveryPage;
