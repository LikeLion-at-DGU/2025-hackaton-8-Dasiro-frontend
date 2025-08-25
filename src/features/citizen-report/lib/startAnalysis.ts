import { geocodeText } from "@shared/lib/kakaoGeocode";
import { formatCoord } from "@shared/lib/coord";
import {
  createReport,
  uploadReportImages,
  analyzeReport,
} from "@entities/report/api";
import { clamp0to100, getAnalysisCopy } from "@features/utils/riskCopy";
import type { ChatMessage } from "@shared/types/chat";
import type { PickedLocation } from "../types";

type Deps = {
  text: string;
  files: File[];
  pickedLocation: PickedLocation;
  append: (items: ChatMessage[]) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setAwaiting: (a: "image" | "text" | null) => void;
};

export async function startAnalysisFlow({
  text,
  files,
  pickedLocation,
  append,
  setMessages,
  setAwaiting,
}: Deps) {
  const loadingId = crypto.randomUUID();
  append([{ id: loadingId, type: "bot", text: "제보를 접수하고 있어요···" }]);

  let uploadingId: string | null = null;
  let analyzingId: string | null = null;

  try {
    // 1) 좌표: (A) 선택 좌표 → (B) 텍스트 지오코딩 → (C) 좌표 없이
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
        // 지오코딩 실패 → 안내 후 중단
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

    // 2) 문자열 포맷
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
          text: `이미지 ${Math.min(files.length, 3)}장 업로드 중 ···`,
        },
      ]);
      const uploaded = await uploadReportImages(reportId, files);
      imageUrls = uploaded.image_urls ?? [];
    }

    // 5) 분석 요청
    // 5) 분석 요청
    analyzingId = crypto.randomUUID();
    append([
      {
        id: analyzingId,
        type: "bot",
        text: "AI가 위험도를 분석하는 중이에요 ···",
        typing: true,
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

    // 진행 멘트 제거 후 결과만 남김
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
}
