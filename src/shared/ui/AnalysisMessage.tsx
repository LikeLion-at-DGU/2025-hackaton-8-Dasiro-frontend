import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";
import { useNavigate } from "react-router-dom";
import type { RiskBucket } from "@shared/types/chat";

type Props = {
  score: number;
  bucket: RiskBucket;
  analysis: string;
  action: string;
};

export default function AnalysisMessage({
  score,
  bucket,
  analysis,
  action,
}: Props) {
  const nav = useNavigate();
  const showCTA = bucket !== "low";
  return (
    <Card $bucket={bucket}>
      <Section>
        <SectionTitle>🕳️ 분석결과</SectionTitle>
        <P>
          {analysis.split(`위험도 ${score}%`).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <Accent>위험도 {score}%</Accent>}
            </span>
          ))}
        </P>
      </Section>

      <Section>
        <SectionTitle>🚨 대처방법</SectionTitle>
        <P>{action}</P>
        {showCTA && (
          <CTA type="button" onClick={() => nav("/saferoute")}>
            안전 루트 안내받기
          </CTA>
        )}
      </Section>
    </Card>
  );
}

const Card = styled.div<{ $bucket: RiskBucket }>`
  background: ${({ theme }) => theme.colors.orange06};
  border-radius: 20px 20px 20px 0px;
  padding: 0.94rem 1.25rem;
  ${fonts.bodyMedium14};
  color: ${({ theme }) => theme.colors.black01};
  max-width: 90%;
`;

const Section = styled.div`
  & + & {
    margin-top: 1.88rem;
  }
`;

const SectionTitle = styled.p`
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.orange01};
  ${fonts.bodyExtra14}
`;

const P = styled.p`
  ${fonts.bodySemiB14};
  margin: 0;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.black02};
`;

const Accent = styled.b`
  color: ${({ theme }) => theme.colors.orange01};
  ${fonts.bodyBold14}
`;

const CTA = styled.button`
  margin-top: 1.25rem;
  width: 100%;
  border-radius: 10px;
  padding: 0.5rem 0;
  ${fonts.bodyBold14};
  background: ${({ theme }) => theme.colors.orange01};
  color: ${({ theme }) => theme.colors.orange06};
  cursor: pointer;
`;
