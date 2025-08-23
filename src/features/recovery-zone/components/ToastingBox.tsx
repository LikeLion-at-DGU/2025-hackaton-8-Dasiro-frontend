import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import exclamation from "/images/icons/exclamation.png";

const ToastWrapper = style(BasicElement.Container).attrs(() => ({
  $padding: [12, 14],
  $borderRadius: 10,
  $gap: 10,
  $justifyContent: "flex-start",
}))`
    margin-bottom: -10px;
    ${({theme}) => theme.fonts.bodyBold14}
    background-color: ${({ theme }) => theme.colors.orange01};
    color: ${({ theme }) => theme.colors.orange06};
    img{
        width: 20px;
        height: 20px;
    }
`;

interface ToastingBoxProps {
  filterType: "임시복구" | "복구중";
}

export const ToastingBox = ({ filterType }: ToastingBoxProps) => {
  const getMessage = () => {
    if (filterType === "임시복구") {
      return "임시복구 지역의 상권 정보는 제공되지 않아요!";
    } else if (filterType === "복구중") {
      return "복구중인 지역의 상권 정보는 제공되지 않아요!";
    }
    return "임시복구 지역의 상권 정보는 제공되지 않아요!";
  };

  return (
    <ToastWrapper>
      <img src={exclamation} alt="경고" />
      {getMessage()}
    </ToastWrapper>
  );
};
