// 지도 화면을 주어진 좌표 배열이 모두 보이도록 자동 조정하는 함수

export function fitToCoords(map: any, coords: { lat: number; lng: number }[]) {
  const kakao = (window as any).kakao;

  // LatLngBounds: 지도 화면 범위를 나타내는 객체
  const bounds = new kakao.maps.LatLngBounds();

  // 모든 좌표를 bounds 영역에 추가
  coords.forEach((c) => bounds.extend(new kakao.maps.LatLng(c.lat, c.lng)));

  // 지도 화면을 bounds에 맞게 조정
  map.setBounds(bounds);
}
