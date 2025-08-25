import * as BasicElement from "@shared/ui/BasicElement";
import style from "styled-components";

export const MainWrapper = style(BasicElement.FlexBoxModel).attrs(() => ({
  $columnDirection: true,
  $alignItems: "flex-end",
  $width: 336,
  $gap: 30,
}))`
#sinkhole-button{
  display: flex;
  gap: 10px;
}`;

export const TopWrapper = style(BasicElement.FlexBoxModel).attrs(() => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $gap: 20
}))``;

export const TopBar = style(BasicElement.FlexBoxModel).attrs(() => ({
  $justifyContent: "space-between",
}))``;

export const LocationSet = style(BasicElement.Button).attrs(() => ({
  $width: "fit-content",
  $gap: 3
}))`

color: ${({ theme }) => theme.colors.black03};
`;

export const NoticeBar = style(BasicElement.Container).attrs(() => ({
  $alignItems: "center",
  $justifyContent: "flex-start",
  $gap: 10,
  $padding: [9, 7],
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

// 모달 관련 컴포넌트들
export const ModalOverlay = style.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(42, 42, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = style(BasicElement.Container).attrs(() => ({
  $padding: [25, 0, 0, 0],
  $borderRadius: 14,
  $columnDirection: true,
  $alignItems: 'center',
  $gap: 16,
  $backgroundColor: '#fafafa'
}))`
  z-index: 1001;
  min-width: 270px;
  max-width: 320px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  #notice{
    text-align: center;
    color: ${({ theme }) => theme.colors.black01};
    ${({ theme }) => theme.fonts.subExtra16};
  }
  .content{
    text-align: center;
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.capSemi12};
  }
  
  #button-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    .map-container{
    width: 100%;
  }
    button{
      display: flex;
      padding: 11px 36px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      color: ${({ theme }) => theme.colors.orange01};
      ${({ theme }) => theme.fonts.subBold16};
      border-top: 1px solid #c0c0c0;
    } 
  }
`;