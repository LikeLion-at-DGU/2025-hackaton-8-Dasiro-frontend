// 지도 꽉 + 상단 검색 오버레이

import DestinationSearch from "@features/safe-route/ui/DestinationSearch";
import SafeRouteMap from "@features/safe-route/ui/SafeRouteMap";

export default function MapWithOverlay() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <SafeRouteMap />

      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: "calc(env(safe-area-inset-top, 0px) + 12px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            padding: 12,
          }}
        >
          <DestinationSearch
            onSelect={(p) => {
              window.dispatchEvent(
                new CustomEvent("dest:selected", { detail: p })
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
