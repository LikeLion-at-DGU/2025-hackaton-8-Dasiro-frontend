import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

export default function CitizenInfoPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const initial = useMemo<ChatMessage[]>(
    () => [
      {
        id: "r1",
        type: "bot",
        text: "반가워요, 저는 싱크홀 분석봇 땅땅이에요. 지역, 지하시설, 과거 사고 기록 등을 바탕으로 해당 지역이 왜 위험한지 설명해드릴게요.",
      },
      { id: "r2", type: "bot", text: "궁금한 동네가 있다면 알려주세요!" },
    ],
    []
  );
  useEffect(() => setMessages(initial), [initial]);

  const onSend = (text: string) => {
    if (!text) return;
    setMessages((p) => [
      ...p,
      { id: crypto.randomUUID(), type: "user", text },
      {
        id: crypto.randomUUID(),
        type: "analysis",
        text: "▸ 신당동 싱크홀 위험 정보\n최근 6개월 내 지반 침하 사고가 2건 이상 보고된 지역으로, 지하시설 노후가 주요 원인으로 추정돼요.\n\n▸ 주의사항\n보도블럭 침하/물웅덩이 반복 시 즉시 신고해 주세요.",
      },
    ]);
  };

  return (
    <CitizenLayout
      onClose={() => navigate(-1)}
      // footer={<InputBar onSend={onSend} />}
    >
      <MessageList messages={messages} />
    </CitizenLayout>
  );
}
