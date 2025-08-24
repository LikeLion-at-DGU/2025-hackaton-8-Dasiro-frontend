import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { SinkholeBottomSheetElement as BottomSheetElement } from "../ui";
import sheetbar from "/images/icons/sheetbar.png";

interface DraggableBottomSheetProps {
  children: ReactNode;
  onSetHeight?: (height: number) => void;
}

const minHeight: number = 36;

export const DraggableBottomSheet = ({ children }: DraggableBottomSheetProps) => {
  const [height, setHeight] = useState(minHeight);
  const [isDragging, setIsDragging] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(minHeight);

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

  const handleInnerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (height < 100) {
      e.preventDefault();
      setHeight(100);
    }
  };

  const handleInnerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (height < 100) {
      e.preventDefault();
      e.stopPropagation();
      setHeight(100);
    }
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
          onWheel={handleInnerWheel}
          onTouchMove={handleInnerTouchMove}
        >
          {children}
        </BottomSheetElement.BottomInner>
      </BottomSheetElement.BottomBar>
    </BottomSheetElement.BottomSheetWrapper>
  );
};

