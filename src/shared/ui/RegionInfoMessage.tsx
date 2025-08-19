import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";

export default function RegionInfoMessage({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <Card>
      <TitleRow>
        <TitleText>{title}</TitleText>
      </TitleRow>
      <Divider />
      <Body>
        {paragraphs.map((p, i) => (
          <P key={i}>{p}</P>
        ))}
      </Body>
    </Card>
  );
}

/* ===== styles ===== */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.orange06};
  border-radius: 22px;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.03);
  color: ${({ theme }) => theme.colors.black01};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleText = styled.p`
  ${fonts.bodyExtra14};
  color: ${({ theme }) => theme.colors.orange01};
  margin: 0;
`;

const Divider = styled.hr`
  margin: 0.625rem 0 0.875rem;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.orange04};
  opacity: 0.5;
`;

const Body = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const P = styled.p`
  ${fonts.bodyMedium14};
  margin: 0;
  white-space: pre-line;
`;
