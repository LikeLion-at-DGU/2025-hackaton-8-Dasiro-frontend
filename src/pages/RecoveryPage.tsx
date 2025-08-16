import * as S from "@widget/MapWithOverlay/MapWithOverlay.styles";
import {
  MainElement,
  Header,
  MapSection,
  BottomSheet,
  BackgroundCircles,
} from "@features/recovery-zone";

const RecoveryPage = () => {
  return (
    <S.Wrap>
      {/* Main Content */}
      <MainElement.MainWrapper style={{ margin: "0 auto", marginTop: "3.4vh" }}>
        <Header />
        <MainElement.MainContent />
        <MapSection />
      </MainElement.MainWrapper>

      {/* Bottom Sheet */}
      <BottomSheet />

      {/* Background Circles */}
      <BackgroundCircles />
    </S.Wrap>
  );
};

export default RecoveryPage;
