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
import { useObjectURLPool } from "@features/citizen-report/hooks/useObjectUrlPool";
import { MSG } from "@features/citizen-report/constants/messages";
import { limitTo3 } from "@features/citizen-report/lib/filesCount";
import { geocodeCandidates } from "@features/citizen-report/lib/getcodeCandidates";
import CandidatesSheet from "@features/citizen-report/ui/report/candidateSheet";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [_, setAwaiting] = useState<AwaitingKind>(null);
  const [pickedLocation, setPickedLocation] = useState<PickedLocation>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [candidates, setCandidates] = useState<CandidatePlace[] | null>(null);

  const urlPoolRef = useObjectURLPool();
  const startingRef = useRef(false);

  const append = (items: ChatMessage[]) =>
    setMessages((prev) => [...prev, ...items]);
  const say = (text: string) =>
    append([{ id: crypto.randomUUID(), type: "bot", text }]);

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const initial = useMemo<ChatMessage[]>(
    () => [{ id: "m1", type: "bot", text: MSG.hello }],
    []
  );
  useEffect(() => setMessages(initial), [initial]);

  const tryStart = async (next?: {
    loc?: PickedLocation | null;
    text?: string | null;
    files?: File[] | null;
  }) => {
    if (startingRef.current) return;

    const loc = next?.loc ?? pickedLocation;
    const textRaw = next?.text ?? pendingText ?? "";
    const text = textRaw.trim();
    const files = limitTo3(next?.files ?? pendingFiles ?? []);

    const ok = !!loc?.lat && !!loc?.lng && !!text && files.length > 0;
    if (!ok) return;

    try {
      startingRef.current = true;

      // 분석 시작
      await startAnalysisFlow({
        text,
        files,
        pickedLocation: loc!,
        append,
        setMessages,
        setAwaiting,
      });

      setPendingText(null);
      setPendingFiles(null);
      setPickedLocation(null);
      setAwaiting("text");
    } finally {
      startingRef.current = false;
    }
  };

  const handlePickCandidate = async (c: CandidatePlace) => {
    const loc: PickedLocation = { lat: c.lat, lng: c.lng, address: c.address };
    const text = pendingText ?? c.address;

    setPickedLocation(loc);
    setPendingText(text);
    setCandidates(null);
    setAwaiting("image");
    say(`'${c.placeName || c.address}'를 선택했어요.`);

    if (!pendingFiles || pendingFiles.length === 0) {
      say(MSG.askImage);
    }
    await tryStart({ loc, text, files: pendingFiles });
  };

  const handleCancelCandidates = () => {
    setCandidates(null);
    say(MSG.pickCanceled);
    setAwaiting("text");
  };

  /* 전송 */
  const onSend = async ({ text, files }: SendPayload) => {
    if (candidates && (!text || !text.trim())) return;

    const hasText = !!text?.trim();
    const hasFiles = !!files?.length;
    if (!hasText && !hasFiles) return;

    if (hasText && !hasFiles && isThanks(text!)) {
      append([
        { id: crypto.randomUUID(), type: "user", text: text!.trim() },
        { id: crypto.randomUUID(), type: "bot", text: MSG.thanks },
      ]);
      return;
    }

    let limited: File[] = [];
    if (hasFiles) {
      limited = limitTo3(files!);
      if (files!.length > 3) say(MSG.tooMany);
      const previews = limited.map((f) => URL.createObjectURL(f));
      if (previews.length) {
        urlPoolRef.current.push(...previews);
        append([{ id: crypto.randomUUID(), type: "image", images: previews }]);
      }
    }

    if (hasText) {
      append([{ id: crypto.randomUUID(), type: "user", text: text!.trim() }]);
    }

    if (hasText) {
      const q = text!.trim();
      if (!looksValidAddressQuery(q)) {
        say(MSG.askAddress);
        setPendingText(null);
        setAwaiting("text");
        return;
      }

      const results = await geocodeCandidates(q);

      if (results.length > 1) {
        setCandidates(results);
        say(
          `'${q}'으로 ${results.length}개 장소를 찾았어요.\n아래 목록에서 위치를 선택해 주세요.`
        );
        setPendingText(q);
        if (limited.length) setPendingFiles(limited);
        setAwaiting(null);
        return;
      }

      if (results.length === 1) {
        const r = results[0];
        const loc: PickedLocation = {
          lat: r.lat,
          lng: r.lng,
          address: r.address,
        };
        const t = pendingText ?? q;

        setPickedLocation(loc);
        setPendingText(t);
        say(`위치를 '${r.placeName || r.address}'로 인식했어요.`);

        if (limited.length) setPendingFiles(limited);

        await tryStart({
          loc,
          text: t,
          files: limited.length ? limited : pendingFiles,
        });

        if (!limited.length) {
          setAwaiting("image");
          say(MSG.askImage);
        }
        return;
      }

      say(MSG.noMatch);
      setAwaiting("text");
      return;
    }

    // 텍스트 없이 이미지만 온 경우
    if (limited.length) {
      setPendingFiles(limited);
      await tryStart({ files: limited });

      if (!pendingText) {
        say(MSG.askImage.replace("사진도", "주소도"));
        setAwaiting("text");
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
