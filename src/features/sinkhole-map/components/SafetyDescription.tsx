import { useState, useEffect } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import badge from "/images/icons/badge.png";
import { GradeSubtitle } from "@features/sinkhole-map/constants";
import { useSelectGrade } from "@entities/sinkhole/context";
import { MapSection } from "@features/recovery-zone";
import { getSafezoneDistricts } from "@entities/sinkhole/api";
import type { SafezoneDistrictItem } from "@features/sinkhole-map/constants";

const StyledContainer = styled(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
  ${({ theme }) => theme.fonts.subBold16};
  .title {
    display: flex;
    gap: 5px;
    color: ${({ theme }) => theme.colors.black02};
  }
  .content {
    display: block;
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.black07};
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.bodySemiB14};
    line-height: 1.5;
    
    span {
      color: ${({ theme }) => theme.colors.orange01};
      font-weight: bold;
    }
  }
  .ddang {
    width: 25px;
    aspect-ratio: 25/24.48;
  }
`;

interface SafetyDescriptionProps {
  selectedGrade?: number;
}

export const SafetyDescription = ({
  selectedGrade = 1,
}: SafetyDescriptionProps) => {
  const { searchedDistrict, isBadgeActive, viewMode, safezoneData } =
    useSelectGrade();
  const [safezoneDistrictNames, setSafezoneDistrictNames] = useState<string>("염창동, 신길동, 마포동");

  const dongName = searchedDistrict?.dong || "염창동";
  const displayGrade = selectedGrade;

  // 안심존 행정동 데이터 가져오기
  useEffect(() => {
    if (isBadgeActive) {
      const fetchSafezoneDistricts = async () => {
        try {
          const response = await getSafezoneDistricts();
          if (response && response.status === "success" && response.data.items.length > 0) {
            // 처음 3개 동의 이름만 추출하여 쉼표로 연결
            const firstThreeDistricts = response.data.items
              .slice(0, 3)
              .map(item => item.dong)
              .join(", ");
            setSafezoneDistrictNames(firstThreeDistricts);
          }
        } catch (error) {
          console.error("안심존 행정동 데이터 가져오기 실패:", error);
          // 에러가 발생하면 기본값 사용
        }
      };

      fetchSafezoneDistricts();
    }
  }, [isBadgeActive]);

  // 디버깅용 로그
  // console.log("SafetyDescription - isBadgeActive:", isBadgeActive);
  // console.log("SafetyDescription - viewMode:", viewMode);
  // console.log("SafetyDescription - safezoneData:", safezoneData);

  // badge 모드일 때와 일반 모드일 때 다른 내용 표시
  if (isBadgeActive) {
    return (
      <StyledContainer $gap={15}>
        {/* G1, G2 등급 행정구에만 색상 표시하는 지도 */}
        <MapSection colorMode="risk" forceViewMode="safezone" />
        <div className="title">
          <img src={badge} alt="뱃지" className="ddang" />
          안전 복구 완료! '부동산 안심존'이에요.
        </div>
        <div className="content">
          현재 <span>{safezoneDistrictNames}</span> 등이 '부동산 안심존'으로 인증되었어요.<br/><br/>
          싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를 보장하기
          위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는 <span>‘안심존
          뱃지’</span>를 부여하고 있어요.<br/><br/><span>‘부동산 안심존’</span>으로 인증된 지역은 싱크홀
          안전등급 1~2등급에 해당하며, 지자체의 복구 및 정밀 점검까지 완료된
          곳이니 조금 더 안심하고 부동산을 거래하실 수 있어요!
          <br />
          <br />
          싱크홀
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer $gap={15}>
      <div className="title">
        <img src={ddang} alt="땅땅이" className="ddang" />
        {GradeSubtitle[displayGrade].subtitle}
      </div>
      <div className="content">
        {dongName}은 싱크홀 안전등급 종합 {displayGrade}등급으로,{" "}
        {displayGrade <= 2
          ? "매우 안전한"
          : displayGrade <= 3
          ? "안전한"
          : "주의가 필요한"}{" "}
        지역이에요. 지반 안정성과 지하 구조물 밀집도가 {displayGrade}등급으로{" "}
        {displayGrade <= 2
          ? "매우 양호했으며"
          : displayGrade <= 3
          ? "양호했으며"
          : "주의가 필요하며"}
        , 지하수 영향도와 노후 건물 분포는 각각 {displayGrade}등급으로{" "}
        {displayGrade <= 2
          ? "안정적인"
          : displayGrade <= 3
          ? "보통"
          : "주의가 필요한"}{" "}
        수준이에요. 이러한 요소들을 종합해볼 때, {dongName}은 싱크홀 발생 위험이{" "}
        {displayGrade <= 2 ? "낮은" : displayGrade <= 3 ? "보통인" : "높은"}{" "}
        지역이니
        {displayGrade <= 2
          ? "안심하셔도 돼요!"
          : displayGrade <= 3
          ? "적당한 주의가 필요해요!"
          : "충분한 주의가 필요해요!"}
      </div>
    </StyledContainer>
  );
};
