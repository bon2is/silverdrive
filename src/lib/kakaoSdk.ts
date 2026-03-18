/**
 * Kakao JavaScript SDK 초기화 유틸.
 *
 * 사용 전 준비사항 (최초 1회):
 *  1. https://developers.kakao.com 에서 앱 생성
 *  2. '플랫폼 > 사이트 도메인' 에 https://silverdrive.andxo.com 등록
 *  3. .env.local 에 NEXT_PUBLIC_KAKAO_JS_APP_KEY=xxxxxxxxxxxxxxxx 추가
 *
 * SDK 스크립트는 layout.tsx 의 <Script> 태그로 lazyOnload 로드됩니다.
 */

/* Kakao SDK 전역 타입 선언 (공식 @types 패키지 없음 — 필요 최소 선언) */
declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
      };
    };
  }
}

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareSettings {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoLink;
  };
  buttons: Array<{
    title: string;
    link: KakaoLink;
  }>;
}

export function initKakao(): boolean {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_APP_KEY;
  if (!key || typeof window === "undefined" || !window.Kakao) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return true;
}

export type { KakaoShareSettings };
