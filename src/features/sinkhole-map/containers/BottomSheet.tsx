import { BottomSheet as RecoveryBottomSheet } from "@features/recovery-zone";
import { BottomSheetContent } from "../components/BottomSheetContent";

interface SinkholeBottomSheetProps {
  isSinkholeMap?: boolean;
}

export const BottomSheet = ({ isSinkholeMap = false }: SinkholeBottomSheetProps) => {
  if (isSinkholeMap) {
    // 싱크홀 맵 전용 컨텐츠 렌더링
    return (
      <div style={{ position: "relative", zIndex: 1000 }}>
        <BottomSheetContent />
      </div>
    );
  }
  
  // 기본 recovery-zone 컨텐츠 렌더링
  return <RecoveryBottomSheet />;
};