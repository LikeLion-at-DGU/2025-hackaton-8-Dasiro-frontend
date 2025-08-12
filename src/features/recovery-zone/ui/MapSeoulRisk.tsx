/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { loadKakaoMaps } from '@shared/lib/loadKakaoMaps';
import { fetchSeoulGeoJson, type FC } from '@shared/lib/SeoulMap/SeoulGeoJson';
import { renderSeoulMask } from '@shared/lib/SeoulMap/renderSeoulMask';
import { renderDistrictPolygons } from '@shared/lib/SeoulMap/renderDistrictPolygons';
import { riskPaletteV1, type RiskPalette } from '../RiskPalette';
import { sampleRiskData, type DistrictRisk } from '../RiskData';
import { createRiskColorResolver } from '../lib/resolveRiskColor';

type Props = {
  appKey: string;
  level?: number;
  centerLat?: number;
  centerLng?: number;
  palette?: RiskPalette;
  riskData?: DistrictRisk[];
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
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let cleanups: (() => void)[] = [];

    (async () => {
      await loadKakaoMaps(appKey, ['services']);
      if (disposed || !mapRef.current) return;
      const kakao = (window as any).kakao;

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level,
      });

      const gj: FC = await fetchSeoulGeoJson();
      const colorResolver = createRiskColorResolver(riskData, palette);
      const polys = renderDistrictPolygons(kakao, map, gj, ({ name, code }) =>
        colorResolver({ name, code })
      );
      const disposeMask = renderSeoulMask(kakao, map, gj);

      cleanups.push(() => {
        polys.forEach((p: any) => p.setMap(null));
      });
      cleanups.push(disposeMask);
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      cleanups = [];
    };
  }, [appKey, centerLat, centerLng, level, palette, riskData]);

  return <MapWrap ref={mapRef} />;
};

export default MapSeoulRisk;
