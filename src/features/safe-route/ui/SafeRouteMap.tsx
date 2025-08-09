// 지도 띄우기 -> 이벤트 받기 -> 경로 그리기

import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { useEffect, useRef } from "react";
import { fitToCoords } from "../lib/fitBounds";

export default function SafeRouteMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  useEffect(() => {
    let map: any;

    loadKakaoMaps(import.meta.env.VITE_KAKAO_JS_KEY).then(() => {
      const kakao = window.kakao;
      map = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });
      mapRef.current = map;

      window.addEventListener("dest:selected", (e: any) => {
        const kakao = window.kakao;
        const dest = new kakao.maps.LatLng(
          Number(e.detail.y),
          Number(e.detail.x)
        );
        const center = mapRef.current.getCenter();
        const origin = new kakao.maps.LatLng(center.getLat(), center.getLng());

        drawLine([
          { lat: origin.getLat(), lng: origin.getLng() },
          { lat: dest.getLat(), lng: dest.getLng() },
        ]);

        fitToCoords(mapRef.current, [
          { lat: origin.getLat(), lng: origin.getLng() },
          { lat: dest.getLat(), lng: dest.getLng() },
        ]);
      });
    });

    return () => {};
  }, []);

  function drawLine(coords: { lat: number; lng: number }[]) {
    const kakao = window.kakao;
    const path = coords.map((c) => new kakao.maps.LatLng(c.lat, c.lng));
    if (!lineRef.current) {
      lineRef.current = new kakao.maps.Polyline({
        map: mapRef.current,
        path,
        strokeWeight: 5,
      });
    } else {
      lineRef.current.setPath(path);
    }
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
