import { useState } from "react";
import { BottomSheetElement } from "../../recovery-zone/ui";
import { BottomSheetGradeButton } from "@features/sinkhole-map/ui/BottomSheetElement";
import Banner from "@features/sinkhole-map/widgets/Banner";
import BottomSheetContent from "@features/sinkhole-map/components/BottomSheetContent";

export const GradeBottomInner = () => {
  // 선택된 싱크홀 등급
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

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
            onClick={() => {
              setSelectedGrade(grade);
              console.log(`${grade}등급 클릭됨`);
            }}
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
