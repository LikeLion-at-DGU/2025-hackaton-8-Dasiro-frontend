import {
  compact,
  isJamoOnly,
  isTooShort,
  sanitize,
} from "@features/citizen-report/lib/addressValidation";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";

function candidateMatchesQuery(q: string, ...cands: (string | undefined)[]) {
  const qC = compact(q);
  return cands.some((c) => {
    const v = compact(c ?? "");
    return v.includes(qC);
  });
}

/**
 * 텍스트(예: "신당동", "서울 중구 신당동 100-1")를 좌표/정규화된 주소로 변환
 * 느슨매칭 방지:
 *  - 1글자/자모 입력 → 즉시 null
 *  - 결과도 입력 부분일치(공백제거) 필터 통과한 것만 채택
 */
export async function geocodeText(
  text: string
): Promise<{ lat: number; lng: number; address: string } | null> {
  const raw = sanitize(text);

  if (!raw || isTooShort(raw) || isJamoOnly(raw)) {
    return null;
  }

  const kakaoApiKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!kakaoApiKey) throw new Error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
  await loadKakaoMaps(kakaoApiKey);

  const kakao = (window as any).kakao;
  const places = new kakao.maps.services.Places();
  const geocoder = new kakao.maps.services.Geocoder();

  const keywordSearch = () =>
    new Promise<any[]>((resolve) => {
      places.keywordSearch(
        raw,
        (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK && result?.length)
            resolve(result);
          else resolve([]);
        },
        // size는 JS SDK에서 무시될 수 있음. 필요 시 page로 페이징하거나 결과에서 slice.
        { page: 1 }
      );
    });

  const addressSearch = () =>
    new Promise<any[]>((resolve) => {
      geocoder.addressSearch(raw, (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK && result?.length)
          resolve(result);
        else resolve([]);
      });
    });

  // 1차: 키워드 → 결과 필터링(입력 부분일치)
  const k = (await keywordSearch()).filter((r) =>
    candidateMatchesQuery(
      raw,
      r.address_name,
      r.road_address_name,
      r.place_name
    )
  );

  if (k.length) {
    const top = k[0];
    const lat = Number(top.y);
    const lng = Number(top.x);
    const address =
      top.address_name || top.road_address_name || top.place_name || raw;
    return { lat, lng, address };
  }

  // 2차: 주소 → 결과 필터링(입력 부분일치)
  const a = (await addressSearch()).filter((r) =>
    candidateMatchesQuery(
      raw,
      r.address?.address_name,
      r.road_address?.address_name
    )
  );

  if (a.length) {
    const top = a[0];
    const lat = Number(top.y);
    const lng = Number(top.x);
    const address =
      top.address?.address_name || top.road_address?.address_name || raw;
    return { lat, lng, address };
  }

  return null;
}
