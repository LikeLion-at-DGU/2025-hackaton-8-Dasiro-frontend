import { BottomSheetElement } from "../ui";
import coupon from "@shared/assets/icons/coupon.png";

interface StoreCardProps {
  image: string;
  title: string;
  address: string;
  hasCoupon?: boolean;
  onClick?: () => void;
}

export const StoreCard = ({ 
  image, 
  title, 
  address, 
  hasCoupon = false, 
  onClick 
}: StoreCardProps) => {
  return (
    <BottomSheetElement.BottomCard onClick={onClick} id="bottomCard">
      <BottomSheetElement.CardContent>
        <img src={image} alt={title} />
        <div className="cardInner">
          <div className="cardTitls">{title}</div>
          <div className="cardPos">{address}</div>
        </div>
      </BottomSheetElement.CardContent>
      {hasCoupon && (
        <div className="couponBox">
          <img src={coupon} alt="" className="coupon" />
          <span>쿠폰</span>
        </div>
      )}
    </BottomSheetElement.BottomCard>
  );
};