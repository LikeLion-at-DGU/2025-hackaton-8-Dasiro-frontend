import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { createReportWithFiles } from "@entities/report/api";
import { clamp0to100, getAnalysisCopy } from "@features/utils/riskCopy";

type LayoutContext = { setFooterHidden: (v: boolean) => void };
type AwaitingKind = "image" | "text" | null;

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaiting, setAwaiting] = useState<AwaitingKind>(null);

  // 세트 인식 보류값
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);

  // 미리보기 ObjectURL 정리
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
    // 언마운트 시 생성한 ObjectURL 정리
    return () => {
      urlPoolRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlPoolRef.current = [];
    };
  }, []);

  const append = (items: ChatMessage[]) =>
    setMessages((prev) => [...prev, ...items]);

  // 분석 시작 -> 결과(analysis 타입 메시지 추가)
  const startAnalysis = async (text: string, files: File[]) => {
    const loadingId = crypto.randomUUID();
    append([
      {
        id: loadingId,
        type: "bot",
        text: "싱크홀 위험도를 분석하고 있어요··· ",
      },
    ]);

    const res = await createReportWithFiles({ text, files });
    const apiScore = clamp0to100(res?.risk_percentage);
    const { score, bucket, analysis, action } = getAnalysisCopy(apiScore);

    setMessages((prev) => {
      const withoutLoading = prev.filter((m) => m.id !== loadingId);
      return [
        ...withoutLoading,
        {
          id: crypto.randomUUID(),
          type: "analysis",
          meta: { score, bucket, analysis, action },
        },
      ];
    });
  };

  const onSend = async ({ text, files }: SendPayload) => {
    const hasText = !!text && text.trim().length > 0;
    const hasFiles = !!files && files.length > 0;
    if (!hasText && !hasFiles) return;

    // 즉시 표시용 미리보기 URL
    const previewUrls = hasFiles
      ? files!.map((f) => URL.createObjectURL(f))
      : [];
    if (previewUrls.length) urlPoolRef.current.push(...previewUrls);

    // 사용자 메시지 표시 (이미지 → 텍스트)
    const out: ChatMessage[] = [];
    if (hasFiles)
      out.push({ id: crypto.randomUUID(), type: "image", images: previewUrls });
    if (hasText)
      out.push({ id: crypto.randomUUID(), type: "user", text: text!.trim() });
    append(out);

    // 세트 인식
    const setComplete =
      (awaiting === "image" && hasFiles) || (awaiting === "text" && hasText);

    if (hasText && hasFiles) {
      // 한 번에 둘 다
      setPendingText(null);
      setPendingFiles(null);
      setAwaiting(null);
      await startAnalysis(text!.trim(), files!);
      return;
    }

    if (setComplete) {
      // 이전에 요청하던 반대 타입이 이번에 도착
      if (awaiting === "image") {
        if (!pendingText || !hasFiles) return;
        setPendingText(null);
        setPendingFiles(null);
        setAwaiting(null);
        await startAnalysis(pendingText, files!);
        return;
      } else if (awaiting === "text") {
        if (!pendingFiles?.length || !hasText) return;
        const t = text!.trim();
        const f = pendingFiles!;
        setPendingFiles(null);
        setPendingText(null);
        setAwaiting(null);
        await startAnalysis(t, f);
        return;
      }
    }

    // 아직 세트가 아니면 가이드
    if (hasText && !hasFiles) {
      setPendingText(text!.trim());
      if (awaiting !== "image") {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "정확한 분석을 위해 사진도 함께 보내주세요.\n땅땅이가 꼼꼼히 살펴볼게요!",
          },
        ]);
        setAwaiting("image");
      }
    } else if (hasFiles && !hasText) {
      setPendingFiles(files!);
      if (awaiting !== "text") {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요.\n땅땅이가 꼼꼼히 살펴볼게요!",
          },
        ]);
        setAwaiting("text");
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
