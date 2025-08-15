import style from "styled-components"
import type {
  DivFlexProps,
  WrapperProps,
  HeaderProps,
  StatusBarProps,
  MapContainerProps,
  BottomNavProps,
  FloatingButtonProps,
  CardProps,
  LegendProps
} from "../../types/ui";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812; // 기준 디자인 높이

export const DivFlex = style.div<DivFlexProps>`
    display: flex;
    align-items: center;
    flex-direction: ${({ $ColumnDirection }) =>
    $ColumnDirection ? "column" : "row"};
    width: ${({ $Width }) => ($Width ? `${$Width / DESIGN_WIDTH * 100}%` : "100%")};
`;

export const Wrapper = style(DivFlex) <WrapperProps>`
  padding: ${({ $padding }) => {
    if (!$padding) return "0px";
    if (typeof $padding === "number") return `${$padding}px`;
    return `${$padding.ver}px ${$padding.hoz || $padding.ver}px`;
  }};
  gap: ${({ $gap }) => ($gap ? `${$gap}px` : "0px")};
`;

export const StatusBar = style.div<StatusBarProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({ $backgroundColor }) => $backgroundColor || "#000"};
  color: ${({ $textColor }) => $textColor || "#fff"};
  font-size: 14px;
  font-weight: 600;
`;

export const Header = style.div<HeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${({ $backgroundColor }) => $backgroundColor || "#fff"};
`;

export const HeaderTitle = style.h1`
  font-size: 24px;
  font-weight: 700;
  color: #FF6B6B;
  margin: 0;
`;

export const LocationDropdown = style.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #999;
  font-size: 14px;
  cursor: pointer;
`;

export const MapContainer = style.div<MapContainerProps>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height ? `${$height}px` : "300px"};
  background: ${({ $backgroundColor }) => $backgroundColor || "#f5f5f5"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Legend = style.div<LegendProps>`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px 20px;
  flex-direction: ${({ $vertical }) => $vertical ? "column" : "row"};
`;

export const LegendItem = style.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
`;

export const LegendDot = style.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const BottomNav = style.nav<BottomNavProps>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  background: ${({ $backgroundColor }) => $backgroundColor || "#fff"};
  border-top: ${({ $borderTop }) => $borderTop || "1px solid #e0e0e0"};
`;

export const NavItem = style.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  
  &.active {
    color: #FF6B6B;
  }
`;

export const FloatingButton = style.button<FloatingButtonProps>`
  position: fixed;
  bottom: ${({ $bottom }) => $bottom ? `${$bottom}px` : "100px"};
  right: ${({ $right }) => $right ? `${$right}px` : "20px"};
  width: ${({ $size }) => $size ? `${$size}px` : "56px"};
  height: ${({ $size }) => $size ? `${$size}px` : "56px"};
  border-radius: 50%;
  background: ${({ $backgroundColor }) => $backgroundColor || "#FF6B6B"};
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

export const Card = style.div<CardProps>`
  background: ${({ $backgroundColor }) => $backgroundColor || "#fff"};
  border-radius: ${({ $borderRadius }) => $borderRadius ? `${$borderRadius}px` : "12px"};
  padding: ${({ $padding }) => {
    if (!$padding) return "16px";
    if (typeof $padding === "number") return `${$padding}px`;
    return `${$padding.ver}px ${$padding.hoz || $padding.ver}px`;
  }};
  box-shadow: ${({ $shadow }) => $shadow || "0 2px 8px rgba(0, 0, 0, 0.1)"};
  margin: ${({ $margin }) => {
    if (!$margin) return "0";
    if (typeof $margin === "number") return `${$margin}px`;
    return `${$margin.ver}px ${$margin.hoz || $margin.ver}px`;
  }};
`;

export const FloatImg = style.img`
  width: 3.5rem;
  height: 3.5rem;
  position: absolute;
  bottom: 80px;
  right: 0;
  cursor: pointer;
  z-index: 40;
  pointer-events: auto;
`;
