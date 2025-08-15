/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, toHolePaths } from './SeoulGeoJson';

export function renderSeoulMask(kakao: any, map: any, gj: FC) {
  const holePaths = toHolePaths(kakao, gj);
  const maskPolygon = new kakao.maps.Polygon({
    map,
    path: [],
    strokeWeight: 0,
    strokeOpacity: 0,
    fillColor: '#ffffff',
    fillOpacity: 1.0,
    zIndex: 10,
  });

  const update = () => {
    const b = map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    const nw = new kakao.maps.LatLng(ne.getLat(), sw.getLng());
    const se = new kakao.maps.LatLng(sw.getLat(), ne.getLng());
    maskPolygon.setPath([[sw, se, ne, nw], ...holePaths]);
  };

  update();
  const idleListener = kakao.maps.event.addListener(map, 'idle', update);

  return () => {
    kakao.maps.event.removeListener(idleListener);
    maskPolygon.setMap(null);
  };
}
