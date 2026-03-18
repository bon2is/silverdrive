/**
 * 현재 실행 환경이 카카오톡 인앱 웹뷰인지 판별합니다.
 * UA 문자열에 'KAKAOTALK' 이 포함돼 있으면 카톡 내장 브라우저입니다.
 */
export function isKakaoWebview(): boolean {
  if (typeof navigator === "undefined") return false;
  return /KAKAOTALK/i.test(navigator.userAgent);
}
