export type TravelMode = "walk" | "car";

export type RouteResult = {
  durationSec: number;
  distanceM: number;
  coords: Array<{ lat: number; lng: number }>;
};

export type LatLng = { lat: number; lng: number };
