import { createContext, useContext, useState, type ReactNode } from "react";
import type { Place } from "@entities/report/places";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface RecoveryContextType {
  // 선택된 위치 정보
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  
  // 주변 장소 데이터
  places: Place[];
  setPlaces: (places: Place[]) => void;
  
  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 필터 상태
  selectedRecoveryStatus: string;
  setSelectedRecoveryStatus: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

interface RecoveryProviderProps {
  children: ReactNode;
}

export const RecoveryProvider = ({ children }: RecoveryProviderProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>({
    lat: 37.5665,
    lng: 126.9780,
    address: "서울시 중구 명동"
  });
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 필터 상태
  const [selectedRecoveryStatus, setSelectedRecoveryStatus] = useState<string>("복구 현황");
  const [selectedCategory, setSelectedCategory] = useState<string>("업종");

  return (
    <RecoveryContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      places,
      setPlaces,
      isLoading,
      setIsLoading,
      selectedRecoveryStatus,
      setSelectedRecoveryStatus,
      selectedCategory,
      setSelectedCategory,
    }}>
      {children}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (context === undefined) {
    throw new Error("useRecovery must be used within a RecoveryProvider");
  }
  return context;
};