import { useState, useRef, useEffect } from "react";
import { BottomSheetElement } from "../ui";
import { FilterButton, StoreCard } from "../widgets";
import sheetbar from "@shared/assets/icons/sheetbar.png";
import example from "@shared/assets/image351.png";

// 필터 버튼 데이터
const FILTER_BUTTONS = [
  { label: "복구현황" },
  { label: "업종" },
];

// 상점 카드 데이터
const STORE_CARDS = [
  {
    id: 1,
    image: example,
    title: "미묘",
    address: "서울 서대문구 연희로 11길 41 1층",
    hasCoupon: true,
  },
  {
    id: 2,
    image: example,
    title: "카페 드림",
    address: "서울 강남구 테헤란로 123길 45 2층",
    hasCoupon: false,
  },
  {
    id: 3,
    image: example,
    title: "행복한 베이커리",
    address: "서울 마포구 홍대입구역 5번 출구",
    hasCoupon: true,
  },
  {
    id: 4,
    image: example,
    title: "스시 맛집",
    address: "서울 종로구 인사동길 12",
    hasCoupon: false,
  },
  {
    id: 5,
    image: example,
    title: "피자 하우스",
    address: "서울 영등포구 여의도동 25-3",
    hasCoupon: true,
  },
  {
    id: 6,
    image: example,
    title: "치킨 천국",
    address: "서울 송파구 잠실동 123-45",
    hasCoupon: true,
  },
  {
    id: 7,
    image: example,
    title: "한식당 맛나",
    address: "서울 중구 명동2가 54-1",
    hasCoupon: false,
  },
  {
    id: 8,
    image: example,
    title: "이탈리안 레스토랑",
    address: "서울 강동구 천호대로 456",
    hasCoupon: true,
  },
  {
    id: 9,
    image: example,
    title: "분식집 맛터",
    address: "서울 관악구 신림동 789-12",
    hasCoupon: false,
  },
  {
    id: 10,
    image: example,
    title: "카페 라떼",
    address: "서울 동작구 사당로 321",
    hasCoupon: true,
  },
  {
    id: 11,
    image: example,
    title: "햄버거 킹덤",
    address: "서울 은평구 불광동 567-89",
    hasCoupon: false,
  },
  {
    id: 12,
    image: example,
    title: "중식당 용궁",
    address: "서울 성북구 정릉동 234-56",
    hasCoupon: true,
  },
];

export const BottomSheet = () => {
  const [height, setHeight] = useState(42.3);
  const [isDragging, setIsDragging] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(42.3);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Mouse down');
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    console.log('Touch start');
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = height;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const deltaY = startYRef.current - e.clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(42.3, Math.min(100, startHeightRef.current + deltaVh));
      
      console.log('Mouse move - newHeight:', newHeight);
      setHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const deltaY = startYRef.current - e.touches[0].clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(42.3, Math.min(100, startHeightRef.current + deltaVh));
      
      console.log('Touch move - newHeight:', newHeight);
      setHeight(newHeight);
    };

    const handleEnd = () => {
      console.log('Drag end');
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, height]);

  return (
    <div
      ref={bottomSheetRef}
      id="bottomSheet"
      style={{ 
        height: `${height}vh`,
        maxHeight: '100vh',
        transition: isDragging ? 'none' : 'height 0.3s ease',
        background: '#f8f9fa',
        boxShadow: '4px 0 12px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '30px 30px 0 0',
        padding: '20px',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <BottomSheetElement.BottomBar id="bottomBar">
        <img
          src={sheetbar}
          alt="바텀시트 조종바"
          style={{ 
            width: "50px", 
            height: "4px",
            cursor: "grab"
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <BottomSheetElement.BottomInner id="bottomInner">
          <BottomSheetElement.BottomButtonList id="bottomButtonList">
            {FILTER_BUTTONS.map((button, index) => (
              <FilterButton 
                key={index} 
                label={button.label}
                onClick={() => console.log(`${button.label} 클릭됨`)}
              />
            ))}
          </BottomSheetElement.BottomButtonList>
          <BottomSheetElement.BottomCardList
            style={{
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              paddingBottom: '20px'
            }}
          >
            {STORE_CARDS.map((store) => (
              <StoreCard
                key={store.id}
                image={store.image}
                title={store.title}
                address={store.address}
                hasCoupon={store.hasCoupon}
                onClick={() => console.log(`${store.title} 카드 클릭됨`)}
              />
            ))}
          </BottomSheetElement.BottomCardList>
        </BottomSheetElement.BottomInner>
      </BottomSheetElement.BottomBar>
    </div>
  );
};