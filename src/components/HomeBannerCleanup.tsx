"use client";

import { useEffect } from "react";
import { removeBanner } from "@/lib/useAdMob";

/** 홈으로 돌아올 때 테스트 흐름에서 남은 AdMob 배너를 제거한다. */
export function HomeBannerCleanup() {
  useEffect(() => { removeBanner(); }, []);
  return null;
}
