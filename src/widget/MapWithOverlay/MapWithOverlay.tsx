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
  const [isDestOpen, setIsDestOpen] = useState(true);
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
                    setIsDestOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setUseMyLocation(false);
                      setIsOriginOpen(true);
                      setIsDestOpen(false);
                    }
                  }}
                >
                  내위치{origin?.address ? `: ${origin.address}` : ""}
                </S.MyLocationText>
              ) : origin && !isOriginOpen ? (
                <S.MyLocationText
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setIsOriginOpen(true);
                    setIsDestOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setIsOriginOpen(true);
                      setIsDestOpen(false);
                    }
                  }}
                >
                  {origin.address ??
                    `${origin.lat.toFixed(6)}, ${origin.lng.toFixed(6)}`}
                </S.MyLocationText>
              ) : !useMyLocation && !origin && !isOriginOpen ? (
                // 출발지 없음 + 닫힘: 눌러서 열리는 Pill
                <S.OpenPill
                  onClick={() => {
                    setIsOriginOpen(true);
                    setIsDestOpen(false);
                  }}
                >
                  출발지 입력
                </S.OpenPill>
              ) : (
                // 검색 컴포넌트
                <S.SearchContainer>
                  <DestinationSearch
                    storageKey="safe-route:recent-origin"
                    open={isOriginOpen}
                    onOpen={() => setIsDestOpen(false)}
                    onClose={() => setIsOriginOpen(false)}
                    placeholder="출발지 입력"
                    onSelect={(p) => {
                      setOrigin({
                        lat: +p.y,
                        lng: +p.x,
                        address: p.address_name ?? p.place_name,
                      });
                      setIsOriginOpen(false);
                      setIsDestOpen(true);
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
                  setIsDestOpen(false);
                } else {
                  setOrigin(undefined);
                  setIsOriginOpen(true);
                  setIsDestOpen(false);
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
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setIsDestOpen(true)
                  }
                >
                  {dest.address ??
                    `${dest.lat.toFixed(6)}, ${dest.lng.toFixed(6)}`}
                </S.MyLocationText>
              ) : !dest && !isDestOpen ? (
                // 도착지 없음 + 닫혀있음: 눌러서 열리는 Pill
                <S.OpenPill onClick={() => setIsDestOpen(true)}>
                  도착지 입력
                </S.OpenPill>
              ) : (
                // 실제 검색 컴포넌트
                <S.SearchContainer>
                  <DestinationSearch
                    storageKey="safe-route:recent-dest"
                    open={isDestOpen}
                    onOpen={() => setIsOriginOpen(false)}
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
