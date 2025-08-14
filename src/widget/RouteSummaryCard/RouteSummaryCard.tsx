import * as S from "./RouteSummaryCard.styles";

import WALKING from "/images/icons/walking.svg";
import UN_WALKING from "/images/icons/un-walking.svg";
import CAR from "/images/icons/car.svg";
import UN_CAR from "/images/icons/un-car.svg";

export type TravelMode = "walk" | "car";

export interface RouteSummaryCardProps {
  durationText?: string;
  mode?: TravelMode;
  onModeChange?: (m: TravelMode) => void;
  onPrimaryAction?: () => void;
}

const ICON_SIZE = 22 as const;

const MODE_META: Record<
  TravelMode,
  { label: string; activeIcon: string; inactiveIcon: string }
> = {
  walk: { label: "도보", activeIcon: WALKING, inactiveIcon: UN_WALKING },
  car: { label: "자가용", activeIcon: CAR, inactiveIcon: UN_CAR },
};

export default function RouteSummaryCard({
  durationText = "",
  mode = "walk",
  onModeChange,
  onPrimaryAction,
}: RouteSummaryCardProps) {
  const modes: TravelMode[] = ["walk", "car"];

  return (
    <S.Wrapper>
      <S.Container>
        {modes.map((m) => {
          const selected = m === mode;
          const meta = MODE_META[m];
          const ButtonComp = m === "walk" ? S.PrimaryButton : S.SecondaryButton;
          const text = selected ? durationText || "경로 보기" : meta.label;

          const handleClick = () => {
            if (selected) onPrimaryAction?.();
            else onModeChange?.(m);
          };

          return (
            <ButtonComp key={m} aria-pressed={selected} onClick={handleClick}>
              <S.IconContainer aria-hidden>
                <S.IconImg
                  src={selected ? meta.activeIcon : meta.inactiveIcon}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  decoding="async"
                  alt=""
                />
              </S.IconContainer>

              <S.IcconText>{text}</S.IcconText>
            </ButtonComp>
          );
        })}
      </S.Container>
    </S.Wrapper>
  );
}
