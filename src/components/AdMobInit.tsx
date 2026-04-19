"use client";

import { useEffect } from "react";
import { initAdMob } from "@/lib/useAdMob";

export function AdMobInit() {
  useEffect(() => {
    initAdMob();
  }, []);
  return null;
}
