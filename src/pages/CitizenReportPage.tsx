import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { isThanks } from "@shared/utils/isThanks";

import { looksValidAddressQuery } from "@features/citizen-report/lib/addressValidation";
import { isSetComplete } from "@features/citizen-report/lib/setComplete";
import {
  startAnalysisFlow,
  type PickedLocation,
} from "@features/citizen-report/lib/startAnalysis";

type LayoutContext = { setFooterHidden: (v: boolean) => void };
export type AwaitingKind = "image" | "text" | null;

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  const THANKS_REPLY =
    "도움이 되었길 바라요! 다른 지역도 궁금하면 편하게 물어보세요.";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaiting, setAwaiting] = useState<AwaitingKind>(null);

  // 지도/현재위치 등으로 선택된 좌표 (있으면 우선 사용)
  const [pickedLocation] = useState<PickedLocation>(null);

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

    // 감사 인사
    if (hasText && !hasFiles && isThanks(text!)) {
      append([
        { id: crypto.randomUUID(), type: "user", text: text!.trim() },
        { id: crypto.randomUUID(), type: "bot", text: THANKS_REPLY },
      ]);
      return;
    }

    // 미리보기 URL
    const previewUrls = hasFiles
      ? files!.map((f) => URL.createObjectURL(f))
      : [];
    if (previewUrls.length) urlPoolRef.current.push(...previewUrls);

    // 사용자 메시지 표시 (이미지 → 텍스트 순서)
    const out: ChatMessage[] = [];
    if (hasFiles)
      out.push({ id: crypto.randomUUID(), type: "image", images: previewUrls });
    if (hasText)
      out.push({ id: crypto.randomUUID(), type: "user", text: text!.trim() });
    append(out);

    // 둘 다 갖춰졌을 때만 true
    const setDone = isSetComplete(
      awaiting,
      hasText,
      hasFiles,
      pendingText,
      pendingFiles
    );

    // [A] 텍스트+이미지 동시에 도착
    if (hasText && hasFiles) {
      if (!looksValidAddressQuery(text)) {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text:
              "주소를 정확히 입력해주세요!\n" +
              "예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
          },
        ]);
        // 이미지는 보류, 텍스트 다시 받기
        setPendingFiles(files!);
        setAwaiting("text");
        return;
      }
      setPendingText(null);
      setPendingFiles(null);
      setAwaiting(null);
      await startAnalysisFlow({
        text: text!.trim(),
        files: files!,
        pickedLocation,
        append,
        setMessages,
        setAwaiting,
      });
      return;
    }

    // [B] 세트가 이제야 완성
    if (setDone) {
      if (awaiting === "image") {
        // 텍스트 선입력 → 방금 이미지 옴
        if (!pendingText || !hasFiles) {
          append([
            {
              id: crypto.randomUUID(),
              type: "bot",
              text: "정확한 분석을 위해 사진도 함께 보내주세요.\n땅땅이가 꼼꼼히 살펴볼게요!",
            },
          ]);
          setAwaiting("image");
          return;
        }
        if (!looksValidAddressQuery(pendingText)) {
          append([
            {
              id: crypto.randomUUID(),
              type: "bot",
              text: "주소를 정확히 입력해주세요!\n예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
            },
          ]);
          setAwaiting("text");
          return;
        }
        const t = pendingText;
        setPendingText(null);
        setPendingFiles(null);
        setAwaiting(null);
        await startAnalysisFlow({
          text: t,
          files: files!,
          pickedLocation,
          append,
          setMessages,
          setAwaiting,
        });
        return;
      } else if (awaiting === "text") {
        // 이미지 선입력 → 방금 텍스트 옴
        if (!pendingFiles?.length || !hasText) {
          append([
            {
              id: crypto.randomUUID(),
              type: "bot",
              text: "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요.\n땅땅이가 꼼꼼히 살펴볼게요!",
            },
          ]);
          setAwaiting("text");
          return;
        }
        const t = text!.trim();
        if (!looksValidAddressQuery(t)) {
          append([
            {
              id: crypto.randomUUID(),
              type: "bot",
              text: "주소를 정확히 입력해주세요!\n예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
            },
          ]);
          setAwaiting("text");
          return;
        }
        const f = pendingFiles!;
        setPendingFiles(null);
        setPendingText(null);
        setAwaiting(null);
        await startAnalysisFlow({
          text: t,
          files: f,
          pickedLocation,
          append,
          setMessages,
          setAwaiting,
        });
        return;
      }
    }

    // [C] 아직 세트가 아님 → 대기로 유도
    if (hasText && !hasFiles) {
      const t = text!.trim();
      if (!looksValidAddressQuery(t)) {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "주소를 정확히 입력해주세요!\n예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
          },
        ]);
        setPendingText(null); // 잘못된 텍스트는 보류하지 않음
        setAwaiting("text");
        return;
      }
      setPendingText(t);
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
      footer={<InputBar onSend={onSend} onPickImage={() => {}} />}
    >
      <MessageList messages={messages} autoScroll />
    </CitizenLayout>
  );
}
