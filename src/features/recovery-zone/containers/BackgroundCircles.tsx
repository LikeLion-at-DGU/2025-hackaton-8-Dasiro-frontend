// Recovery Zone 배경 장식 원형 요소들 - 페이지 전체에 배치되는 장식용 원형 배경
import { MapBackgroundCircle } from "../ui";

// 배경 원형 요소들의 위치 좌표 (px 단위)
// 각 원형 요소는 특정 위치에 고정되어 시각적 깊이감과 브랜드 느낌을 제공
const BACKGROUND_CIRCLE_POSITIONS = [
  { top: 238, left: -127 },  // 왼쪽 상단 원형 (일부가 화면 밖으로 나감)
  { top: 70, left: 238 },    // 오른쪽 상단 원형
  { top: 491, left: -67 },   // 왼쪽 하단 원형 (일부가 화면 밖으로 나감)
] as const;

export const BackgroundCircles = () => {
  return (
    <>
      {/* 정의된 위치에 따라 배경 원형 요소들을 렌더링 */}
      {BACKGROUND_CIRCLE_POSITIONS.map((position, index) => (
        <MapBackgroundCircle
          key={index}
          $top={position.top}
          $left={position.left}
        />
      ))}
    </>
  );
};