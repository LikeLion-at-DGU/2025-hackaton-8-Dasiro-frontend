import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 1rem;
  border-radius: 13px;
  width: 95%;
  border: 1px solid ${({ theme }) => theme.colors.black05};
  background: ${({ theme }) => theme.colors.black07};
  z-index: 99;
  position: absolute;
  bottom: 2rem;
`;

export const TopTextContainer = styled.section`
  display: flex;
  gap: 1.44rem;

  img {
    width: 40px;
    height: 40px;
  }
`;

export const TopTextBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.44rem;

  h1 {
    ${fonts.subBold16}
    color: ${({ theme }) => theme.colors.orange01}
  }

  p {
    ${fonts.capMedium12}
    color: ${({ theme }) => theme.colors.black02}
  }
`;

export const BottomTextContainer = styled.section`
  display: flex;
  gap: 0.62rem;
  align-items: baseline;

  p {
    ${fonts.bodyBold14}
    color: ${({ theme }) => theme.colors.black03};
  }

  h1 {
    ${fonts.bodyBold14}
    color: ${({ theme }) => theme.colors.black02};
  }

  h1 .num {
    ${fonts.titleExtra22}
    color: ${({ theme }) => theme.colors.black02};
  }
`;
