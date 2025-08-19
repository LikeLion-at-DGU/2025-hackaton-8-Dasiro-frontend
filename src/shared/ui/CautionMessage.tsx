import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";

export default function CautionsMessage({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <TitleRow>
        <Badge>🚨</Badge>
        <TitleText>{title}</TitleText>
      </TitleRow>
      <Divider />
      <List>
        {items.map((t, i) => (
          <Item key={i}>
            <img src="/images/icons/check.svg" />
            <ItemText>{t}</ItemText>
          </Item>
        ))}
      </List>
    </Card>
  );
}

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
`;

const Badge = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.black07};
  flex: 0 0 20px;
`;

const TitleText = styled.p`
  ${fonts.bodyExtra14};
  color: ${({ theme }) => theme.colors.orange01};
  margin: 0;
`;

const Divider = styled.hr`
  margin: 0.625rem 0 0.875rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ItemText = styled.p`
  ${fonts.bodyMedium14};
  margin: 0;
  white-space: pre-line;
`;
