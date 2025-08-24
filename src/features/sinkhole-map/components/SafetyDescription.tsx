import { useState, useEffect } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import badge from "/images/icons/badge.png";
import { GradeSubtitle } from "@features/sinkhole-map/constants";
import { useSelectGrade } from "@entities/sinkhole/context";
import { MapSection } from "@features/recovery-zone";
import { getSafezoneDistricts, getDistrictsByGrade } from "@entities/sinkhole/api";
import type { Grade } from "@entities/sinkhole/selectgrade";

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
  #filter-description {
    padding: 20px;
    align-items: center;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.orange06};
  }
`;

interface SafetyDescriptionProps {
  selectedGrade?: number;
}

export const SafetyDescription = ({
  selectedGrade = 1,
}: SafetyDescriptionProps) => {
  const { isBadgeActive, selectedGradeData } = useSelectGrade();
  const [safezoneDistrictNames, setSafezoneDistrictNames] =
    useState<string>("염창동, 신길동, 마포동");
  const [gradeDistrictInfo, setGradeDistrictInfo] = useState<{
    names: string;
    count: number;
  }>({ names: "", count: 0 });

  const displayGrade = selectedGrade;

  // 등급이 선택되었는지 확인 (selectedGradeData가 있고 items가 있으면 등급 선택됨)
  const isGradeSelected =
    selectedGradeData &&
    selectedGradeData.items &&
    selectedGradeData.items.length > 0;

  // 동적으로 content 생성하는 함수
  const generateDynamicContent = (grade: number, dong: string, count: number) => {
    return GradeSubtitle(grade, dong, count).content;
  };

  // 안심존 행정동 데이터 가져오기
  useEffect(() => {
    if (isBadgeActive) {
      const fetchSafezoneDistricts = async () => {
        try {
          const response = await getSafezoneDistricts();
          if (
            response &&
            response.status === "success" &&
            response.data.items.length > 0
          ) {
            // 처음 3개 동의 이름만 추출하여 쉼표로 연결
            const firstThreeDistricts = response.data.items
              .slice(0, 3)
              .map((item) => item.dong)
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

  // 등급별 지역 데이터 가져오기
  useEffect(() => {
    if (isGradeSelected && selectedGrade) {
      const fetchGradeDistricts = async () => {
        try {
          const response = await getDistrictsByGrade(`G${selectedGrade}` as Grade);
          if (
            response &&
            response.status === "success" &&
            response.data.items.length > 0
          ) {
            // 처음 3개 동의 이름만 추출하여 쉼표로 연결
            const firstThreeDistricts = response.data.items
              .slice(0, 3)
              .map((item: any) => item.dong)
              .join(", ");
            const totalCount = response.data.items.length;
            
            setGradeDistrictInfo({
              names: firstThreeDistricts,
              count: totalCount
            });
          }
        } catch (error) {
          console.error(`${selectedGrade}등급 지역 데이터 가져오기 실패:`, error);
          // 에러가 발생하면 기본값 사용
          setGradeDistrictInfo({
            names: "해당 지역",
            count: 0
          });
        }
      };

      fetchGradeDistricts();
    }
  }, [isGradeSelected, selectedGrade]);

  // 디버깅용 로그
  // console.log("SafetyDescription - isBadgeActive:", isBadgeActive);
  // console.log("SafetyDescription - viewMode:", viewMode);
  // console.log("SafetyDescription - safezoneData:", safezoneData);

  // badge 모드일 때와 등급 선택 시 지도 표시
  if (isBadgeActive) {
    return (
      <StyledContainer $gap={60}>
        {/* G1, G2 등급 행정구에만 색상 표시하는 지도 */}
        <MapSection id="bottomsheet-map" colorMode="risk" forceViewMode="safezone" />
        <div>
          <div className="title">
            <img src={badge} alt="뱃지" className="ddang" />
            안전 복구 완료! '부동산 안심존'이에요.
          </div>
          <div className="content">
            현재 <span>{safezoneDistrictNames}</span> 등이 '부동산 안심존'으로
            인증되었어요.
            <br />
            <br />
            싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를
            보장하기 위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는{" "}
            <span>‘안심존 뱃지’</span>를 부여하고 있어요.
            <br />
            <br />
            <span>‘부동산 안심존’</span>으로 인증된 지역은 싱크홀 안전등급
            1~2등급에 해당하며, 지자체의 복구 및 정밀 점검까지 완료된 곳이니
            조금 더 안심하고 부동산을 거래하실 수 있어요!
            <br />
            <br />
            싱크홀
          </div>
        </div>
      </StyledContainer>
    );
  }

  // 등급이 선택된 경우 지도와 함께 표시
  if (isGradeSelected) {
    return (
      <StyledContainer $gap={60}>
        {/* 선택된 등급 행정구에만 색상 표시하는 지도 */}
        <MapSection id="bottomsheet-grade-map" colorMode="risk" />
        <div>
          <div className="title">
            <img src={ddang} alt="땅땅이" className="ddang" />
            {GradeSubtitle(selectedGrade, gradeDistrictInfo.names, gradeDistrictInfo.count).subtitle}
          </div>
          <div className="content" id="filter-description">
            {generateDynamicContent(selectedGrade, gradeDistrictInfo.names, gradeDistrictInfo.count)
              .split(/(\S+?동(?:, \S+?동)*|총 \d+개 동)/)
              .map((part: any, index: any) => {
                if (part.match(/\S+?동(?:, \S+?동)*/)) {
                  return <span key={index}>{part}</span>;
                }
                if (part.match(/총 \d+개 동/)) {
                  return <span key={index}>{part}</span>;
                }
                return part;
              })}
          </div>
        </div>
      </StyledContainer>
    );
  }

  // 기본 상태에서는 기본값으로 표시
  const defaultGradeInfo = GradeSubtitle(displayGrade, "반포2동, 대치1동, 상암동", 15);

  return (
    <StyledContainer $gap={15}>
      <div className="title">
        <img src={ddang} alt="땅땅이" className="ddang" />
        {defaultGradeInfo.subtitle}
      </div>
      <div className="content" id="filter-description">
        {defaultGradeInfo.content.split(/(\S+?동(?:, \S+?동)*|총 \d+개 동)/).map((part: any, index: any) => {
          if (part.match(/\S+?동(?:, \S+?동)*/)) {
            return <span key={index}>{part}</span>;
          }
          if (part.match(/총 \d+개 동/)) {
            return <span key={index}>{part}</span>;
          }
          return part;
        })}
      </div>
    </StyledContainer>
  );
};
