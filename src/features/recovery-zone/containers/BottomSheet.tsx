// Recovery Zone 하단 슬라이드 시트 - 필터 및 복구 완료 상점 목록 표시
import { DraggableBottomSheet } from "../components/DraggableBottomSheet";
import { FilterButtonList } from "../components/FilterButtonList";
import { GradeBottomInner } from "../../sinkhole-map/components/GradeButtonList";

interface BottomSheetProps {
  isSinkholeMap?: boolean;
  id?: "recovery" | "sinkhole";
}

export const BottomSheet = ({ isSinkholeMap = false, id="recovery"}: BottomSheetProps) => {
  return (
    <div id={id}>
      <DraggableBottomSheet>
        {isSinkholeMap ? <GradeBottomInner /> : <FilterButtonList />}
      </DraggableBottomSheet>
    </div>
  );
};
