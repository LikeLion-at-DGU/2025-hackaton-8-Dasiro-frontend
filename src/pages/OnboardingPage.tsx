import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fonts } from "@shared/styles/fonts";

type LayoutContext = { setFooterHidden: (v: boolean) => void };

type Slide = {
  id: string;
  hero: string;
  titleLines: React.ReactNode[];
  descLines: string[];
  heroBoxH?: number;
  imgW?: number;
  imgH?: number;
};

const DEST_PATH = "/";

export default function OnboardingPage() {
  const nav = useNavigate();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "recovery",
        hero: "/images/character/character1.png",
        titleLines: [
          <>
            완벽하게 <Accent>복구된</Accent> 우리 <Accent>동네 가게</Accent>,
          </>,
          <>오늘은 여기 어때요?</>,
        ],
        descLines: [
          "복구를 마친 우리 동네 가게들을 한눈에 확인할 수 있어요.",
          "가까운 곳부터 둘러보고, 따뜻한 소비로 응원해보세요!",
        ],
        imgH: 193,
        imgW: 180,
      },
      {
        id: "map",
        hero: "/images/character/character2.png",
        titleLines: [
          <>지금 걷고 있는 이 길,</>,
          <>
            <Accent>안심해도</Accent> 될까요?
          </>,
        ],
        descLines: [
          "최근 발생한 싱크홀 위치를 지도로 쉽게 확인할 수 있어요.",
          "우리 동네의 위험 요소를 한 눈에 살펴보세요!",
        ],
        imgH: 260,
        imgW: 190,
      },
      {
        id: "saferoute",
        hero: "/images/character/character3.png",
        titleLines: [
          <>
            <Accent>위험한 길</Accent>은 피해가요.
          </>,
          <>
            <Accent>안전한 길</Accent>을 안내해 드릴게요!
          </>,
        ],
        descLines: [
          "싱크홀을 피해 안전하게 이동할 수 있는 경로를 안내해요.",
          "일상 속 불안을 줄이고, 안심 도로를 함께 걸어요!",
        ],
        imgH: 196,
        imgW: 233,
      },
      {
        id: "report",
        hero: "/images/character/character4.png",
        titleLines: [
          <>
            혹시 방금 <Accent>위험</Accent>해보였나요?
          </>,
          <>
            <Accent>사진 한 장</Accent>이면 충분해요!
          </>,
        ],
        descLines: [
          "싱크홀 위험 요소 및 전조 증상을 직접 제보할 수 있어요.",
          "작은 제보가 우리 동네를 더욱 안전하게 만들어요!",
        ],
        imgH: 196,
        imgW: 163,
      },
    ],
    []
  );

  const len = slides.length;
  const hasSkip = idx < len - 1;

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(len - 1, i + 1));
  const skip = () => nav(DEST_PATH);
  const start = () => nav(DEST_PATH);

  // swipe
  const startX = useRef<number | null>(null);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <Wrap onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {hasSkip && (
        <Skip type="button" onClick={skip}>
          건너뛰기
        </Skip>
      )}

      <Dots $hasSkip={hasSkip}>
        {slides.map((s, i) => (
          <Dot key={s.id} $active={i === idx} />
        ))}
      </Dots>

      <Stage>
        {slides.map((s, i) => (
          <SlidePane key={s.id} $active={i === idx} aria-hidden={i !== idx}>
            <TitleBox>
              {s.titleLines.map((line, j) => (
                <TitleLine key={j}>{line}</TitleLine>
              ))}
            </TitleBox>

            <HeroBox $imgW={s.imgW} $imgH={s.imgH} $boxH={s.heroBoxH}>
              <HeroInner>
                <img src={s.hero} alt="" />
              </HeroInner>
            </HeroBox>

            <DescBox>
              {s.descLines.map((line, j) => (
                <DescP key={j}>{line}</DescP>
              ))}
            </DescBox>
          </SlidePane>
        ))}
      </Stage>

      {idx > 0 && (
        <NavBtnLeft aria-label="이전" onClick={goPrev}>
          <Chevron>{"‹"}</Chevron>
        </NavBtnLeft>
      )}
      {idx < len - 1 && (
        <NavBtnRight aria-label="다음" onClick={goNext}>
          <Chevron>{"›"}</Chevron>
        </NavBtnRight>
      )}

      <Bottom>
        {idx === len - 1 ? <CTA onClick={start}>시작하기</CTA> : null}
      </Bottom>
    </Wrap>
  );
}

/* ============ styles ============ */

const Wrap = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  min-height: 100dvh;
  background: radial-gradient(
      45% 35% at 82% 72%,
      rgba(255, 163, 112, 0.28) 0%,
      rgba(255, 163, 112, 0) 65%
    ),
    radial-gradient(
      35% 28% at 18% 20%,
      rgba(255, 200, 170, 0.18) 0%,
      rgba(255, 200, 170, 0) 60%
    ),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.orange05} 0%,
      #ffffff 100%
    );

  box-shadow: 0 0 68.277px rgba(163, 113, 71, 0.08);
`;

const Skip = styled.button`
  display: flex;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.black03};
  ${fonts.bodySemiB14};
  cursor: pointer;
`;

const Dots = styled.div<{ $hasSkip: boolean }>`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: ${({ $hasSkip }) => ($hasSkip ? "1rem" : "0.25rem")};
  margin-bottom: 1.25rem;
`;

const Dot = styled.span<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.orange01};
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transition: opacity 0.2s;
`;

const Stage = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const SlidePane = styled.article<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  display: grid;
  align-content: start;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: translateX(${({ $active }) => ($active ? "0" : "8px")});
  transition: opacity 180ms ease, transform 180ms ease;
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
`;

const TitleLine = styled.h2`
  ${fonts.titleBold20};
  color: ${({ theme }) => theme.colors.black01};
  margin: 0;
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.colors.orange01};
`;

const HeroBox = styled.div<{ $imgW?: number; $imgH?: number; $boxH?: number }>`
  display: grid;
  place-items: center;

  margin-top: 2rem;
  margin-bottom: 1rem;

  height: ${({ $boxH }) =>
    $boxH ? `${$boxH}px` : "clamp(160px, 26vh, 200px)"};

  img {
    max-height: 100%;
    max-width: ${({ $imgW }) => ($imgW ? `${$imgW}px` : "min(72%, 196px)")};
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const HeroInner = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
`;

const DescBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  text-align: center;
  margin-top: 4rem;
`;

const DescP = styled.p`
  ${fonts.bodySemiB14};
  color: ${({ theme }) => theme.colors.black02};
  margin: 0;
`;

const navBtnBase = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #ffffffb3;
  border: 0;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
`;
const NavBtnLeft = styled.button`
  ${navBtnBase};
  left: 6px;
`;
const NavBtnRight = styled.button`
  ${navBtnBase};
  right: 6px;
`;
const Chevron = styled.span`
  font-size: 20px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black02};
`;

const Bottom = styled.footer`
  position: absolute;
  display: flex;
  top: 31rem;
  width: 85%;
`;
const CTA = styled.button`
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 14px 16px;
  ${fonts.subExtra16};
  background: ${({ theme }) => theme.colors.orange01};
  color: ${({ theme }) => theme.colors.black07};
  cursor: pointer;
`;
