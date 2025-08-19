export type CreateReportRequest = {
  text: string;
  image_url: string[];
};

export type CreateReportResponse = {
  risk_percentage: number;
};
