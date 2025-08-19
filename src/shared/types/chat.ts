// src/shared/types/chat.ts
export type ChatMessageType = "bot" | "user" | "image";

export type ChatMessage = {
  id: string;
  type: ChatMessageType;
  text?: string;
  images?: string[];
};
