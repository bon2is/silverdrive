/**
 * Kakao JavaScript SDK 초기화 유틸.
 *
 * 사용 전 준비사항 (최초 1회):
 *  1. https://developers.kakao.com 에서 앱 생성
 *  2. '플랫폼 > 사이트 도메인' 에 https://silverdrive.andxo.com 등록
 *  3. .env.local 에 NEXT_PUBLIC_KAKAO_JS_APP_KEY=xxxxxxxxxxxxxxxx 추가
 *
 * 카카오 로그인 기능 사용 시 추가 설정:
 *  4. Kakao Developers > 카카오 로그인 > 활성화 ON
 *  5. 동의항목 > profile_nickname 선택 (필수 또는 선택)
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
        sendScrap:   (settings: KakaoScrapSettings)  => void;
      };
      Auth: {
        login: (settings: {
          scope?: string;
          success: (authObj: { access_token: string }) => void;
          fail: (err: unknown) => void;
        }) => void;
        getAccessToken: () => string | null;
      };
      API: {
        request: (settings: {
          url: string;
          success: (res: KakaoUserInfo) => void;
          fail: (err: unknown) => void;
        }) => void;
      };
    };
  }
}

export interface KakaoUserInfo {
  id: number;
  kakao_account?: {
    profile?: { nickname?: string };
  };
  properties?: { nickname?: string };
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
  buttons?: Array<{
    title: string;
    link: KakaoLink;
  }>;
}

interface KakaoScrapSettings {
  requestUrl: string;
  templateArgs?: Record<string, string>;
}

export function initKakao(): boolean {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_APP_KEY;
  if (!key || typeof window === "undefined" || !window.Kakao) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return true;
}

/**
 * 카카오 로그인 팝업을 열고 닉네임을 반환합니다.
 * - 반드시 사용자 클릭 이벤트 핸들러 내에서 호출해야 합니다 (팝업 차단 방지)
 * - Kakao Developers 콘솔에서 "카카오 로그인" 활성화 필요
 * - 실패 시 null 반환 (에러 throw 없음)
 */
export async function loginWithKakaoAndGetNickname(): Promise<string | null> {
  if (typeof window === "undefined" || !window.Kakao) return null;
  if (!window.Kakao.isInitialized()) {
    const ok = initKakao();
    if (!ok) return null;
  }

  return new Promise((resolve) => {
    window.Kakao.Auth.login({
      scope: "profile_nickname",
      success: () => {
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: (res) => {
            const nickname =
              res.kakao_account?.profile?.nickname ??
              res.properties?.nickname ??
              null;
            resolve(nickname);
          },
          fail: () => resolve(null),
        });
      },
      fail: () => resolve(null),
    });
  });
}

export type { KakaoShareSettings, KakaoScrapSettings };
