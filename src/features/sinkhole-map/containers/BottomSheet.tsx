import { DraggableBottomSheet } from "@features/recovery-zone/components/DraggableBottomSheet";
import { GradeBottomInner } from "../components/GradeButtonList";

interface SinkholeBottomSheetProps {
  id?: string;
}

export const BottomSheet = ({ id = "sinkhole" }: SinkholeBottomSheetProps) => {
  return (
    <div id={id}>
      <DraggableBottomSheet>
        <GradeBottomInner />
      </DraggableBottomSheet>
    </div>
  );
};