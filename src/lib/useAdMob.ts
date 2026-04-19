import { Capacitor } from "@capacitor/core";

// Google 공식 테스트 광고 단위 ID (개발/테스트 환경 전용)
const TEST_BANNER_ID        = "ca-app-pub-3940256099942544/6300978111";
const TEST_INTERSTITIAL_ID  = "ca-app-pub-3940256099942544/1033173712";

const isNative = () => Capacitor.isNativePlatform();
const isTesting = () => process.env.NODE_ENV !== "production";

function getBannerId(): string {
  return isTesting()
    ? TEST_BANNER_ID
    : (process.env.NEXT_PUBLIC_ADMOB_BANNER_ID ?? "");
}

function getInterstitialId(): string {
  return isTesting()
    ? TEST_INTERSTITIAL_ID
    : (process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID ?? "");
}

export async function initAdMob(): Promise<void> {
  if (!isNative()) return;
  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.initialize({ testingDevices: [] });
}

export async function showBottomBanner(): Promise<void> {
  if (!isNative()) return;
  const adId = getBannerId();
  if (!adId) return;
  const { AdMob, BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
  await AdMob.showBanner({
    adId,
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: isTesting(),
  });
}

export async function hideBanner(): Promise<void> {
  if (!isNative()) return;
  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.hideBanner();
}

// sessionStorage 플래그로 세션당 1회만 전면광고 노출
const INTERSTITIAL_KEY = "admob_interstitial_shown";

export async function showInterstitialOnce(): Promise<void> {
  if (!isNative()) return;
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(INTERSTITIAL_KEY)) return;

  const adId = getInterstitialId();
  if (!adId) return;

  const { AdMob } = await import("@capacitor-community/admob");
  await AdMob.prepareInterstitial({ adId, isTesting: isTesting() });
  await AdMob.showInterstitial();

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(INTERSTITIAL_KEY, "1");
  }
}
