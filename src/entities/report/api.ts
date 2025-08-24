import { postResponse } from "@shared/lib/instance";
import type {
  ReportId,
  UploadImagesData,
  AnalyzeReportReq,
  AnalyzeReportData,
  CreateReportReq,
  CreateReportData,
  PresignRes,
  PresignReq,
} from "./model";

type ApiEnvelope<T> = {
  status: string;
  message: string;
  code: number;
  data: T;
};

const unwrap = <T>(res: T | ApiEnvelope<T> | null): T => {
  if (!res) throw new Error("Empty response");
  return (res as any).data ?? (res as T);
};

/** Presigned URL 발급 */
async function getPresignedUrl(file: File): Promise<PresignRes> {
  // console.log("[getPresignedUrl] 요청:", { name: file.name, type: file.type });
  const res = await postResponse<PresignReq, ApiEnvelope<PresignRes>>(
    "/api/v1/reports/s3/presigned-url/",
    { file_name: file.name, file_type: file.type || "application/octet-stream" }
  );
  const data = unwrap<PresignRes>(res);
  // console.log("[getPresignedUrl] 응답:", data);
  return data;
}

/** S3로 PUT 업로드 */
async function putToS3(uploadUrl: string, file: File): Promise<void> {
  // console.log("ㅈㅂ", location.origin);
  // console.log("[putToS3] 업로드 시작:", { name: file.name, uploadUrl });
  const resp = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });
  // console.log("[putToS3] 응답 코드:", resp.status);

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`[putToS3] ${resp.status} ${resp.statusText} ${text}`);
  }
  // console.log("[putToS3] 업로드 성공:", file.name);
}

// 제보 생성
export async function createReport(body: CreateReportReq): Promise<number> {
  // console.log("[createReport] 요청:", body);
  const res = await postResponse<
    CreateReportReq,
    ApiEnvelope<CreateReportData>
  >("/api/v1/reports/", body);
  const data = unwrap<any>(res);
  const rawId = data?.id;
  const reportId = typeof rawId === "string" ? Number(rawId) : rawId;
  if (reportId == null || Number.isNaN(reportId)) {
    // console.error("[createReport] invalid response:", data);
    throw new Error("[createReport] invalid response");
  }
  // console.log("[createReport] 생성 완료 → reportId:", reportId);
  return reportId;
}

/**
 * 이미지 업로드 (presign → S3 PUT → 이미지 URL 등록)
 * - files 최대 3장
 */
export async function uploadReportImages(
  reportId: ReportId,
  files: File[],
  opts?: { onProgress?: (ratio: number) => void }
) {
  const targets = files.slice(0, 3);
  // console.log(
  //   "[uploadReportImages] 시작: reportId=",
  //   reportId,
  //   "files=",
  //   targets.map((f) => f.name)
  // );

  const fileUrls: string[] = [];
  for (let i = 0; i < targets.length; i++) {
    const f = targets[i];
    // console.log(
    //   `[uploadReportImages] (${i + 1}/${targets.length}) presign 요청`,
    //   f.name
    // );

    const { upload_url, file_url } = await getPresignedUrl(f);

    // console.log(
    //   `[uploadReportImages] (${i + 1}/${targets.length}) S3 PUT 시작`,
    //   {
    //     name: f.name,
    //     upload_url,
    //   }
    // );
    await putToS3(upload_url, f);

    // console.log(
    //   `[uploadReportImages] (${i + 1}/${targets.length}) 업로드 완료 →`,
    //   file_url
    // );
    fileUrls.push(file_url);

    const ratio = (i + 1) / targets.length;
    opts?.onProgress?.(ratio);
    // console.log("[uploadReportImages] 진행률:", ratio);
  }

  // console.log("[uploadReportImages] 서버에 이미지 URL 등록:", fileUrls);
  const res = await postResponse<
    { image_urls: string[] },
    ApiEnvelope<UploadImagesData>
  >(`/api/v1/reports/${reportId}/images`, { image_urls: fileUrls });
  const data = unwrap<UploadImagesData>(res);
  // console.log("[uploadReportImages] 서버 응답:", data);

  if (!data?.image_urls?.length) {
    // console.error(
    //   "[uploadReportImages] invalid response (no image_urls)",
    //   data
    // );
    throw new Error("[uploadReportImages] invalid response (no image_urls)");
  }

  // console.log("[uploadReportImages] 완료:", data.image_urls);
  return data;
}

// 분석 요청
export async function analyzeReport(reportId: ReportId, imageUrls: string[]) {
  const payload: AnalyzeReportReq = { image_urls: imageUrls.slice(0, 3) };
  // console.log("[analyzeReport] 요청:", { reportId, payload });
  const res = await postResponse<
    AnalyzeReportReq,
    ApiEnvelope<AnalyzeReportData>
  >(`/api/v1/reports/${reportId}/analyze`, payload);
  const data = unwrap<AnalyzeReportData>(res);
  // console.log("[analyzeReport] 응답:", data);
  return data;
}
