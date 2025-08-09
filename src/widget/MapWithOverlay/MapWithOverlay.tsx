import { useCallback, useRef, useState } from "react";
import * as S from "./MapWithOverlay.styles";
import SafeRouteMap from "@features/safe-route/ui/SafeRouteMap";
import SearchField from "./SearchField";
import type { Loc } from "@shared/types/location";

type ActiveField = "origin" | "dest" | null;

export default function MapWithOverlay() {
  const [origin, setOrigin] = useState<Loc | undefined>(undefined);
  const [dest, setDest] = useState<Loc | undefined>(undefined);
  const [useMyLocation, setUseMyLocation] = useState(true);

  const [active, setActive] = useState<ActiveField>("dest");
  const cardRef = useRef<HTMLDivElement | null>(null);

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
        <S.Card ref={cardRef}>
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
            />
          </S.SearchRow>
        </S.Card>
      </S.Overlay>
    </S.Wrap>
  );
}
