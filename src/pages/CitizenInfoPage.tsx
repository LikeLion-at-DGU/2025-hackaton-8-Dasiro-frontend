import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { getRegionInfoByQuery } from "@entities/region/api";
import { isThanks } from "@shared/utils/isThanks";

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
        id: "intro",
        type: "bot",
        text:
          "반가워요, 저는 싱크홀 분석봇 땅땅이에요.\n" +
          "싱크홀이 자주 생기는 이유는 지역마다 달라요.\n" +
          "지형, 지하 시설, 과거 사고 기록 등을 바탕으로\n" +
          "해당 지역이 왜 위험한지 설명해드릴게요.\n" +
          "궁금한 동네가 있다면 땅땅이에게 알려주세요!",
      },
    ],
    []
  );

  useEffect(() => setMessages(initial), [initial]);

  const append = (items: ChatMessage[]) => setMessages((p) => [...p, ...items]);

  const THANKS_REPLY =
    "도움이 되었길 바라요! 다른 지역도 궁금하면 편하게 물어보세요.";

  const onSend = async ({ text }: SendPayload) => {
    const q = text?.trim();
    if (!q) return;

    if (isThanks(q)) {
      append([
        { id: crypto.randomUUID(), type: "user", text: q },
        { id: crypto.randomUUID(), type: "bot", text: THANKS_REPLY },
      ]);
      return;
    }

    append([{ id: crypto.randomUUID(), type: "user", text: q }]);

    const info = await getRegionInfoByQuery(q);

    append([
      {
        id: crypto.randomUUID(),
        type: "region_info",
        meta: { title: info.title, content: info.content },
      },
      {
        id: crypto.randomUUID(),
        type: "cautions",
        meta: { title: "주의사항" },
      },
    ]);
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
