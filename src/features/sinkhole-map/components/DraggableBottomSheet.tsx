import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { SinkholeBottomSheetElement as BottomSheetElement } from "../ui";
import sheetbar from "/images/icons/sheetbar.png";

interface DraggableBottomSheetProps {
  children: ReactNode;
  onSetHeight?: (height: number) => void;
}

const minHeight: number = 35;

export const DraggableBottomSheet = ({ children }: DraggableBottomSheetProps) => {
  const [height, setHeight] = useState(minHeight);
  const [isDragging, setIsDragging] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(minHeight);
  const lastTouchYRef = useRef<number | null>(null);

  const setHeightFromExternal = (newHeight: number) => {
    setHeight(newHeight);
  };

  useEffect(() => {
    (window as any).setBottomSheetHeight = setHeightFromExternal;
    return () => {
      delete (window as any).setBottomSheetHeight;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = height;
  };

  useEffect(() => {
    const bottomInnerElement = document.getElementById('bottomInner');
    if (bottomInnerElement) {
      bottomInnerElement.addEventListener('wheel', handleInnerWheel, { passive: false });
    }
    return () => {
      if (bottomInnerElement) {
        bottomInnerElement.removeEventListener('wheel', handleInnerWheel);
      }
    };
  }, [height]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaY = startYRef.current - e.clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(minHeight, Math.min(100, startHeightRef.current + deltaVh));
      setHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaY = startYRef.current - e.touches[0].clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(minHeight, Math.min(100, startHeightRef.current + deltaVh));
      setHeight(newHeight);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, height]);

  const clampHeight = (value: number) => Math.max(minHeight, Math.min(100, value));

  const handleInnerWheel = (e: WheelEvent) => {
    const bottomCardList = document.querySelector('.bottom-card-list') as HTMLElement;
    
    if (height >= 100 && e.deltaY > 0 && bottomCardList) {
      // 100vh에서 아래로 스크롤할 때: 내부 스크롤 우선
      const { scrollTop, scrollHeight, clientHeight } = bottomCardList;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      if (!isAtBottom) {
        // 내부 스크롤이 끝에 닿지 않았으면 내부 스크롤 우선
        return;
      }
    }
    
    if (height >= 100 && e.deltaY < 0 && bottomCardList) {
      // 100vh에서 위로 스크롤할 때: 내부 스크롤 우선
      const { scrollTop } = bottomCardList;
      
      if (scrollTop > 0) {
        // 내부 스크롤이 끝에 닿지 않았으면 내부 스크롤 우선
        return;
      } else {
        // 내부 스크롤이 맨 위에 닿았으면 시트 높이 조절
        e.preventDefault();
        const deltaVh = (e.deltaY / window.innerHeight) * 100;
        setHeight((prev) => clampHeight(prev + deltaVh));
        return;
      }
    }
    
    if (height < 100 || (height > minHeight && e.deltaY < 0)) {
      e.preventDefault();
      const deltaVh = (e.deltaY / window.innerHeight) * 100;
      setHeight((prev) => clampHeight(prev + deltaVh));
    }
  };

  const handleInnerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    if (lastTouchYRef.current !== null) {
      const deltaY = lastTouchYRef.current - currentY;
      if (height < 100 || (height > minHeight && deltaY < 0)) {
        e.preventDefault();
        e.stopPropagation();
        const deltaVh = (deltaY / window.innerHeight) * 100;
        setHeight((prev) => clampHeight(prev + deltaVh));
      }
    }
    lastTouchYRef.current = currentY;
  };

  const handleInnerTouchEnd = () => {
    lastTouchYRef.current = null;
  };

  return (
    <BottomSheetElement.BottomSheetWrapper
      id="bottomSheet"
      ref={bottomSheetRef}
      style={{
        height: `${height}vh`,
        minHeight: minHeight,
        transition: isDragging ? "none" : "height 0.3s ease",
      }}
    >
      <BottomSheetElement.BottomBar className="bottomBar">
        <img
          src={sheetbar}
          alt="바텀시트 조종바"
          style={{ width: "50px", height: "4px", cursor: "grab" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <BottomSheetElement.BottomInner
          style={{
            "--bottom-sheet-height": `${height}vh`,
            maxHeight: `calc(var(--bottom-sheet-height) - 15.5vh)`,
          } as React.CSSProperties}
          id="bottomInner"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={handleInnerTouchMove}
          onTouchEnd={handleInnerTouchEnd}
        >
          {children}
        </BottomSheetElement.BottomInner>
      </BottomSheetElement.BottomBar>
    </BottomSheetElement.BottomSheetWrapper>
  );
};

