import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";
import { useEffect, type PropsWithChildren } from "react";
import { useOutletContext } from "react-router-dom";
import DateBadge from "./DateBadge";

type Props = PropsWithChildren<{ onClose?: () => void }>;
type LayoutContext = { setFooterHidden: (v: boolean) => void };

export default function CitizenLayout({ onClose, children }: Props) {
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  return (
    <>
      <Header>
        <button className="close" onClick={onClose} aria-label="닫기">
          <img src="/images/icons/close.svg" alt="" />
        </button>
        <p className="title">땅땅이</p>
      </Header>
      <DateBadge />
      <CitizenLayoutWrapper>{children}</CitizenLayoutWrapper>
    </>
  );
}

const CitizenLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0rem 2rem;
`;

const Header = styled.div`
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
