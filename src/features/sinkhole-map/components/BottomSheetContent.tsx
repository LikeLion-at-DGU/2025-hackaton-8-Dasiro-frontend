import style from "styled-components";
import * as SinkholeBottomSheetElement from "@features/sinkhole-map/ui/BottomSheetElement";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import badge from "/images/icons/badge.png";
import whitemarker from "/images/icons/whitemarker.png";
import { gradeSubtitle } from "@features/sinkhole-map/types";

const getGradeIcon = (grade: number) => `/images/icons/grade${grade}.png`;

const grade: number = 1; // Replace 1 with the actual grade value as needed

const StyledContainer = style(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
${({ theme }) => theme.fonts.subBold16};
  #dong{
    color: ${({ theme }) => theme.colors.orange01};
    ${({ theme }) => theme.fonts.subExtra16};
  }
  img{
    width: 157px;
    aspect-ratio: 1/1;
  }
  div:nth-child(2){
    display: flex;
    width: 100%;
    justify-content: center;
  }
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

const StyledButton = style(BasicElement.Button)`
  ${({ theme }) => theme.fonts.bodySemiB14}
  color: ${({ theme }) => theme.colors.orange06};
  background-color: ${({ theme }) => theme.colors.orange01};
  img{
    width: 12.8px;
    height: 16px;
  }
`;

export const BottomSheetContent = () => {
  return (
    <BasicElement.Container $gap={35} $columnDirection={true}>
      <StyledContainer $gap={50}>
        <div>
          <span id="dong">염창동</span>의<br /> 싱크홀 안전도는 {grade}
          등급이에요!
        </div>
        <div>
          <img src={getGradeIcon(grade)} alt="뱃지" />
        </div>
      </StyledContainer>
      <StyledContainer $gap={15}>
        <div className="title">
          <img src={ddang} alt="땅땅이" className="ddang" />
          {gradeSubtitle[grade].subtitle}
        </div>
        <div className="content">
          염창동은 싱크홀 안전등급 종합 1등급으로, 매우 안전한 지역이에요. 지반
          안정성과 지하 구조물 밀집도가 1등급으로 매우 양호했으며, 지하수
          영향도와 노후 건물 분포는 각각 2등급으로 안정적인 수준이에요. 이러한
          요소들을 종합해볼 때, 염창동은 싱크홀 발생 위험이 낮은 지역이니
          안심하셔도 돼요!
        </div>
      </StyledContainer>
      <StyledContainer $gap={15}>
        <div className="title">
          <img src={badge} alt="땅땅이" className="ddang" />
          염창동은 '부동산 안심존'이에요!
        </div>
        <div className="content">
          싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를 보장하기
          위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는 ‘안심존
          뱃지’를 부여하고 있어요. ‘부동산 안심존’으로 인증된 지역은 싱크홀
          안전등급 1~2등급에 해당하며, 지자체의 복구 및 정밀 점검까지 완료된
          곳이니 조금 더 안심하고 부동산을 거래하실 수 있어요!
        </div>
      </StyledContainer>
      <StyledButton
        $width={"fit-content"}
        $gap={10}
        $padding={[6, 20]}
        $borderRadius={50}
      >
        <img src={whitemarker} alt="하얀색 핀" />
        지도보기
      </StyledButton>
    </BasicElement.Container>
  );
};

export default BottomSheetContent;
