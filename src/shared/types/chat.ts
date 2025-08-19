export type RiskBucket = "low" | "mid" | "high";

export type ChatMessageType =
  | "bot"
  | "user"
  | "image"
  | "analysis"
  | "region_info"
  | "cautions";

export type RegionInfoMeta = {
  title: string;
  paragraphs: string[];
};

export type CautionsMeta = {
  title: string;
  items?: string[];
};

export type ChatMessage =
  | { id: string; type: "bot" | "user"; text: string }
  | { id: string; type: "image"; images: string[] }
  | {
      id: string;
      type: "analysis";
      meta: {
        score: number;
        bucket: RiskBucket;
        analysis: string;
        action: string;
      };
    }
  | { id: string; type: "region_info"; meta: RegionInfoMeta }
  | { id: string; type: "cautions"; meta?: CautionsMeta };
