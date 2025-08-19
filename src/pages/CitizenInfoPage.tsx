import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

async function fetchRegionInfo(query: string): Promise<{
  title: string;
  paragraphs: string[];
  cautions: string[];
}> {
  // TODO: 실제 API로 교체
  // 여기선 더미 반환
  return {
    title: `🕳️ ${query.split(" ").pop()} 싱크홀 위험 정보`,
    paragraphs: [
      `${query}은 최근 6개월 내 지반 침하 사고가 2건 이상 발생한 지역이에요. 이는 패턴은 단순한 우연이 아닌, 지반·지하 시설물·과거 사고 기록 등과 관련된 경우가 많아요.`,
      `특히 ${query}처럼 도시화나 오래된 기반 시설이 많은 지역에서는 노후된 하수관이나 지하 공사로 인해 지반이 약해지는 일이 자주 발생해요. 하수관이나 미세한 균열이 생기면 오랜 시간 물이 스며들어 토사가 유실되고, 멀쩡해 보이던 지반 공간은 내부에서 지반이 점점 꺼지는 거예요.`,
      `또한, 지하철 공사나 동시다발 매설, 도시가스 등 복잡한 지하 인프라가 서로 간섭되며 안전성이 떨어질 염려가 있어요.`,
    ],
    cautions: [
      "보도블록이 갑자기 기울어 있거나 울퉁불퉁함을 확인해보세요.",
      "도로에 가로 또는 세로로 가는 금이 간 경우, 지하에 공간이 생겼을 가능성이 있어요.",
      "빗물받이 주변에 거품이 있거나 물이 잘 빠지지 않는다면 주변 지반이 무너지고 있는 신호일 수 있어요.",
      "인근 공사장에서 진동이 심하게 느껴진다면, 지반 안정성에 영향을 줄 수 있어요.",
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
          "해당 지역이 왜 위험한지 설명해드릴게요.\n\n" +
          "궁금한 동네가 있다면 땅땅이에게 알려주세요!",
      },
    ],
    []
  );

  useEffect(() => setMessages(initial), [initial]);

  const append = (items: ChatMessage[]) => setMessages((p) => [...p, ...items]);

  const onSend = async ({ text }: SendPayload) => {
    const q = text?.trim();
    if (!q) return;

    append([{ id: crypto.randomUUID(), type: "user", text: q }]);

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
        meta: { title: "주의사항", items: data.cautions },
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
