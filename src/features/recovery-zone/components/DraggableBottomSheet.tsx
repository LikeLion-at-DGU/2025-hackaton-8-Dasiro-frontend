import { useState, useRef, useEffect, type ReactNode } from "react";
import { BottomSheetElement } from "../ui";
import sheetbar from "/images/icons/sheetbar.png";

interface DraggableBottomSheetProps {
  children: ReactNode;
}

const minHeight:number = 36;

export const DraggableBottomSheet = ({ children }: DraggableBottomSheetProps) => {
  // 하단 시트의 높이 상태 (vh 단위, 최소 42.3vh에서 최대 100vh)
  const [height, setHeight] = useState(minHeight);
  // 드래그 중 여부를 나타내는 상태
  const [isDragging, setIsDragging] = useState(false);
  // 하단 시트 DOM 요소 참조
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  // 드래그 시작 시 Y 좌표 저장
  const startYRef = useRef(0);
  // 드래그 시작 시 시트 높이 저장
  const startHeightRef = useRef(minHeight);

  // 마우스 드래그 시작 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Mouse down');
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  // 터치 드래그 시작 핸들러 (모바일 지원)
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    console.log('Touch start');
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = height;
  };

  // 드래그 중 이벤트 처리를 위한 useEffect
  useEffect(() => {
    // 마우스 이동 시 시트 높이 계산 및 업데이트
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      // 드래그 거리를 vh 단위로 변환
      const deltaY = startYRef.current - e.clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      // 최소 42.3vh, 최대 100vh 범위로 제한
      const newHeight = Math.max(36, Math.min(100, startHeightRef.current + deltaVh));
      
      console.log('Mouse move - newHeight:', newHeight);
      setHeight(newHeight);
    };

    // 터치 이동 시 시트 높이 계산 및 업데이트
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      // 터치 드래그 거리를 vh 단위로 변환
      const deltaY = startYRef.current - e.touches[0].clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      // 최소 42.3vh, 최대 100vh 범위로 제한
      const newHeight = Math.max(42.3, Math.min(100, startHeightRef.current + deltaVh));
      
      console.log('Touch move - newHeight:', newHeight);
      setHeight(newHeight);
    };

    // 드래그 종료 처리
    const handleEnd = () => {
      console.log('Drag end');
      setIsDragging(false);
    };

    // 드래그 중일 때만 이벤트 리스너 등록
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    // 컴포넌트 언마운트 또는 드래그 종료 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, height]); // isDragging과 height 변경 시 effect 재실행

  return (
    <BottomSheetElement.BottomSheetWrapper
      ref={bottomSheetRef}
      style={{ 
        height: `${height}vh`,
        // maxHeight: '100vh',
        minHeight: minHeight,
        // 드래그 중에는 애니메이션 비활성화, 그 외에는 부드러운 전환 효과
        transition: isDragging ? 'none' : 'height 0.3s ease'
      }}
    >
      <BottomSheetElement.BottomBar className="bottomBar">
        {/* 드래그 핸들 바 - 사용자가 이것을 드래그하여 시트 높이 조절 */}
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
        <BottomSheetElement.BottomInner
          style={{
            '--bottom-sheet-height': `${height}vh`
          } as React.CSSProperties}
        >
          {children}
        </BottomSheetElement.BottomInner>
      </BottomSheetElement.BottomBar>
    </BottomSheetElement.BottomSheetWrapper>
  );
};