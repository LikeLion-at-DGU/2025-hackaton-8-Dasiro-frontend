import { useState, useEffect, type ReactNode } from "react";
import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import { MainElement } from "@features/recovery-zone/ui";
import { LocationSetWithModal } from "./LocationSetWithModal";
import { ToastingBox } from "@features/recovery-zone/components/ToastingBox";
import logo from "/images/logo.png";
import { SinkholeMainElement } from "@features/sinkhole-map";
import { useSelectGrade } from "@entities/sinkhole/context";
import { getSafezoneGu } from "@entities/sinkhole/api";
import { useCoupon } from "@shared/contexts/CouponContext";
import { useRecovery } from "@features/recovery-zone/context/RecoveryContext";
import { Barcode } from "./Barcode";
import xicon from "/images/icons/x.png";

interface PageHeaderProps {
  showLocationSet?: boolean;
  locationSetText?: string;
  searchBar?: ReactNode;
  noticeBar?: ReactNode;
  showSinkholeButton?: boolean;
  showToast?: boolean; // 토스트 표시 여부
}

const CouponContent = style(BasicElement.Container).attrs(() => ({
  $borderRadius: 12,
  $columnDirection: true,
  $alignItems: "center",
  $gap: 16,
  $backgroundColor: "#fafafa",
}))`
  z-index: 1001;
  min-width: 270px;
  max-width: 320px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  
  /* 마스크를 사용하여 양쪽 끝에 원형 클리핑 */
  mask: 
    radial-gradient(circle 12px at -12px 175px, transparent 12px, black 12px),
    radial-gradient(circle 12px at calc(100% + 12px) 175px, transparent 12px, black 12px);
  mask-composite: intersect;
  -webkit-mask: 
    radial-gradient(circle 12px at -12px 175px, transparent 12px, black 12px),
    radial-gradient(circle 12px at calc(100% + 12px) 175px, transparent 12px, black 12px);
  -webkit-mask-composite: source-in;
  
  #notice{
    text-align: center;
    color: ${({ theme }) => theme.colors.black01};
    ${({ theme }) => theme.fonts.subExtra16};
    gap: 30px;
  }
  .content{
    text-align: center;
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.capSemi12};
  }
  
  #coupon-wrapper{
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 15px;
    border-bottom: 3px dashed #E1E1E1;
    padding-bottom: 20px;
    
    .coupon-title{
      color: ${({ theme }) => theme.colors.black01};
      ${({ theme }) => theme.fonts.subExtra16};
    }
    .content{
      color: ${({ theme }) => theme.colors.black02};
      ${({ theme }) => theme.fonts.bodySemiB14};
    }
  }
`;

export const PageHeader = ({
  showLocationSet = false,
  locationSetText = "위치 설정",
  searchBar,
  noticeBar,
  showSinkholeButton = false,
  showToast = false,
}: PageHeaderProps) => {
  const [activeButton, setActiveButton] = useState<"badge" | "layer">("layer"); // 기본값은 layer

  // 토스트 메시지 상태
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [toastFilterType, setToastFilterType] = useState<"임시복구" | "복구중">(
    "임시복구"
  );

  // CouponContext 안전하게 사용
  let couponModalPlace = null;
  let closeCouponModal = () => {};

  try {
    const couponContext = useCoupon();
    couponModalPlace = couponContext.couponModalPlace;
    closeCouponModal = couponContext.closeCouponModal;
  } catch {
    // CouponProvider가 없는 경우 기본값 사용
  }

  // RecoveryContext 안전하게 사용 (토스트 표시를 위해)
  let selectedRecoveryStatus = "전체";
  try {
    if (showToast) {
      const recoveryContext = useRecovery();
      selectedRecoveryStatus = recoveryContext.selectedRecoveryStatus;
    }
  } catch {
    // RecoveryProvider가 없는 경우 기본값 사용
  }

  // 복구현황 변경 감지해서 토스트 표시
  useEffect(() => {
    if (
      showToast &&
      (selectedRecoveryStatus === "임시복구" ||
        selectedRecoveryStatus === "복구중")
    ) {
      setToastFilterType(selectedRecoveryStatus as "임시복구" | "복구중");
      setShowToastMessage(true);
      const timer = setTimeout(() => {
        setShowToastMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowToastMessage(false);
    }
  }, [selectedRecoveryStatus, showToast]);

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
        const response = await getSafezoneGu();
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

  // 쿠폰 모달 관련 핸들러
  const handleCouponModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCouponModal();
    }
  };

  return (
    <>
      <MainElement.TopWrapper id="top-wrapper">
        <MainElement.TopBar>
          <img
            src={logo}
            alt="로고"
            style={{ 
              width: "60px", 
              height: "27.961px",
              display: showToastMessage ? "none" : "block"
            }}
          />
          {showLocationSet && (
            <div style={{ display: showToastMessage ? "none" : "block" }}>
              <LocationSetWithModal initialLocationText={locationSetText} />
            </div>
          )}
          {/* 토스트 메시지 - TopBar 안에 표시 */}
          {showToastMessage && <ToastingBox filterType={toastFilterType} />}
        </MainElement.TopBar>

        {searchBar && searchBar}
        {noticeBar && noticeBar}
        {showSinkholeButton && (
          <div id="sinkhole-button">
            {SinkholeMainElement.SinkholeButton(
              "layer",
              activeButton === "layer",
              () => handleButtonClick("layer")
            )}
            {SinkholeMainElement.SinkholeButton(
              "badge",
              activeButton === "badge",
              () => handleButtonClick("badge")
            )}
          </div>
        )}
      </MainElement.TopWrapper>

      {/* 쿠폰 모달 */}
      {couponModalPlace && (
        <MainElement.ModalOverlay onClick={handleCouponModalClose}>
          <CouponContent
            id="coupon-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ gap: "0px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "12px",
                paddingRight: "12px",
                width: "100%",
              }}
            >
              <img
                src={xicon}
                alt="x"
                style={{ width: "24px", aspectRatio: "1/1", cursor: "pointer" }}
                onClick={handleCouponModalClose}
              />
            </div>
            <div
              style={{ display: "flex", gap: "30px", flexDirection: "column" }}
            >
              <div id="notice">
                <img
                  src={logo}
                  alt="로고"
                  style={{ width: "77.25px", height: "36px" }}
                />
              </div>
              <div id="coupon-wrapper">
                <div className="coupon-title">카페 미묘 10% 할인쿠폰</div>
                <p className="content">
                  쿠폰 발급 및 사용 기간 : 2025.07.01 ~ 07.31
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "25px",
                }}
              >
                <Barcode
                  data={`COUPON-${
                    couponModalPlace?.name || "DEFAULT"
                  }-${Date.now()}`}
                  width={200}
                  height={60}
                  showText={true}
                  text={`${String(
                    couponModalPlace?.name?.slice(0, 3) || "001"
                  )}-${String(Date.now()).slice(-6)}`}
                  barColor="#333"
                  backgroundColor="transparent"
                />
              </div>
            </div>
          </CouponContent>
        </MainElement.ModalOverlay>
      )}
    </>
  );
};
