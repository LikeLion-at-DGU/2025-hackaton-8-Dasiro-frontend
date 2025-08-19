import { BottomSheetElement } from "../ui";
import coupon from "/images/icons/coupon.png";

interface StoreCardProps {
  image: string;
  title: string;
  address: string;
  hasCoupon?: boolean;
  cardClickHandler?: () => void;
  couponClickHandler?: () => void;
}

export const StoreCard = ({ 
  image, 
  title, 
  address, 
  hasCoupon = false, 
  cardClickHandler,
  couponClickHandler
}: StoreCardProps) => {
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