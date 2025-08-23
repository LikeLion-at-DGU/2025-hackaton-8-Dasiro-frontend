import { useEffect } from "react";
import { BottomSheetElement } from "../ui";
import { FilterButton, StoreCard } from "../widgets";
import { FILTER_BUTTONS } from "../constants";
import { getNearPlaces, type Place } from "@entities/report/places";
import { useRecovery } from "../context/RecoveryContext";
import { useCoupon } from "@shared/contexts/CouponContext";

export const FilterButtonList = () => {
  const {
    selectedLocation,
    places,
    setPlaces,
    isLoading,
    setIsLoading,
    selectedRecoveryStatus,
    setSelectedRecoveryStatus,
    selectedCategory,
    setSelectedCategory,
  } = useRecovery();

  const { showCouponModal } = useCoupon();

  // 장소 데이터 불러오기
  useEffect(() => {
    console.log('useEffect 실행:', { selectedLocation, places: places.length });
    if (selectedLocation) {
      setIsLoading(true);
      getNearPlaces({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: 200,
        category: "FOOD",
        page: 1,
        page_size: 20
      })
      .then(response => {
        console.log('불러온 상점 데이터:', response);
        if (response && response.items) {
          setPlaces(response.items);
        } else {
          console.warn('응답 데이터가 비어있습니다, Mock 데이터 사용:', response);
          // Mock 데이터로 테스트
          const mockPlaces: Place[] = [
            {
              id: 1,
              name: "테스트 식당 1",
              category: "FOOD",
              address: "서울시 중구 명동길 1",
              lat: 37.5665,
              lng: 126.9780,
              distance_m: 50,
              main_image_url: "/images/image351.png",
              kakao_url: null,
              has_active_coupons: true
            },
            {
              id: 2,
              name: "테스트 카페 1",
              category: "CAFE",
              address: "서울시 중구 명동길 2",
              lat: 37.5670,
              lng: 126.9785,
              distance_m: 100,
              main_image_url: null,
              kakao_url: null,
              has_active_coupons: false
            }
          ];
          console.log('Mock 데이터 사용:', mockPlaces);
          setPlaces(mockPlaces);
        }
      })
      .catch(error => {
        console.error('장소 데이터 로드 실패:', error);
        // 이 부분은 실행되지 않을 것 (getResponse가 에러를 catch해서 null 반환)
        setPlaces([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [selectedLocation]);

  // 쿠폰 클릭 핸들러
  const handleCouponClick = (place: Place) => {
    console.log(`${place.name} 쿠폰 클릭됨`);
    showCouponModal(place);
  };

  // 렌더링 디버깅
  console.log('FilterButtonList 렌더링:', { 
    isLoading, 
    placesLength: places.length, 
    selectedLocation: !!selectedLocation 
  });

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
          maxHeight: 'calc(var(--bottom-sheet-height, 50vh) - 120px)', // 시트 높이에서 버튼과 여백 빼기
          overflowY: 'auto',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        ) : places.length > 0 ? (
          places.map((place) => (
            <StoreCard
              key={place.id}
              place={place}
              cardClickHandler={(place) => console.log(`${place.name} 카드 클릭됨`)}
              couponClickHandler={handleCouponClick}
            />
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {selectedLocation ? '주변 상점이 없습니다.' : '위치를 선택해주세요.'}
          </div>
        )}
      </BottomSheetElement.BottomCardList>
    </>
  );
};