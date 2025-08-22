import * as S from "./RouteSummaryCardBottom.styles";

type Props = {
  durationSec?: number | null;
  distanceM?: number | null;
};

const RouteSummaryCardBottom = ({ durationSec, distanceM }: Props) => {
  const dur = splitDuration(durationSec ?? null);
  const distanceText = formatDistanceKR(distanceM ?? null);

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
          {dur ? (
            <h1>
              총{" "}
              {dur.h > 0 && (
                <>
                  <span className="num">{dur.h}</span>시간{" "}
                </>
              )}
              <span className="num">{dur.m}</span>분
            </h1>
          ) : (
            <h1>총 —분</h1>
          )}
          <p>{distanceText}</p>
        </S.BottomTextContainer>
      </S.Container>
    </S.Wrapper>
  );
};

export default RouteSummaryCardBottom;

function splitDuration(totalSec: number | null) {
  if (totalSec == null) return null;
  const h = Math.floor(totalSec / 3600);
  const m = Math.round((totalSec % 3600) / 60);
  return { h, m };
}

function formatDistanceKR(meters: number | null) {
  if (meters == null) return "약 —";
  if (meters >= 1000) {
    const km = meters / 1000;
    // 한 자리 소수
    return `약 ${km.toFixed(1)}km`;
  }
  // 1000m 미만은 m로 표시
  return `약 ${Math.round(meters)}m`;
}
