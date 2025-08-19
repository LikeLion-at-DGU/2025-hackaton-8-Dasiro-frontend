// src/pages/CitizenReportPage.tsx  (4.2.1)
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";

type LayoutContext = { setFooterHidden: (v: boolean) => void };
type AwaitingKind = "image" | "text" | null;

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaiting, setAwaiting] = useState<AwaitingKind>(null);
  const urlPoolRef = useRef<string[]>([]); // 생성한 ObjectURL 정리용

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const initial = useMemo<ChatMessage[]>(
    () => [
      {
        id: "m1",
        type: "bot",
        text: "반가워요, 제보자 님!\n걷고 있는 길이 불안하게 느껴지셨나요?\n걱정되는 장소의 사진을 보내주시면,\n싱크홀 위험도를 분석해드릴게요.",
      },
    ],
    []
  );
  useEffect(() => setMessages(initial), [initial]);

  // 언마운트 시 ObjectURL 정리
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

    // 이미지 미리보기 URL
    const urls = hasFiles ? files!.map((f) => URL.createObjectURL(f)) : [];
    if (urls.length) urlPoolRef.current.push(...urls);

    const updates: ChatMessage[] = [];

    // 1) 사용자 메시지 표시 (이미지 → 텍스트)
    if (hasFiles)
      updates.push({ id: crypto.randomUUID(), type: "image", images: urls });
    if (hasText)
      updates.push({
        id: crypto.randomUUID(),
        type: "user",
        text: text!.trim(),
      });

    // 2) 세트 완료 조건: 이전에 요청하던 "반대 타입"이 이번에 도착했는가?
    const setComplete =
      (awaiting === "image" && hasFiles) || (awaiting === "text" && hasText);

    if (hasText && hasFiles) {
      // 한 번에 둘 다
      updates.push({
        id: crypto.randomUUID(),
        type: "bot",
        text: "싱크홀 위험도를 분석해보고 있어요…",
      });
      setAwaiting(null);
    } else if (setComplete) {
      // 이전에 요청하던 반대 타입이 도착 → 완료
      updates.push({
        id: crypto.randomUUID(),
        type: "bot",
        text: "싱크홀 위험도를 분석해보고 있어요…",
      });
      setAwaiting(null);
    } else if (hasText && !hasFiles) {
      // 텍스트만 왔고, 아직 이미지를 기다리지 않던 경우에만 안내 (중복 안내 방지)
      if (awaiting !== "image") {
        updates.push({
          id: crypto.randomUUID(),
          type: "bot",
          text: "정확한 분석을 위해 사진도 함께 보내주세요.\n\n땅땅이가 꼼꼼히 살펴볼게요!",
        });
        setAwaiting("image");
      }
      // 이미 awaiting === "image"면 그대로 대기 (추가 안내 X)
    } else if (hasFiles && !hasText) {
      // 이미지만 왔고, 아직 텍스트를 기다리지 않던 경우만 안내
      if (awaiting !== "text") {
        updates.push({
          id: crypto.randomUUID(),
          type: "bot",
          text: "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요.\n\n땅땅이가 꼼꼼히 살펴볼게요!",
        });
        setAwaiting("text");
      }
      // 이미 awaiting === "text"면 그대로 대기
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
