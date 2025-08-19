import instance from "@shared/lib/instance";

export type CreateReportWithFilesResponse = {
  risk_percentage: number;
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

  const res = await instance.post<CreateReportWithFilesResponse>(
    "/api/v1/reports/images",
    form
  );
  return res.data;
}
