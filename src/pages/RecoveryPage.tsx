import { Wrapper } from "@features/recovery-zone/types/BasicElement";
import {
  BottomSheet,
  MainContent,
  BackgroundCircle,
} from "@features/recovery-zone";
import * as S from "@widget/MapWithOverlay/MapWithOverlay.styles";

const BackgroundCirclePos = [
  { top: 238, left: -127 },
  { top: 70, left: 238 },
  { top: 491, left: -67 },
];

const RecoveryPage = () => {
  return (
    <S.Wrap>
      <Wrapper $gap={40} $ColumnDirection={true}>
        <MainContent></MainContent>
        {/* <BottomSheet></BottomSheet> */}
      </Wrapper>

      {BackgroundCirclePos.map((pos, idx) => (
        <BackgroundCircle key={idx} $top={pos.top} $left={pos.left} />
      ))}
    </S.Wrap>
  );
};

export default RecoveryPage;
