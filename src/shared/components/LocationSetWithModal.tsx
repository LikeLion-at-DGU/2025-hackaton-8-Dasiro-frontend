import { useState } from "react";
import { MainElement } from "@features/recovery-zone/ui";
import { LocationPickerMap } from "@features/recovery-zone/widgets/LocationPickerMap";

interface LocationSetWithModalProps {
  initialLocationText?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationSetWithModal = ({
  initialLocationText = "위치 설정",
  onLocationSelect
}: LocationSetWithModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);

  const handleLocationClick = () => {
    console.log("위치 설정 버튼 클릭됨");
    setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleLocationSelectInternal = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
    // 여기서는 내부 상태만 업데이트, 상위 전달은 "허용" 버튼에서
  };

  const handleLocationAllow = () => {
    if (selectedLocation) {
      console.log("위치 허용됨:", selectedLocation);
      setIsLocationAllowed(true);
      onLocationSelect?.(selectedLocation); // 여기서 상위 컴포넌트로 위치 전달
    }
    setIsModalOpen(false);
  };

  return (
    <>
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
                  onLocationSelect={handleLocationSelectInternal}
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
      
      <MainElement.LocationSet
        onClick={handleLocationClick}
        style={{ cursor: "pointer", pointerEvents: "auto" }}
      >
        {isLocationAllowed ? "현재 위치" : initialLocationText}
        <img
          src="/images/icons/downarrow.png"
          alt="화살표"
          style={{ width: "17px", height: "17px" }}
        />
      </MainElement.LocationSet>
    </>
  );
};