import style from "styled-components";
import type {
  FlexLayoutProps,
  BoxModelProps,
  VisualProps,
  FlexBoxModelProps,
  ContainerProps,
  ButtonProps,
  CardProps,
  OverlayProps,
} from "../../features/recovery-zone/types/ui";

// 디자인 기준 화면 너비 (px)
const DESIGN_WIDTH = 375;

// 유틸리티 함수들

// 간격(spacing) 값을 픽셀 단위로 포맷팅하는 함수
const formatSpacing = (value?: number | number[]) => {
  if (!value) return "0px";
  if (typeof value === "number") return `${value}px`;
  return value.map(v => `${v}px`).join(" ");
};

// 너비 값을 퍼센트 또는 문자열로 포맷팅하는 함수
const formatWidth = (width?: number | string) => {
  if (!width) return "100%";
  if (typeof width === "string") return width;
  return `${width / DESIGN_WIDTH * 100}%`;
};

// 기본 레이아웃 컴포넌트 - Flexbox 기반 레이아웃
export const FlexLayout = style.div<FlexLayoutProps>`
  display: flex;
  flex-direction: ${({ $columnDirection }) => $columnDirection ? "column" : "row"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  width: ${({ $width }) => formatWidth($width)};
`;

// 박스 모델 컴포넌트 - 패딩, 마진, 간격 스타일링
export const BoxModel = style.div<BoxModelProps>`
  padding: ${({ $padding }) => formatSpacing($padding)};
  margin: ${({ $margin }) => formatSpacing($margin)};
  gap: ${({ $gap }) => $gap ? `${$gap}px` : "0px"};
`;

// 시각적 스타일 컴포넌트 - 색상, 테두리, 그림자 등
export const Visual = style.div<VisualProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "inherit"};
  border-radius: ${({ $borderRadius }) => formatSpacing($borderRadius)};
  border: ${({ $border }) => $border || "none"};
  box-shadow: ${({ $boxShadow }) => $boxShadow || "none"};
`;

// 일반적인 패턴을 위한 조합 컴포넌트들

// Flex 레이아웃과 박스 모델이 결합된 컴포넌트
export const FlexBoxModel = style(FlexLayout)<FlexBoxModelProps>`
  padding: ${({ $padding }) => formatSpacing($padding)};
  margin: ${({ $margin }) => formatSpacing($margin)};
  gap: ${({ $gap }) => $gap ? `${$gap}px` : "0px"};
`;

// 범용 컨테이너 컴포넌트 - 레이아웃, 박스 모델, 시각적 스타일 모두 포함
export const Container = style(FlexBoxModel)<ContainerProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "inherit"};
  border-radius: ${({ $borderRadius }) => formatSpacing($borderRadius)};
  border: ${({ $border }) => $border || "none"};
  box-shadow: ${({ $boxShadow }) => $boxShadow || "none"};
`;

// 버튼 컴포넌트 - 클릭 가능한 인터랙티브 요소
export const Button = style(Container)<ButtonProps>`
  cursor: ${({ $cursor }) => $cursor || "pointer"};
  transition: opacity 0.2s ease;
  
  ${({ $hover }) => $hover && `
    &:hover {
      opacity: 0.8;
    }
  `}
`;

// 카드 컴포넌트 - 콘텐츠를 담는 카드 형태의 컨테이너
export const Card = style(Container)<CardProps>`
  /* 카드 전용 스타일을 여기에 추가할 수 있음 */
`;

// 오버레이 컴포넌트 - 위치 지정 가능한 절대/상대 위치 요소
export const Overlay = style.div<OverlayProps>`
  position: ${({ $position }) => $position || "absolute"};
  top: ${({ $top }) => $top ? `${$top}px` : "auto"};
  left: ${({ $left }) => $left ? `${$left}px` : "auto"};
  bottom: ${({ $bottom }) => $bottom ? `${$bottom}px` : "auto"};
  right: ${({ $right }) => $right ? `${$right}px` : "auto"};
  z-index: ${({ $zIndex }) => $zIndex || 1};
  background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "inherit"};
  border-radius: ${({ $borderRadius }) => formatSpacing($borderRadius)};
  border: ${({ $border }) => $border || "none"};
  box-shadow: ${({ $boxShadow }) => $boxShadow || "none"};
`;

// 하위 호환성 지원 (기존 이름 유지)
export const BorderRadiusBox = Container;
