import { useEffect, useState, useRef } from "react";
import { BottomSheetElement } from "../ui";
import { FilterButton, StoreCard, LegacyStoreCard } from "../widgets";
import { FILTER_BUTTONS } from "../constants";
import { getPlaces, type Place } from "@entities/report/places";
import { getIncidents } from "@entities/recovery/incidents";
import {
  TEMP_REPAIRED_TEST_DATA,
  UNDER_REPAIR_TEST_DATA,
  STORE_TEST_DATA,
} from "../constants";
import { type CardItem } from "@entities/recovery/types";
import { mapFilterToCategory } from "../utils/categoryMapper";
import { useRecovery } from "../context/RecoveryContext";
import { useCoupon } from "@shared/contexts/CouponContext";
import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import whitemarker from "/images/icons/whitemarker.png";

const StyledButton = style(BasicElement.Button)`
  ${({ theme }) => theme.fonts.bodySemiB14}
  color: ${({ theme }) => theme.colors.orange06};
  background-color: ${({ theme }) => theme.colors.orange01};
  position: fixed;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  
  opacity: var(--button-opacity, 0);
  transform: translateX(-50%) translateY(var(--button-translate-y, 20px));
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  img{
    width: 12.8px;
    height: 16px;
  }
`;

export const FilterButtonList = () => {
  const [bottomSheetHeight, setBottomSheetHeight] = useState(36);
  const lastHeightRef = useRef(36);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let resizeObserver: ResizeObserver;
    
    // 초기 높이 설정
    const initializeHeight = () => {
      const bottomSheet = document.getElementById('bottomSheet');
      if (bottomSheet) {
        const style = getComputedStyle(bottomSheet);
        const heightValue = Math.round(parseFloat(style.height) / window.innerHeight * 100);
        lastHeightRef.current = heightValue;
        setBottomSheetHeight(heightValue);
      }
    };
    
    // 지연 수행으로 DOM 준비 대기
    const initTimer = setTimeout(initializeHeight, 100);
    
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const bottomSheet = document.getElementById('bottomSheet');
        if (bottomSheet) {
          const style = getComputedStyle(bottomSheet);
          const heightValue = Math.round(parseFloat(style.height) / window.innerHeight * 100);
          
          // 실제로 높이가 변했을 때만 상태 업데이트
          if (Math.abs(heightValue - lastHeightRef.current) >= 1) {
            lastHeightRef.current = heightValue;
            setBottomSheetHeight(heightValue);
          }
        }
      }, 30); // 30ms debounce
    });
    
    const bottomSheet = document.getElementById('bottomSheet');
    if (bottomSheet) {
      observer.observe(bottomSheet, {
        attributes: true,
        attributeFilter: ['style']
      });
      
      // ResizeObserver 추가 (브라우저 리사이징 대응)
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            initializeHeight();
          }, 30);
        });
        resizeObserver.observe(bottomSheet);
      }
      
      // 즉시 초기화 시도
      initializeHeight();
    }
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initTimer);
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);
  
  const handleMinimizeSheet = () => {
    console.log("handleMinimizeSheet called");
    
    // BottomCardList 스크롤을 맨 위로 이동
    const bottomCardList = document.querySelector('.bottom-card-list') as HTMLElement;
    if (bottomCardList) {
      bottomCardList.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // 전역 함수 사용
    if ((window as any).setBottomSheetHeight) {
      (window as any).setBottomSheetHeight(36);
    }
  };

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
    console.log("useEffect 실행:", {
      selectedLocation,
      selectedRecoveryStatus,
      selectedCategory,
      places: places.length,
    });

    if (selectedLocation) {
      setIsLoading(true);

      // 임시복구나 복구중일 때는 incidents API 사용
      if (
        selectedRecoveryStatus === "임시복구" ||
        selectedRecoveryStatus === "복구중"
      ) {
        const status =
          selectedRecoveryStatus === "임시복구"
            ? "TEMP_REPAIRED"
            : "UNDER_REPAIR";
        getIncidents({ statuses: [status] })
          .then((response) => {
            console.log("불러온 사고 데이터:", response);
            if (
              response &&
              response.data.items &&
              response.data.items.length > 0
            ) {
              // IncidentItem을 CardItem 형태로 변환
              const convertedItems: CardItem[] = response.data.items.map(
                (incident) => ({
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
                  images_count: incident.images_count,
                })
              );
              setPlaces(convertedItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
            } else {
              // API 데이터가 없으면 테스트 데이터 사용
              console.log("API 데이터가 없어서 테스트 데이터 사용");
              const testData =
                selectedRecoveryStatus === "임시복구"
                  ? TEMP_REPAIRED_TEST_DATA
                  : UNDER_REPAIR_TEST_DATA;
              const convertedTestItems: CardItem[] = testData.map(
                (incident) => ({
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
                  images_count: incident.images_count,
                })
              );
              setPlaces(convertedTestItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
            }
          })
          .catch((error) => {
            console.error("사고 데이터 로드 실패, 테스트 데이터 사용:", error);
            // API 호출 실패시 테스트 데이터 사용
            const testData =
              selectedRecoveryStatus === "임시복구"
                ? TEMP_REPAIRED_TEST_DATA
                : UNDER_REPAIR_TEST_DATA;
            const convertedTestItems: CardItem[] = testData.map((incident) => ({
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
              images_count: incident.images_count,
            }));
            setPlaces(convertedTestItems as any); // 임시로 any 사용, 나중에 Context 수정 필요
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // 복구완료나 전체일 때는 places API 사용
        // selectedLocation에서 구 이름 추출 (예: "서울시 중구 명동" -> "중구")
        const sigungu = selectedLocation.address
          ? selectedLocation.address
              .split(" ")
              .find((part) => part.endsWith("구")) || "중구"
          : "중구";

        getPlaces({
          category:
            selectedCategory && selectedCategory !== "전체"
              ? mapFilterToCategory(selectedCategory)
              : undefined,
          sigungu: sigungu,
          page: 1,
          page_size: 20,
        })
          .then((response) => {
            console.log("불러온 상점 데이터:", response);
            if (
              response &&
              response.data &&
              response.data.items &&
              response.data.items.length > 0
            ) {
              // API 데이터에 클라이언트 사이드 필터링 적용
              let filteredPlaces = response.data.items;
              if (selectedCategory && selectedCategory !== "전체") {
                const targetCategory = mapFilterToCategory(selectedCategory);
                filteredPlaces = response.data.items.filter(
                  (place) => place.category === targetCategory
                );
              }
              setPlaces(filteredPlaces);
            } else {
              console.warn(
                "응답 데이터가 비어있습니다, 테스트 데이터 사용:",
                response
              );
              console.log("상점 테스트 데이터 사용:", STORE_TEST_DATA);
              // 테스트 데이터에도 필터링 적용
              let filteredTestData = STORE_TEST_DATA;
              if (selectedCategory && selectedCategory !== "전체") {
                const targetCategory = mapFilterToCategory(selectedCategory);
                filteredTestData = STORE_TEST_DATA.filter(
                  (place) => place.category === targetCategory
                );
              }
              setPlaces(filteredTestData);
            }
          })
          .catch((error) => {
            console.error("장소 데이터 로드 실패, 테스트 데이터 사용:", error);
            // 에러 시에도 테스트 데이터에 필터링 적용
            let filteredTestData = STORE_TEST_DATA;
            if (selectedCategory && selectedCategory !== "전체") {
              const targetCategory = mapFilterToCategory(selectedCategory);
              filteredTestData = STORE_TEST_DATA.filter(
                (place) => place.category === targetCategory
              );
            }
            setPlaces(filteredTestData);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [selectedLocation, selectedRecoveryStatus, selectedCategory]);

  // 쿠폰 클릭 핸들러
  const handleCouponClick = (place: Place) => {
    console.log(`${place.name} 쿠폰 클릭됨`);
    showCouponModal(place);
  };

  const shouldShowButton = bottomSheetHeight >= 90;

  // 렌더링 디버깅
  console.log("FilterButtonList 렌더링:", {
    isLoading,
    placesLength: places.length,
    selectedLocation: !!selectedLocation,
  });

  return (
    <>
      {/* 필터 버튼 목록 - 복구현황, 업종별 필터링 */}
      <BottomSheetElement.BottomButtonList
        id="bottomButtonList"
      >
        {FILTER_BUTTONS.map((button, index) => {
          const getSelectedOption = () => {
            if (button.label === "복구현황") {
              return selectedRecoveryStatus === "전체"
                ? undefined
                : selectedRecoveryStatus;
            }
            if (button.label === "업종") {
              return selectedCategory === "전체" ? undefined : selectedCategory;
            }
            return undefined;
          };

          const getOptionSelectHandler = () => {
            if (button.label === "복구현황") return setSelectedRecoveryStatus;
            if (button.label === "업종") return setSelectedCategory;
            return undefined;
          };

          // 업종 버튼은 복구현황이 "복구완료"가 아닐 때 비활성화
          const isDisabled =
            button.label === "업종" && selectedRecoveryStatus !== "복구완료";

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
          overflowY: "auto",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
        ) : places.length > 0 ? (
          places.map((place) => {
            // 임시복구나 복구중일 때는 LegacyStoreCard 사용
            if (
              selectedRecoveryStatus === "임시복구" ||
              selectedRecoveryStatus === "복구중"
            ) {
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
                  cardClickHandler={() =>
                    console.log(`${cardItem.name} 카드 클릭됨`)
                  }
                />
              );
            }

            // 복구완료나 전체일 때는 기존 StoreCard 사용
            return (
              <StoreCard
                key={place.name + place.address} // id가 없으므로 name + address를 key로 사용
                place={place}
                cardClickHandler={(place) =>
                  console.log(`${place.name} 카드 클릭됨`)
                }
                couponClickHandler={handleCouponClick}
              />
            );
          })
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            {selectedLocation
              ? "주변 상점이 없습니다."
              : "위치를 선택해주세요."}
          </div>
        )}
        <StyledButton
          $width={"fit-content"}
          $gap={10}
          $padding={[6, 20]}
          $borderRadius={50}
          onClick={handleMinimizeSheet}
          style={{
            opacity: shouldShowButton ? 1 : 0,
            transform: `translateX(-50%) translateY(${shouldShowButton ? '0px' : '20px'})`,
            pointerEvents: shouldShowButton ? 'auto' : 'none'
          }}
        >
          <img src={whitemarker} alt="하얀색 핀" />
          지도보기
        </StyledButton>
      </BottomSheetElement.BottomCardList>
    </>
  );
};
