import { DraggableBottomSheet } from "@features/sinkhole-map/components/DraggableBottomSheet";
import { GradeBottomInner } from "../components/GradeButtonList";

export const BottomSheet = () => {
  return (
      <DraggableBottomSheet>
        {(height) => <GradeBottomInner height={height} />}
      </DraggableBottomSheet>
  );
};