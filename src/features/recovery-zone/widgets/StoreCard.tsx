import { BottomSheetElement } from "../ui";
import { type Place } from "@entities/report/places";
import coupon from "/images/icons/coupon.png";
import move from "/images/icons/move.png";

interface StoreCardProps {
  place: Place;
  cardClickHandler?: (place: Place) => void;
  couponClickHandler?: (place: Place) => void;
}

// Legacy props interface for backward compatibility (incident data)
interface LegacyStoreCardProps {
  image: string | undefined;
  title: string;
  address: string;
  occurred_at: string;
  cause: string;
  method: string;
  cardClickHandler?: () => void;
}

// New StoreCard component using Place data
export const StoreCard = ({
  place,
  cardClickHandler,
  couponClickHandler,
}: StoreCardProps) => {
  const handleCouponClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    couponClickHandler?.(place);
  };

  const handleCardClick = () => {
    cardClickHandler?.(place);
  };

  const handleKakaoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (place.kakao_url) {
      window.open(place.kakao_url, "_blank");
    }
  };

  return (
    <BottomSheetElement.BottomCard onClick={handleCardClick} id="bottomCard">
      <BottomSheetElement.CardContent>
        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
          <img
            src={place.main_image_url || "/images/default-store.png"}
            alt={place.name}
          />
        </div>
        <div className="cardInner">
          <div className="cardTitles">
            {place.name}{" "}
            <img
              src={move}
              alt="카카오 페이지 이동 버튼"
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              onClick={handleKakaoClick}
            />
          </div>
          <div className="cardPos">{place.address}</div>
        </div>
      </BottomSheetElement.CardContent>
      <div className="couponBox" onClick={handleCouponClick}>
        <img src={coupon} alt="" className="coupon" />
        <span>쿠폰</span>
      </div>
    </BottomSheetElement.BottomCard>
  );
};

// Legacy StoreCard component for backward compatibility
export const LegacyStoreCard = ({
  image,
  title,
  address,
  occurred_at,
  cause,
  method,
  cardClickHandler,
}: LegacyStoreCardProps) => {
  return (
    <BottomSheetElement.BottomCard
      onClick={cardClickHandler}
      className="LegacyBottomCard"
    >
      <BottomSheetElement.CardContent>
        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
          <img src={image} alt={title}/>
        </div>
        <div className="cardInner" style={{ gap: "7px" }}>
          <div className="cardDate">{occurred_at}</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div className="cardTitls">{address}</div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div className="cardPos">원인 | {cause}</div>
              <div className="cardPos">복구방법 | {method}</div>
            </div>
          </div>
        </div>
      </BottomSheetElement.CardContent>
    </BottomSheetElement.BottomCard>
  );
};
