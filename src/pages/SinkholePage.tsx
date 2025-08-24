// Recovery Zone 페이지 - 복구 상권 현황을 보여주는 메인 페이지
import * as S from "@widget/MapWithOverlay/MapWithOverlay.styles";
import { PageHeader, SearchBar } from "@shared/components";
import {
  MainElement,
  BackgroundCircles,
} from "@features/recovery-zone";
import { SinkholeMapSection } from "@features/sinkhole-map/containers/SinkholeMapSection";
import { BottomSheet } from "@features/sinkhole-map/containers/BottomSheet";
import { SelectGradeProvider, useSelectGrade } from "@entities/sinkhole/context";
import { searchDistricts } from "@entities/sinkhole/api";
import FloatAction from "@shared/ui/FloatAction";

// SinkholePage 내부 컴포넌트
const SinkholePageContent = () => {
  const { setSearchedDistrict, isBadgeActive } = useSelectGrade();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchedDistrict(null);
      return;
    }

    try {
      const response = await searchDistricts({ q: query, limit: 1 });
      if (response && response.data && response.data.items && response.data.items.length > 0) {
        setSearchedDistrict(response.data.items[0]);
        console.log("검색된 동:", response.data.items[0]);
      } else {
        setSearchedDistrict(null);
        console.log("검색 결과 없음");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchedDistrict(null);
    }
  };

  return (
    <S.Wrap>
      {/* 메인 콘텐츠 영역 - 헤더, 지도, 기타 UI 요소들을 포함 */}
      <MainElement.MainWrapper style={{ margin: "0 auto", marginTop: "3.4vh" }}>
        {/* 상단 헤더 - 로고, 위치 설정 버튼, 공지사항 포함 */}
        <PageHeader
          searchBar={
            <SearchBar
              placeholder="안전지역 동 단위로 검색하기"
              onSearch={handleSearch}
            />
          }
          showSinkholeButton={true}
        />
        
        {/* 메인 콘텐츠 컨테이너 (현재 빈 상태) */}
        <MainElement.MainContent />
        {/* 서울 지역 싱크홀 위험도 지도 - 구별 색상 표시 */}
        <SinkholeMapSection 
          id="main-map"
          forceViewMode={isBadgeActive ? "safezone" : undefined}
        />
      </MainElement.MainWrapper>

      {/* 하단 슬라이드 시트 - 싱크홀 등급 버튼 */}
      <BottomSheet id={"sinkhole"} />

      {/* 배경 장식용 원형 요소들 */}
      <BackgroundCircles />
      <FloatAction/>
    </S.Wrap>
  );
};

const SinkholePage = () => {
  return (
    <SelectGradeProvider>
      <SinkholePageContent />
    </SelectGradeProvider>
  );
};


export default SinkholePage;
