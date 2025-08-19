// src/shared/types/chat.ts
export type ChatMessageType = "bot" | "user" | "analysis" | "info" | "image";

export type ChatMessage = {
  id: string;
  type: ChatMessageType;
  text?: string;
  images?: string[];
};
