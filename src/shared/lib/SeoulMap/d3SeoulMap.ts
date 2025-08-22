import * as d3 from 'd3';
import { fetchSeoulGeoJson, type FC, type Feature } from './SeoulGeoJson';

export interface D3SeoulMapConfig {
  width: number;
  height: number;
  container: string | HTMLElement;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  hoverColor?: string;
  enableZoom?: boolean;
  enableTooltip?: boolean;
}

export interface D3SeoulMapInstance {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  projection: d3.GeoProjection;
  path: d3.GeoPath;
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
  render: (geoData?: FC) => Promise<void>;
  destroy: () => void;
  setFillColor: (colorFn: (d: Feature) => string) => void;
  highlightDistrict: (districtName: string) => void;
  resetHighlight: () => void;
}

export async function createD3SeoulMap(config: D3SeoulMapConfig): Promise<D3SeoulMapInstance> {
  const {
    width,
    height,
    container,
    strokeColor = '#333',
    strokeWidth = 1,
    fillColor = '#e6f3ff',
    hoverColor = '#4a90e2',
    enableZoom = true,
    enableTooltip = true
  } = config;

  // Container 설정
  const containerEl = typeof container === 'string' 
    ? document.querySelector(container) as HTMLElement
    : container;

  if (!containerEl) {
    throw new Error('Container element not found');
  }

  // SVG 생성
  const svg = d3.select(containerEl)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'transparent');

  // 지도 그룹
  const mapGroup = svg.append('g').attr('class', 'map-group');

  // 서울 중심 좌표 (위도, 경도)
  const seoulCenter: [number, number] = [126.9780, 37.5665];

  // Projection 설정 (서울에 최적화된 Mercator)
  const projection = d3.geoMercator()
    .center(seoulCenter)
    .scale(80000)
    .translate([width / 2, height / 2]);

  // Path generator
  const path = d3.geoPath().projection(projection);

  // Zoom 설정
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 5])
    .on('zoom', (event) => {
      mapGroup.attr('transform', event.transform);
    });

  if (enableZoom) {
    svg.call(zoom);
  }

  // Tooltip 설정
  let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  
  if (enableTooltip) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-seoul-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', '1000');
  }

  // 렌더링 함수
  const render = async (geoData?: FC) => {
    const data = geoData || await fetchSeoulGeoJson();
    
    console.log('D3 Map Render:', { width, height, features: data.features.length });
    
    // 서울 지도에 최적화된 고정 스케일 사용 - 여백을 위해 스케일 축소
    const seoulScale = Math.min(width, height) * 140; // 180에서 140으로 축소하여 여백 확보
    console.log('Seoul Scale:', seoulScale);
    
    projection
      .center([126.9780, 37.5665]) // 서울 중심좌표 고정
      .scale(seoulScale)
      .translate([width / 2, height / 2]);

    // 기존 경로 제거
    mapGroup.selectAll('path').remove();

    // 구역 그리기
    const districts = mapGroup.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', (d: any) => {
        const pathData = path(d);
        console.log('Path data for', d.properties?.name, ':', pathData?.substring(0, 50));
        return pathData;
      })
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('class', 'district')
      .style('cursor', 'pointer');
      
    console.log('Districts created:', districts.size());

    // 현재 색상 함수는 전역 변수 사용

    // 인터랙션 추가
    districts
      .on('mouseenter', function(event, d) {
        // hover 색상으로 변경하기 전에 원래 색상을 data에 저장
        const originalColor = d3.select(this).attr('fill');
        d3.select(this).attr('data-original-fill', originalColor);
        d3.select(this).attr('fill', hoverColor);
        
        if (tooltip && d.properties) {
          const districtName = d.properties.name || d.properties.SIG_KOR_NM || 'Unknown';
          tooltip
            .style('opacity', 1)
            .html(districtName)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on('mousemove', function(event) {
        if (tooltip) {
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on('mouseleave', function(event, d) {
        // 원래 색상으로 복원
        const originalColor = d3.select(this).attr('data-original-fill');
        if (originalColor) {
          d3.select(this).attr('fill', originalColor);
        } else if (globalColorFn) {
          // 색상 함수가 설정되어 있으면 그것을 사용
          d3.select(this).attr('fill', globalColorFn(d));
        } else {
          // 기본 색상으로 복원
          d3.select(this).attr('fill', fillColor);
        }
        
        if (tooltip) {
          tooltip.style('opacity', 0);
        }
      })
      .on('click', function(event, d) {
        const districtName = d.properties?.name || d.properties?.SIG_KOR_NM || 'Unknown';
        console.log('Clicked district:', districtName);
        
        // 커스텀 이벤트 발생
        const customEvent = new CustomEvent('district-click', {
          detail: { district: districtName, feature: d, event }
        });
        containerEl.dispatchEvent(customEvent);
      });
  };

  // 색상 설정 함수
  let globalColorFn: ((d: any) => string) | null = null;
  
  const setFillColor = (colorFn: (d: any) => string) => {
    globalColorFn = colorFn; // 전역에 색상 함수 저장
    mapGroup.selectAll('path.district')
      .attr('fill', colorFn);
  };

  // 구역 하이라이트
  const highlightDistrict = (districtName: string) => {
    mapGroup.selectAll('path.district')
      .attr('fill', function(d: any) {
        const name = d.properties?.name || d.properties?.SIG_KOR_NM || '';
        return name === districtName ? hoverColor : fillColor;
      });
  };

  // 하이라이트 초기화
  const resetHighlight = () => {
    mapGroup.selectAll('path.district')
      .attr('fill', fillColor);
  };

  // 정리 함수
  const destroy = () => {
    svg.remove();
    if (tooltip) {
      tooltip.remove();
    }
  };

  return {
    svg,
    projection,
    path,
    zoom,
    render,
    destroy,
    setFillColor,
    highlightDistrict,
    resetHighlight
  };
}

// 기본 사용 예시 함수
export async function renderBasicSeoulMap(containerId: string, width = 800, height = 600) {
  const mapInstance = await createD3SeoulMap({
    width,
    height,
    container: containerId,
    strokeColor: '#666',
    strokeWidth: 1,
    fillColor: '#e8f4fd',
    hoverColor: '#2196f3',
    enableZoom: true,
    enableTooltip: true
  });

  await mapInstance.render();
  return mapInstance;
}