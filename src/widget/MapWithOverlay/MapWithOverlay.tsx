import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./MapWithOverlay.styles";
import SafeRouteMap from "@features/safe-route/ui/SafeRouteMap";
import SearchField from "./SearchField";
import RouteSummaryCard, {
  type TravelMode,
} from "@widget/RouteSummaryCard/RouteSummaryCard";
import RouteSummaryCardBottom from "@widget/RouteSummaryCard/RouteSummaryCardBottom";
import type { Loc } from "@shared/types/location";
import type { RouteResult } from "@features/safe-route/types";
import { getSafeRoutes } from "@features/safe-route/api/getSafeRoutes";
import { formatDurationKR } from "@features/safe-route/lib/distance";
import { useOutletContext } from "react-router-dom";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

type ActiveField = "origin" | "dest" | null;

export default function MapWithOverlay() {
  const [origin, setOrigin] = useState<Loc | undefined>(undefined);
  const [dest, setDest] = useState<Loc | undefined>(undefined);
  const [useMyLocation, setUseMyLocation] = useState(true);

  const [active, setActive] = useState<ActiveField>("dest");
  const [mode, setMode] = useState<TravelMode>("walk");
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  // 모드별 경로 캐시
  const [routesByMode, setRoutesByMode] = useState<Partial<
    Record<TravelMode, RouteResult>
  > | null>(null);

  // 현재 표시할 값
  const [routePath, setRoutePath] = useState<
    RouteResult["coords"] | undefined
  >();
  const [durationText, setDurationText] = useState("");
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [distanceM, setDistanceM] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // 내 위치 수신 시 origin 세팅
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

  // origin/dest 바뀔 때 API 한 번 호출해서 두 모드 전부 받아오기
  useEffect(() => {
    let canceled = false;

    (async () => {
      if (!origin || !dest) {
        setRoutesByMode(null);
        setRoutePath(undefined);
        setDurationText("");
        setDurationSec(null);
        setDistanceM(null);
        return;
      }

      const res = await getSafeRoutes({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: dest.lat, lng: dest.lng },
      });

      if (canceled) return;
      setRoutesByMode(res);
    })();

    return () => {
      canceled = true;
    };
  }, [origin, dest]);

  // 선택 모드/새 경로 들어오면 표시값 갱신
  useEffect(() => {
    if (!routesByMode) return;
    const current = routesByMode[mode] ?? routesByMode.walk ?? routesByMode.car;
    if (!current) return;

    setRoutePath(current.coords);
    setDurationSec(current.durationSec);
    setDistanceM(current.distanceM);
    setDurationText(formatDurationKR(current.durationSec));
  }, [mode, routesByMode]);

  useEffect(() => {
    if (origin && !dest) setActive("dest");
  }, [origin, dest]);

  const isReady = Boolean(origin && dest);

  useEffect(() => {
    setFooterHidden(isReady);

    return () => setFooterHidden(false);
  }, [isReady, setFooterHidden]);

  return (
    <S.Wrap>
      <SafeRouteMap
        origin={origin}
        dest={dest}
        routePath={routePath}
        useMyLocation={useMyLocation}
        onMyLocation={handleMyLocation}
      />

      <S.Overlay>
        <S.Card ref={cardRef}>
          <S.SwapHandle onClick={swapRoute} aria-label="출발지/도착지 바꾸기">
            <img src="/images/icons/switch.png" />
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
              startOpen
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

          <RouteSummaryCardBottom
            durationSec={durationSec ?? undefined}
            distanceM={distanceM ?? undefined}
          />
        </>
      )}
    </S.Wrap>
  );
}
