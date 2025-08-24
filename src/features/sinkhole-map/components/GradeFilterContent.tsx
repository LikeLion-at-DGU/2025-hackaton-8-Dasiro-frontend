import { useState, useEffect } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import { GradeSubtitle } from "@features/sinkhole-map/constants";
import { useSelectGrade } from "@entities/sinkhole/context";
import { MapSection } from "../containers/MapSection";
import { getDistrictsByGrade } from "@entities/sinkhole/api";
import type { Grade } from "@entities/sinkhole/selectgrade";
import { GradeInfo } from "./GradeInfo";

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

export const GradeFilterContent = () => {
  const { selectedGradeData, selectedGrade } = useSelectGrade();
  const [gradeDistrictInfo, setGradeDistrictInfo] = useState<{ names: string; count: number }>({ names: "", count: 0 });

  const displayGrade = selectedGrade ?? 1;
  const isGradeSelected =
    selectedGradeData &&
    selectedGradeData.items &&
    selectedGradeData.items.length > 0;

  const generateDynamicContent = (grade: number, dong: string, count: number) => {
    return GradeSubtitle(grade, dong, count).content;
  };

  useEffect(() => {
    if (isGradeSelected && selectedGrade) {
      const fetchGradeDistricts = async () => {
        try {
          const response = await getDistrictsByGrade(`G${selectedGrade}` as Grade);
          if (response && response.status === "success" && response.data.items.length > 0) {
            const firstThreeDistricts = response.data.items
              .slice(0, 3)
              .map((item: any) => item.dong)
              .join(", ");
            const totalCount = response.data.items.length;

            setGradeDistrictInfo({ names: firstThreeDistricts, count: totalCount });
          }
        } catch (error) {
          console.error(`${selectedGrade}등급 지역 데이터 가져오기 실패:`, error);
          setGradeDistrictInfo({ names: "해당 지역", count: 0 });
        }
      };
      fetchGradeDistricts();
    }
  }, [isGradeSelected, selectedGrade]);

  if (isGradeSelected) {
    return (
      <>
        <GradeInfo />
        <StyledContainer $gap={60}>
          <MapSection id="bottomsheet-grade-map" colorMode="risk" />
          <div style={{ gap: "15px" }}>
            <div className="title">
              <img src={ddang} alt="땅땅이" className="ddang" />
              {GradeSubtitle(displayGrade, gradeDistrictInfo.names, gradeDistrictInfo.count).subtitle}
            </div>
            <div className="content" id="filter-description">
              {generateDynamicContent(displayGrade, gradeDistrictInfo.names, gradeDistrictInfo.count)
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
      </>
    );
  }

  const defaultGradeInfo = GradeSubtitle(displayGrade, "반포2동, 대치1동, 상암동", 15);

  return (
    <>
      <GradeInfo />
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
    </>
  );
};

export default GradeFilterContent;
