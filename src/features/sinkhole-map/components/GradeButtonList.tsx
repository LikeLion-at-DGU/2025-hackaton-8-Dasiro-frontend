import { SinkholeBottomSheetElement as BottomSheetElement } from "@features/sinkhole-map";

import { BottomSheetContent } from "@features/sinkhole-map/components/BottomSheetContent";
import { getDistrictsGuByGrade } from "@entities/sinkhole/api";
import { useSelectGrade } from "@entities/sinkhole/context";
import type { Grade } from "@entities/sinkhole/selectgrade";

export const GradeBottomInner = () => {
  // Context에서 상태 관리
  const {
    selectedGrade,
    setSelectedGrade,
    setSelectedGradeData,
    isBadgeActive,
    setSearchedDistrict,
    setIsBadgeActive,
  } = useSelectGrade();

  // 등급별 구 데이터 조회
  const handleGradeClick = async (grade: number) => {
    // 등급 버튼 클릭 시 검색 결과와 badge 비활성화
    setSearchedDistrict(null);
    setIsBadgeActive(false);
    
    // 등급 선택시 바텀시트를 100vh로 확장
    if ((window as any).setBottomSheetHeight) {
      (window as any).setBottomSheetHeight(100);
    }
    
    setSelectedGrade(grade);
    console.log(`${grade}등급 클릭됨`);
    
    try {
      const response = await getDistrictsGuByGrade(`G${grade}` as Grade);
      if (response && response.status === "success") {
        setSelectedGradeData(response.data);
        console.log(`${grade}등급 데이터:`, response.data);
      } else {
        setSelectedGradeData(null);
        console.error(`${grade}등급 데이터 조회 실패`);
      }
    } catch (error) {
      console.error(`${grade}등급 API 호출 실패:`, error);
      setSelectedGradeData(null);
    }
  };

  return (
    <>
      {/* badge 버튼이 활성화되지 않았을 때만 등급 버튼 목록 표시 */}
      {!isBadgeActive && (
        <BottomSheetElement.BottomButtonList
          id="bottomButtonList"
          $isSearch={false}
        >
          {[1, 2, 3, 4, 5].map((grade) => (
            <BottomSheetElement.BottomSheetGradeButton
              key={grade}
              $isActive={selectedGrade === grade}
              onClick={() => handleGradeClick(grade)}
            >
              {grade}등급
            </BottomSheetElement.BottomSheetGradeButton>
          ))}
        </BottomSheetElement.BottomButtonList>
      )}
      <BottomSheetElement.BottomCardList
        style={{
          gap: "40px",
          overflowY: "auto",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <BottomSheetContent />
      </BottomSheetElement.BottomCardList>
    </>
  );
};
