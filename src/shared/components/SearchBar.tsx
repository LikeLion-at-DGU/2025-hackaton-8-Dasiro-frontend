import { useState } from "react";
import * as BasicElement from "@shared/ui/BasicElement";
import styled from "styled-components";
import search from "/images/icons/search.png";

const StyledContainer = styled(BasicElement.Container)`
  background-color: ${({ theme }) => theme.colors.orange05};
  input {
    flex: 1;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black01};
    ${({ theme }) => theme.fonts.bodyMedium14}
  }
  input::placeholder {
    color: ${({ theme }) => theme.colors.orange03};
  }
`;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(searchValue);
    }
  };

  return (
    <StyledContainer
      className={`search-bar ${className}`}
      $padding={[8, 18]}
      $borderRadius={20}
      $columnDirection={false}
      $alignItems="center"
      $gap={10}
    >
      <BasicElement.Button
        onClick={() => onSearch?.(searchValue)}
        $padding={4}
        $backgroundColor="transparent"
        $border="none"
        $hover={true}
        $width="fit-content"
      >
        <img
          src={search}
          alt="검색 돋보기"
          style={{ width: "15px", aspectRatio: "1/1" }}
        />
      </BasicElement.Button>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
    </StyledContainer>
  );
};
