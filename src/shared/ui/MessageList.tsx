import styled from "styled-components";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@shared/types/chat";
import { useEffect, useRef } from "react";

type Props = {
  messages: ChatMessage[];
  autoScroll?: boolean;
};

export default function MessageList({ messages, autoScroll = true }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!autoScroll) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, autoScroll]);

  return (
    <Scroll>
      <Inner>
        {messages.map((m) => (
          <li key={m.id}>
            <MessageBubble msg={m} />
          </li>
        ))}
        <div ref={endRef} />
      </Inner>
    </Scroll>
  );
}

const Scroll = styled.div`
  flex: 1;
  /* min-height: 0; */
`;

const Inner = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2.19rem;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    width: 100%;
  }
`;
