import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import badge from "/images/icons/badge.png";
import { GradeSubtitle } from "@features/sinkhole-map/constants";
import { useSelectGrade } from "@entities/sinkhole/context";
import wrench from "/images/icons/wrench.png";
import water from "/images/icons/water.png";
import subway from "/images/icons/subway.png";
import building from "/images/icons/building.png";
import incident from "/images/icons/incident.png";

const StyledContainer = styled(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
  ${({ theme }) => theme.fonts.subBold16};
  .title {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: ${({ theme }) => theme.colors.black02};
  }
  .content {
    display: block;
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.subBold16};
    line-height: 1.5;
    justify-content: flex-start;
    margin-top: 35px;
    width: 100%;
    .inner-content {
      color: ${({ theme }) => theme.colors.black02};
      ${({ theme }) => theme.fonts.bodySemiB14};
      margin-top: 10px;
      background-color: ${({ theme }) => theme.colors.black07};
      border-radius: 10px;
    }
  }
  .emphasis {
    color: ${({ theme }) => theme.colors.orange01};
    font-weight: bold;
  }
  .ddang {
    width: 25px;
    aspect-ratio: 25/24.48;
  }
  .icon {
    width: 16px;
    height: 16px;
  }
  .gradeBtn {
    width: 42px;
    height: 20px;
  }
  #filter-detail {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    ${({ theme }) => theme.fonts.capSemi12};
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bond {
      display: flex;
      align-items: center;
      gap: 7px;
    }
  }
`;

const gradeMapper = {
  G1: 1,
  G2: 2,
  G3: 3,
  G4: 4,
  G5: 5,
} as const;

type GradeKey = keyof typeof gradeMapper;

export const SearchResultContent = () => {
  const { searchedDistrict } = useSelectGrade();
  if (!searchedDistrict) return null;

  const grade = gradeMapper[searchedDistrict.total_grade as GradeKey];
  const ground_stability =
    gradeMapper[searchedDistrict.ground_stability as GradeKey];
  const groundwater_impact =
    gradeMapper[searchedDistrict.groundwater_impact as GradeKey];
  const underground_density =
    gradeMapper[searchedDistrict.underground_density as GradeKey];
  const old_building_dist =
    gradeMapper[searchedDistrict.old_building_dist as GradeKey];
  const incident_history =
    gradeMapper[searchedDistrict.incident_history as GradeKey];

  return (
    <StyledContainer>
      <div className="title" style={{ marginBottom: "50px" }}>
        <div>
          <span className="emphasis">{searchedDistrict.dong}</span>의
        </div>
        <div>싱크홀 안전도는 {grade}등급이에요!</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          marginBottom: "30px",
        }}
      >
        <img
          src={`/images/icons/grade${grade}.png`}
          alt=""
          style={{ width: "157px" }}
        />
      </div>
      <div style={{ display: "flex" }} id="filter-detail">
        <div>
          <div className="bond">
            {" "}
            <img src={wrench} alt="공사" className="icon" />
            굴착공사현장
          </div>{" "}
          <img
            src={`/images/icons/box${ground_stability}.png`}
            alt=""
            className="gradeBtn"
          />
        </div>
        <div>
          <div className="bond">
            <img src={water} alt="지하수" className="icon" />
            지하수 영향{" "}
          </div>
          <img
            src={`/images/icons/box${groundwater_impact}.png`}
            alt=""
            className="gradeBtn"
          />
        </div>
        <div>
          <div className="bond">
            <img src={subway} alt="지하철" className="icon" />
            지하 구조물 밀집도
          </div>{" "}
          <img
            src={`/images/icons/box${underground_density}.png`}
            alt=""
            className="gradeBtn"
          />
        </div>
        <div>
          <div className="bond">
            <img src={building} alt="노후건물" className="icon" />
            노후 건물 분포{" "}
          </div>
          <img
            src={`/images/icons/box${old_building_dist}.png`}
            alt=""
            className="gradeBtn"
          />
        </div>
        <div>
          <div className="bond">
            <img src={incident} alt="사고" className="icon" />
            싱크홀 사고 이력{" "}
          </div>
          <img
            src={`/images/icons/box${incident_history}.png`}
            alt=""
            className="gradeBtn"
          />
        </div>
      </div>
      <div className="content">
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <img src={ddang} alt="땅땅이" style={{ width: "25px" }} />
          {GradeSubtitle(grade).subtitle}
        </div>
        <div style={{ padding: "20px" }} className="inner-content">
          {searchedDistrict.dong}은 싱크홀 안전등급 종합 1등급으로, 매우 안전한
          지역이에요. 지반 안정성과 지하 구조물 밀집도가 1등급으로 매우
          양호했으며, 지하수 영향도와 노후 건물 분포는 각각 2등급으로 안정적인
          수준이에요. 이러한 요소들을 종합해볼 때, 염창동은 싱크홀 발생 위험이
          낮은 지역이니 안심하셔도 돼요!
        </div>
      </div>
      {grade <= 2 && (
        <div className="content">
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src={badge} alt="뱃지" style={{ width: "25px" }} />
            {searchedDistrict.dong}은 ‘부동산 안심존’이에요!
          </div>
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            className="inner-content"
          >
            <div>
              싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를
              보장하기 위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는
              <span className="emphasis">‘안심존 뱃지’</span>를 부여하고 있어요.
            </div>
            <div>
              <span className="emphasis">‘부동산 안심존’</span>으로 인증된
              지역은 싱크홀 안전등급 1등급에 해당하며, 지자체의 복구 및 정밀
              점검까지 완료된 곳이니 조금 더 안심하고 부동산을 거래하실 수
              있어요!
            </div>
          </div>
        </div>
      )}
    </StyledContainer>
  );
};

export default SearchResultContent;
