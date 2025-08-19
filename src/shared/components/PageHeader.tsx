import React, { ReactNode } from "react";
import { MainElement } from "@features/recovery-zone/ui";
import { LocationSetWithModal } from "./LocationSetWithModal";
import logo from "/images/logo.png";

interface PageHeaderProps {
  showLocationSet?: boolean;
  locationSetText?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  searchBar?: ReactNode;
  noticeBar?: ReactNode;
}

export const PageHeader = ({
  showLocationSet = false,
  locationSetText = "위치 설정",
  onLocationSelect,
  searchBar,
  noticeBar
}: PageHeaderProps) => {
  return (
    <>
      <MainElement.TopWrapper>
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
      </MainElement.TopWrapper>
    </>
  );
};