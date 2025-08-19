// src/shared/ui/MessageBubble.tsx
import styled, { css } from "styled-components";
import { fonts } from "@shared/styles/fonts";
import type { ChatMessageType, ChatMessage } from "@shared/types/chat";

type BubbleVariant = Extract<
  ChatMessageType,
  "bot" | "user" | "analysis" | "info"
>;

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.type === "image") {
    if (!msg.images?.length) return null;
    return (
      <Row $side="right">
        <Images>
          {msg.images.map((src, i) => (
            <Thumb key={i} src={src} alt={`img-${i}`} />
          ))}
        </Images>
      </Row>
    );
  }

  const side: "left" | "right" = msg.type === "user" ? "right" : "left";
  const variant: BubbleVariant = msg.type;

  return (
    <Row $side={side}>
      {side === "left" && (
        <AvatarWrapper>
          <Avatar>
            <img src="/images/character/character3.png" alt="땅땅이" />
          </Avatar>
          <p>땅땅이</p>
        </AvatarWrapper>
      )}
      <Bubble $variant={variant}>{msg.text}</Bubble>
    </Row>
  );
}

const Row = styled.div<{ $side: "left" | "right" }>`
  display: flex;
  width: 100%;
  flex-direction: ${({ $side }) => ($side === "left" ? "column" : "row")};
  gap: 0.94rem;
  justify-content: ${({ $side }) =>
    $side === "right" ? "flex-end" : "flex-start"};
  align-items: flex-start;
`;

const AvatarWrapper = styled.div`
  display: flex;
  gap: 0.62rem;
  align-items: center;
  p {
    ${fonts.bodySemiB14};
    color: ${({ theme }) => theme.colors.black01};
  }
`;

const Avatar = styled.div`
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.375rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.orange06};
  img {
    height: 28px;
  }
`;

const Bubble = styled.div<{ $variant: BubbleVariant }>`
  ${fonts.bodyMedium14};
  max-width: 76%;
  padding: 0.94rem 1.25rem;
  border-radius: 20px 20px 0 0;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case "user":
        return css`
          background: ${theme.colors.orange01};
          color: ${theme.colors.black07};
          border-bottom-left-radius: 20px;
        `;
      case "analysis":
        return css`
          background: ${theme.colors.orange06};
          color: ${theme.colors.black01};
          border-left: 3px solid ${theme.colors.orange02};
        `;
      case "info":
        return css`
          background: ${theme.colors.orange06};
          color: ${theme.colors.orange02};
          border-left: 3px solid ${theme.colors.orange02};
        `;
      default:
        return css`
          background: ${theme.colors.orange06};
          color: ${theme.colors.black01};
          border-bottom-right-radius: 20px;
        `;
    }
  }}
`;

const Images = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`;
const Thumb = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.black06};
`;
