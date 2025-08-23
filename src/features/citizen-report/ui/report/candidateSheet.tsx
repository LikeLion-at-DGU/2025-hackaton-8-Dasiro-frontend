import styled, { css } from "styled-components";
import type { CandidatePlace } from "@features/citizen-report/types";

type Props = {
  title?: string;
  subtitle?: string;
  candidates: CandidatePlace[];
  onPick: (c: CandidatePlace) => void;
  onCancel: () => void;
};

export default function CandidatesSheet({
  title = "해당하는 장소를 선택해 주세요",
  subtitle = "목록에서 정확한 지점을 골라주세요.",
  candidates,
  onPick,
  onCancel,
}: Props) {
  return (
    <Sheet role="dialog" aria-modal="true" aria-label="장소 후보 선택">
      <SheetInner>
        <Header>
          <TitleWrap>
            <TitleContainer>
              <Pin aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                  />
                </svg>
              </Pin>
              <Title>{title}</Title>
            </TitleContainer>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleWrap>
          <CloseBtn onClick={onCancel} aria-label="닫기">
            <img src="/images/icons/close.svg" />
          </CloseBtn>
        </Header>

        <List role="listbox" aria-label="후보 목록">
          {candidates.map((c) => (
            <Item key={c.id} role="option" aria-selected={false}>
              <ItemButton
                onClick={() => onPick(c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPick(c);
                  }
                }}
              >
                <Bullet />
                <ItemMain>
                  <ItemTitle>{c.placeName || c.address}</ItemTitle>
                  {c.placeName && <ItemSub>{c.address}</ItemSub>}
                </ItemMain>
              </ItemButton>
            </Item>
          ))}
        </List>

        <FooterRow>
          <Hint>원하는 장소가 없나요? 더 구체적으로 입력해 보세요.</Hint>
          <Actions>
            <CancelBtn onClick={onCancel}>취소</CancelBtn>
          </Actions>
        </FooterRow>
      </SheetInner>
    </Sheet>
  );
}

// style
const Elevation = css`
  box-shadow: 0 -12px 28px rgba(42, 42, 42, 0.08);
`;

const Sheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(10px);
  ${Elevation};
  width: 100%;
  max-width: 400px;
  margin-inline: auto;
`;

const SheetInner = styled.div`
  margin: 0 auto;
  max-width: 350px;
  padding: 12px 16px 14px;
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const TitleContainer = styled.section`
  display: flex;
  gap: 0.5rem;
`;

const Pin = styled.span`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.black02};
  display: inline-flex;
  line-height: 0;
  svg {
    display: block;
  }
`;

const TitleWrap = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.subExtra16};
  color: ${({ theme }) => theme.colors.black01};
`;

const Subtitle = styled.div`
  margin-top: 4px;
  ${({ theme }) => theme.fonts.capMedium12};
  color: ${({ theme }) => theme.colors.black03};
  margin-left: 1.8rem;
`;

const CloseBtn = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.black02};

  &:hover {
    background: ${({ theme }) => theme.colors.black07};
    color: ${({ theme }) => theme.colors.black01};
  }

  svg {
    display: block;
  }
`;

const List = styled.ul`
  margin-top: 12px;
  max-height: 16rem; /* 256px */
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.black05};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.black08};
`;

const Item = styled.li`
  &:not(:first-child) {
    border-top: 1px solid ${({ theme }) => theme.colors.black06};
  }
`;

const ItemButton = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.black08};
  border: 0;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.black07};
  }
`;

const Bullet = styled.span`
  margin-top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.orange02};
  flex: 0 0 10px;
`;

const ItemMain = styled.div`
  min-width: 0;
`;

const ItemTitle = styled.div`
  ${({ theme }) => theme.fonts.bodySemiB14};
  color: ${({ theme }) => theme.colors.black01};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSub = styled.div`
  margin-top: 2px;
  ${({ theme }) => theme.fonts.capMedium12};
  color: ${({ theme }) => theme.colors.black03};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FooterRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Hint = styled.div`
  ${({ theme }) => theme.fonts.capMedium12};
  color: ${({ theme }) => theme.colors.black03};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelBtn = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  ${({ theme }) => theme.fonts.bodySemiB14};
  color: ${({ theme }) => theme.colors.black02};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.black01};
    text-decoration: underline;
  }
`;
