import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";

export const DEFAULT_CAUTION_ITEMS = [
  "보도블록이 갑자기 기울어 있거나 울퉁불퉁한지 확인해보세요.",
  "도로에 가로 또는 세로로 가는 금이 간 경우, 지하에 공간이 생겼을 가능성이 있어요.",
  "빗물받이 주변이 꺼져 있거나 물이 잘 빠지지 않는다면 주변 지반이 무너지고 있는 신호일 수 있어요.",
  "인근 공사장에서 진동이 심하게 느껴진다면, 지반 안정성에 영향을 줄 수 있어요.",
];

type RegionProps = {
  variant: "region";
  title: string;
  content: string;
};

type CautionsProps = {
  variant: "cautions";
  title?: string;
  items?: string[];
};

type Props = RegionProps | CautionsProps;

export default function InfoCard(props: Props) {
  if (props.variant === "region") {
    const { title, content } = props;
    return (
      <Card>
        <TitleRow>
          <TitleText>{title}</TitleText>
        </TitleRow>
        <Divider />
        <Content>{content}</Content>
      </Card>
    );
  }

  // cautions
  const title = props.title ?? "주의사항";
  const items = props.items ?? DEFAULT_CAUTION_ITEMS;

  return (
    <Card>
      <TitleRow>
        <TitleText>🚨 {title}</TitleText>
      </TitleRow>
      <Divider />
      <List>
        {items.map((t, i) => (
          <Item key={i}>
            <Check src="/images/icons/check.svg" alt="" />
            <ItemText>{t}</ItemText>
          </Item>
        ))}
      </List>
    </Card>
  );
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.orange06};
  border-radius: 20px 20px 20px 0;
  padding: 0.94rem 1.25rem;
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

const Content = styled.p`
  ${fonts.bodySemiB14};
  margin: 0;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.black02};
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  list-style: none;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 18px 1fr;
  column-gap: 0.5rem;
  align-items: start;
`;

const Check = styled.img`
  width: 18px;
  height: 18px;
  display: block;
  margin-top: 2px;
`;

const ItemText = styled.p`
  ${fonts.bodySemiB14};
  margin: 0;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.black02};
`;
