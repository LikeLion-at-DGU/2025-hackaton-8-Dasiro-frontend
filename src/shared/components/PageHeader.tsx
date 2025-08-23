import { useState, type ReactNode } from "react";
import { MainElement } from "@features/recovery-zone/ui";
import { LocationSetWithModal } from "./LocationSetWithModal";
import logo from "/images/logo.png";
import { SinkholeMainElement } from "@features/sinkhole-map";
import { useSelectGrade } from "@entities/sinkhole/context";
import { getSafezones } from "@entities/sinkhole/api";

interface PageHeaderProps {
  showLocationSet?: boolean;
  locationSetText?: string;
  searchBar?: ReactNode;
  noticeBar?: ReactNode;
  showSinkholeButton?: boolean;
}

export const PageHeader = ({
  showLocationSet = false,
  locationSetText = "위치 설정",
  searchBar,
  noticeBar,
  showSinkholeButton = false,
}: PageHeaderProps) => {
  const [activeButton, setActiveButton] = useState<"badge" | "layer">("layer"); // 기본값은 layer
  
  // Sinkhole 컨텍스트 (showSinkholeButton이 true일 때만 사용)
  let sinkholeContext: any = null;
  try {
    if (showSinkholeButton) {
      sinkholeContext = useSelectGrade();
    }
  } catch {
    // Context가 없는 경우 무시
  }

  const handleButtonClick = async (type: "badge" | "layer") => {
    setActiveButton(type);
    
    if (type === "badge" && sinkholeContext) {
      // badge 버튼 클릭 시 안심존 데이터 조회
      sinkholeContext.setIsBadgeActive(true);
      try {
        const response = await getSafezones();
        if (response && response.status === "success") {
          sinkholeContext.setSafezoneData(response.data);
          sinkholeContext.setViewMode("safezone");
          console.log("안심존 데이터:", response.data);
        } else {
          console.error("안심존 데이터 조회 실패");
        }
      } catch (error) {
        console.error("안심존 API 호출 실패:", error);
      }
    } else if (type === "layer" && sinkholeContext) {
      // layer 버튼 클릭 시 등급 모드로 복귀
      sinkholeContext.setIsBadgeActive(false);
      sinkholeContext.setViewMode("grade");
    }
  };

  return (
    <>
      <MainElement.TopWrapper id="top-wrapper">
        <MainElement.TopBar>
          <img
            src={logo}
            alt="로고"
            style={{ width: "60px", height: "27.961px" }}
          />
          {showLocationSet && (
            <LocationSetWithModal
              initialLocationText={locationSetText}
            />
          )}
        </MainElement.TopBar>

        {searchBar && searchBar}
        {noticeBar && noticeBar}
        {showSinkholeButton && (
          <div id="sinkhole-button">
            {SinkholeMainElement.SinkholeButton("layer", activeButton === "layer", () => handleButtonClick("layer"))}
            {SinkholeMainElement.SinkholeButton("badge", activeButton === "badge", () => handleButtonClick("badge"))}
          </div>
        )}
      </MainElement.TopWrapper>
    </>
  );
};
