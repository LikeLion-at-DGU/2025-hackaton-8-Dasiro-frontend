// Recovery Zone 헤더 컴포넌트 - 로고, 위치 설정, 공지사항을 포함
import { useState } from "react";
import { MainElement } from "../ui";
import { LocationPickerMap } from "../widgets/LocationPickerMap";
import logo from "@shared/assets/logo.png";
import downarrow from "@shared/assets/icons/downarrow.png";

export const Header = () => {
  // 위치 설정 모달 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 사용자가 선택한 위치 정보 (위도, 경도, 주소)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  
  // 위치 허용 여부 상태 (허용 시 "현재 위치", 미허용 시 "위치 설정" 표시)
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);

  // 컴포넌트 마운트 시 로그
  console.log("Header 컴포넌트 렌더링됨, isModalOpen:", isModalOpen);

  const handleLocationClick = () => {
    console.log("위치 설정 버튼 클릭됨");
    setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    // 모달 콘텐츠 영역을 클릭한 경우가 아니라면 모달을 닫음
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
  };

  const handleLocationAllow = () => {
    if (selectedLocation) {
      console.log("위치 허용됨:", selectedLocation);
      setIsLocationAllowed(true);
      // 여기에 위치 허용 후 처리 로직 추가
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <MainElement.TopWrapper>
        <MainElement.TopBar>
          <img
            src={logo}
            alt="로고"
            style={{ width: "60px", height: "27.961px" }}
          />
          <MainElement.LocationSet
            onClick={handleLocationClick}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          >
            {isLocationAllowed ? "현재 위치" : "위치 설정"}{" "}
            <img
              src={downarrow}
              alt="화살표"
              style={{ width: "17px", height: "17px" }}
            />
          </MainElement.LocationSet>
        </MainElement.TopBar>
        <MainElement.NoticeBar id="notice">
          <span>NOTICE</span>
          <span>복구완료된 주변 상권, 따뜻한 소비로 응원해보세요!</span>
        </MainElement.NoticeBar>
      </MainElement.TopWrapper>

      {isModalOpen && (
        <MainElement.ModalOverlay onClick={handleModalClose}>
          <MainElement.ModalContent onClick={(e) => e.stopPropagation()}>
            <div id="notice">
              '다시로' 앱이 사용자의 위치를
              <br /> 사용하도록 허용하겠습니까?
            </div>
            <p className="content">
              위치 정보를 기반으로 현재 위치,
              <br /> 길찾기 정보, 컨텐츠 추천을 제공합니다
            </p>
            <div id="button-wrapper">
              <div className="map-container">
                <LocationPickerMap
                  onLocationSelect={handleLocationSelect}
                  isVisible={isModalOpen}
                />
              </div>
              <button onClick={handleLocationAllow}>허용</button>
              <button onClick={() => {
                setIsLocationAllowed(false);
                setIsModalOpen(false);
              }}>허용 안 함</button>
            </div>
          </MainElement.ModalContent>
        </MainElement.ModalOverlay>
      )}
    </>
  );
};
