import { useState } from "react";
import { BottomSheetElement } from "@features/recovery-zone";
import { BottomSheetGradeButton } from "@features/sinkhole-map/ui/BottomSheetElement";
import { Banner } from "@features/sinkhole-map/containers/Banner";
import { BottomSheetContent } from "@features/sinkhole-map/components/BottomSheetContent";
import { getDistrictsByGrade } from "@entities/sinkhole/api";
import { useSelectGrade } from "@entities/sinkhole/context";
import type { Grade } from "@entities/sinkhole/selectgrade";

export const GradeBottomInner = () => {
  // 선택된 싱크홀 등급
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  // Context에서 상태 관리
  const { setSelectedGradeData } = useSelectGrade();

  // 등급별 구 데이터 조회
  const handleGradeClick = async (grade: number) => {
    setSelectedGrade(grade);
    console.log(`${grade}등급 클릭됨`);
    
    try {
      const response = await getDistrictsByGrade(`G${grade}` as Grade);
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
      {/* 등급 버튼 목록 - 1등급에서 5등급까지 */}
      <BottomSheetElement.BottomButtonList
        id="bottomButtonList"
        $isSinkholeMap={true}
        $isSearch={false}
      >
        {[1, 2, 3, 4, 5].map((grade) => (
          <BottomSheetGradeButton
            key={grade}
            $isActive={selectedGrade === grade}
            onClick={() => handleGradeClick(grade)}
          >
            {grade}등급
          </BottomSheetGradeButton>
        ))}
      </BottomSheetElement.BottomButtonList>
      <BottomSheetElement.BottomCardList
        style={{
          gap: "40px",
          overflowY: "auto",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Banner />
        <BottomSheetContent/>
      </BottomSheetElement.BottomCardList>
    </>
  );
};
