import { useCallback, useState } from "react";
import * as S from "./MapWithOverlay.styles";
import SafeRouteMap from "@features/safe-route/ui/SafeRouteMap";
import DestinationSearch from "@features/safe-route/ui/DestinationSearch";
import type { Loc } from "@shared/types/location";

export default function MapWithOverlay() {
  const [origin, setOrigin] = useState<Loc | undefined>(undefined);
  const [dest, setDest] = useState<Loc | undefined>(undefined);
  const [useMyLocation, setUseMyLocation] = useState(true);
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(true); // 처음엔 인풋 보이게
  const handleMyLocation = useCallback(
    (p: Loc) => {
      if (useMyLocation) setOrigin(p);
    },
    [useMyLocation]
  );

  return (
    <S.Wrap>
      <SafeRouteMap
        origin={origin}
        dest={dest}
        useMyLocation={useMyLocation}
        onMyLocation={handleMyLocation}
      />

      <S.Overlay>
        <S.Card>
          {/* 출발지 줄 */}
          <S.Row>
            <S.Dot $center />
            <S.FlexContent>
              {useMyLocation ? (
                <S.MyLocationText
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setUseMyLocation(false);
                    setIsOriginOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setUseMyLocation(false);
                      setIsOriginOpen(true);
                    }
                  }}
                >
                  내위치{origin?.address ? `: ${origin.address}` : ""}
                </S.MyLocationText>
              ) : origin && !isOriginOpen ? (
                <S.MyLocationText
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsOriginOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setIsOriginOpen(true);
                  }}
                >
                  {origin.address ??
                    `${origin.lat.toFixed(6)}, ${origin.lng.toFixed(6)}`}
                </S.MyLocationText>
              ) : (
                <S.SearchContainer>
                  <DestinationSearch
                    open={isOriginOpen}
                    onClose={() => setIsOriginOpen(false)}
                    placeholder="출발지 입력"
                    onSelect={(p) => {
                      setOrigin({
                        lat: +p.y,
                        lng: +p.x,
                        address: p.address_name ?? p.place_name,
                      });
                      setIsOriginOpen(false);
                    }}
                  />
                </S.SearchContainer>
              )}
            </S.FlexContent>

            <S.CloseButton
              onClick={() => {
                if (useMyLocation) {
                  setUseMyLocation(false);
                  setOrigin(undefined);
                  setIsOriginOpen(true);
                } else {
                  setOrigin(undefined);
                  setIsOriginOpen(true);
                }
              }}
            >
              ×
            </S.CloseButton>
          </S.Row>
          <S.Divider />
          {/* 도착지 줄 */}
          <S.SearchRow>
            <S.Dot $dest />
            <S.FlexContent>
              {dest && !isDestOpen ? (
                <S.MyLocationText
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsDestOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setIsDestOpen(true);
                  }}
                >
                  도착지:{" "}
                  {dest.address ??
                    `${dest.lat.toFixed(6)}, ${dest.lng.toFixed(6)}`}
                </S.MyLocationText>
              ) : (
                <S.SearchContainer>
                  <DestinationSearch
                    open={isDestOpen}
                    onClose={() => setIsDestOpen(false)}
                    placeholder="도착지 입력"
                    onSelect={(p) => {
                      setDest({
                        lat: +p.y,
                        lng: +p.x,
                        address: p.address_name ?? p.place_name,
                      });
                      setIsDestOpen(false);
                    }}
                  />
                </S.SearchContainer>
              )}
            </S.FlexContent>
          </S.SearchRow>
        </S.Card>
      </S.Overlay>
    </S.Wrap>
  );
}
