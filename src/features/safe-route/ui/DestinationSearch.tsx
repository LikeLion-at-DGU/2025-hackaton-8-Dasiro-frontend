import { useEffect, useRef, useState } from "react";
import * as S from "./DestinationSearch.styles";
import { geocodeAddress } from "@features/safe-route/lib/geocodeAddress";
import { addRecent, getRecents } from "../lib/recentSearch";
import { createPortal } from "react-dom";

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
  storageKey?: string;
  anchorEl?: HTMLElement | null;
};

export default function DestinationSearch({
  onSelect,
  placeholder = "도착지 입력",
  open = true,
  onOpen,
  onClose,
  onRequestPick,
  storageKey = "safe-route:recent-dest",
  anchorEl,
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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [floatingStyle, setFloatingStyle] = useState<React.CSSProperties>({});

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

  // open 토글
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
      handleSelect({
        place_name: typed,
        address_name: typed,
        x: String(hit.lng),
        y: String(hit.lat),
      });
      return;
    }
    onRequestPick?.(typed);
    handleClose();
  };

  if (!visible) return null;

  const showRecents = isFocused && !q.trim() && recents.length > 0;

  const recalc = () => {
    if (!anchorEl || !inputRef.current) return;
    const cardRect = anchorEl.getBoundingClientRect();
    const inputRect = inputRef.current.getBoundingClientRect();
    setFloatingStyle({
      position: "fixed",
      left: cardRect.left,
      width: cardRect.width,
      top: inputRect.bottom + 6,
      zIndex: 1000,
    });
  };

  useEffect(() => {
    if (isFocused && anchorEl && inputRef.current) recalc();
  }, [isFocused, anchorEl]);

  useEffect(() => {
    if (!isFocused) return;
    const onWin = () => recalc();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [isFocused]);

  return (
    <>
      <S.Wrap>
        <S.InputRow>
          <S.Input
            ref={inputRef}
            value={q}
            onFocus={() => {
              setIsFocused(true);
              onOpen?.();
              recalc();
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
        </S.InputRow>
      </S.Wrap>

      {isFocused &&
        (results.length > 0 ||
          showRecents ||
          (q.trim() && results.length === 0)) &&
        createPortal(
          <div style={floatingStyle} onMouseDown={(e) => e.preventDefault()}>
            {results.length > 0 && (
              <S.List>
                {results.map((p) => (
                  <li key={`${p.x},${p.y}`}>
                    <S.ItemButton onClick={() => handleSelect(p)}>
                      <S.ItemTop>
                        <S.ItemIcon>
                          <img
                            src="src/shared/assets/icons/location-pin.png"
                            alt="위치 아이콘"
                            width={12}
                            height={16}
                          />
                        </S.ItemIcon>
                        <S.ItemTitle>{p.place_name}</S.ItemTitle>
                      </S.ItemTop>
                      <S.ItemSub>{p.address_name}</S.ItemSub>
                    </S.ItemButton>
                  </li>
                ))}
              </S.List>
            )}

            {showRecents && (
              <>
                <S.List>
                  <S.RecentsHeader>최근 검색</S.RecentsHeader>
                  {recents.map((r) => (
                    <li key={`${r.x},${r.y},${r.ts}`}>
                      <S.ItemButton>
                        <S.ItemContent
                          onClick={() =>
                            handleSelect({
                              place_name: r.place_name,
                              address_name: r.address_name,
                              x: r.x,
                              y: r.y,
                            })
                          }
                        >
                          <S.ItemTop>
                            <S.ItemIcon>
                              <img
                                src="src/shared/assets/icons/location-pin.png"
                                alt="최근 검색 아이콘"
                                width={12}
                                height={16}
                              />
                            </S.ItemIcon>
                            <S.ItemTitle>{r.place_name}</S.ItemTitle>
                          </S.ItemTop>
                          <S.ItemSub>{r.address_name}</S.ItemSub>
                        </S.ItemContent>

                        <S.RemoveBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = recents.filter(
                              (item) => item.ts !== r.ts
                            );
                            localStorage.setItem(
                              storageKey,
                              JSON.stringify(updated)
                            );
                            setRecents(updated);
                          }}
                        >
                          ×
                        </S.RemoveBtn>
                      </S.ItemButton>
                    </li>
                  ))}
                </S.List>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
