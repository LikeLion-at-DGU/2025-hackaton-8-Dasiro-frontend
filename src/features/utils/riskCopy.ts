export type RiskBucket = "low" | "mid" | "high";

export const clamp0to100 = (n: unknown) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0;
};

export const riskBucket = (score: number): RiskBucket =>
  score <= 35 ? "low" : score <= 70 ? "mid" : "high";

const riskLabel = (score: number) =>
  score <= 30
    ? "낮은 편"
    : score <= 70
    ? "주의가 필요한 상태"
    : "매우 위험한 상태";

export const getAnalysisCopy = (rawScore: number) => {
  const s = clamp0to100(rawScore);
  const bucket = riskBucket(s);

  if (s <= 10) {
    return {
      score: s,
      bucket,
      analysis: `해당 장소는 위험도 ${s}%로 안전한 편이에요. 지반 침하 징후가 거의 나타나지 않으니 안심하셔도 돼요!`,
      action: `그래도 불안하시다면 해당 지역을 계속해서 지켜봐주세요! 여러분의 관심이 큰 재앙을 막을 수 있답니다 :)`,
    };
  }

  if (bucket === "low") {
    return {
      score: s,
      bucket,
      analysis: `해당 장소는 위험도 ${s}%로 ${riskLabel(
        s
      )}예요. 지금은 큰 문제는 없어 보이지만, 계속해서 관찰이 필요한 곳이에요.`,
      action: `혹시 주변에서 이상한 소리가 들리거나, 새로운 균열을 발견하셨다면 언제든지 땅땅이에게 다시 알려 주세요. 바로 도와드릴게요!`,
    };
  }
  if (bucket === "mid") {
    return {
      score: s,
      bucket,
      analysis: `해당 장소는 위험도 ${s}%로 ${riskLabel(
        s
      )}예요. 큰 위험은 아니지만, 작은 균열의 가능성이 있어요.`,
      action: `안전을 위해 다시로가 즉시 해당 시청에 자동 신고했어요. 지금 바로 가까운 안전 경로로 이동해 주세요!`,
    };
  }
  return {
    score: s,
    bucket,
    analysis: `해당 장소는 위험도 ${s}%로 ${riskLabel(
      s
    )}예요. 지반 침하 징후가 강하게 나타나고 있어요.`,
    action: `안전을 위해 다시로가 즉시 해당 시청에 자동 신고했어요. 지금 바로 가까운 안전 경로로 이동해 주세요!`,
  };
};
