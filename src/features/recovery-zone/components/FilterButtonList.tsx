import { useEffect } from "react";
import { BottomSheetElement } from "../ui";
import { FilterButton, StoreCard, LegacyStoreCard } from "../widgets";
import { FILTER_BUTTONS } from "../constants";
import { getNearPlaces, type Place } from "@entities/report/places";
import { getIncidents } from "@entities/recovery/incidents";
import { TEMP_REPAIRED_TEST_DATA, UNDER_REPAIR_TEST_DATA, STORE_TEST_DATA } from "../constants";
import { type CardItem } from "@entities/recovery/types";
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

  // 장소 데이터 불러오기 (복구현황에 따라 다른 API 호출)
  useEffect(() => {
    console.log('useEffect 실행:', { selectedLocation, selectedRecoveryStatus, places: places.length });
    
    if (selectedLocation) {
      setIsLoading(true);
      
      // 임시복구나 복구중일 때는 incidents API 사용
      if (selectedRecoveryStatus === "임시복구" || selectedRecoveryStatus === "복구중") {
        const status = selectedRecoveryStatus === "임시복구" ? "TEMP_REPAIRED" : "UNDER_REPAIR";
        getIncidents([status])
        .then(response => {
          console.log('불러온 사고 데이터:', response);
          if (response && response.data.items && response.data.items.length > 0) {
            // IncidentItem을 CardItem 형태로 변환
            const convertedItems: CardItem[] = response.data.items.map(incident => ({
              id: incident.id,
              name: incident.cause,
              address: incident.address,
              lat: incident.lat,
              lng: incident.lng,
              distance_m: incident.distance_m,
              type: "incident" as const,
              occurred_at: incident.occurred_at,
              cause: incident.cause,
              method: incident.method,
              status: incident.status,
              images_count: incident.images_count
            }));
            setPlaces(convertedItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
          } else {
            // API 데이터가 없으면 테스트 데이터 사용
            console.log('API 데이터가 없어서 테스트 데이터 사용');
            const testData = selectedRecoveryStatus === "임시복구" ? TEMP_REPAIRED_TEST_DATA : UNDER_REPAIR_TEST_DATA;
            const convertedTestItems: CardItem[] = testData.map(incident => ({
              id: incident.id,
              name: incident.cause,
              address: incident.address,
              lat: incident.lat,
              lng: incident.lng,
              distance_m: incident.distance_m,
              type: "incident" as const,
              occurred_at: incident.occurred_at,
              cause: incident.cause,
              method: incident.method,
              status: incident.status,
              images_count: incident.images_count
            }));
            setPlaces(convertedTestItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
          }
        })
        .catch(error => {
          console.error('사고 데이터 로드 실패, 테스트 데이터 사용:', error);
          // API 호출 실패시 테스트 데이터 사용
          const testData = selectedRecoveryStatus === "임시복구" ? TEMP_REPAIRED_TEST_DATA : UNDER_REPAIR_TEST_DATA;
          const convertedTestItems: CardItem[] = testData.map(incident => ({
            id: incident.id,
            name: incident.cause,
            address: incident.address,
            lat: incident.lat,
            lng: incident.lng,
            distance_m: incident.distance_m,
            type: "incident" as const,
            occurred_at: incident.occurred_at,
            cause: incident.cause,
            method: incident.method,
            status: incident.status,
            images_count: incident.images_count
          }));
          setPlaces(convertedTestItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else {
        // 복구완료나 전체일 때는 기존 places API 사용
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
            console.warn('응답 데이터가 비어있습니다, 테스트 데이터 사용:', response);
            console.log('상점 테스트 데이터 사용:', STORE_TEST_DATA);
            setPlaces(STORE_TEST_DATA);
          }
        })
        .catch(error => {
          console.error('장소 데이터 로드 실패:', error);
          setPlaces([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
      }
    }
  }, [selectedLocation, selectedRecoveryStatus]);

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

          // 업종 버튼은 복구현황이 "복구완료"가 아닐 때 비활성화
          const isDisabled = button.label === "업종" && selectedRecoveryStatus !== "복구완료";

          return (
            <FilterButton 
              key={index} 
              label={button.label}
              dropdownOptions={button.dropdownOptions}
              selectedOption={getSelectedOption()}
              onOptionSelect={getOptionSelectHandler()}
              onClick={() => console.log(`${button.label} 클릭됨`)}
              disabled={isDisabled}
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
          places.map((place) => {
            // 임시복구나 복구중일 때는 LegacyStoreCard 사용
            if (selectedRecoveryStatus === "임시복구" || selectedRecoveryStatus === "복구중") {
              const cardItem = place as any as CardItem; // 타입 캐스팅
              return (
                <LegacyStoreCard
                  key={cardItem.id}
                  image="/images/default-store.png" // incident는 이미지가 없으므로 기본 이미지
                  title={cardItem.name}
                  address={cardItem.address}
                  occurred_at={cardItem.occurred_at || ""}
                  cause={cardItem.cause || ""}
                  method={cardItem.method || ""}
                  cardClickHandler={() => console.log(`${cardItem.name} 카드 클릭됨`)}
                />
              );
            }
            
            // 복구완료나 전체일 때는 기존 StoreCard 사용
            return (
              <StoreCard
                key={place.id}
                place={place}
                cardClickHandler={(place) => console.log(`${place.name} 카드 클릭됨`)}
                couponClickHandler={handleCouponClick}
              />
            );
          })
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {selectedLocation ? '주변 상점이 없습니다.' : '위치를 선택해주세요.'}
          </div>
        )}
      </BottomSheetElement.BottomCardList>
    </>
  );
};