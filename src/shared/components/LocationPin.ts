// 위치 핀 생성 유틸리티 함수
export const createLocationPin = (options?: {
  size?: number;
  color?: string;
  shadowColor?: string;
  borderColor?: string;
  shadowSpread?: number;
  borderWidth?: number;
}) => {
  const {
    size = 20,
    color = "#FF7765",
    shadowColor = "rgba(255, 119, 101, 0.30)",
    borderColor = "#fff6f0",
    shadowSpread = 5,
    borderWidth = 4
  } = options || {};

  const pinElement = document.createElement("div");
  pinElement.style.width = `${size}px`;
  pinElement.style.height = `${size}px`;
  pinElement.style.borderRadius = "50%";
  pinElement.style.background = color;
  pinElement.style.boxShadow = `0 0 0 ${shadowSpread}px ${shadowColor}`;
  pinElement.style.border = `${borderWidth}px solid ${borderColor}`;
  pinElement.style.cursor = "pointer";

  return pinElement;
};

// 기본 다시로 스타일 핀
export const createDasiroPin = () => {
  return createLocationPin({
    size: 20,
    color: "#FF7765",
    shadowColor: "rgba(255, 119, 101, 0.30)",
    borderColor: "#fff6f0",
    shadowSpread: 5,
    borderWidth: 4
  });
};