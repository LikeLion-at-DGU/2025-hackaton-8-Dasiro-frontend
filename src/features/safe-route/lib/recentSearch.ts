export type RecentItem = {
  place_name: string;
  address_name: string;
  x: string; // lng
  y: string; // lat
  ts: number; // 저장 시각 (정렬용)
};

const MAX = 8;

export function getRecents(key: string): RecentItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RecentItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRecent(key: string, item: RecentItem) {
  const list = getRecents(key);
  // x,y 기준 dedupe
  const filtered = list.filter((i) => !(i.x === item.x && i.y === item.y));
  filtered.unshift({ ...item, ts: Date.now() });
  localStorage.setItem(key, JSON.stringify(filtered.slice(0, MAX)));
}

export function clearRecents(key: string) {
  localStorage.removeItem(key);
}
