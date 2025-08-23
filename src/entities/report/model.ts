export type ReportId = number;

export type CreateReportReq = {
  lat?: string;
  lng?: string;
  text?: string;
};

export type CreateReportData = {
  id?: number | string;

  status: "received" | string;
  text?: string;
  lat?: string | null;
  lng?: string | null;
  resolved?: {
    lat: number | null;
    lng: number | null;
    district: { id: number; sido: string; sigungu: string; dong: string };
    confidence: number | null;
  };
};

export type UploadImagesData = {
  image_urls: string[];
};

export type AnalyzeReportReq = {
  image_urls: string[];
};

export type AnalyzeReportData = {
  risk_score: number;
  sent_to?: string;
  sent_at?: string;
};
