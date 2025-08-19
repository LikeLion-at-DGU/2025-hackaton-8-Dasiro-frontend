import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { createReportWithFiles } from "@entities/report/api";

type LayoutContext = { setFooterHidden: (v: boolean) => void };
type AwaitingKind = "image" | "text" | null;

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaiting, setAwaiting] = useState<AwaitingKind>(null);

  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);

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
          "반가워요, 제보자 님!\n걷고 있는 길이 불안하게 느껴지셨나요?\n" +
          "걱정되는 장소의 사진을 보내주시면,\n싱크홀 위험도를 분석해드릴게요.",
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

  const append = (items: ChatMessage[]) =>
    setMessages((prev) => [...prev, ...items]);

  const onSend = async ({ text, files }: SendPayload) => {
    const hasText = !!text && text.trim().length > 0;
    const hasFiles = !!files && files.length > 0;
    if (!hasText && !hasFiles) return;

    // 채팅 즉시 표시용 미리보기 URL
    const previewUrls = hasFiles
      ? files!.map((f) => URL.createObjectURL(f))
      : [];
    if (previewUrls.length) urlPoolRef.current.push(...previewUrls);

    // 1) 사용자 메시지 즉시 표시 (이미지 -> 텍스트)
    const out: ChatMessage[] = [];
    if (hasFiles)
      out.push({ id: crypto.randomUUID(), type: "image", images: previewUrls });
    if (hasText)
      out.push({ id: crypto.randomUUID(), type: "user", text: text!.trim() });
    append(out);

    const setComplete =
      (awaiting === "image" && hasFiles) || (awaiting === "text" && hasText);

    // 세트 전송에 실제 쓸 값 (둘 다 채워져야 호출)
    let toText: string | null = null;
    let toFiles: File[] | null = null;

    if (hasText && hasFiles) {
      // 한 번에 둘 다
      toText = text!.trim();
      toFiles = files!;
      setPendingText(null);
      setPendingFiles(null);
      setAwaiting(null);

      append([
        {
          id: crypto.randomUUID(),
          type: "bot",
          text: "싱크홀 위험도를 분석해보고 있어요…",
        },
      ]);
    } else if (setComplete) {
      // 이전에 요청하던 반대 타입이 이번에 도착
      if (awaiting === "image") {
        // 직전에 text만 있었음 → pendingText 사용 + 방금 온 files
        if (!pendingText || !hasFiles) return;
        toText = pendingText;
        toFiles = files!;
        setPendingText(null);
        setPendingFiles(null);
      } else if (awaiting === "text") {
        // 직전에 files만 있었음 → pendingFiles 사용 + 방금 온 text
        if (!pendingFiles?.length || !hasText) return;
        toText = text!.trim();
        toFiles = pendingFiles!;
        setPendingFiles(null);
        setPendingText(null);
      }
      setAwaiting(null);

      append([
        {
          id: crypto.randomUUID(),
          type: "bot",
          text: "싱크홀 위험도를 분석하고 있어요···",
        },
      ]);
    } else if (hasText && !hasFiles) {
      // 텍스트만 왔고, 아직 이미지를 기다리지 않던 경우에만 안내
      setPendingText(text!.trim());
      if (awaiting !== "image") {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "정확한 분석을 위해 사진도 함께 보내주세요.땅땅이가 꼼꼼히 살펴볼게요!",
          },
        ]);
        setAwaiting("image");
      }
    } else if (hasFiles && !hasText) {
      // 이미지만 왔고, 아직 텍스트를 기다리지 않던 경우만 안내
      setPendingFiles(files!);
      if (awaiting !== "text") {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요. 땅땅이가 꼼꼼히 살펴볼게요!",
          },
        ]);
        setAwaiting("text");
      }
    }

    // 3) 세트가 준비되었으면 multipart로 백엔드에 전송
    if (toText && toFiles?.length) {
      try {
        const result = await createReportWithFiles({
          text: toText,
          files: toFiles,
        });
        const pct = Number(result.risk_percentage);

        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text:
              `▸ 분석결과\n해당 장소의 예상 위험도는 ${pct.toFixed(
                1
              )}% 입니다.\n\n` +
              `▸ 안내\n보도 침하/균열, 반복 물웅덩이 등 징후 발견 시 통행을 피하세요.`,
          },
        ]);
      } catch (err: any) {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "분석 요청 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
          },
        ]);
      }
    }
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
