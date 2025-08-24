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
  const { searchedDistrict, isBadgeActive, selectedGradeData } = useSelectGrade();

  const dongName = searchedDistrict?.dong || "염창동";
  const displayGrade = selectedGrade;
  
  // 등급이 선택되었는지 확인
  const isGradeSelected = selectedGradeData && selectedGradeData.items && selectedGradeData.items.length > 0;

  // badge 모드일 때와 일반 모드일 때 다른 내용 표시
  if (isBadgeActive) {
    return (
      <StyledContainer $gap={50}>
        <div>
          싱크홀 위험 요인을 종합 분석해
          <br />
          <span className="dong">부동산 자산 보호</span>가 가능한{" "}
          <span className="dong">'안심존'</span>을 알려드려요!
        </div>
      </StyledContainer>
    );
  }

  // 등급 필터가 선택된 경우
  if (isGradeSelected) {
    return (
      <StyledContainer $gap={50}>
        <div>
          <span className="dong">싱크홀 위험 요인</span>을 종합 분석해
          <br />
          <span>지역별 싱크홀 안전등급을 알려드릴게요!</span>
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer $gap={50} id="normal-info">
      <div>
        <span className="dong">{dongName}</span>의<br /> 싱크홀 안전도는{" "}
        {displayGrade}
        등급이에요!
      </div>
      <div>
        <img src={getGradeIcon(displayGrade)} alt="뱃지" />
      </div>
    </StyledContainer>
  );
};
