import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { sanitize } from "./addressValidation";
import type { CandidatePlace } from "../types";

/**
 * 텍스트로 후보 리스트(최대 5개) 반환
 * 우선순위: Places.keywordSearch → (필요시) Geocoder.addressSearch 1개
 */
export async function geocodeCandidates(
  text: string
): Promise<CandidatePlace[]> {
  const q = sanitize(text);
  const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!kakaoApiKey) throw new Error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
  await loadKakaoMaps(kakaoApiKey);

  const kakao = (window as any).kakao;
  const places = new kakao.maps.services.Places();
  const geocoder = new kakao.maps.services.Geocoder();

  // 1) 키워드(지명/POI/행정동)
  const keywordResult: any[] = await new Promise((resolve) => {
    places.keywordSearch(
      q,
      (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK && result?.length)
          resolve(result);
        else resolve([]);
      },
      { page: 1 } // JS SDK에선 size 무시될 수 있음
    );
  });

  const candidates: CandidatePlace[] = keywordResult
    .slice(0, 5)
    .map((r: any, i: number) => ({
      id: String(i),
      lat: Number(r.y),
      lng: Number(r.x),
      address: r.address_name || r.road_address_name || r.place_name || q,
      placeName: r.place_name,
    }));

  if (candidates.length > 0) return candidates;

  // 2) 주소(도로명/지번) - 상위 1개만 후보로
  const addr: any[] = await new Promise((resolve) => {
    geocoder.addressSearch(q, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK && result?.length)
        resolve(result);
      else resolve([]);
    });
  });

  if (addr.length) {
    const top = addr[0];
    return [
      {
        id: "0",
        lat: Number(top.y),
        lng: Number(top.x),
        address:
          top.address?.address_name || top.road_address?.address_name || q,
      },
    ];
  }

  return [];
}
