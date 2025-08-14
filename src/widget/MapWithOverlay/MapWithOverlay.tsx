import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as S from "./MapWithOverlay.styles";
import SafeRouteMap from "@features/safe-route/ui/SafeRouteMap";
import SearchField from "./SearchField";

import type { Loc } from "@shared/types/location";

import RouteSummaryCard, {
  type TravelMode,
} from "@widget/RouteSummaryCard/RouteSummaryCard";
import RouteSummaryCardBottom from "@widget/RouteSummaryCard/RouteSummaryCardBottom";

type ActiveField = "origin" | "dest" | null;

export default function MapWithOverlay() {
  const [origin, setOrigin] = useState<Loc | undefined>(undefined);
  const [dest, setDest] = useState<Loc | undefined>(undefined);
  const [useMyLocation, setUseMyLocation] = useState(true);

  const [active, setActive] = useState<ActiveField>("dest");
  const [mode, setMode] = useState<TravelMode>("walk");

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMyLocation = useCallback(
    (p: Loc) => {
      if (useMyLocation) setOrigin(p);
    },
    [useMyLocation]
  );

  const swapRoute = () => {
    if (!origin && !dest) return;
    setUseMyLocation(false);
    setOrigin(dest);
    setDest(origin);
    setActive((a) => (a === "origin" ? "dest" : a === "dest" ? "origin" : a));
  };

  // TODO: 실제 경로 API 결과로 대체
  const durationText = useMemo(() => {
    if (!origin || !dest) return "";
    return mode === "walk" ? "1시간 12분" : "24분";
  }, [origin, dest, mode]);

  useEffect(() => {
    if (origin && !dest) {
      setActive("dest");
    }
  }, [origin, dest]);

  const isReady = Boolean(origin && dest);

  return (
    <S.Wrap>
      <SafeRouteMap
        origin={origin}
        dest={dest}
        useMyLocation={useMyLocation}
        onMyLocation={handleMyLocation}
      />
      <S.Overlay>
        <S.Card ref={cardRef}>
          <S.SwapHandle onClick={swapRoute} aria-label="출발지/도착지 바꾸기">
            <img src="src/shared/assets/icons/switch.png" />
          </S.SwapHandle>

          {/* 출발지 */}
          <S.Row>
            <S.Dot $center />
            <SearchField
              anchorEl={cardRef.current}
              labelWhenMyLocation={`내위치${
                origin?.address ? `: ${origin.address}` : ""
              }`}
              value={useMyLocation ? undefined : origin}
              setValue={setOrigin}
              placeholder="출발지 입력"
              storageKey="safe-route:recent-origin"
              startOpen={!useMyLocation && !origin}
              showMyLocationLabel={useMyLocation}
              onDisableMyLocation={() => setUseMyLocation(false)}
              onOpenExclusive={() => setActive("origin")}
              shouldClose={active !== "origin"}
              showCloseButton
              isActive={active === "origin"}
            />
          </S.Row>

          <S.Divider />

          {/* 도착지 */}
          <S.SearchRow>
            <S.Dot $dest />
            <SearchField
              anchorEl={cardRef.current}
              value={dest}
              setValue={setDest}
              placeholder="도착지 입력"
              storageKey="safe-route:recent-dest"
              startOpen={true}
              onOpenExclusive={() => setActive("dest")}
              shouldClose={active !== "dest"}
              isActive={active === "dest"}
            />
          </S.SearchRow>
        </S.Card>
      </S.Overlay>

      {isReady && (
        <>
          <S.BottomOverlay>
            <RouteSummaryCard
              durationText={durationText}
              mode={mode}
              onModeChange={setMode}
              onPrimaryAction={() => {}}
            />
          </S.BottomOverlay>
          <RouteSummaryCardBottom />
        </>
      )}
    </S.Wrap>
  );
}
