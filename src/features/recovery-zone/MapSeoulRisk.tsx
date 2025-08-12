// components/MapSeoulRisk.tsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  fetchSeoulGeoJson,
  forEachRing,
  toHolePaths,
  extractDistrictKey,
  type FC,
} from "@shared/lib/SeoulMap/SeoulGeoJson.ts";

import {
  riskPaletteV1,
  type RiskPalette,
  scoreToLevel,
  levelToColor,
  colorForScore,
} from "./RiskPalette";

import { sampleRiskData, makeRiskIndex, type DistrictRisk } from "./RiskData";

// ✅ 공유 라이브러리에서 Kakao SDK 로더 import (경로는 프로젝트 구조에 맞게 조정)
import { loadKakaoMaps } from "@shared/lib/loadKakaoMaps";

type Props = {
  appKey: string; // Kakao JS 키
  level?: number; // 초기 줌 레벨(값이 클수록 넓음)
  centerLat?: number;
  centerLng?: number;
  palette?: RiskPalette; // 위험도 팔레트
  riskData?: DistrictRisk[]; // 구별 위험도 데이터 (없으면 sample 사용)
  showMyLocationPin?: boolean; // 내 위치 핀 표시 여부
  disableMove?: boolean; // 지도 이동 금지 (기본 true)
  disableZoom?: boolean; // 줌 금지 (기본 true)
};

const MapWrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MapSeoulRisk: React.FC<Props> = ({
  appKey,
  level = 10,
  centerLat = 37.5665,
  centerLng = 126.978,
  palette = riskPaletteV1,
  riskData = sampleRiskData,
  showMyLocationPin = true,
  disableMove = true,
  disableZoom = true,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;

    (async () => {
      // 1) Kakao SDK 로드
      await loadKakaoMaps(appKey, ["services"]);
      const kakao = window.kakao;
      if (disposed || !mapRef.current) return;

      // 2) 지도 생성
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level,
      });
      if (disableZoom) map.setZoomable(false);
      if (disableMove) map.setDraggable(false);

      // 3) 데이터 준비
      const gj: FC = await fetchSeoulGeoJson();
      const riskIndex = makeRiskIndex(riskData);

      // 4) 구 폴리곤(위험도 색상 + 흰색 경계)
      const districtPolygons: any[] = [];
      forEachRing(gj, (ring, feature) => {
        const props = feature.properties ?? {};
        const { name, code } = extractDistrictKey(props);

        const risk =
          (code && riskIndex.byCode.get(code)) ||
          (name && riskIndex.byName.get(name));

        const color = (() => {
          if (risk?.riskLevel) return levelToColor(risk.riskLevel, palette);
          if (typeof risk?.riskScore === "number")
            return colorForScore(risk.riskScore, palette);
          return palette.fallbackColor;
        })();

        const path = ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
        districtPolygons.push(
          new kakao.maps.Polygon({
            map,
            path,
            strokeWeight: 2,
            strokeColor: "#ffffff", // 흰색 경계
            strokeOpacity: 1,
            strokeStyle: "solid",
            fillColor: color,
            fillOpacity: 1.0,
            zIndex: 11,
          })
        );
      });

      // 5) 서울 외 마스킹 (바깥 사각형 + holes)
      const holePaths = toHolePaths(kakao, gj);
      const maskPolygon = new kakao.maps.Polygon({
        map,
        path: [],
        strokeWeight: 0,
        strokeOpacity: 0,
        fillColor: "#ffffff",
        fillOpacity: 1.0,
        zIndex: 10,
      });
      const updateMask = () => {
        const b = map.getBounds();
        const sw = b.getSouthWest(),
          ne = b.getNorthEast();
        const nw = new kakao.maps.LatLng(ne.getLat(), sw.getLng());
        const se = new kakao.maps.LatLng(sw.getLat(), ne.getLng());
        maskPolygon.setPath([[sw, se, ne, nw], ...holePaths]);
      };
      updateMask();
      const idleListener = kakao.maps.event.addListener(
        map,
        "idle",
        updateMask
      );

      // 6) 내 위치 핀 + 해당 구 말풍선(옵션)
      let myMarker: any | null = null;
      let myOverlay: any | null = null;
      if (showMyLocationPin && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (p) => {
            const lat = p.coords.latitude,
              lng = p.coords.longitude;
            const pos = new kakao.maps.LatLng(lat, lng);
            myMarker = new kakao.maps.Marker({
              map,
              position: pos,
              zIndex: 20,
            });

            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(
              lng,
              lat,
              (result: any[], status: string) => {
                if (status !== kakao.maps.services.Status.OK || !result?.length)
                  return;
                const b =
                  result.find((r) => r.region_type === "B") || result[0];
                const gu = b?.region_2depth_name ?? "내 위치";

                const balloon = document.createElement("div");
                balloon.style.cssText =
                  "background:#111;color:#fff;padding:6px 10px;border-radius:14px;font-size:13px;line-height:1;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25);";
                balloon.textContent = gu;

                myOverlay = new kakao.maps.CustomOverlay({
                  map,
                  position: pos,
                  yAnchor: 1.5,
                  zIndex: 21,
                  content: balloon,
                });
              }
            );
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }

      // 7) 정리
      cleanupRef.current = () => {
        try {
          kakao.maps.event.removeListener(idleListener);
        } catch {}
        try {
          maskPolygon.setMap(null);
        } catch {}
        districtPolygons.forEach((p) => {
          try {
            p.setMap(null);
          } catch {}
        });
        if (myMarker)
          try {
            myMarker.setMap(null);
          } catch {}
        if (myOverlay)
          try {
            myOverlay.setMap(null);
          } catch {}
      };
    })().catch((e) => {
      console.error(e);
      alert("지도를 불러오는 중 오류가 발생했습니다.");
    });

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, [
    appKey,
    centerLat,
    centerLng,
    level,
    palette,
    riskData,
    showMyLocationPin,
    disableMove,
    disableZoom,
  ]);

  return <MapWrap ref={mapRef} />;
};

export default MapSeoulRisk;
