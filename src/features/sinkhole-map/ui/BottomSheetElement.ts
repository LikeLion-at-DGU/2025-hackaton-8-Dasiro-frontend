import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";


export const BottomSheetGradeButton = style(BasicElement.Button).attrs<{
  $isActive?: boolean;
}>(({ theme, $isActive }) => ({
  $width: 500,
  $padding: [7, 9],
  $columnDirection: true,
  $hover: true,
  $backgroundColor: $isActive ? theme.colors.orange01 : "transparent",
  $textColor: $isActive ? theme.colors.orange05 : theme.colors.black02,
}))`
  border-radius: 5px;
  ${({ theme }) => theme.fonts.bodySemiB14}
  &:hover{
    background-color: ${({ theme }) => theme.colors.orange01};
    color: ${({ theme }) => theme.colors.orange05};
  }
`;

export const BottomSheetContent = style(BasicElement.Container).attrs(() => ({
  $gap: 35,
  $columnDirection: true,
  $alignItems: 'flex-start'
}))``;

