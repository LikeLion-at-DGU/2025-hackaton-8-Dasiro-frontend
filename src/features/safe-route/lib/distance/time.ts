export const SPEED_WALK = 1.33; // m/s
export const SPEED_CAR = 8.33; // m/s (도심 추정치)

export function estimateDurationSec(
  distanceM: number,
  speedMps: number
): number {
  const d = Number.isFinite(distanceM) ? distanceM : 0;
  const s = speedMps > 0 ? speedMps : SPEED_WALK;
  return Math.max(60, Math.round(d / s));
}

export function formatDurationKR(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `총 ${h}시간 ${m}분` : `총 ${m}분`;
}
