// geo/SeoulGeoJson.ts

// ── 최소 GeoJSON 타입 (필요 필드만)
export type FC = {
  type: 'FeatureCollection';
  features: Feature[];
};
export type Feature = {
  type: 'Feature';
  properties?: Record<string, any>;
  geometry: Geometry | null;
};
export type Geometry =
  | { type: 'Polygon'; coordinates: number[][][] }        // [ [ [lng, lat], ... ] ]
  | { type: 'MultiPolygon'; coordinates: number[][][][] } // [ [ [ [lng,lat], ... ] ], ... ]
  ;

// ── 기본 원격 소스(URL) — 필요 시 여기만 교체
export const SEOUL_GEOJSON_URL =
  'https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json';

// ── 간단 캐시 (중복 fetch 방지)
let _cache: FC | null = null;
let _inflight: Promise<FC> | null = null;

/** 원격에서 서울 자치구 GeoJSON을 가져오고 모듈 캐시에 저장 */
export async function fetchSeoulGeoJson(init?: RequestInit): Promise<FC> {
  if (_cache) return _cache;
  if (_inflight) return _inflight;

  _inflight = (async () => {
    const resp = await fetch(SEOUL_GEOJSON_URL, init);
    if (!resp.ok) throw new Error('GeoJSON 응답 에러: ' + resp.status);
    const gj = (await resp.json()) as FC;
    _cache = gj;
    _inflight = null;
    return gj;
  })();

  return _inflight;
}

/** 로컬 정적 파일을 쓰고 싶을 때 캐시에 주입 */
export function primeSeoulGeoJsonCache(data: FC) {
  _cache = data;
  _inflight = null;
}

/** 각 Feature의 모든 ring(좌표 배열)을 순회하며 콜백 실행 */
export function forEachRing(gj: FC, cb: (ring: number[][], feature: Feature) => void) {
  for (const f of gj.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') {
      (g.coordinates || []).forEach((ring) => cb(ring, f));
    } else if (g.type === 'MultiPolygon') {
      (g.coordinates || []).forEach((poly) => poly.forEach((ring) => cb(ring, f)));
    }
  }
}

/** 카카오 Polygon의 holes 입력용: GeoJSON → kakao.maps.LatLng[][] */
export function toHolePaths(kakao: any, gj: FC) {
  const holes: any[] = [];
  forEachRing(gj, (ring) => {
    holes.push(ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng)));
  });
  return holes;
}

/** Feature.properties에서 구 이름/코드 추출(소스별 키 차이 흡수) */
export function extractDistrictKey(props: Record<string, any> = {}) {
  const name =
    props.name ??        // southkorea-maps
    props.SIG_KOR_NM ??  // 통계청 표준
    props.SIGENG_NM ??   // 영문
    undefined;

  const code =
    props.adm_cd ??      // 행정표준코드
    props.SIG_CD ??      // 시군구코드
    undefined;

  return { name, code };
}