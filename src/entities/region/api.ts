import { postResponse } from "@shared/lib/instance";
import type { RegionInfoData, RiskInfoDTO } from "./model";

export async function getRegionInfoByQuery(
  query: string
): Promise<RegionInfoData | null> {
  const dong = (query ?? "").trim();
  if (!dong) return null;

  const raw = await postResponse<
    { dong: string },
    RiskInfoDTO | { data?: RiskInfoDTO }
  >("/api/v1/districts/risk/risk-info", { dong });
  if (!raw) return null;

  const dto: RiskInfoDTO | undefined =
    (raw as any).data ?? (raw as RiskInfoDTO);
  if (!dto) return null;

  const regionName = [dto.sido, dto.sigungu, dto.dong]
    .filter(Boolean)
    .join(" ")
    .trim();
  const title = `🕳️ ${regionName || dong} 싱크홀 위험 정보`;

  const content = (dto.analysis_text ?? "").trim();
  if (!content) return null;

  return { title, content };
}
