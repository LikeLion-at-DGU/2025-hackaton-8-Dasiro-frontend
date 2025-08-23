import { createContext, useContext, useState, type ReactNode } from "react";
import type { Place } from "@entities/report/places";

interface CouponContextType {
  couponModalPlace: Place | null;
  showCouponModal: (place: Place) => void;
  closeCouponModal: () => void;
  useCoupon: (place: Place) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider = ({ children }: CouponProviderProps) => {
  const [couponModalPlace, setCouponModalPlace] = useState<Place | null>(null);

  const showCouponModal = (place: Place) => {
    setCouponModalPlace(place);
  };

  const closeCouponModal = () => {
    setCouponModalPlace(null);
  };

  const useCoupon = (place: Place) => {
    console.log(`${place.name}의 쿠폰을 사용합니다`);
    // TODO: 실제 쿠폰 사용 로직 구현
    setCouponModalPlace(null);
  };

  const value: CouponContextType = {
    couponModalPlace,
    showCouponModal,
    closeCouponModal,
    useCoupon,
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};