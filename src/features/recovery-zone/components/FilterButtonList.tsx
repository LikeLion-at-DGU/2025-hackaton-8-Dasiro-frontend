import { useState } from "react";
import { BottomSheetElement } from "../ui";
import { FilterButton, StoreCard } from "../widgets";
import { FILTER_BUTTONS, STORE_CARDS } from "../constants";

export const FilterButtonList = () => {
  // 선택된 복구현황 필터 옵션
  const [selectedRecoveryStatus, setSelectedRecoveryStatus] = useState<string>("복구 현황");
  // 선택된 업종 필터 옵션
  const [selectedCategory, setSelectedCategory] = useState<string>("업종");

  return (
    <>
      {/* 필터 버튼 목록 - 복구현황, 업종별 필터링 */}
      <BottomSheetElement.BottomButtonList 
        id="bottomButtonList"
        $isSinkholeMap={false}
      >
        {FILTER_BUTTONS.map((button, index) => {
          const getSelectedOption = () => {
            if (button.label === "복구현황") return selectedRecoveryStatus;
            if (button.label === "업종") return selectedCategory;
            return undefined;
          };

          const getOptionSelectHandler = () => {
            if (button.label === "복구현황") return setSelectedRecoveryStatus;
            if (button.label === "업종") return setSelectedCategory;
            return undefined;
          };

          return (
            <FilterButton 
              key={index} 
              label={button.label}
              dropdownOptions={button.dropdownOptions}
              selectedOption={getSelectedOption()}
              onOptionSelect={getOptionSelectHandler()}
              onClick={() => console.log(`${button.label} 클릭됨`)}
            />
          );
        })}
      </BottomSheetElement.BottomButtonList>
      {/* 복구 완료 상점 카드 목록 - 스크롤 가능한 세로 목록 */}
      <BottomSheetElement.BottomCardList
        style={{
          overflowY: 'auto',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {STORE_CARDS.map((store) => (
          <StoreCard
            key={store.id}
            image={store.image}
            title={store.title}
            address={store.address}
            hasCoupon={store.hasCoupon}
            cardClickHandler={() => console.log(`${store.title} 카드 클릭됨`)}
            couponClickHandler={() => console.log(`${store.title} 쿠폰 클릭됨`)}
          />
        ))}
      </BottomSheetElement.BottomCardList>
    </>
  );
};