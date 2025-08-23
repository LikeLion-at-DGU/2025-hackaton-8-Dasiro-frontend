import {getResponse} from "@shared/lib/instance";

export type PlaceCategory = "FOOD" | "CAFE" | "CONVENIENCE" | "OTHER";

export interface Place {
  name: string;
  category: PlaceCategory;
  address: string;
  lat: number;
  lng: number;
  main_image_url: string | null;
  kakao_place_id: string | null;
  kakao_url: string | null;
  distance_m: number | null;
}

export interface PlacesResponse {
  status: string;
  message: string;
  code: number;
  data: {
    items: Place[];
    count: number;
  };
}

export interface GetPlacesParams {
  category?: PlaceCategory;
  sigungu?: string;
  page?: number;
  page_size?: number;
}

export const getPlaces = (params?: GetPlacesParams) => {
  const searchParams = new URLSearchParams();
  
  if (params?.category) searchParams.append('category', params.category);
  if (params?.sigungu) searchParams.append('sigungu', params.sigungu);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
  
  const url = searchParams.toString() 
    ? `/api/v1/places?${searchParams.toString()}`
    : `/api/v1/places`;
    
  return getResponse(url) as Promise<PlacesResponse>;
};
