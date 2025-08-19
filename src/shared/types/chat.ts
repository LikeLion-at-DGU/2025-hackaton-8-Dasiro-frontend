// src/shared/types/chat.ts
export type RiskBucket = "low" | "mid" | "high";

export type ChatMessageType = "bot" | "user" | "image" | "analysis";

export type ChatMessage =
  | { id: string; type: "bot" | "user"; text: string }
  | { id: string; type: "image"; images: string[] }
  | {
      id: string;
      type: "analysis";
      meta: {
        score: number;
        bucket: RiskBucket;
        analysis: string; // 본문
        action: string; // 본문
      };
    };
