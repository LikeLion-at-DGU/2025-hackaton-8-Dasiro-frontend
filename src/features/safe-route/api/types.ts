export type SafeRouteRequest = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
};

export type SafeRouteMode = "walk" | "car";

export type SafeRouteSegment = {
  mode: SafeRouteMode;
  duration_sec: number;
  distance_m: number;
  polyline: [number, number][];
};

export type SafeRouteResponse = {
  status: "success" | "error";
  message: string;
  code: number;
  data?: {
    routes: SafeRouteSegment[];
  };
};
