import styled from "styled-components";

import { fonts } from "@shared/styles/fonts";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import DateBadge from "@features/citizen-report/ui/intro/DateBadge";
import BotIntro from "@features/citizen-report/ui/intro/BotIntro";
import IntroBtn from "@features/citizen-report/ui/intro/IntroBtn";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

const CitizenIntro = () => {
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
      <DateBadge />
      <IntroContent>
        <BotIntro />
        <IntroBtn />
      </IntroContent>
    </>
  );
};

export default CitizenIntro;

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
