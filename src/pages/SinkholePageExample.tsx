// SinkholePage 예시 - PageHeader를 SearchBar와 함께 사용
import { PageHeader, SearchBar } from "@shared/components";
import { MainElement } from "@features/recovery-zone";

const SinkholePage = () => {
  const handleSearch = (query: string) => {
    console.log("검색어:", query);
    // 싱크홀 검색 로직 구현
  };

  return (
    <div>
      <MainElement.MainWrapper style={{ margin: "0 auto", marginTop: "3.4vh" }}>
        {/* SinkholePage용 헤더 - 로고 + 검색바, LocationSet 없음 */}
        <PageHeader
          searchBar={
            <SearchBar 
              placeholder="싱크홀 위치를 검색하세요"
              onSearch={handleSearch}
            />
          }
        />
        
        {/* 싱크홀 관련 메인 콘텐츠 */}
        <div>싱크홀 지도 및 기타 콘텐츠</div>
      </MainElement.MainWrapper>
    </div>
  );
};

export default SinkholePage;