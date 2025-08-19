import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const urlPoolRef = useRef<string[]>([]);

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const initial = useMemo<ChatMessage[]>(
    () => [
      {
        id: "m1",
        type: "bot",
        text:
          "반가워요, 제보자 님!" +
          " 걷고 있는 길이 불안하게 느껴지셨나요? " +
          "걱정되는 장소의 사진을 보내주시면, 싱크홀 위험도를 분석해드릴게요.",
      },
    ],
    []
  );
  useEffect(() => setMessages(initial), [initial]);

  useEffect(() => {
    return () => {
      urlPoolRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlPoolRef.current = [];
    };
  }, []);

  const onSend = ({ text, files }: SendPayload) => {
    const hasText = !!text && text.trim().length > 0;
    const hasFiles = !!files && files.length > 0;

    if (!hasText && !hasFiles) return;

    const urls = hasFiles ? files!.map((f) => URL.createObjectURL(f)) : [];
    if (urls.length) {
      urlPoolRef.current.push(...urls);
    }

    const updates: ChatMessage[] = [];

    // 사용자 메시지(이미지 -> 텍스트 순서로 표시)
    if (hasFiles) {
      updates.push({ id: crypto.randomUUID(), type: "image", images: urls });
    }
    if (hasText) {
      updates.push({
        id: crypto.randomUUID(),
        type: "user",
        text: text!.trim(),
      });
    }

    // 봇 응답 규칙
    if (hasFiles && !hasText) {
      updates.push({
        id: crypto.randomUUID(),
        type: "bot",
        text:
          "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요. " +
          "땅땅이가 꼼꼼히 살펴볼게요!",
      });
    } else if (!hasFiles && hasText) {
      updates.push({
        id: crypto.randomUUID(),
        type: "bot",
        text:
          "정확한 분석을 위해 사진도 함께 보내주세요. " +
          "땅땅이가 꼼꼼히 살펴볼게요!",
      });
    } else if (hasFiles && hasText) {
      updates.push({
        id: crypto.randomUUID(),
        type: "bot",
        text: "싱크홀 위험도를 분석해보고 있어요…",
      });
      // TODO: 실제 분석 API 연동 시 결과 도착 후 analysis/info 메시지 추가
    }

    setMessages((prev) => [...prev, ...updates]);
  };

  return (
    <CitizenLayout
      onClose={() => navigate(-1)}
      footer={<InputBar onSend={onSend} />}
    >
      <MessageList messages={messages} autoScroll />
    </CitizenLayout>
  );
}
