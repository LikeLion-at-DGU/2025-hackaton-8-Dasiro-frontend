import React, { useState, type ReactNode } from "react";
import { MainElement } from "@features/recovery-zone/ui";
import { LocationSetWithModal } from "./LocationSetWithModal";
import logo from "/images/logo.png";
import { SinkholeMainElement } from "@features/sinkhole-map";

interface PageHeaderProps {
  showLocationSet?: boolean;
  locationSetText?: string;
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  searchBar?: ReactNode;
  noticeBar?: ReactNode;
}

export const PageHeader = ({
  showLocationSet = false,
  locationSetText = "위치 설정",
  onLocationSelect,
  searchBar,
  noticeBar,
}: PageHeaderProps) => {
  const [activeButton, setActiveButton] = useState<"badge" | "layer">("layer"); // 기본값은 layer

  const handleButtonClick = (type: "badge" | "layer") => {
    setActiveButton(type);
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
              onLocationSelect={onLocationSelect}
            />
          )}
        </MainElement.TopBar>

        {searchBar && searchBar}
        {noticeBar && noticeBar}
        <div id="sinkhole-button">
          {SinkholeMainElement.SinkholeButton("layer", activeButton === "layer", () => handleButtonClick("layer"))}
          {SinkholeMainElement.SinkholeButton("badge", activeButton === "badge", () => handleButtonClick("badge"))}
        </div>
      </MainElement.TopWrapper>
    </>
  );
};
