import { useEffect, useRef, useState } from "react";
import * as S from "./DestinationSearch.styles";
import { geocodeAddress } from "@shared/lib/geocodeAddress";
import { addRecent, clearRecents, getRecents } from "../lib/recentSearch";

export type Place = {
  place_name: string;
  x: string; // lng
  y: string; // lat
  address_name: string;
};

type Props = {
  onSelect: (p: Place) => void;
  placeholder?: string;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onRequestPick?: (label: string) => void;
  storageKey?: string; // 최근 검색 저장 키
};

export default function DestinationSearch({
  onSelect,
  placeholder = "도착지 입력",
  open = true,
  onOpen,
  onClose,
  onRequestPick,
  storageKey = "safe-route:recent-dest",
}: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [visible, setVisible] = useState(open);

  const [recents, setRecents] = useState(() => getRecents(storageKey));
  const [isFocused, setIsFocused] = useState(false);

  const timer = useRef<number | null>(null);
  const [sdkReady, setSdkReady] = useState(
    !!(window as any).kakao?.maps?.services?.Places
  );

  // SDK 준비 대기
  useEffect(() => {
    if (sdkReady) return;
    const t = setInterval(() => {
      if ((window as any).kakao?.maps?.services?.Places) {
        setSdkReady(true);
        clearInterval(t);
      }
    }, 50);
    return () => clearInterval(t);
  }, [sdkReady]);

  // open 변경 시 표시/초기화
  useEffect(() => {
    if (!open) {
      setVisible(false);
      setIsFocused(false);
    } else {
      setVisible(true);
      onOpen?.();
    }
  }, [open, onOpen]);

  // 디바운스 검색
  useEffect(() => {
    if (!visible || !isFocused) return;
    if (!q.trim()) {
      setResults([]);
      setRecents(getRecents(storageKey));
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const kakao = (window as any).kakao;
      if (!kakao?.maps?.services?.Places) return;
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(q, (data: Place[], status: string) => {
        if (status === kakao.maps.services.Status.OK) setResults(data);
        else setResults([]);
      });
    }, 300);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q, visible, sdkReady, storageKey]);

  const handleSelect = (p: Place) => {
    // 최근 저장
    addRecent(storageKey, {
      place_name: p.place_name,
      address_name: p.address_name,
      x: p.x,
      y: p.y,
      ts: Date.now(),
    });
    setRecents(getRecents(storageKey));
    onSelect(p);
    handleClose();
  };

  const handleClose = () => {
    setQ("");
    setResults([]);
    setVisible(false);
    setIsFocused(false);
    onClose?.();
  };

  const tryUseTyped = async () => {
    const typed = q.trim();
    if (!typed) return;

    const hit = await geocodeAddress(typed).catch(() => null);
    if (hit) {
      const p: Place = {
        place_name: typed,
        address_name: typed,
        x: String(hit.lng),
        y: String(hit.lat),
      };
      handleSelect(p); //
      return;
    }

    onRequestPick?.(typed);
    handleClose();
  };

  if (!visible) return null;

  const showRecents = isFocused && !q.trim() && recents.length > 0;

  return (
    <S.Wrap>
      <S.InputRow>
        <S.Input
          value={q}
          onFocus={() => {
            setIsFocused(true);
            onOpen?.();
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 120);
          }}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "Enter" && results.length === 0) {
              e.preventDefault();
              tryUseTyped();
            }
          }}
        />
        {showRecents && (
          <S.ClearBtn
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              clearRecents(storageKey);
              setRecents([]);
            }}
            aria-label="최근 검색 비우기"
            title="최근 검색 비우기"
          />
        )}
      </S.InputRow>

      {/* 검색 결과 */}
      {isFocused && results.length > 0 && (
        <S.List onMouseDown={(e) => e.preventDefault()}>
          <S.RecentsHeader>최근 검색</S.RecentsHeader>
          {results.map((p) => (
            <li key={`${p.x},${p.y}`}>
              <S.ItemButton onClick={() => handleSelect(p)}>
                <S.ItemTitle>{p.place_name}</S.ItemTitle>
                <S.ItemSub>{p.address_name}</S.ItemSub>
              </S.ItemButton>
            </li>
          ))}
        </S.List>
      )}

      {showRecents && (
        <S.List onMouseDown={(e) => e.preventDefault()}>
          {recents.map((r) => (
            <li key={`${r.x},${r.y},${r.ts}`}>
              <S.ItemButton
                onClick={() =>
                  handleSelect({
                    place_name: r.place_name,
                    address_name: r.address_name,
                    x: r.x,
                    y: r.y,
                  })
                }
              >
                <S.ItemTitle>{r.place_name}</S.ItemTitle>
                <S.ItemSub>{r.address_name}</S.ItemSub>
              </S.ItemButton>
            </li>
          ))}
        </S.List>
      )}

      {q.trim() && results.length === 0 && (
        <S.List>
          <li>
            <S.ItemButton onClick={tryUseTyped}>
              <S.ItemTitle>“{q.trim()}” 위치 직접 지정</S.ItemTitle>
            </S.ItemButton>
          </li>
        </S.List>
      )}
    </S.Wrap>
  );
}
