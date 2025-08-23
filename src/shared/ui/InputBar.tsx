import styled from "styled-components";
import { fonts } from "@shared/styles/fonts";
import { useEffect, useRef, useState } from "react";

export type SendPayload = { text?: string; files?: File[] };

type Props = {
  placeholder?: string;
  onSend?: (payload: SendPayload) => void;
  onPickImage?: () => void;
};

type PreviewItem = { id: string; file: File; url: string };

const MAX_FILES = 3;

export default function InputBar({
  placeholder = "궁금한 사항을 입력해 주세요.",
  onSend,
  onPickImage,
}: Props) {
  const [value, setValue] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (previews.length >= MAX_FILES) {
      // 이미 꽉 찬 상태에서 다시 열려고 하면 안내
      alert(`이미지는 최대 ${MAX_FILES}장까지만 선택할 수 있어요.`);
      return;
    }
    fileRef.current?.click();
  };

  const handleFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    // "처음부터" 4장 이상 선택한 경우: 바로 alert
    if (previews.length === 0 && picked.length > MAX_FILES) {
      alert(`이미지는 최대 ${MAX_FILES}장까지만 선택할 수 있어요.`);
    }

    // 남은 칸만큼만 수용
    const remaining = Math.max(0, MAX_FILES - previews.length);
    const accepted = picked.slice(0, remaining);

    const items = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...items]);

    // 같은 파일 재선택 가능하게 초기화
    e.currentTarget.value = "";
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearPreviews = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  const doSend = () => {
    const text = value.trim();
    const files = previews.map((p) => p.file);

    const hasText = text.length > 0;
    const hasFiles = files.length > 0;

    if (!hasText && !hasFiles) return;

    onSend?.({
      text: hasText ? text : undefined,
      files: hasFiles ? files.slice(0, MAX_FILES) : undefined,
    });

    setValue("");
    clearPreviews();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  };

  return (
    <>
      {previews.length > 0 && (
        <PreviewStrip>
          <ThumbRow>
            {previews.map((p) => (
              <Thumb key={p.id}>
                <img src={p.url} alt="선택한 이미지 미리보기" />
                <RemoveBtn
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={() => removePreview(p.id)}
                >
                  ×
                </RemoveBtn>
              </Thumb>
            ))}
          </ThumbRow>
        </PreviewStrip>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          doSend();
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          style={{ display: "none" }}
        />

        {onPickImage && (
          <IconBtn type="button" aria-label="사진 첨부" onClick={openPicker}>
            <img src="/images/icons/camera.png" alt="" />
          </IconBtn>
        )}

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="send"
        />

        <IconBtn type="submit" aria-label="전송">
          <img src="/images/icons/send.png" alt="" />
        </IconBtn>
      </Form>
    </>
  );
}

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.7rem 0.8rem;
  border-radius: 19.1px;
  background: ${({ theme }) => theme.colors.orange05};
`;

const Input = styled.input`
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  ${fonts.bodyMedium14};
  color: ${({ theme }) => theme.colors.black01};
  &::placeholder {
    opacity: 0.6;
  }
`;

const IconBtn = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  img {
    width: 19px;
    height: 19px;
  }
`;

const PreviewStrip = styled.div`
  padding: 0 0 0.5rem 0;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const Thumb = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  flex: 0 0 auto;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
`;
