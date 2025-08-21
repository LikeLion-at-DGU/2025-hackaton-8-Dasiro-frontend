import * as BasicElement from "@shared/ui/BasicElement";
import style from "styled-components";
import badge from "/images/icons/badge.png";
import layer from "/images/icons/layer.png";
import nolayer from "/images/icons/nolayer.png";

export const SelectButton = style(BasicElement.Button).attrs<{
  $isActive?: boolean;
}>(({ theme, $isActive }) => ({
  $width: "fit-content",
  $gap: 5,
  $columnDirection: false,
  $hover: true,
  $backgroundColor: $isActive ? theme.colors.orange01 : theme.colors.orange05,
  $textColor: $isActive ? theme.colors.orange05 : theme.colors.orange01,
}))`
  padding: 7px 9px;
  border-radius: 8px;
  img{
    width: 16px;
    aspect-ratio: 1/1;
  }
`;

// type SinkholeButtonProps = "badge" | "layer";

export const SinkholeButton = (
  type: "badge" | "layer" | null = null,
  isActive: boolean = false,
  onClick?: () => void
) => {
  const innerText = type === "badge" ? "부동산 안심존" : "전체";
  const imageSrc = type === "badge" ? badge : isActive ? layer : nolayer; // layer는 활성화 상태에 따라 결정

  return (
    <SelectButton data-type={type} $isActive={isActive} onClick={onClick}>
      {type && <img src={imageSrc} alt="아이콘" />}
      <span>{innerText}</span>
    </SelectButton>
  );
};
