export const formatCoord = (v?: number | null) =>
  typeof v === "number" && Number.isFinite(v) ? v.toFixed(6) : undefined;
