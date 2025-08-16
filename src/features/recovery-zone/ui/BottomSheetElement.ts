import * as BasicElement from "./BasicElement";
import style from "styled-components";

export const BottomWrapper = style(BasicElement.Container).attrs(() => ({
    $columnDirection: true,
    $padding: 20,
    $borderRadius: [30, 30, 0, 0]
}))`
    background: ${({ theme }) => theme.colors.black08};
    box-shadow: 4px 0 12px 0 rgba(0, 0, 0, 0.05);
    min-height: 42.3vh;
    position: relative;
    z-index: 10;
    user-select: none;
`;

export const BottomBar = style(BasicElement.FlexBoxModel).attrs(() => ({
    $columnDirection: true,
    $gap: 25,
    $alignItems: "center",
    $justifyContent: "flex-start"
}))`
    height: 100%;
    flex: 1;
`;

export const BottomInner = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 20,
    $columnDirection: true,
    $alignItems: "flex-start"
}))``;

export const BottomButtonList = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 13,
    $columnDirection: false,
    $justifyContent: "flex-start"
}))``;

export const BottomCardList = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 18,
    $columnDirection: true,
    $alignItems: "flex-start"
}))``;

export const BottomButton = style(BasicElement.Button).attrs(() => ({
    $width: "fit-content",
    $padding: [7, 10],
    $gap: 4,
    $columnDirection: false,
    $borderRadius: 30,
    $hover: true
}))`
    background-color: ${({ theme }) => theme.colors.black08};
    border: 1px solid ${({ theme }) => theme.colors.black05};
    
    span {
        ${({ theme }) => theme.fonts.capMedium12};
        color: ${({ theme }) => theme.colors.black03};
    }
    
    img {
        width: 12.036px;
        aspect-ratio: 1:1;
    }
`;

export const BottomCard = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 30,
    $columnDirection: false,
    $justifyContent: "flex-start"
}))`
    
    >img {
        height: 70px;
        aspect-ratio: 1:1;
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
    .couponBox  {
        display: flex;
        padding: 4px 10px;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        background-color: ${({ theme }) => theme.colors.orange06};
        border-radius: 10px;
        white-space: nowrap;
        flex-shrink: 0;
        img{
            height: 20px;
            aspect-ratio: 1:1;
            flex-shrink: 0;
        }
        span {
            ${({ theme }) => theme.fonts.capSemi12};
            color: ${({ theme }) => theme.colors.orange01};
            flex-shrink: 0;
        }
    }

`

export const CardContent = style(BasicElement.FlexBoxModel).attrs(() => ({
    $gap: 15,
    $columnDirection: false,
    $justifyContent: "flex-start"
}))``;
