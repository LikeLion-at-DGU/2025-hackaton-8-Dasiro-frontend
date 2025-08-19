import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

type RegionInfo = {
  title: string;
  paragraphs: string[];
  cautions?: string[];
};

/** TODO: 실제 API 연동으로 교체 */
async function fetchRegionInfo(query: string): Promise<RegionInfo> {
  const where = query.trim();
  return {
    title: `🕳️ ${where} 싱크홀 위험 정보`,
    paragraphs: [
      `${where}은(는) 최근 6개월 내 지반 침하 사고가 2건 이상 발생한 지역이에요. 이 패턴은 단순한 우연이 아니라, 지반·지하 시설물·과거 사고 기록 등과 관련된 경우가 많아요.`,
      `특히 ${where}처럼 도시화가 진행됐거나 오래된 기반 시설이 많은 곳에서는 노후 하수관/지하 공사 영향으로 지반이 약해지는 일이 자주 발생해요. 미세한 균열로 스며든 물이 토사를 유실시켜 겉으로는 멀쩡해 보여도 내부 공간이 점점 꺼질 수 있어요.`,
      `또한, 지하철 공사나 통신망·도시가스 등 복잡한 지하 인프라가 서로 간섭되면 지반 안정성이 떨어질 가능성이 있어요.`,
    ],
  };
}

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

  // 입력 전송
  const onSend = async ({ text }: SendPayload) => {
    const q = text?.trim();
    if (!q) return;

    // 사용자 메시지
    append([{ id: crypto.randomUUID(), type: "user", text: q }]);

    // 지역 정보 조회
    const data = await fetchRegionInfo(q);

    append([
      {
        id: crypto.randomUUID(),
        type: "region_info",
        meta: { title: data.title, paragraphs: data.paragraphs },
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
