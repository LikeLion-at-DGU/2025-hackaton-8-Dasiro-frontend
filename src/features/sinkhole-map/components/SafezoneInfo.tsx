import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import badge from "/images/icons/badge.png";
import { useSelectGrade } from "@entities/sinkhole/context";

const StyledContainer = styled(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
${({ theme }) => theme.fonts.subBold16};
  .title{
    display: flex;
    gap: 5px;
    color: ${({ theme }) => theme.colors.black02};
  }
  .content{
    display: flex;
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.black07};
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.bodySemiB14};
  }
  .ddang{
    width: 25px;
    aspect-ratio: 25.00/24.48;
  }
`;

export const SafezoneInfo = () => {
  const { searchedDistrict, isBadgeActive } = useSelectGrade();
  
  const dongName = searchedDistrict?.dong || "염창동";
  const isSafezone = searchedDistrict?.is_safezone ?? true;

  // badge 모드가 아니고 안심존이 아닌 경우 렌더링하지 않음
  if (!isBadgeActive && !isSafezone) {
    return null;
  }

  // badge 모드일 때는 항상 표시
  if (isBadgeActive) {
    return (
      <StyledContainer $gap={15}>
        <div className="title">
          <img src={badge} alt="땅땅이" className="ddang" />
          {dongName}은 '부동산 안심존'이에요!
        </div>
        <div className="content">
          싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를 보장하기
          위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는 '안심존
          뱃지'를 부여하고 있어요. '부동산 안심존'으로 인증된 지역은 싱크홀
          안전등급 1~2등급에 해당하며, 지자체의 복구 및 정밀 점검까지 완료된
          곳이니 조금 더 안심하고 부동산을 거래하실 수 있어요!
        </div>
      </StyledContainer>
    );
  }
};