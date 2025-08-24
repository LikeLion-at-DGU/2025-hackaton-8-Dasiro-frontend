import type { SafeRouteRequest } from "./types";
import type { TravelMode, RouteResult } from "../types";
import { postResponse } from "@shared/lib/instance";
import { buildDummyBoth } from "../lib/distance";

export type SafeRouteSegment = {
  mode: "walk" | "car";
  duration_sec: number;
  distance_m: number;
  polyline: Array<[number | string, number | string]>;
};

/** 차량 응답: data.routes[] */
type CarResponse = {
  status: "success" | "error";
  data?: { routes: SafeRouteSegment[] };
  message?: string;
  code?: number;
};

/** 도보 응답: data 가 단일 세그먼트 */
type WalkResponse = {
  status: "success" | "error";
  data?: SafeRouteSegment;
  message?: string;
  code?: number;
};

/* ========== helpers ========== */
const toNum = (v: unknown): number | null => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : null;
};

const coerceLatLngPair = (pair: [number | string, number | string]) => {
  const lat = toNum(pair[0]);
  const lng = toNum(pair[1]);
  if (lat == null || lng == null) return null;
  return { lat, lng };
};

const polylineToCoords = (
  poly: Array<[number | string, number | string]>
): { lat: number; lng: number }[] => {
  const out: { lat: number; lng: number }[] = [];
  for (const p of poly) {
    const c = coerceLatLngPair(p);
    if (c) out.push(c);
  }
  return out;
};

const segToResult = (seg: SafeRouteSegment): RouteResult | null => {
  const duration = toNum(seg.duration_sec);
  const distance = toNum(seg.distance_m);
  if (duration == null || distance == null || !Array.isArray(seg.polyline))
    return null;
  const coords = polylineToCoords(seg.polyline);
  if (!coords.length) return null;
  return { durationSec: duration, distanceM: distance, coords };
};

const sanitizeRequest = (body: SafeRouteRequest): SafeRouteRequest | null => {
  const olat = toNum((body as any)?.origin?.lat);
  const olng = toNum((body as any)?.origin?.lng);
  const dlat = toNum((body as any)?.destination?.lat);
  const dlng = toNum((body as any)?.destination?.lng);
  if (olat == null || olng == null || dlat == null || dlng == null) return null;
  const round6 = (n: number) => Math.round(n * 1e6) / 1e6;
  return {
    origin: { lat: round6(olat), lng: round6(olng) },
    destination: { lat: round6(dlat), lng: round6(dlng) },
  };
};

async function fetchKakaoCarOnly(
  body: SafeRouteRequest
): Promise<RouteResult | null> {
  const safe = sanitizeRequest(body);
  if (!safe) {
    console.warn("[KAKAO] invalid coords in request", body);
    return null;
  }
  const res = await postResponse<SafeRouteRequest, CarResponse>(
    "/api/v1/proxy/kakao/safe-routes",
    safe
  );
  if (
    !res ||
    res.status !== "success" ||
    !res.data ||
    !Array.isArray(res.data.routes)
  ) {
    console.warn("[KAKAO] bad response:", res?.message ?? res);
    return null;
  }
  // mode === "car" 우선, 없으면 첫 요소
  const seg =
    res.data.routes.find((s) => s.mode === "car") ?? res.data.routes[0];
  return seg ? segToResult(seg) : null;
}

// 도보: { data: SafeRouteSegment }
async function fetchORSWalkOnly(
  body: SafeRouteRequest
): Promise<RouteResult | null> {
  const safe = sanitizeRequest(body);
  if (!safe) {
    console.warn("[ORS] invalid coords in request", body);
    return null;
  }
  const res = await postResponse<SafeRouteRequest, WalkResponse>(
    "/api/v1/proxy/ors/safe-routes",
    safe
  );
  if (!res) return null;
  if (res.status === "error") {
    console.warn("[ORS] error:", res.code, res.message, res.data);
    return null;
  }
  if (!res.data) {
    console.warn("[ORS] missing data:", res);
    return null;
  }

  const seg: SafeRouteSegment = { ...res.data, mode: "walk" };
  return segToResult(seg);
}

/* ========== 최종 병합 ========== */
export async function getSafeRoutes(body: SafeRouteRequest) {
  const [carRes, walkRes] = await Promise.allSettled([
    fetchKakaoCarOnly(body),
    fetchORSWalkOnly(body),
  ]);

  const car =
    carRes.status === "fulfilled" ? carRes.value ?? undefined : undefined;
  const walk =
    walkRes.status === "fulfilled" ? walkRes.value ?? undefined : undefined;

  const merged: Partial<Record<TravelMode, RouteResult>> = {
    ...(car ? { car } : {}),
    ...(walk ? { walk } : {}),
  };

  if (!merged.car && !merged.walk) {
    const safe = sanitizeRequest(body);
    return safe
      ? buildDummyBoth(safe.origin, safe.destination)
      : buildDummyBoth(body.origin as any, body.destination as any);
  }
  return merged;
}
