export interface DivFlexProps {
  $ColumnDirection?: boolean;
  $Width?: number;
}

interface PaddingSize {
  ver: number;
  hoz?: number;
}

interface MarginSize {
  ver: number;
  hoz?: number;
}

export interface WrapperProps extends DivFlexProps {
  $padding?: PaddingSize | number;
  $gap?: number;
}

export type PositionProps = {
  $top?: number;
  $left?: number;
};

export interface StatusBarProps {
  $backgroundColor?: string;
  $textColor?: string;
}

export interface HeaderProps {
  $backgroundColor?: string;
}

export interface MapContainerProps {
  $height?: number;
  $backgroundColor?: string;
}

export interface LegendProps {
  $vertical?: boolean;
}

export interface BottomNavProps {
  $backgroundColor?: string;
  $borderTop?: string;
}

export interface FloatingButtonProps extends PositionProps {
  $bottom?: number;
  $right?: number;
  $size?: number;
  $backgroundColor?: string;
}

export interface CardProps {
  $backgroundColor?: string;
  $borderRadius?: number;
  $padding?: PaddingSize | number;
  $shadow?: string;
  $margin?: MarginSize | number;
}