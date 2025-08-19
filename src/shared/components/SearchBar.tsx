import { useState } from "react";
import { MainElement } from "@features/recovery-zone/ui";
import * as BasicElement from "@features/recovery-zone/ui/BasicElement";
import search from "/images/icons/search.png";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onInputChange?: (value: string) => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = "검색어를 입력하세요",
  onSearch,
  onInputChange,
  className = "",
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onInputChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(searchValue);
    }
  };

  return (
    <BasicElement.Container
      className={`search-bar ${className}`}
      $padding={[8, 16]}
      $backgroundColor="#f8f9fa"
      $borderRadius={8}
      $columnDirection={false}
      $alignItems="center"
      $gap={8}
    >
      <BasicElement.Button
        onClick={() => onSearch?.(searchValue)}
        $padding={4}
        $backgroundColor="transparent"
        $border="none"
        $hover={true}
      >
        <img src={search} alt="검색 돋보기" style={{width: "15px", aspectRatio:"1/1"}}/>
      </BasicElement.Button>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          fontSize: "14px",
        }}
      />
    </BasicElement.Container>
  );
};
