import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { fonts } from "@shared/styles/fonts";
import { isOnboarded, setOnboarded } from "@features/onboarding/lib/storage";

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
  const loc = useLocation();
  const { setFooterHidden } = useOutletContext<LayoutContext>();
  const [idx, setIdx] = useState(0);

  const params = new URLSearchParams(loc.search);
  const returnTo = params.get("return") || DEST_PATH;

  useEffect(() => {
    setFooterHidden(true);
    return () => setFooterHidden(false);
  }, [setFooterHidden]);

  useEffect(() => {
    if (isOnboarded()) nav(returnTo, { replace: true });
  }, [nav, returnTo]);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "recovery",
        hero: "/images/character/character1.png",
        titleLines: [
          <>
            완벽하게 <Accent>복구</Accent>된 우리 <Accent>동네 가게</Accent>,
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
            <Accent>안심</Accent>해도 될까요?
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
  const spotSide = idx % 2 === 0 ? "right" : "left";
  const hasSkip = idx < len - 1;

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(len - 1, i + 1));
  const jump = (i: number) => setIdx(() => Math.max(0, Math.min(len - 1, i)));

  const finish = () => {
    setOnboarded(true);
    nav(returnTo, { replace: true });
  };
  const skip = () => finish();
  const start = () => finish();

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
    <Wrap
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      $spotSide={spotSide}
      $useSpotImg={true}
    >
      <TopBar>
        {hasSkip && (
          <Skip type="button" onClick={skip} aria-label="온보딩 건너뛰기">
            건너뛰기
          </Skip>
        )}
      </TopBar>
      <Dots role="tablist" aria-label="온보딩 진행 표시">
        {slides.map((s, i) => (
          <Dot
            key={s.id}
            $active={i === idx}
            role="tab"
            aria-selected={i === idx}
            aria-controls={`slide-${s.id}`}
            tabIndex={0}
            onClick={() => jump(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") jump(i);
            }}
          />
        ))}
      </Dots>
      <Content>
        {slides.map((s, i) => (
          <SlidePane
            id={`slide-${s.id}`}
            key={s.id}
            $active={i === idx}
            $last={i === len - 1}
            aria-hidden={i !== idx}
          >
            <TitleBox>
              {s.titleLines.map((line, j) => (
                <TitleLine key={j}>{line}</TitleLine>
              ))}
            </TitleBox>

            <HeroBox $imgW={s.imgW} $imgH={s.imgH} $boxH={s.heroBoxH}>
              <HeroInner>
                <img
                  src={s.hero}
                  alt=""
                  width={s.imgW}
                  height={s.imgH}
                  decoding="async"
                />
              </HeroInner>
              <ArrowLayer aria-hidden>
                {idx > 0 && (
                  <NavBtnLeft
                    aria-label="이전"
                    onClick={goPrev}
                    style={{ pointerEvents: "auto" }}
                  >
                    <Chevron>
                      <img src="/images/icons/arrow-left.svg" />
                    </Chevron>
                  </NavBtnLeft>
                )}
                {idx < len - 1 && (
                  <NavBtnRight
                    aria-label="다음"
                    onClick={goNext}
                    style={{ pointerEvents: "auto" }}
                  >
                    <Chevron>
                      <img src="/images/icons/arrow-right.svg" />
                    </Chevron>
                  </NavBtnRight>
                )}
              </ArrowLayer>
            </HeroBox>

            <DescBox $last={i === len - 1}>
              {s.descLines.map((line, j) => (
                <DescP key={j}>{line}</DescP>
              ))}
            </DescBox>

            <BottomRow $last={i === len - 1}>
              {i === len - 1 ? <CTA onClick={start}>시작하기</CTA> : null}
            </BottomRow>
          </SlidePane>
        ))}
      </Content>
    </Wrap>
  );
}

/* ============ styles ============ */

const Wrap = styled.section<{
  $spotSide: "left" | "right";
  $useSpotImg?: boolean;
}>`
  position: relative;
  display: grid;
  grid-template-rows: calc(24px + max(6px, env(safe-area-inset-top))) 14px 1fr;
  row-gap: 1.5rem;
  padding: 1rem 1.5rem calc(1rem + env(safe-area-inset-bottom));
  min-height: 100vh;
  height: 100vh;
  @supports (height: 100dvh) {
    min-height: 100dvh;
    height: 100dvh;
  }
  @supports (height: 100svh) {
    min-height: 100svh;
    height: 100svh;
  }

  background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.16) 0%,
      rgba(255, 255, 255, 0) 38%
    ),
    linear-gradient(
      0deg,
      rgba(255, 163, 112, 0.06) 0%,
      rgba(255, 163, 112, 0) 80%
    );
  background-repeat: no-repeat;

  ${({ $useSpotImg, $spotSide }) =>
    $useSpotImg &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: url("/images/icons/${$spotSide === "left"
            ? "left"
            : "right"}-circle.png")
          no-repeat;
        background-position: ${$spotSide === "left"
          ? "left 0% top 11rem"
          : "right 0% top 7rem"};
        background-size: 15rem;
        z-index: 0;
      }
    `}
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: calc(var(--topbar-h) + var(--topbar-pad));
  padding-top: var(--topbar-pad);
`;

const Skip = styled.button`
  height: var(--topbar-h);
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.black03};
  ${fonts.bodySemiB14};
  cursor: pointer;
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--dots-h);
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.orange01};
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transition: opacity 0.2s;
  border: 0;
  padding: 0;
  cursor: pointer;
`;

const Content = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const SlidePane = styled.article<{ $active: boolean; $last: boolean }>`
  position: absolute;
  display: grid;
  gap: 12px;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: translateX(${({ $active }) => ($active ? "0" : "8px")});
  transition: opacity 180ms ease, transform 180ms ease;
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

  margin-top: 0.75rem;
  margin-bottom: 0.25rem;

  height: ${({ $boxH }) =>
    $boxH ? `${$boxH}px` : "clamp(150px, 30vh, 200px)"};

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

const DescBox = styled.div<{ $last?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  margin-top: ${({ $last }) => ($last ? "2rem" : "3rem")};
`;

const DescP = styled.p`
  ${fonts.bodySemiB14};
  color: ${({ theme }) => theme.colors.black02};
  margin: 0;

  @media (max-width: 360px) {
    ${fonts.capSemi12};
  }
`;

const BottomRow = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ $last }) => ($last ? "1rem" : "3rem")};
  width: 100%;
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

/* ▼▼ 화살표 전용: 나머지 스타일 건드리지 마세요 ▼▼ */

/* 버튼 공통 스타일(포지션 X) */
const navBtnBase = css`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #ffffffb3;
  border: 0;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  pointer-events: auto;
`;

const ArrowLayer = styled.div`
  position: fixed;
  display: grid;
  width: 100%;
  max-width: 400px;
  height: 100%;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`;

const NavBtnLeft = styled.button`
  ${navBtnBase};
  grid-column: 1;
  justify-self: start;
`;

const NavBtnRight = styled.button`
  ${navBtnBase};
  grid-column: 3;
  justify-self: end;
`;

const Chevron = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.black02};
`;
