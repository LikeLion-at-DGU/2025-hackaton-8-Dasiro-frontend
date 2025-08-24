import styled from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import ddang from "/images/icons/ddang.png";
import { useSelectGrade } from "@entities/sinkhole/context";

const StyledContainer = styled(BasicElement.Container).attrs(({ $gap }) => ({
  $columnDirection: true,
  $alignItems: "flex-start",
  $justifyContent: "center",
  $gap: $gap,
}))`
  ${({ theme }) => theme.fonts.subBold16};
  .title {
    display: flex;
    gap: 5px;
    color: ${({ theme }) => theme.colors.black02};
  }
  .content {
    display: block;
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.black07};
    color: ${({ theme }) => theme.colors.black02};
    ${({ theme }) => theme.fonts.bodySemiB14};
    line-height: 1.5;

    span {
      color: ${({ theme }) => theme.colors.orange01};
      font-weight: bold;
    }
  }
  .ddang {
    width: 25px;
    aspect-ratio: 25/24.48;
  }
`;

export const SearchResultContent = () => {
  const { searchedDistrict } = useSelectGrade();
  if (!searchedDistrict) return null;

  return (
    <StyledContainer $gap={15}>
      <div className="title">
        <img src={ddang} alt="땅땅이" className="ddang" />
        검색 결과입니다
      </div>
      <div className="content">
        <span>{searchedDistrict.dong}</span>의 싱크홀 안전 정보를 확인하세요.
        <br />
        <br />
        주소: {searchedDistrict.sido} {searchedDistrict.sigungu} {searchedDistrict.dong}
        <br />
        안심존 여부: {searchedDistrict.is_safezone ? "안심존" : "일반 지역"}
      </div>
    </StyledContainer>
  );
};

export default SearchResultContent;
