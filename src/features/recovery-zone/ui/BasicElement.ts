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
} from "../types/ui";

const DESIGN_WIDTH = 375;

// Utility functions
const formatSpacing = (value?: number | number[]) => {
  if (!value) return "0px";
  if (typeof value === "number") return `${value}px`;
  return value.map(v => `${v}px`).join(" ");
};

const formatWidth = (width?: number | string) => {
  if (!width) return "100%";
  if (typeof width === "string") return width;
  return `${width / DESIGN_WIDTH * 100}%`;
};

// Base Layout Component
export const FlexLayout = style.div<FlexLayoutProps>`
  display: flex;
  flex-direction: ${({ $columnDirection }) => $columnDirection ? "column" : "row"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  width: ${({ $width }) => formatWidth($width)};
`;

// Box Model Component
export const BoxModel = style.div<BoxModelProps>`
  padding: ${({ $padding }) => formatSpacing($padding)};
  margin: ${({ $margin }) => formatSpacing($margin)};
  gap: ${({ $gap }) => $gap ? `${$gap}px` : "0px"};
`;

// Visual Component
export const Visual = style.div<VisualProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "inherit"};
  border-radius: ${({ $borderRadius }) => formatSpacing($borderRadius)};
  border: ${({ $border }) => $border || "none"};
  box-shadow: ${({ $boxShadow }) => $boxShadow || "none"};
`;

// Combined Components for common patterns
export const FlexBoxModel = style(FlexLayout)<FlexBoxModelProps>`
  padding: ${({ $padding }) => formatSpacing($padding)};
  margin: ${({ $margin }) => formatSpacing($margin)};
  gap: ${({ $gap }) => $gap ? `${$gap}px` : "0px"};
`;

export const Container = style(FlexBoxModel)<ContainerProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "inherit"};
  border-radius: ${({ $borderRadius }) => formatSpacing($borderRadius)};
  border: ${({ $border }) => $border || "none"};
  box-shadow: ${({ $boxShadow }) => $boxShadow || "none"};
`;

export const Button = style(Container)<ButtonProps>`
  cursor: ${({ $cursor }) => $cursor || "pointer"};
  transition: opacity 0.2s ease;
  
  ${({ $hover }) => $hover && `
    &:hover {
      opacity: 0.8;
    }
  `}
`;

export const Card = style(Container)<CardProps>`
  /* Card-specific styles can be added here */
`;

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

// Legacy support (keeping old names for backward compatibility)
export const BorderRadiusBox = Container;
