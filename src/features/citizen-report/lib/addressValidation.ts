// 주소/키워드 유효성 검사 관련 유틸

export const sanitize = (s?: string) => (s ?? "").trim();
export const compact = (s?: string) => sanitize(s).replace(/\s+/g, "");

export const isJamoOnly = (s: string) =>
  /^[\u3131-\u314E\u314F-\u3163]+$/.test(compact(s));

export const isTooShort = (s: string) => compact(s).length < 3;

export const looksValidAddressQuery = (s?: string) => {
  const c = compact(s);
  if (!c || isTooShort(c) || isJamoOnly(c)) return false;

  // - 한글 2자 이상 (ex: "서울", "청구역")
  // - 영문 3자 이상 (ex: "Seoul", "Gangnam")
  return /[가-힣]{2,}/.test(c) || /[A-Za-z]{3,}/.test(c);
};
