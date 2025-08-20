import { postResponse } from "@shared/lib/instance";
import type { RegionInfoAPIResponse, RegionInfoData } from "./model";

export function makeDummyRegionInfo(whereRaw: string): RegionInfoData {
  const where = whereRaw.trim();
  return {
    title: `🕳️ ${where} 싱크홀 위험 정보`,
    content:
      `${where}는 최근 6개월 내 지반 침하 사고가 2건 이상 발생한 지역이에요.\r\n` +
      `이 패턴은 단순한 우연이 아니라, 지반·지하 시설물·과거 사고 기록 등과 관련된 경우가 많아요.\r\n\r\n` +
      `특히 ${where}처럼 도시화가 진행됐거나 오래된 기반 시설이 많은 곳에서는 노후 하수관/지하 공사 영향으로 지반이 약해지는 일이 자주 발생해요.\r\n` +
      `미세한 균열로 스며든 물이 토사를 유실시켜 겉으로는 멀쩡해 보여도 내부 공간이 점점 꺼질 수 있어요.\r\n\r\n` +
      `또한, 지하철 공사나 통신망·도시가스 등 복잡한 지하 인프라가 서로 간섭되면 지반 안정성이 떨어질 가능성이 있어요.`,
  };
}

export async function getRegionInfoByQuery(
  query: string
): Promise<RegionInfoData> {
  const data = await postResponse<{ query: string }, RegionInfoAPIResponse>(
    "/api/v1/region-info",
    { query }
  );

  const region = (data?.region ?? "").trim();
  const content = (data?.content ?? "").trim();

  if (!region || !content) {
    return makeDummyRegionInfo(query);
  }

  return {
    title: `🕳️ ${region} 싱크홀 위험 정보`,
    content,
  };
}
