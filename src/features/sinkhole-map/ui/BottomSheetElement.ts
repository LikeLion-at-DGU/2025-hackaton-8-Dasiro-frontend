import * as BasicElement from "../../../shared/ui/BasicElement";
import style from "styled-components";

// BottomSheet 메인 컨테이너
export const BottomSheetWrapper = style(BasicElement.Container).attrs(() => ({
  $columnDirection: true,
  $padding: 20,
  $borderRadius: [30, 30, 0, 0],
  $backgroundColor: "#ffffff",
  $boxShadow: "4px 0 12px 0 rgba(0, 0, 0, 0.05)",
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  user-select: none;
`;

export const BottomWrapper = style(BasicElement.Container).attrs(() => ({
  $columnDirection: true,
  $padding: 20,
  $borderRadius: [30, 30, 0, 0],
  $backgroundColor: undefined,
  $boxShadow: "4px 0 12px 0 rgba(0, 0, 0, 0.05)",
}))`
  background: ${({ theme }) => theme.colors.black08};
  min-height: 36vh;
  position: relative;
  z-index: 10;
  user-select: none;
`;

export const BottomBar = style(BasicElement.FlexBoxModel).attrs(() => ({
  $columnDirection: true,
  $gap: 25,
  $alignItems: "center",
  $justifyContent: "flex-start",
}))`
  height: 100%;
  flex: 1;
`;

export const BottomInner = style(BasicElement.FlexBoxModel).attrs(() => ({
  $gap: 20,
  $columnDirection: true,
  $alignItems: "flex-start",
}))`
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
`;

export const BottomButtonList = style(BasicElement.FlexBoxModel).attrs<{
  $isSearch?: boolean;
}>({
  $gap: 15,
  $columnDirection: false,
  $justifyContent: "space-between",
})`
  display: ${({ $isSearch }) => ($isSearch ? "none" : "flex")};
`;

export const BottomCardList = style(BasicElement.FlexBoxModel).attrs(() => ({
  $gap: 18,
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "flex-start",
  className: "bottom-card-list"
}))`
  overflow-y: var(--scroll-enabled, auto);
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  &::-webkit-scrollbar {
    display: none;
  }
  .dong {
    color: ${({ theme }) => theme.colors.orange01};
  }
`;

export const BottomButton = style(BasicElement.Button).attrs<{
  $isSelected?: boolean;
  $isDropdownOpen?: boolean;
}>(() => ({
  $width: "fit-content",
  $padding: [7, 10],
  $gap: 4,
  $columnDirection: false,
  $hover: true,
}))<{
  $isSelected?: boolean;
  $isDropdownOpen?: boolean;
}>`
  border-radius: ${({ $isDropdownOpen }) =>
    $isDropdownOpen ? "15px 15px 0px 0px" : "30px"};
  background-color: ${({ theme }) => theme.colors.black08};
  border: 1px solid ${({ theme }) => theme.colors.black05};

  span {
    ${({ theme }) => theme.fonts.capMedium12};
    color: ${({ theme }) => theme.colors.black03};
  }

  img {
    width: 12.036px;
    aspect-ratio: 1/1;
  }
`;

export const BottomCard = style(BasicElement.FlexBoxModel).attrs(() => ({
  $gap: 30,
  $columnDirection: false,
  $justifyContent: "flex-start",
}))`
  border-bottom: 1px dashed #e1e1e1;
  padding-bottom: 12px;
  > img {
    height: 70px;
    aspect-ratio: 1/1;
    border-radius: 5px;
  }
  .cardInner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
  }
  .cardTitls {
    ${({ theme }) => theme.fonts.bodyBold14};
    color: ${({ theme }) => theme.colors.black02}
  }
  .cardPos {
    ${({ theme }) => theme.fonts.capMedium12};
    color: ${({ theme }) => theme.colors.black03}
  }
  .couponBox {
    display: flex;
    padding: 4px 10px;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    background-color: ${({ theme }) => theme.colors.orange06};
    border-radius: 10px;
    white-space: nowrap;
    flex-shrink: 0;
    &:hover {
      cursor: pointer;
    }
    img {
      height: 20px;
      aspect-ratio: 1/1;
      flex-shrink: 0;
    }
    span {
      ${({ theme }) => theme.fonts.capSemi12};
      color: ${({ theme }) => theme.colors.orange01};
      flex-shrink: 0;
    }
  }
`;

export const CardContent = style(BasicElement.FlexBoxModel).attrs(() => ({
  $gap: 15,
  $columnDirection: false,
  $justifyContent: "flex-start",
}))`
  .cardDate {
    ${({ theme }) => theme.fonts.capMedium10};
    color: ${({ theme }) => theme.colors.black04};
  }
  .cardTitles {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.bodyBold14};
  }
`;

export const DropdownContainer = style(BasicElement.Container).attrs(() => ({
  $width: "fit-content",
}))`
  position: relative;
`;

export const DropdownList = style(BasicElement.Overlay).attrs(() => ({
  $position: "absolute" as const,
  $left: 0,
  $zIndex: 1000,
  $backgroundColor: "#ffffff",
  $boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  $border: undefined,
}))`
  top: 100%;
  width: fit-content;
  min-width: 100%;
  border-radius: 0px 0px 15px 15px;
  border: 1px solid ${({ theme }) => theme.colors.black05};
  border-top: none;
  overflow: hidden;
  white-space: nowrap;
`;

export const DropdownItem = style(BasicElement.Container).attrs(() => ({
  $padding: 10,
  $backgroundColor: "transparent",
  $hover: true,
}))`
  ${({ theme }) => theme.fonts.capMedium12};
  color: ${({ theme }) => theme.colors.black02};
  &:hover {
    background-color: ${({ theme }) => theme.colors.black08};
  }
`;

// 싱크홀 전용 버튼 및 콘텐츠
export const BottomSheetGradeButton = style(BasicElement.Button).attrs<{ $isActive?: boolean }>(
  ({ theme, $isActive }) => ({
    $width: 500,
    $padding: [7, 9],
    $columnDirection: true,
    $hover: true,
    $backgroundColor: $isActive ? theme.colors.orange01 : "transparent",
    $textColor: $isActive ? theme.colors.orange05 : theme.colors.black02,
  })
)`
  border-radius: 5px;
  ${({ theme }) => theme.fonts.bodySemiB14};
  &:hover {
    background-color: ${({ theme }) => theme.colors.orange01};
    color: ${({ theme }) => theme.colors.orange05};
  }
`;

export const BottomSheetContent = style(BasicElement.Container).attrs(() => ({
  $gap: 35,
  $columnDirection: true,
  $alignItems: "flex-start",
}))``;

