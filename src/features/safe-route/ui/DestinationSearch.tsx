import { useEffect, useRef, useState } from "react";

type Place = { place_name: string; x: string; y: string; address_name: string };

export default function DestinationSearch({
  onSelect,
}: {
  onSelect: (p: Place) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const kakao = (window as any).kakao;
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(q, (data: Place[], status: string) => {
        if (status === kakao.maps.services.Status.OK) setResults(data);
        else setResults([]);
      });
    }, 300);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="도착지 입력"
      />
      <ul>
        {results.map((p) => (
          <li key={`${p.x},${p.y}`}>
            <button onClick={() => onSelect(p)}>
              {p.place_name} ({p.address_name})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
