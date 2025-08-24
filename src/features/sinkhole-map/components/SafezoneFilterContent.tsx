import { useState, useEffect } from "react";
import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import badge from "/images/icons/badge.png";
import { MapSection } from "../containers/MapSection";
import { getSafezoneDistricts } from "@entities/sinkhole/api";

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

export const SafezoneFilterContent = () => {
  const [safezoneDistrictNames, setSafezoneDistrictNames] = useState<string>("염창동, 신길동, 마포동");

  useEffect(() => {
    const fetchSafezoneDistricts = async () => {
      try {
        const response = await getSafezoneDistricts();
        if (response && response.status === "success" && response.data.items.length > 0) {
          const firstThreeDistricts = response.data.items
            .slice(0, 3)
            .map((item) => item.dong)
            .join(", ");
          setSafezoneDistrictNames(firstThreeDistricts);
        }
      } catch (error) {
        console.error("안심존 행정동 데이터 가져오기 실패:", error);
      }
    };
    fetchSafezoneDistricts();
  }, []);

  return (
    <StyledContainer $gap={60}>
      <MapSection id="bottomsheet-map" colorMode="risk" forceViewMode="safezone" />
      <div style={{ gap: "15px", display: "flex", flexDirection: "column" }}>
        <div className="title">
          <img src={badge} alt="뱃지" className="ddang" />
          안전 복구 완료! '부동산 안심존'이에요.
        </div>
        <div className="content">
          현재 <span>{safezoneDistrictNames}</span> 등이 '부동산 안심존'으로 인증되었어요.
          <br />
          <br />
          싱크홀 위험으로 인한 부동산 피해를 줄이고, 안전한 자산 거래를 보장하기 위해 복구 완료 및 추가 안전 점검을 모두 통과한 지역에는 <span>‘안심존 뱃지’</span>를 부여하고 있어요.
          <br />
          <br />
          <span>‘부동산 안심존’</span>으로 인증된 지역은 싱크홀 안전등급 1~2등급에 해당하며, 지자체의 복구 및 정밀 점검까지 완료된 곳이니 조금 더 안심하고 부동산을 거래하실 수 있어요!
          <br />
          <br />
        </div>
      </div>
    </StyledContainer>
  );
};

export default SafezoneFilterContent;
