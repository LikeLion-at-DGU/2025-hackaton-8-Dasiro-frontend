/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, forEachRing, extractDistrictKey } from './SeoulGeoJson';

export interface DistrictColorResolver {
  (key: { name?: string; code?: string }): string;
}

export function renderDistrictPolygons(
  kakao: any,
  map: any,
  gj: FC,
  getColor: DistrictColorResolver
) {
  const polygons: any[] = [];
  forEachRing(gj, (ring, feature) => {
    const props = feature.properties ?? {};
    const { name, code } = extractDistrictKey(props);
    const color = getColor({ name, code });
    const path = ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
    const poly = new kakao.maps.Polygon({
      map,
      path,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      strokeOpacity: 1,
      strokeStyle: 'solid',
      fillColor: color,
      fillOpacity: 1.0,
      zIndex: 11,
    });
    polygons.push(poly);
  });
  return polygons;
}
