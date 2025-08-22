import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  pointer-events: none;
  z-index: 12;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  pointer-events: auto;
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 6px 23px;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.black07};
  color: ${({ theme }) => theme.colors.black03};
  ${fonts.bodySemiB14};
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &[aria-pressed="true"] {
    background: ${({ theme }) => theme.colors.orange01};
    color: ${({ theme }) => theme.colors.orange06};
  }

  @media (max-width: 320px) {
    padding: 6px 15px;
  }
`;

export const PrimaryButton = styled(ButtonBase)``;
export const SecondaryButton = styled(ButtonBase)``;

export const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const IconImg = styled.img`
  display: block;
  width: 22px;
  height: 22px;
  user-select: none;
  pointer-events: none;
`;

export const IcconText = styled.span``;
