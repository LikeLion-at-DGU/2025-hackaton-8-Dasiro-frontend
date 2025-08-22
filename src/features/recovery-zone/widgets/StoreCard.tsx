import { BottomSheetElement } from "../ui";
import { type Place } from "@entities/report/places";
import coupon from "/images/icons/coupon.png";

interface StoreCardProps {
  place: Place;
  cardClickHandler?: (place: Place) => void;
  couponClickHandler?: (place: Place) => void;
}

// Legacy props interface for backward compatibility
interface LegacyStoreCardProps {
  image: string;
  title: string;
  address: string;
  hasCoupon?: boolean;
  cardClickHandler?: () => void;
  couponClickHandler?: () => void;
}

// New StoreCard component using Place data
export const StoreCard = ({ 
  place, 
  cardClickHandler,
  couponClickHandler
}: StoreCardProps) => {
  const handleCouponClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    couponClickHandler?.(place);
  };

  const handleCardClick = () => {
    cardClickHandler?.(place);
  };

  return (
    <BottomSheetElement.BottomCard onClick={handleCardClick} id="bottomCard">
      <BottomSheetElement.CardContent>
        <img 
          src={place.main_image_url || "/images/default-store.png"} 
          alt={place.name} 
        />
        <div className="cardInner">
          <div className="cardTitls">{place.name}</div>
          <div className="cardPos">{place.address}</div>
        </div>
      </BottomSheetElement.CardContent>
      {place.has_active_coupons && (
        <div className="couponBox" onClick={handleCouponClick}>
          <img src={coupon} alt="" className="coupon" />
          <span>쿠폰</span>
        </div>
      )}
    </BottomSheetElement.BottomCard>
  );
};

// Legacy StoreCard component for backward compatibility
export const LegacyStoreCard = ({ 
  image, 
  title, 
  address, 
  hasCoupon = false, 
  cardClickHandler,
  couponClickHandler
}: LegacyStoreCardProps) => {
  const handleCouponClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    couponClickHandler?.();
  };

  return (
    <BottomSheetElement.BottomCard onClick={cardClickHandler} id="bottomCard">
      <BottomSheetElement.CardContent>
        <img src={image} alt={title} />
        <div className="cardInner">
          <div className="cardTitls">{title}</div>
          <div className="cardPos">{address}</div>
        </div>
      </BottomSheetElement.CardContent>
      {hasCoupon && (
        <div className="couponBox" onClick={handleCouponClick}>
          <img src={coupon} alt="" className="coupon" />
          <span>쿠폰</span>
        </div>
      )}
    </BottomSheetElement.BottomCard>
  );
};