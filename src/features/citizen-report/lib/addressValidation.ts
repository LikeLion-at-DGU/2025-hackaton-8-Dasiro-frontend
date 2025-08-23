export const sanitize = (s?: string) => (s ?? "").trim();
export const compact = (s?: string) => sanitize(s).replace(/\s+/g, "");

// 한글 '자모'만: ㄱ-ㅎ / ㅏ-ㅣ
export const isJamoOnly = (s: string) =>
  /^[\u3131-\u314E\u314F-\u3163]+$/.test(compact(s));

export const isTooShort = (s: string) => compact(s).length < 2;

/**
 * 1차 필터:
 *  - 너무 짧거나 자모만 → false
 *  - 아래 중 하나라도 만족하면 true
 *    - 한글 2자 이상
 *    - 영문 3자 이상
 *    - 숫자 2자 이상 (우편번호/번지수 등)
 */
export const looksValidAddressQuery = (s?: string) => {
  const c = compact(s);
  if (!c || isTooShort(c) || isJamoOnly(c)) return false;
  return /[가-힣]{2,}/.test(c) || /[A-Za-z]{3,}/.test(c) || /\d{2,}/.test(c);
};
