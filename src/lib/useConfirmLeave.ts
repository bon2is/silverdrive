"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * 브라우저 뒤로가기를 가로채 확인 팝업을 표시하는 훅.
 * showConfirm: 팝업 노출 여부
 * confirmLeave: 확인 시 첫 페이지(/)로 이동
 * cancelLeave: 취소 시 팝업 닫기
 */
export function useConfirmLeave() {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // 현재 URL을 history에 한 번 더 쌓아서 뒤로가기를 감지할 수 있게 함
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // 실제 이동은 막고, history를 다시 쌓아 팝업을 띄움
      window.history.pushState(null, "", window.location.href);
      setShowConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const confirmLeave = useCallback(() => {
    window.location.replace("/");
  }, []);

  const cancelLeave = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return { showConfirm, confirmLeave, cancelLeave };
}
