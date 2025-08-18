import type {
  SafeRouteRequest,
  SafeRouteResponse,
  SafeRouteSegment,
} from "./types";
import type { TravelMode, RouteResult } from "../types";
import { postResponse } from "@shared/lib/instance";
import { buildDummyBoth } from "../lib/distance";

// 서버의 polyline을 내부 RouteResult로 변환

function adaptSegmentsToRecord(
  segments: SafeRouteSegment[]
): Partial<Record<TravelMode, RouteResult>> {
  const out: Partial<Record<TravelMode, RouteResult>> = {};
  for (const s of segments) {
    const mode = s.mode as TravelMode;
    out[mode] = {
      durationSec: s.duration_sec,
      distanceM: s.distance_m,
      coords: s.polyline.map(([lat, lng]) => ({ lat, lng })),
    };
  }
  return out;
}

export async function getSafeRoutes(body: SafeRouteRequest) {
  const json = await postResponse<SafeRouteRequest, SafeRouteResponse>(
    "/api/v1/proxy/kakao/safe-routes",
    body
  );

  if (!json || json.status !== "success" || !json.data?.routes) {
    return buildDummyBoth(body.origin, body.destination);
  }
  return adaptSegmentsToRecord(json.data.routes);
}
