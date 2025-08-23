export type AwaitingKind = "image" | "text" | null;

export type PickedLocation = {
  lat: number;
  lng: number;
  address?: string;
} | null;

export type CandidatePlace = {
  id: string;
  lat: number;
  lng: number;
  address: string;
  placeName?: string;
};
