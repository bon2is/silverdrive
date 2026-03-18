"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * 브라우저 뒤로가기를 가로채 확인 팝업을 표시하는 훅.
 *
 * ⚠️ 주의: pushState 시 null 대신 현재 state를 보존해야 함.
 *   null로 덮으면 Next.js App Router의 내부 navigation state가 사라져
 *   다음 라우팅 시 hard reload(전체 새로고침)가 발생하고
 *   Zustand store가 초기화됩니다.
 */
export function useConfirmLeave() {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Next.js의 현재 history.state를 유지하면서 extra entry를 추가
    const savedState = window.history.state;
    window.history.pushState(savedState, "", window.location.href);

    const handlePopState = () => {
      // 뒤로가기가 발생했을 때: 다시 앞으로 push해서 이동을 막음
      // 이때도 history.state(이미 바뀐 이전 상태)를 그대로 보존
      window.history.pushState(window.history.state, "", window.location.href);
      setShowConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const confirmLeave = useCallback(() => {
    // history 스택을 교체해 뒤로가기로 테스트 페이지에 돌아오지 않게 함
    window.location.replace("/");
  }, []);

  const cancelLeave = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return { showConfirm, confirmLeave, cancelLeave };
}
