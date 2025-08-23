import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { isThanks } from "@shared/utils/isThanks";

import {
  createReport,
  uploadReportImages,
  analyzeReport,
} from "@entities/report/api";
import { clamp0to100, getAnalysisCopy } from "@features/utils/riskCopy";
import { geocodeText } from "@shared/lib/kakaoGeocode";
import { formatCoord } from "@shared/lib/coord";

type LayoutContext = { setFooterHidden: (v: boolean) => void };
type AwaitingKind = "image" | "text" | null;
type PickedLocation = { lat: number; lng: number; address?: string } | null;

/* ========= 입력 유효성 검사 유틸 ========= */
const sanitize = (s?: string) => (s ?? "").trim();
const compact = (s?: string) => sanitize(s).replace(/\s+/g, "");
const isJamoOnly = (s: string) =>
  /^[\u3131-\u314E\u314F-\u3163]+$/.test(compact(s));
const isTooShort = (s: string) => compact(s).length < 2;
const looksValidAddressQuery = (s?: string) => {
  const c = compact(s);
  if (!c || isTooShort(c) || isJamoOnly(c)) return false;
  return /[가-힣A-Za-z0-9]/.test(c);
};
/* ======================================= */

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

  /**
   * 텍스트 + 이미지 세트가 갖춰졌을 때 호출 순서
   * 1) POST /api/v1/reports             (reportId get)
   * 2) POST /api/v1/reports/:id/images  (이미지 업로드, 최대 3장)
   * 3) POST /api/v1/reports/:id/analyze (위험도 분석 결과 get)
   *    - 중간 멘트(접수/업로드/분석)는 결과가 나오면 자동 제거
   */
  const startAnalysis = async (text: string, files: File[]) => {
    const loadingId = crypto.randomUUID();
    append([{ id: loadingId, type: "bot", text: "제보를 접수하고 있어요···" }]);

    let uploadingId: string | null = null;
    let analyzingId: string | null = null;

    try {
      let latNum: number | undefined;
      let lngNum: number | undefined;

      if (pickedLocation?.lat && pickedLocation?.lng) {
        latNum = pickedLocation.lat;
        lngNum = pickedLocation.lng;
      } else if (text?.trim()) {
        const geo = await geocodeText(text.trim());
        if (geo) {
          latNum = geo.lat;
          lngNum = geo.lng;
          append([
            {
              id: crypto.randomUUID(),
              type: "bot",
              text: `위치를 '${geo.address}'로 인식했어요.`,
            },
          ]);
        } else {
          setMessages((prev) =>
            prev
              .filter((m) => m.id !== loadingId)
              .concat({
                id: crypto.randomUUID(),
                type: "bot",
                text:
                  "주소를 정확히 입력해주세요!\n" +
                  "예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
              })
          );
          setAwaiting("text");
          return;
        }
      }

      // 2) 문자열로 포맷
      const latStr = formatCoord(latNum);
      const lngStr = formatCoord(lngNum);

      // 3) 제보 생성
      const reportId = await createReport({
        text: text?.trim() || undefined,
        lat: latStr,
        lng: lngStr,
      });

      // 4) 이미지 업로드
      let imageUrls: string[] = [];
      if (files?.length) {
        uploadingId = crypto.randomUUID();
        append([
          {
            id: uploadingId,
            type: "bot",
            text: `이미지 ${Math.min(files.length, 3)}장 업로드 중…`,
          },
        ]);
        const uploaded = await uploadReportImages(reportId, files);
        imageUrls = uploaded.image_urls ?? [];
      }

      // 5) 분석 요청
      analyzingId = crypto.randomUUID();
      append([
        {
          id: analyzingId,
          type: "bot",
          text: "AI가 위험도를 분석하는 중이에요…",
        },
      ]);
      const analysis = await analyzeReport(reportId, imageUrls);

      const apiScore = clamp0to100(analysis.risk_score);
      const {
        score,
        bucket,
        analysis: analysisText,
        action,
      } = getAnalysisCopy(apiScore);

      // 결과가 나오면 중간 멘트들 제거
      setMessages((prev) =>
        prev
          .filter((m) => ![loadingId, uploadingId, analyzingId].includes(m.id))
          .concat({
            id: crypto.randomUUID(),
            type: "analysis",
            meta: { score, bucket, analysis: analysisText, action },
          })
      );
    } catch (e) {
      console.error(e);
      setMessages((prev) =>
        prev
          .filter((m) => ![loadingId, uploadingId, analyzingId].includes(m.id))
          .concat({
            id: crypto.randomUUID(),
            type: "bot",
            text:
              "제보 처리에 실패했어요. 잠시 후 다시 시도해 주세요.\n" +
              "문제가 계속되면 네트워크 상태를 확인해 주세요.",
          })
      );
    }
  };

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

    const setComplete =
      (awaiting === "image" && hasFiles && !!pendingText) ||
      (awaiting === "text" && hasText && !!pendingFiles?.length);

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
      await startAnalysis(text!.trim(), files!);
      return;
    }

    // --- [B] 세트가 완성된 경우
    if (setComplete) {
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
              text:
                "주소를 정확히 입력해주세요!\n" +
                "예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
            },
          ]);
          setAwaiting("text");
          return;
        }
        const t = pendingText;
        setPendingText(null);
        setPendingFiles(null);
        setAwaiting(null);
        await startAnalysis(t, files!);
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
              text:
                "주소를 정확히 입력해주세요!\n" +
                "예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
            },
          ]);
          setAwaiting("text");
          return;
        }
        const f = pendingFiles!;
        setPendingFiles(null);
        setPendingText(null);
        setAwaiting(null);
        await startAnalysis(t, f);
        return;
      }
    }

    // --- [C] 아직 세트가 아니면 대기로 유도
    if (hasText && !hasFiles) {
      const t = text!.trim();
      if (!looksValidAddressQuery(t)) {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text:
              "주소를 정확히 입력해주세요!\n" +
              "예) 서울 중구 필동로 1길 30 / 신당동 100-1 / 충무로역 7번 출구",
          },
        ]);
        // 잘못된 텍스트는 보류하지 않음
        setPendingText(null);
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
