import { useEffect, useRef, useState } from "react";
import * as S from "./DestinationSearch.styles";
import { geocodeAddress } from "@shared/lib/geocodeAddress";

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
  onClose?: () => void;
  onRequestPick?: (label: string) => void;
};

export default function DestinationSearch({
  onSelect,
  placeholder = "도착지 입력",
  open = true,
  onClose,
  onRequestPick,
}: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [visible, setVisible] = useState(open);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    if (!q.trim()) {
      setResults([]);
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
  }, [q, visible]);

  const handleSelect = (p: Place) => {
    onSelect(p);
    handleClose();
  };

  const handleClose = () => {
    setQ("");
    setResults([]);
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const tryUseTyped = async () => {
    const typed = q.trim();
    if (!typed) return;

    const hit = await geocodeAddress(typed).catch(() => null);
    if (hit) {
      onSelect({
        place_name: typed,
        address_name: typed,
        x: String(hit.lng),
        y: String(hit.lat),
      });
      handleClose();
      return;
    }

    onRequestPick?.(typed);
    handleClose();
  };

  return (
    <S.Wrap>
      <S.InputRow>
        <S.Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "Enter" && results.length === 0) tryUseTyped();
          }}
        />
      </S.InputRow>

      {results.length > 0 ? (
        <S.List>
          {results.map((p) => (
            <li key={`${p.x},${p.y}`}>
              <S.ItemButton onClick={() => handleSelect(p)}>
                <S.ItemTitle>{p.place_name}</S.ItemTitle>
                <S.ItemSub>{p.address_name}</S.ItemSub>
              </S.ItemButton>
            </li>
          ))}
        </S.List>
      ) : q.trim() ? (
        <S.List>
          <li>
            <S.ItemButton onClick={tryUseTyped}>
              <S.ItemTitle>“{q.trim()}” 위치 직접 지정</S.ItemTitle>
              <S.ItemSub>
                주소로 인식되지 않으면 입력한 주소를 클릭해 직접 지정해주세요.
              </S.ItemSub>
            </S.ItemButton>
          </li>
        </S.List>
      ) : null}
    </S.Wrap>
  );
}
