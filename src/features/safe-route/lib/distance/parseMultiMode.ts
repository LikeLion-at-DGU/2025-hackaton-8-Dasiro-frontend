import type { RouteResult, TravelMode } from "@features/safe-route/types";

export function parseMultiMode(
  json: unknown
): Partial<Record<TravelMode, RouteResult>> | null {
  if (
    !json ||
    typeof json !== "object" ||
    !("data" in json) ||
    (json as any).data == null
  ) {
    return null;
  }

  const data = (json as any).data;
  const out: Partial<Record<TravelMode, RouteResult>> = {};

  const consume = (item: any) => {
    if (!item) return;
    const m = item.mode as TravelMode | undefined;
    const poly = item.polyline as [number, number][] | undefined;
    const dur = Number(item.duration_sec ?? 0);
    const dist = Number(item.distance_m ?? 0);
    if (!m || !Array.isArray(poly)) return;
    out[m] = {
      durationSec: dur,
      distanceM: dist,
      coords: poly.map(([lat, lng]) => ({ lat, lng })),
    };
  };

  if (Array.isArray(data)) {
    data.forEach(consume);
  } else if (data && Array.isArray(data.routes)) {
    data.routes.forEach(consume);
  } else if (data && (data.walk || data.car)) {
    consume({ ...(data.walk || {}), mode: "walk" });
    consume({ ...(data.car || {}), mode: "car" });
  } else if (data && data.mode) {
    consume(data);
  }

  return Object.keys(out).length ? out : null;
}
