import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";
import { getNowLocation } from "@features/safe-route/lib/getLocation";
import { fitToCoords } from "../lib/fitBounds";
import type { Loc } from "@shared/types/location";
import { reverseGeocode } from "../lib/reverseGeocode";
import markerIcon from "@shared/assets/icons/marker.png";
import FloatAction from "@shared/ui/FloatAction";

type Props = {
  origin?: Loc;
  dest?: Loc;
  routePath?: Array<{ lat: number; lng: number }>;
  useMyLocation?: boolean;
  onMyLocation?: (p: Loc) => void;
  pickTarget?: "origin" | "dest" | null;
  onPickComplete?: (p: { lat: number; lng: number }) => void;
};

export default function SafeRouteMap({
  origin,
  dest,
  routePath,
  useMyLocation = true,
  onMyLocation,
  pickTarget,
  onPickComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  // 내 현재 위치
  const myLocRef = useRef<{ lat: number; lng: number } | null>(null);
  const myLocOverlayRef = useRef<any>(null);

  // 출발지/도착지 마커
  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);

  // 공통 마커 이미지
  const markerImageRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);

  // 지도 생성
  useEffect(() => {
    let mounted = true;
    loadKakaoMaps(import.meta.env.VITE_KAKAO_JS_KEY).then(() => {
      if (!mounted) return;
      const kakao = (window as any).kakao;
      mapRef.current = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });

      markerImageRef.current = new kakao.maps.MarkerImage(
        markerIcon,
        new kakao.maps.Size(20, 27),
        { offset: new kakao.maps.Point(10, 27) }
      );
      setMapReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 현재 위치 자동
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!mapReady || !map || !kakao || !useMyLocation) return;

    (async () => {
      try {
        const pos = await getNowLocation({
          enableHighAccuracy: true,
          timeout: 6000,
        });
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let address: string | undefined = undefined;
        try {
          address = (await reverseGeocode(lat, lng)) ?? undefined;
        } catch {}
        onMyLocation?.({ lat, lng, address });

        myLocRef.current = { lat, lng };
        drawMyLocationDot();
        map.setCenter(new kakao.maps.LatLng(lat, lng));
      } catch {
        const lat = 37.5665,
          lng = 126.978;
        let address: string | undefined = undefined;
        try {
          address = (await reverseGeocode(lat, lng)) ?? undefined;
        } catch {}
        onMyLocation?.({ lat, lng, address });

        myLocRef.current = { lat, lng };
        drawMyLocationDot();
        map.setCenter(new kakao.maps.LatLng(lat, lng));
      }
    })();
  }, [mapReady, useMyLocation]);

  // 출발지/도착지/선 갱신
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!mapReady || !map || !kakao) return;

    // 출발지 마커 갱신
    updateOriginMarker();

    // 도착지 마커 갱신
    if (dest) {
      const pos = new kakao.maps.LatLng(dest.lat, dest.lng);
      if (!destMarkerRef.current) {
        destMarkerRef.current = new kakao.maps.Marker({
          map,
          position: pos,
          image: markerImageRef.current,
        });
      } else {
        destMarkerRef.current.setPosition(pos);
        if (!destMarkerRef.current.getMap()) destMarkerRef.current.setMap(map);
        if (!destMarkerRef.current.getImage() && markerImageRef.current) {
          destMarkerRef.current.setImage(markerImageRef.current);
        }
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.setMap(null);
      destMarkerRef.current = null;
    }

    // 경로 라인 & fitBounds (routePath 우선)
    if (origin && dest) {
      const points: Array<{ lat: number; lng: number }> =
        routePath && routePath.length >= 2
          ? routePath
          : [
              { lat: origin.lat, lng: origin.lng },
              { lat: dest.lat, lng: dest.lng },
            ];

      const kakaoPath = points.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

      if (!lineRef.current) {
        lineRef.current = new kakao.maps.Polyline({
          map,
          path: kakaoPath,
          strokeWeight: 6,
          strokeColor: "#ACC856",
          strokeOpacity: 0.95,
        });
      } else {
        lineRef.current.setPath(kakaoPath);
        lineRef.current.setOptions({
          strokeColor: "#ACC856",
          strokeWeight: 6,
          strokeOpacity: 0.95,
        });
      }

      fitToCoords(map, points);
      map.setLevel(map.getLevel() + 1);
    } else if (lineRef.current) {
      lineRef.current.setMap(null);
      lineRef.current = null;
    }
  }, [mapReady, origin, dest, routePath]);

  // 픽 모드: 지도 클릭 좌표 전달
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!mapReady || !map || !kakao) return;

    let listener: any = null;

    if (pickTarget) {
      listener = kakao.maps.event.addListener(map, "click", (e: any) => {
        const ll = e.latLng;
        onPickComplete?.({ lat: ll.getLat(), lng: ll.getLng() });
      });
      map.setCursor("crosshair");
    } else {
      map.setCursor("");
    }

    return () => {
      if (listener) kakao.maps.event.removeListener(map, "click", listener);
    };
  }, [mapReady, pickTarget, onPickComplete]);

  function drawMyLocationDot() {
    const kakao = (window as any).kakao;
    const map = mapRef.current;
    if (!myLocRef.current || !map) return;

    const { lat, lng } = myLocRef.current;
    const pos = new kakao.maps.LatLng(lat, lng);

    const el = document.createElement("div");
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.borderRadius = "50%";
    el.style.background = "#FF7765";
    el.style.boxShadow = "0 0 0 5px rgba(255, 119, 101, 0.30)";
    el.style.border = "4px solid #fff6f0";

    if (!myLocOverlayRef.current) {
      myLocOverlayRef.current = new kakao.maps.CustomOverlay({
        position: pos,
        content: el,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 20,
      });
      myLocOverlayRef.current.setMap(map);
    } else {
      myLocOverlayRef.current.setPosition(pos);
      myLocOverlayRef.current.setContent(el);
      if (!myLocOverlayRef.current.getMap())
        myLocOverlayRef.current.setMap(map);
    }
  }

  function updateOriginMarker() {
    const kakao = (window as any).kakao;
    const map = mapRef.current;
    if (!map) return;

    const routeActive = !!(origin && dest);

    if (origin) {
      const pos = new kakao.maps.LatLng(origin.lat, origin.lng);

      // 내 위치와 동일한지(소수점 오차 고려)
      const isSameAsMyLoc =
        myLocRef.current &&
        Math.abs(myLocRef.current.lat - origin.lat) < 1e-7 &&
        Math.abs(myLocRef.current.lng - origin.lng) < 1e-7;

      // 경로 없고 내 위치와 같으면 마커 생략
      const shouldSkipMarker = !routeActive && isSameAsMyLoc;

      if (shouldSkipMarker) {
        if (originMarkerRef.current) {
          originMarkerRef.current.setMap(null);
          originMarkerRef.current = null;
        }
      } else {
        if (!originMarkerRef.current) {
          originMarkerRef.current = new kakao.maps.Marker({
            map,
            position: pos,
            image: markerImageRef.current,
          });
        } else {
          originMarkerRef.current.setPosition(pos);
          if (!originMarkerRef.current.getMap())
            originMarkerRef.current.setMap(map);

          if (!originMarkerRef.current.getImage() && markerImageRef.current) {
            originMarkerRef.current.setImage(markerImageRef.current);
          }
        }
      }

      if (!dest) map.setCenter(pos);
    } else if (originMarkerRef.current) {
      originMarkerRef.current.setMap(null);
      originMarkerRef.current = null;
    }
  }

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {!(origin && dest) && <FloatAction />}
    </>
  );
}
