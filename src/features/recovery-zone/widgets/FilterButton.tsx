import { BottomSheetElement } from "../ui";
import buttonarrow from "@shared/assets/icons/buttonarrow.png";

interface FilterButtonProps {
  label: string;
  onClick?: () => void;
}

export const FilterButton = ({ label, onClick }: FilterButtonProps) => {
  return (
    <BottomSheetElement.BottomButton onClick={onClick}>
      <span>{label}</span>
      <img src={buttonarrow} alt="버튼 화살표" />
    </BottomSheetElement.BottomButton>
  );
};