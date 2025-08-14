import * as S from "./RouteSummaryCardBottom.styles";

const RouteSummaryCardBottom = () => {
  return (
    <S.Wrapper>
      <S.Container>
        <S.TopTextContainer>
          <S.TopTextBox>
            <h1>싱크홀 안전 루트</h1>
            <p>싱크홀 걱정은 이제 그만! 안전한 길로 안내해드려요.</p>
          </S.TopTextBox>
          <img src="/images/icons/mapArrow.png" />
        </S.TopTextContainer>

        <S.BottomTextContainer>
          <h1>
            총 <span className="num">1</span>시간{" "}
            <span className="num">12</span>분
          </h1>
          <p>약 5.9km</p>
        </S.BottomTextContainer>
      </S.Container>
    </S.Wrapper>
  );
};

export default RouteSummaryCardBottom;
