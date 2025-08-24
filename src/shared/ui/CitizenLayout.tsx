import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";
import { useEffect, type PropsWithChildren, type ReactNode } from "react";
import { useOutletContext } from "react-router-dom";
import DateBadge from "./DateBadge";

type Props = PropsWithChildren<{ onClose?: () => void; footer?: ReactNode }>;
type LayoutContext = { setFooterHidden: (v: boolean) => void };

export default function CitizenLayout({ onClose, children, footer }: Props) {
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

      <CitizenLayoutWrapper>
        {" "}
        <DateBadge />
        {children}
      </CitizenLayoutWrapper>
      {footer && <Dock>{footer}</Dock>}
    </>
  );
}

const CitizenLayoutWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  padding: 0 1rem;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
  padding: 0.625rem;
  margin-bottom: 0.81rem;

  button {
    display: flex;
    align-items: center;
  }

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

const Dock = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;

  background: #fff;
  box-shadow: 0 -6px 14px 0 rgba(47, 47, 47, 0.04);

  padding: 1rem 1.12rem calc(1rem + env(safe-area-inset-bottom));
`;
