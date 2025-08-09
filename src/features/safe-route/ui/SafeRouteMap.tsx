import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";

import { useEffect, useRef } from "react";
import { fitToCoords } from "../lib/fitBounds";
import { getNowLocation } from "@shared/lib/getLocation";

export default function SafeRouteMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const myMarkerRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const handleDestSelected = (e: Event) => {
      if (!mapRef.current) return;
      const kakao = window.kakao;
      const { x, y } = (e as CustomEvent).detail;
      const dest = new kakao.maps.LatLng(Number(y), Number(x));

      const origin = myMarkerRef.current
        ? myMarkerRef.current.getPosition()
        : mapRef.current.getCenter();

      drawLine([
        { lat: origin.getLat(), lng: origin.getLng() },
        { lat: dest.getLat(), lng: dest.getLng() },
      ]);

      fitToCoords(mapRef.current, [
        { lat: origin.getLat(), lng: origin.getLng() },
        { lat: dest.getLat(), lng: dest.getLng() },
      ]);
    };

    loadKakaoMaps(import.meta.env.VITE_KAKAO_JS_KEY)
      .then(async () => {
        if (!isMounted) return;
        const kakao = window.kakao;

        // 1) 맵 생성 (기본 센터: 서울 시청)
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 4,
        });
        mapRef.current = map;

        // 2) 현재 위치
        try {
          const pos = await getNowLocation({
            enableHighAccuracy: true,
            timeout: 6000,
          });
          if (!isMounted) return;
          const here = new kakao.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          );

          // 마커 생성/업데이트
          if (!myMarkerRef.current) {
            myMarkerRef.current = new kakao.maps.Marker({
              map,
              position: here,
            });
          } else {
            myMarkerRef.current.setPosition(here);
          }

          map.setCenter(here);
        } catch (e) {
          console.warn("현재 위치 에러", e);
        }

        window.addEventListener(
          "dest:selected",
          handleDestSelected as EventListener
        );
      })
      .catch((e) => console.error("Kakao SDK 로드 실패:", e));

    return () => {
      isMounted = false;
      window.removeEventListener(
        "dest:selected",
        handleDestSelected as EventListener
      );
    };
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
