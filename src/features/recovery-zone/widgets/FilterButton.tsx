import { useState } from "react";
import { BottomSheetElement } from "../ui";
import buttonarrow from "/images/icons/buttonarrow.png";

interface FilterButtonProps {
  label: string;
  onClick?: () => void;
  dropdownOptions?: string[];
  selectedOption?: string;
  onOptionSelect?: (option: string) => void;
}

export const FilterButton = ({ 
  label, 
  onClick, 
  dropdownOptions, 
  selectedOption,
  onOptionSelect 
}: FilterButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSelected = !!(selectedOption && selectedOption !== label);

  const handleButtonClick = () => {
    if (dropdownOptions) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      onClick?.();
    }
  };

  const handleOptionClick = (option: string) => {
    onOptionSelect?.(option);
    setIsDropdownOpen(false);
  };

  return (
    <BottomSheetElement.DropdownContainer id="dropdownContainer">
      <BottomSheetElement.BottomButton $isSelected={isSelected} $isDropdownOpen={isDropdownOpen} onClick={handleButtonClick}>
        <span>{selectedOption || label}</span>
        <img 
          src={buttonarrow} 
          alt="버튼 화살표" 
          style={{
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </BottomSheetElement.BottomButton>
      
      {isDropdownOpen && dropdownOptions && (
        <BottomSheetElement.DropdownList id="dropdownList">
          {dropdownOptions.map((option, index) => (
            <BottomSheetElement.DropdownItem
              key={index}
              className={selectedOption === option ? 'selected' : ''}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </BottomSheetElement.DropdownItem>
          ))}
        </BottomSheetElement.DropdownList>
      )}
    </BottomSheetElement.DropdownContainer>
  );
};