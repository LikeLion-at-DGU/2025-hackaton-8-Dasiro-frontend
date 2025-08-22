import {postResponse, getResponse} from "@shared/lib/instance";

export type PlaceCategory = "FOOD" | "CAFE" | "CONVENIENCE" | "OTHER";

export interface Place {
  id: number;
  name: string;
  category: PlaceCategory;
  address: string;
  lat: number;
  lng: number;
  distance_m: number;
  main_image_url: string | null;
  kakao_url: string | null;
  has_active_coupons: boolean;
}

export interface NearPlacesResponse {
  items: Place[];
  count: number;
}

export interface GetNearPlacesParams {
  lat: number;
  lng: number;
  radius?: number;
  category?: PlaceCategory;
  page?: number;
  page_size?: number;
}

export const getNearPlaces = (params: GetNearPlacesParams) => {
  const searchParams = new URLSearchParams();
  searchParams.append('lat', params.lat.toString());
  searchParams.append('lng', params.lng.toString());
  
  if (params.radius) searchParams.append('radius', params.radius.toString());
  if (params.category) searchParams.append('category', params.category);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  
  return getResponse(`/api/v1/places/near?${searchParams.toString()}`) as Promise<NearPlacesResponse>;
};
