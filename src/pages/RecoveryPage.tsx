import { Wrapper } from "@features/recovery-zone/components/UI/BasicElement";
import {
  BottomSheet,
  MainContent,
  BackgroundCircle,
} from "@features/recovery-zone";
import * as S from "@widget/MapWithOverlay/MapWithOverlay.styles";

// Background circle positions configuration
const BACKGROUND_CIRCLE_POSITIONS = [
  { top: 238, left: -127 },
  { top: 70, left: 238 },
  { top: 491, left: -67 },
] as const;

/**
 * Recovery Page - 복구 현황 및 위험 지역 정보를 표시하는 메인 페이지
 */
const RecoveryPage = () => {
  return (
    <S.Wrap>
      <Wrapper $gap={40} $ColumnDirection={true}>
        <MainContent />
        {/* TODO: BottomSheet 활성화 시 주석 해제 */}
        {/* <BottomSheet /> */}
      </Wrapper>

      {/* Background decoration circles */}
      {BACKGROUND_CIRCLE_POSITIONS.map((position, index) => (
        <BackgroundCircle 
          key={`bg-circle-${index}`} 
          $top={position.top} 
          $left={position.left} 
        />
      ))}
    </S.Wrap>
  );
};

export default RecoveryPage;
