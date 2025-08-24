import * as BasicElement from "@shared/ui/BasicElement";
import style from "styled-components";
import ddang from "/images/icons/ddang.png";
import { useSelectGrade } from "@entities/sinkhole/context";

const BannerWrapper = style(BasicElement.Container).attrs(() => ({
  $padding: [16, 22],
  $columnDirection: false,
  $gap: 20,
}))`
    border-radius: 10px;
    align-items: center;
    background: linear-gradient(133deg, #FFF6F0 14.15%, rgba(255, 119, 101, 0.10) 584.08%);
    img[alt="땅땅이"]{
        width: 60px;
        aspect-ratio: 60.00/58.76;
    }
    div:nth-child(1){
        ${({ theme }) => theme.fonts.capBold12};
        color: ${({ theme }) => theme.colors.black02};
    }
    div:nth-child(2){
        ${({ theme }) => theme.fonts.bodyExtra14};
        color: ${({ theme }) => theme.colors.black02};
    }
`;

const Banner = () => {
  const {isBadgeActive} = useSelectGrade();
  return (
    <BannerWrapper id="Banner">
      <div>
        {!isBadgeActive ? (
          <>
            <div>한 눈에 보는 우리 동네 땅 건강검진 결과 🩺</div>
            <div>땅땅이가 알려주는 싱크홀맵 안전등급</div>
          </>
        ) : (
          <>
            <div>우리 동네, 안심하고 거래할 수 있을까? 🏡</div>
            <div>땅땅이가 알려주는 ‘부동산 안심존’</div>
          </>
        )}
      </div>
      <img src={ddang} alt="땅땅이" />
    </BannerWrapper>
  );
};

export { Banner };
export default Banner;
