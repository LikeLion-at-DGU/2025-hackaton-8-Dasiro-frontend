// src/shared/onboarding/onboardingGuardLoader.ts
import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ONBOARD_KEY } from "./storage";

/** 최초 진입 시 /onboarding 로 리다이렉트 (허용 경로는 예외) */
export async function onboardingGuardLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 온보딩 페이지 자체/호환 경로는 예외
  const allowList = new Set<string>(["/onboarding", "/onboard"]);
  if (allowList.has(path)) return null;

  // 클라이언트 로컬스토리지 체크
  try {
    const done = localStorage.getItem(ONBOARD_KEY) === "1";
    if (done) return null;
  } catch {
    // 접근 불가 시엔 온보딩으로 유도
  }

  const ret = encodeURIComponent(path + url.search);
  throw redirect(`/onboarding?return=${ret}`);
}
