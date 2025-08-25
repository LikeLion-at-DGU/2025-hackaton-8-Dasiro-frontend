import styled, { css } from "styled-components";
import { fonts } from "@shared/styles/fonts";
import AnalysisMessage from "@shared/ui/AnalysisMessage";
import type { ChatMessage } from "@shared/types/chat";
import InfoCard from "./Infocard";
import Typewriter from "typewriter-effect";

type BubbleVariant = "bot" | "user";

type BotTextMsg = { id: string; type: "bot"; text: string; typing?: boolean };
type UserTextMsg = { id: string; type: "user"; text: string };

function isBotTextMessage(m: ChatMessage): m is BotTextMsg {
  return m.type === "bot";
}
function isUserTextMessage(m: ChatMessage): m is UserTextMsg {
  return m.type === "user";
}

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.type === "image") {
    if (!msg.images?.length) return null;
    return (
      <Row $side="right" $noAvatar>
        <Images>
          {msg.images.map((src, i) => (
            <Thumb key={i} src={src} alt={`img-${i}`} />
          ))}
        </Images>
      </Row>
    );
  }

  // 분석 카드
  if (msg.type === "analysis") {
    const { score, bucket, analysis, action } = msg.meta;
    return (
      <Row $side="left">
        <AvatarWrapper>
          <Avatar>
            <img src="/images/character/character2.png" alt="땅땅이" />
          </Avatar>
          <p>땅땅이</p>
        </AvatarWrapper>
        <AnalysisMessage
          score={score}
          bucket={bucket}
          analysis={analysis}
          action={action}
        />
      </Row>
    );
  }

  // 지역정보 카드
  if (msg.type === "region_info") {
    const { title, content } = msg.meta;
    return (
      <Row $side="left">
        <AvatarWrapper>
          <Avatar>
            <img src="/images/character/character3.png" alt="땅땅이" />
          </Avatar>
          <p>땅땅이</p>
        </AvatarWrapper>
        <InfoCard variant="region" title={title} content={content} />
      </Row>
    );
  }

  // 주의사항 카드
  if (msg.type === "cautions") {
    return (
      <Row $side="left" $noAvatar $padBottom>
        <InfoCard variant="cautions" />
      </Row>
    );
  }

  // ---- 일반 bot/user ----
  const side: "left" | "right" = isUserTextMessage(msg) ? "right" : "left";
  const variant: BubbleVariant = isUserTextMessage(msg) ? "user" : "bot";
  const isTyping = isBotTextMessage(msg) && !!msg.typing;

  let bubbleContent: React.ReactNode = null;

  if (isTyping && isBotTextMessage(msg)) {
    const html = (msg.text || "").replace(/\n/g, "<br/>");
    bubbleContent = (
      <Typewriter
        options={{ delay: 40, cursor: "", loop: true }}
        onInit={(tw) => {
          tw.typeString(html).pauseFor(900).deleteAll().start();
        }}
      />
    );
  } else if (isUserTextMessage(msg) || isBotTextMessage(msg)) {
    bubbleContent = msg.text;
  } else {
    bubbleContent = null;
  }

  return (
    <Row $side={side}>
      {side === "left" && (
        <AvatarWrapper>
          <Avatar>
            <img src="/images/character/character2.png" alt="땅땅이" />
          </Avatar>
          <p>땅땅이</p>
        </AvatarWrapper>
      )}
      <Bubble $variant={variant}>{bubbleContent}</Bubble>
    </Row>
  );
}

const Row = styled.div<{
  $side: "left" | "right";
  $noAvatar?: boolean;
  $padBottom?: boolean;
}>`
  display: flex;
  width: 100%;
  flex-direction: ${({ $side }) => ($side === "left" ? "column" : "row")};
  gap: ${({ $noAvatar }) => ($noAvatar ? "0.5rem" : "0.94rem")};
  justify-content: ${({ $side }) =>
    $side === "right" ? "flex-end" : "flex-start"};
  align-items: flex-start;
  padding-bottom: ${({ $padBottom }) => ($padBottom ? "0.5rem" : 0)};
`;

const AvatarWrapper = styled.div`
  display: flex;
  gap: 0.62rem;
  align-items: center;

  p {
    ${fonts.bodySemiB14};
    color: ${({ theme }) => theme.colors.black01};
    margin: 0;
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
  max-width: 90%;
  padding: 0.55rem 1.25rem;
  border-radius: 20px 20px 0 0;
  white-space: ${({ $variant }) =>
    $variant === "bot" ? "pre-line" : "normal"};
  overflow-wrap: anywhere;

  ${({ theme, $variant }) =>
    $variant === "user"
      ? css`
          background: ${theme.colors.orange01};
          color: ${theme.colors.black07};
          border-bottom-left-radius: 20px;
        `
      : css`
          background: ${theme.colors.orange06};
          color: ${theme.colors.black01};
          border-bottom-right-radius: 20px;
        `}
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
