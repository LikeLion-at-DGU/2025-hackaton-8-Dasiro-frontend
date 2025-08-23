import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import { useSelectGrade } from "@entities/sinkhole/context";

const getGradeIcon = (grade: number) => `/images/icons/grade${grade}.png`;

const StyledContainer = styled(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
  ${({ theme }) => theme.fonts.subBold16};
  .dong {
    color: ${({ theme }) => theme.colors.orange01};
    ${({ theme }) => theme.fonts.subExtra16};
  }
  img {
    width: 157px;
    aspect-ratio: 1/1;
  }
  div:nth-child(2) {
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;

interface GradeInfoProps {
  selectedGrade?: number;
}

export const GradeInfo = ({ selectedGrade = 1 }: GradeInfoProps) => {
  const { searchedDistrict, isBadgeActive } = useSelectGrade();

  const dongName = searchedDistrict?.dong || "염창동";
  const displayGrade = selectedGrade;

  // badge 모드일 때와 일반 모드일 때 다른 내용 표시
  if (isBadgeActive) {
    return (
      <StyledContainer $gap={50}>
        <div>
          싱크홀 위험 요인을 종합 분석해
          <br />
          <span className="dong">부동산 자산 보호</span>가 가능한 <span className="dong">'안심존'</span>을 알려드려요!
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer $gap={50}>
      <div>
        <span className="dong">{dongName}</span>의<br /> 싱크홀 안전도는 {displayGrade}
        등급이에요!
      </div>
      <div>
        <img src={getGradeIcon(displayGrade)} alt="뱃지" />
      </div>
    </StyledContainer>
  );
};
