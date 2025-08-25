import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { SinkholeBottomSheetElement as BottomSheetElement } from "../ui";
import sheetbar from "/images/icons/sheetbar.png";

interface DraggableBottomSheetProps {
  children: (height: number) => ReactNode;
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
      
      // 드래그 방향에 따라 즉시 최대/최소 높이로 설정
      const deltaY = startYRef.current - e.clientY;
      if (deltaY > 0) {
        // 위로 드래그 시 100vh
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(100);
        } else {
          setHeight(100);
        }
      } else if (deltaY < 0) {
        // 아래로 드래그 시 35vh
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(35);
        } else {
          setHeight(minHeight);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      // 드래그 방향에 따라 즉시 최대/최소 높이로 설정
      const deltaY = startYRef.current - e.touches[0].clientY;
      if (deltaY > 0) {
        // 위로 드래그 시 100vh
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(100);
        } else {
          setHeight(100);
        }
      } else if (deltaY < 0) {
        // 아래로 드래그 시 35vh
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(35);
        } else {
          setHeight(minHeight);
        }
      }
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
      // 위로 스크롤할 때는 바로 35vh로 설정 (바텀시트 축소)
      if (e.deltaY < 0) {
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(35);
        } else {
          setHeight(minHeight);
        }
      } else {
        // 아래로 스크롤할 때는 바로 100vh로 설정 (바텀시트 확장)
        if ((window as any).setBottomSheetHeight) {
          (window as any).setBottomSheetHeight(100);
        } else {
          setHeight(100);
        }
      }
    }
  };

  const handleInnerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    if (lastTouchYRef.current !== null) {
      const deltaY = lastTouchYRef.current - currentY;
      if (height < 100 || (height > minHeight && deltaY < 0)) {
        e.preventDefault();
        e.stopPropagation();
        // 위로 드래그할 때는 바로 35vh로 설정 (바텀시트 축소)
        if (deltaY > 0) {
          if ((window as any).setBottomSheetHeight) {
            (window as any).setBottomSheetHeight(35);
          } else {
            setHeight(minHeight);
          }
        } else {
          // 아래로 드래그할 때는 바로 100vh로 설정 (바텀시트 확장)
          if ((window as any).setBottomSheetHeight) {
            (window as any).setBottomSheetHeight(100);
          } else {
            setHeight(100);
          }
        }
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
        transition: isDragging ? "none" : "height 0.8s ease-out",
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
            overflow: height >= 100 ? 'auto' : 'hidden',
          } as React.CSSProperties}
          id="bottomInner"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={handleInnerTouchMove}
          onTouchEnd={handleInnerTouchEnd}
        >
          {children(height)}
        </BottomSheetElement.BottomInner>
      </BottomSheetElement.BottomBar>
    </BottomSheetElement.BottomSheetWrapper>
  );
};

