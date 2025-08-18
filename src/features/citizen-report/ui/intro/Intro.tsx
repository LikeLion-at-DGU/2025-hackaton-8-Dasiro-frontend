import styled from "styled-components";
import BotIntro from "./BotIntro";
import DateBadge from "./DateBadge";
import IntroBtn from "./IntroBtn";
import { fonts } from "@shared/styles/fonts";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

const Intro = () => {
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  return (
    <>
      <IntroHeader>
        <p className="title">땅땅이</p>
        <img src="/images/icons/close.svg" />
      </IntroHeader>
      <DateBadge date="2025.07.27(일)" />
      <IntroContent>
        <BotIntro />
        <IntroBtn />
      </IntroContent>
    </>
  );
};

export default Intro;

const IntroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
  padding: 0.625rem;
  margin-bottom: 0.81rem;

  .title {
    color: ${({ theme }) => theme.colors.black01};
    text-align: center;
    ${fonts.subExtra16}
  }

  img {
    width: 15.5px;
    height: 15.5px;
    position: absolute;
    right: 1rem;
  }
`;

const IntroContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0rem 2rem;
`;
