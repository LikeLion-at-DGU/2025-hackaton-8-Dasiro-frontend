import instance from "@shared/lib/instance";

export type CreateReportWithFilesResponse = {
  risk_percentage: number; // 0~100
};

// 0~100 범위로 보정
const clamp0to100 = (n: unknown) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0;
};

// 텍스트+파일명을 시드로 한 결정적 난수(더미 점수)
const dummyRiskFromSeed = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h % 101); // 0~100
};

export async function createReportWithFiles({
  text,
  files,
}: {
  text: string;
  files: File[];
}): Promise<CreateReportWithFilesResponse> {
  const form = new FormData();
  form.append("text", text);
  files.forEach((f) => form.append("files", f, f.name));

  try {
    const res = await instance.post<CreateReportWithFilesResponse>(
      "/api/v1/reports/images",
      form
    );
    return { risk_percentage: clamp0to100(res.data?.risk_percentage) };
  } catch (err) {
    // ✅ API 연결/응답 실패 시 더미 리턴
    console.warn(
      "[createReportWithFiles] API 실패, 더미 데이터로 대체합니다.",
      err
    );
    const seed = `${text}|${files.map((f) => f.name).join(",")}`;
    const risk_percentage = clamp0to100(dummyRiskFromSeed(seed));
    return { risk_percentage };
  }
}
