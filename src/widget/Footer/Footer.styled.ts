import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

export const Wrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  max-width: 375px;
  margin: 0 auto;
  padding: 1.125rem 2.0625rem;
  box-shadow: 0 -6px 14px 0 rgba(47, 47, 47, 0.06);
`;

export const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: ${({ active, theme }) => (active ? theme.colors.orange01 : "#888")};
  ${fonts.capMedium12};
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;
