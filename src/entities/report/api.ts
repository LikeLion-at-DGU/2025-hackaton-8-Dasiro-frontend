import { postResponse, postFormData } from "@shared/lib/instance";
import type {
  ReportId,
  UploadImagesData,
  AnalyzeReportReq,
  AnalyzeReportData,
  CreateReportReq,
  CreateReportData,
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

// 제보 생성: report_id 또는 id 모두 수용
export async function createReport(body: CreateReportReq): Promise<number> {
  const res = await postResponse<
    CreateReportReq,
    ApiEnvelope<CreateReportData>
  >("/api/v1/reports/", body);
  const data = unwrap<any>(res);
  const rawId = data?.id;
  const reportId = typeof rawId === "string" ? Number(rawId) : rawId;
  if (reportId == null || Number.isNaN(reportId)) {
    throw new Error("[createReport] invalid response");
  }
  return reportId;
}

// 이미지 업로드: 1) files → 실패 시 2) files[] 폴백
export async function uploadReportImages(reportId: ReportId, files: File[]) {
  const buildForm = (key: "files" | "files[]") => {
    const form = new FormData();
    files.slice(0, 3).forEach((f) => form.append(key, f, f.name));
    for (const [k, v] of form.entries()) {
      console.log("[uploadReportImages] FormData:", k, v);
    }
    return form;
  };

  // 1차: files
  let res = await postFormData<ApiEnvelope<UploadImagesData>>(
    `/api/v1/reports/${reportId}/images`,
    buildForm("files")
  );

  const isMissingFileError =
    !!res &&
    (res as any).status === "error" &&
    typeof (res as any).message === "string" &&
    ((res as any).message.includes("파일") ||
      (res as any).message.toLowerCase().includes("file"));

  if (!res || isMissingFileError) {
    res = await postFormData<ApiEnvelope<UploadImagesData>>(
      `/api/v1/reports/${reportId}/images`,
      buildForm("files[]")
    );
  }

  const data = unwrap<UploadImagesData>(res);
  if (!data?.image_urls) {
    throw new Error("[uploadReportImages] invalid response (no image_urls)");
  }
  return data;
}

// 분석 요청
export async function analyzeReport(reportId: ReportId, imageUrls: string[]) {
  const payload: AnalyzeReportReq = { image_urls: imageUrls.slice(0, 3) };
  const res = await postResponse<
    AnalyzeReportReq,
    ApiEnvelope<AnalyzeReportData>
  >(`/api/v1/reports/${reportId}/analyze`, payload);
  const data = unwrap<AnalyzeReportData>(res);
  return data;
}
