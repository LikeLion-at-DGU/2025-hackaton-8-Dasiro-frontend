const THANKS_PATTERNS = [
  /감사(합|해)?(니다|요)?/i, // 감사합니다/감사해요...
  /고마워(요)?/i,
  /고맙(습니|사|다)?/i,
  /\b(thanks|thank you|thx|ty)\b/i,
  /땡큐/i,
];

export function isThanks(text?: string) {
  if (!text) return false;
  const s = text.trim();
  if (!s) return false;
  return THANKS_PATTERNS.some((re) => re.test(s));
}
