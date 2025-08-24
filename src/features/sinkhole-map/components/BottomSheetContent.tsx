import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import whitemarker from "/images/icons/whitemarker.png";
import { Banner } from "@features/sinkhole-map/containers/Banner";
import { useState, useEffect, useRef, type FC } from "react";
import { useSelectGrade } from "@entities/sinkhole/context";
import { GradeFilterContent } from "./GradeFilterContent";
import { SafezoneFilterContent } from "./SafezoneFilterContent";
import { SearchResultContent } from "./SearchResultContent";

const StyledButton = style(BasicElement.Button)`
  ${({ theme }) => theme.fonts.bodySemiB14}
  color: ${({ theme }) => theme.colors.orange06};
  background-color: ${({ theme }) => theme.colors.orange01};
  position: fixed;
  bottom: 13vh;
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

export const BottomSheetContent = () => {
  const [bottomSheetHeight, setBottomSheetHeight] = useState(36);
  const lastHeightRef = useRef(36);
  const { searchedDistrict, isBadgeActive } = useSelectGrade();
  
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
      }, 30); // 30ms debounce 로 감소
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
    // BottomCardList 스크롤을 맨 위로 이동
    const bottomCardList = document.querySelector('.bottom-card-list') as HTMLElement;
    if (bottomCardList) {
      bottomCardList.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    if ((window as any).setBottomSheetHeight) {
      (window as any).setBottomSheetHeight(36);
    }
  };
  
  const shouldShowButton = bottomSheetHeight >= 45;
  let Content: FC;
  if (searchedDistrict) {
    Content = SearchResultContent;
  } else if (isBadgeActive) {
    Content = SafezoneFilterContent;
  } else {
    Content = GradeFilterContent;
  }

  return (
    <BasicElement.Container $gap={40} $columnDirection={true}>
      <Banner />
      <Content />
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
    </BasicElement.Container>
  );
};

export default BottomSheetContent;
