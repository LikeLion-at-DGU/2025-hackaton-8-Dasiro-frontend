import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Place } from "@entities/report/places";
import { getPlaces } from "@entities/report/places";
import { SEOUL_CITY_HALL } from "@shared/utils/locationUtils";

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
  selectedRecoveryStatus: string | null;
  setSelectedRecoveryStatus: (status: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

interface RecoveryProviderProps {
  children: ReactNode;
}

export const RecoveryProvider = ({ children }: RecoveryProviderProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>({
    lat: SEOUL_CITY_HALL.lat,
    lng: SEOUL_CITY_HALL.lng,
    address: SEOUL_CITY_HALL.address
  });
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 필터 상태 - 초기값은 null로 설정하여 전체 데이터를 보여주도록 함
  const [selectedRecoveryStatus, setSelectedRecoveryStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const wrappedSetSelectedRecoveryStatus = (status: string | null) => {
    console.log("setSelectedRecoveryStatus 호출됨:", status);
    setSelectedRecoveryStatus(status);
  };

  const wrappedSetSelectedCategory = (category: string | null) => {
    console.log("setSelectedCategory 호출됨:", category);
    setSelectedCategory(category);
  };
  
  console.log("RecoveryContext 상태:", { selectedRecoveryStatus, selectedCategory });

  // 전체 상점 리스트를 초기 로드에서 가져오기
  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        console.log("RecoveryContext에서 getPlaces 호출 시작");
        setIsLoading(true);
        const response = await getPlaces();
        console.log("RecoveryContext에서 받은 응답:", response);
        if (response?.data?.items) {
          setPlaces(response.data.items);
        }
      } catch (error) {
        console.error("전체 상점 리스트 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlaces();
  }, []);

  return (
    <RecoveryContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      places,
      setPlaces,
      isLoading,
      setIsLoading,
      selectedRecoveryStatus,
      setSelectedRecoveryStatus: wrappedSetSelectedRecoveryStatus,
      selectedCategory,
      setSelectedCategory: wrappedSetSelectedCategory,
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