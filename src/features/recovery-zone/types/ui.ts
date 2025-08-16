// Base Layout Props
export interface FlexLayoutProps {
  $columnDirection?: boolean;
  $width?: number | string;
  $alignItems?: string;
  $justifyContent?: string;
}

// Box Model Props
export interface BoxModelProps {
  $padding?: number | number[];
  $margin?: number | number[];
  $gap?: number;
}

// Visual Props
export interface VisualProps {
  $backgroundColor?: string;
  $textColor?: string;
  $borderRadius?: number | number[];
  $border?: string;
  $boxShadow?: string;
}

// Interactive Props
export interface InteractiveProps {
  $cursor?: string;
  $hover?: boolean;
}

// Position Props
export interface PositionProps {
  $top?: number;
  $left?: number;
  $bottom?: number;
  $right?: number;
  $position?: string;
  $zIndex?: number;
}

// Combined Props for common patterns
export interface FlexBoxModelProps extends FlexLayoutProps, BoxModelProps {}

export interface ContainerProps extends FlexBoxModelProps, VisualProps {}

export interface ButtonProps extends ContainerProps, InteractiveProps {}

export interface CardProps extends ContainerProps {}

export interface OverlayProps extends PositionProps, VisualProps {}

