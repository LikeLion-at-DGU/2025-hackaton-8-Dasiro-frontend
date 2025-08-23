export const extractDong = (raw: string): string | null => {
  const t = (raw ?? "").trim();
  if (!t) return null;
  const endMatch = t.match(/([가-힣0-9]+동)\s*$/);
  if (endMatch) return endMatch[1];
  const parts = t.split(/\s+/);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^[가-힣0-9]+동$/.test(parts[i])) return parts[i];
  }
  return null;
};
