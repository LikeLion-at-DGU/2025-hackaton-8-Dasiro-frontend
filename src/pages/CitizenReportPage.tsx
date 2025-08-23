import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CitizenLayout from "@shared/ui/CitizenLayout";
import MessageList from "@shared/ui/MessageList";
import InputBar, { type SendPayload } from "@shared/ui/InputBar";
import type { ChatMessage } from "@shared/types/chat";
import { isThanks } from "@shared/utils/isThanks";

import { looksValidAddressQuery } from "@features/citizen-report/lib/addressValidation";
import { startAnalysisFlow } from "@features/citizen-report/lib/startAnalysis";

import type {
  AwaitingKind,
  PickedLocation,
  CandidatePlace,
} from "@features/citizen-report/types";
import { geocodeCandidates } from "@features/citizen-report/lib/getcodeCandidates";
import CandidatesSheet from "@features/citizen-report/ui/report/candidateSheet";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

const limitTo3 = (files?: File[] | null) => (files ? files.slice(0, 3) : []);

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  const THANKS_REPLY =
    "도움이 되었길 바라요! 다른 지역도 궁금하면 편하게 물어보세요.";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaiting, setAwaiting] = useState<AwaitingKind>(null);

  // 확정 좌표/주소(후보 선택 또는 단일 지오코딩 결과)
  const [pickedLocation, setPickedLocation] = useState<PickedLocation>(null);

  // 세트 인식 보류값
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);

  // 후보 선택 모드
  const [candidates, setCandidates] = useState<CandidatePlace[] | null>(null);

  // 미리보기 ObjectURL 정리
  const urlPoolRef = useRef<string[]>([]);
  // 중복 실행 방지
  const startingRef = useRef(false);

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

  const tryStartWithState = async (next?: {
    pickedLocation?: PickedLocation;
    pendingText?: string | null;
    pendingFiles?: File[] | null;
  }) => {
    if (startingRef.current) return;

    const loc = next?.pickedLocation ?? pickedLocation;
    const pText = next?.pendingText ?? pendingText;
    const pFiles = next?.pendingFiles ?? pendingFiles;

    const textOk = !!(pText ?? loc?.address);
    const filesOk = !!(pFiles && pFiles.length > 0);
    const locOk = !!loc?.lat && !!loc?.lng;
    if (!textOk || !filesOk || !locOk) return;

    try {
      startingRef.current = true;
      const t = (pText ?? loc?.address ?? "").trim();
      const f = limitTo3(pFiles!);

      setPendingText(null);
      setPendingFiles(null);
      setAwaiting(null);

      await startAnalysisFlow({
        text: t,
        files: f,
        pickedLocation: loc,
        append,
        setMessages,
        setAwaiting,
      });
    } finally {
      startingRef.current = false;
    }
  };

  const handlePickCandidate = async (c: CandidatePlace) => {
    const nextPicked: PickedLocation = {
      lat: c.lat,
      lng: c.lng,
      address: c.address,
    };
    const nextPendingText = pendingText ?? c.address;
    const nextPendingFiles = pendingFiles;

    setPickedLocation(nextPicked);
    setPendingText(nextPendingText);
    setCandidates(null);
    setAwaiting("image");

    append([
      {
        id: crypto.randomUUID(),
        type: "bot",
        text: `'${c.placeName || c.address}'를 선택했어요.`,
      },
    ]);

    await tryStartWithState({
      pickedLocation: nextPicked,
      pendingText: nextPendingText,
      pendingFiles: nextPendingFiles,
    });
  };

  const handleCancelCandidates = () => {
    setCandidates(null);
    append([
      {
        id: crypto.randomUUID(),
        type: "bot",
        text: "장소 선택이 취소되었어요. 주소나 장소명을 다시 입력해 주세요.",
      },
    ]);
    setAwaiting("text");
  };

  const onSend = async ({ text, files }: SendPayload) => {
    if (candidates && (!text || !text.trim())) return;

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

    // 파일 제한 + 미리보기
    let limitedFiles: File[] = [];
    if (hasFiles) {
      limitedFiles = limitTo3(files!);
      if (files!.length > 3) {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: `이미지는 최대 3장까지만 분석할 수 있어요. 앞의 3장만 사용할게요.`,
          },
        ]);
      }
    }

    const previewUrls = limitedFiles.map((f) => URL.createObjectURL(f));
    if (previewUrls.length) urlPoolRef.current.push(...previewUrls);

    const out: ChatMessage[] = [];
    if (previewUrls.length)
      out.push({ id: crypto.randomUUID(), type: "image", images: previewUrls });
    if (hasText)
      out.push({ id: crypto.randomUUID(), type: "user", text: text!.trim() });
    append(out);

    if (hasText) {
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
        setPendingText(null);
        setAwaiting("text");
        return;
      }

      const q = text!.trim();
      const results = await geocodeCandidates(q);

      if (results.length > 1) {
        setCandidates(results);
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text:
              `'${q}'으로 ${results.length}개 장소를 찾았어요.\n` +
              "아래 목록에서 위치를 선택해 주세요.",
          },
        ]);
        // 현재 입력값 보관
        setPendingText(q);
        if (limitedFiles.length) setPendingFiles(limitedFiles);
        setAwaiting(null);
        return;
      } else if (results.length === 1) {
        // 후보 1개 → 좌표 고정
        const r = results[0];
        const nextPicked: PickedLocation = {
          lat: r.lat,
          lng: r.lng,
          address: r.address,
        };
        const nextPendingText = pendingText ?? q;

        setPickedLocation(nextPicked);
        setPendingText(nextPendingText);
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: `위치를 '${r.placeName || r.address}'로 인식했어요.`,
          },
        ]);

        // 파일이 동반되었다면 보관
        if (limitedFiles.length) setPendingFiles(limitedFiles);

        // 좌표/텍스트/이미지까지 갖춰졌는지 검사
        await tryStartWithState({
          pickedLocation: nextPicked,
          pendingText: nextPendingText,
          pendingFiles: limitedFiles.length ? limitedFiles : pendingFiles,
        });

        // 파일이 없었다면 다음은 이미지 대기
        if (!limitedFiles.length) setAwaiting("image");
      } else {
        append([
          {
            id: crypto.randomUUID(),
            type: "bot",
            text: "일치하는 장소를 찾지 못했어요. 주소나 장소명을 더 구체적으로 입력해 주세요.",
          },
        ]);
        setAwaiting("text");
        return;
      }
    } else {
      // 텍스트 없이 이미지만 온 경우 → 파일 보관
      if (limitedFiles.length) {
        setPendingFiles(limitedFiles);
        // 주소/좌표가 이미 확정되어 있다면 바로 게이트 검사
        await tryStartWithState({
          pendingFiles: limitedFiles,
        });
        // 아직 위치 미확정이라면 텍스트 유도
        if (!pickedLocation) {
          if (awaiting !== "text") {
            append([
              {
                id: crypto.randomUUID(),
                type: "bot",
                text:
                  "정확한 분석을 위해 간단한 주소도 함께 말씀해 주세요.\n" +
                  "땅땅이가 꼼꼼히 살펴볼게요!",
              },
            ]);
            setAwaiting("text");
          }
        }
      }
    }
  };

  return (
    <CitizenLayout
      onClose={() => navigate(-1)}
      footer={
        candidates ? (
          <CandidatesSheet
            candidates={candidates}
            title="해당하는 장소를 선택해 주세요"
            subtitle="목록에서 정확한 지점을 골라주세요."
            onPick={handlePickCandidate}
            onCancel={handleCancelCandidates}
          />
        ) : (
          <InputBar onSend={onSend} onPickImage={() => {}} />
        )
      }
    >
      <MessageList messages={messages} autoScroll />
    </CitizenLayout>
  );
}
