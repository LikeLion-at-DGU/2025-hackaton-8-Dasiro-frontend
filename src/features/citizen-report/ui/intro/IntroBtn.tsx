import styled, { css } from "styled-components";
import { fonts } from "@shared/styles/fonts";

type IntroBtnProps = {
  onClickReport?: () => void;
  onClickInfo?: () => void;
};

const IntroBtn = ({ onClickReport, onClickInfo }: IntroBtnProps) => (
  <BtnWrapper>
    <PillButton variant="report" onClick={onClickReport} type="button">
      싱크홀 제보 <Arrow aria-hidden>{">"}</Arrow>
    </PillButton>
    <PillButton variant="info" onClick={onClickInfo} type="button">
      지역별 싱크홀 위험 정보 <Arrow aria-hidden>{">"}</Arrow>
    </PillButton>
  </BtnWrapper>
);

export default IntroBtn;

const BtnWrapper = styled.section`
  display: flex;
  gap: 0.625rem;
  padding: 0 1rem;
`;

const sharedPill = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fonts.bodyMedium14}
  padding: 0.625rem 0.75rem;
  border-radius: 82.5px;
  border: none;
  cursor: pointer;
`;

const PillButton = styled.button<{ variant: "report" | "info" }>`
  ${sharedPill}
  ${({ theme, variant }) =>
    variant === "report"
      ? css`
          background-color: ${theme.colors.orange01};
          color: ${theme.colors.black07};
        `
      : css`
          background-color: ${theme.colors.orange05};
          color: ${theme.colors.orange02};
        `}

        @media (max-width: 343px) {
    ${fonts.capMedium12};
  }
`;

const Arrow = styled.span`
  margin-left: 0.25rem;
`;
