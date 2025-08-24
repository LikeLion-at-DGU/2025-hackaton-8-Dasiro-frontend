import style, { keyframes } from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import exclamation from "/images/icons/exclamation.png";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
`;

const ToastWrapper = style(BasicElement.Container).attrs<{
  $isExiting?: boolean;
}>(() => ({
  $padding: [12, 14],
  $borderRadius: 10,
  $gap: 10,
  $justifyContent: "flex-start",
}))<{ $isExiting?: boolean }>`
  margin-bottom: -10px;
  ${({ theme }) => theme.fonts.bodyBold14}
  background-color: ${({ theme }) => theme.colors.orange01};
  color: ${({ theme }) => theme.colors.orange06};

  /* ★ fadeIn/fadeOut 끝난 뒤 상태 유지 */
  animation: ${({ $isExiting }) =>
    $isExiting ? fadeOut : fadeIn} 0.3s ease-out forwards;

  img{
    width: 20px;
    height: 20px;
  }
`;

interface ToastingBoxProps {
  filterType: "임시복구" | "복구중";
  onAnimationEnd?: () => void;
  isExiting?: boolean;
}

export const ToastingBox = ({
  filterType,
  onAnimationEnd,
  isExiting = false,
}: ToastingBoxProps) => {
  const getMessage = () => {
    if (filterType === "임시복구") {
      return "임시복구 지역의 상권 정보는 제공되지 않아요!";
    } else if (filterType === "복구중") {
      return "복구중인 지역의 상권 정보는 제공되지 않아요!";
    }
    return "임시복구 지역의 상권 정보는 제공되지 않아요!";
  };

  const handleAnimationEnd = () => {
    // ★ 애니메이션 이름을 보지 말고 상태값으로 판별
    if (isExiting && onAnimationEnd) onAnimationEnd();
  };

  return (
    <ToastWrapper $isExiting={isExiting} onAnimationEnd={handleAnimationEnd}>
      <img src={exclamation} alt="경고" />
      {getMessage()}
    </ToastWrapper>
  );
};
