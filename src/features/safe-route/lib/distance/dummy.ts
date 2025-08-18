import type { RouteResult, TravelMode } from "@features/safe-route/types";
import { estimateDurationSec, SPEED_WALK, SPEED_CAR } from "./time";
import { sumPathMeters } from "./distance";

/** 아주 짧은 거리에서 진동을 줄이기 위한 상수 */
const MIN_SEGMENTS = 4;
const MAX_SEGMENTS = 48;
const MIN_LENGTH_M = 80;

/** 많이 꺾이는(지그재그) polyline 생성 */
export function buildZigZagPolyline(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  opts?: {
    segments?: number;
    amplitudeM?: number;
    jitterM?: number;
    seed?: number;
  }
): [number, number][] {
  const segmentsRaw = opts?.segments ?? 18;
  const segments = Math.max(MIN_SEGMENTS, Math.min(MAX_SEGMENTS, segmentsRaw));
  let amplitudeM = opts?.amplitudeM ?? 80;
  const jitterM = opts?.jitterM ?? 10;

  // 간단한 seedable 난수
  let rndSeed = typeof opts?.seed === "number" ? opts!.seed : Date.now();
  const rand = () => {
    rndSeed = (rndSeed * 1664525 + 1013904223) % 0xffffffff;
    return (rndSeed >>> 0) / 0xffffffff;
  };

  const midLat = (origin.lat + dest.lat) / 2;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const mPerDegLat = 111_320;
  const mPerDegLng = 111_320 * Math.cos(toRad(midLat) || 0);

  const dxm = (dest.lng - origin.lng) * mPerDegLng;
  const dym = (dest.lat - origin.lat) * mPerDegLat;
  const len = Math.hypot(dxm, dym) || 1;

  // 거리 기반 세그먼트/진폭 보정
  const segs =
    len < MIN_LENGTH_M
      ? Math.max(MIN_SEGMENTS, Math.floor(segments / 2))
      : Math.max(MIN_SEGMENTS, Math.min(segments, Math.floor(len / 50)));

  if (len < MIN_LENGTH_M) {
    amplitudeM = Math.min(amplitudeM, len * 0.25);
  }

  const tx = dxm / len;
  const ty = dym / len;
  const nx = -ty;
  const ny = tx;

  const out: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const bx = tx * len * t;
    const by = ty * len * t;

    const side = i === 0 || i === segs ? 0 : i % 2 === 0 ? 1 : -1;
    const envelope = 0.6 + 0.4 * Math.sin(Math.PI * t);
    const jitter = (rand() * 2 - 1) * jitterM;
    const off = side * amplitudeM * envelope + jitter;

    const pxm = bx + nx * off;
    const pym = by + ny * off;

    const lat = origin.lat + pym / mPerDegLat;
    const lng = origin.lng + pxm / mPerDegLng;
    out.push([lat, lng]);
  }

  // 정확히 양 끝 고정
  out[0] = [origin.lat, origin.lng];
  out[out.length - 1] = [dest.lat, dest.lng];
  return out;
}

/** 실패 시 두 모드 모두 더미 생성: 도보(많이 꺾임) / 자가용(덜 꺾임) */
export function buildDummyBoth(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number }
): Partial<Record<TravelMode, RouteResult>> {
  // 도보: 지그재그 크게
  const walkPoly = buildZigZagPolyline(origin, dest, {
    segments: 20,
    amplitudeM: 90,
    jitterM: 12,
  });
  const walkCoords = walkPoly.map(([lat, lng]) => ({ lat, lng }));
  const walkDist = Math.round(sumPathMeters(walkCoords));
  const walkDur = estimateDurationSec(walkDist, SPEED_WALK);

  // 자가용: 더 직선적
  const carPoly = buildZigZagPolyline(origin, dest, {
    segments: 12,
    amplitudeM: 45,
    jitterM: 6,
  });
  const carCoords = carPoly.map(([lat, lng]) => ({ lat, lng }));
  const carDist = Math.round(sumPathMeters(carCoords));
  const carDur = estimateDurationSec(carDist, SPEED_CAR);

  return {
    walk: { durationSec: walkDur, distanceM: walkDist, coords: walkCoords },
    car: { durationSec: carDur, distanceM: carDist, coords: carCoords },
  };
}
