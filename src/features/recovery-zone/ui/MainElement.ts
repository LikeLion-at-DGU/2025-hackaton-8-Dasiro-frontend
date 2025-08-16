import * as BasicElement from "./BasicElement";
import style from "styled-components";

export const MainWrapper = style(BasicElement.FlexBoxModel).attrs(() => ({
    $columnDirection: true,
    $alignItems: "flex-end",
    $width: 336,
    $gap: 30,
}))``;

export const TopWrapper = style(BasicElement.FlexBoxModel).attrs(() => ({
    $columnDirection: true,
    $alignItems: "flex-start",
    $gap: 20
}))``;

export const TopBar = style(BasicElement.FlexBoxModel).attrs(() => ({
    $justifyContent: "space-between",
}))``;

export const LocationSet = style(BasicElement.FlexBoxModel).attrs(() => ({
    $width: "fit-content",
    $gap: 3
}))``;

export const NoticeBar = style(BasicElement.Container).attrs(() => ({
    $alignItems: "center",
    $gap: 10,
    $padding: [9, 13],
    $borderRadius: 10
}))`
  background-color: ${({ theme }) => theme.colors.orange05};
  
  span:nth-child(1) {
    ${({ theme }) => theme.fonts.capExtra12};
    color: ${({ theme }) => theme.colors.orange01};
  }
  
  span:nth-child(2) {
    ${({ theme }) => theme.fonts.capSemi12};
    color: ${({ theme }) => theme.colors.black02};
  }
`;

export const MainContent = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 30
}))``;