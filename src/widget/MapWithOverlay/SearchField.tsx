import { useState, useCallback, useEffect } from "react";
import * as S from "./MapWithOverlay.styles";
import DestinationSearch, {
  type Place,
} from "@features/safe-route/ui/DestinationSearch";
import type { Loc } from "@shared/types/location";

type Props = {
  labelWhenMyLocation?: string;
  value?: Loc;
  setValue: (v: Loc | undefined) => void;
  placeholder: string;
  storageKey: string;
  startOpen?: boolean;
  onOpenExclusive?: () => void;
  showMyLocationLabel?: boolean;
  onDisableMyLocation?: () => void;
  showCloseButton?: boolean;
  anchorEl?: HTMLElement | null;
  shouldClose?: boolean;
  isActive?: boolean;
};

export default function SearchField({
  labelWhenMyLocation,
  value,
  setValue,
  placeholder,
  storageKey,
  startOpen = false,
  onOpenExclusive,
  showMyLocationLabel = false,
  onDisableMyLocation,
  showCloseButton = false,
  anchorEl,
  shouldClose,
}: Props) {
  const [open, setOpen] = useState(startOpen);

  useEffect(() => {
    if (shouldClose) setOpen(false);
  }, [shouldClose]);

  const openMe = useCallback(() => {
    onOpenExclusive?.();
    setOpen(true);
  }, [onOpenExclusive]);

  const closeMe = useCallback(() => setOpen(false), []);

  const clearAndOpen = () => {
    if (showMyLocationLabel) onDisableMyLocation?.();
    setValue(undefined);
    openMe();
  };

  return (
    <S.FlexContent>
      {showMyLocationLabel && !open && (
        <S.MyLocationText
          role="button"
          tabIndex={0}
          onClick={() => {
            onDisableMyLocation?.();
            openMe();
          }}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (onDisableMyLocation?.(), openMe())
          }
        >
          {labelWhenMyLocation}
        </S.MyLocationText>
      )}

      {!showMyLocationLabel && value && !open && (
        <S.MyLocationText
          role="button"
          tabIndex={0}
          onClick={openMe}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openMe()}
          title={`${placeholder} 변경`}
        >
          {value.address ?? `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`}
        </S.MyLocationText>
      )}

      {/* 가짜 인풋 */}
      {!showMyLocationLabel && !value && !open && (
        <S.OpenPill onClick={openMe}>{placeholder}</S.OpenPill>
      )}

      {/* 실제 검색 */}
      {open && (
        <S.SearchContainer>
          <DestinationSearch
            storageKey={storageKey}
            open={open}
            onOpen={onOpenExclusive}
            onClose={closeMe}
            placeholder={placeholder}
            onSelect={(p: Place) => {
              setValue({
                lat: +p.y,
                lng: +p.x,
                address: p.place_name ?? p.address_name,
              });
              closeMe();
            }}
            anchorEl={anchorEl}
          />
        </S.SearchContainer>
      )}

      {showCloseButton && (
        <S.CloseButton
          onClick={clearAndOpen}
          aria-label={`${placeholder} 지우기`}
        >
          ×
        </S.CloseButton>
      )}
    </S.FlexContent>
  );
}
