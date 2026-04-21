import { Capacitor } from "@capacitor/core";

// Google 공식 테스트 광고 단위 ID (개발/테스트 환경 전용)
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_REWARD_ID = "ca-app-pub-3940256099942544/5354046379";

// 실제 광고 단위 ID
const PROD_BANNER_ID       = "ca-app-pub-7999144867236526/1385353605";
const PROD_REWARD_ID       = "ca-app-pub-7999144867236526/4626607924";
const PROD_MIDDLE_WAIT_ID  = "ca-app-pub-7999144867236526/2000726421";

const isNative  = () => Capacitor.isNativePlatform();
const isTesting = () => process.env.NODE_ENV !== "production";

function getBannerId(): string {
  return isTesting() ? TEST_BANNER_ID : PROD_BANNER_ID;
}

function getMiddleWaitId(): string {
  return isTesting() ? TEST_BANNER_ID : PROD_MIDDLE_WAIT_ID;
}

function getRewardId(): string {
  return isTesting() ? TEST_REWARD_ID : PROD_REWARD_ID;
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
  // Destroy any existing banner first so showBanner() always creates a fresh view
  // (the plugin calls updateExistingAdView() when mAdView != null, skipping position/size)
  try { await AdMob.removeBanner(); } catch { /* no existing banner */ }
  await AdMob.showBanner({
    adId,
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: isTesting(),
  });
}

export async function showCenterBanner(): Promise<void> {
  if (!isNative()) return;
  const adId = getMiddleWaitId();
  if (!adId) return;
  const { AdMob, BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
  // Destroy any existing banner first — this also resolves the race condition where
  // the previous page's removeBanner() cleanup and this showBanner() run concurrently
  try { await AdMob.removeBanner(); } catch { /* no existing banner */ }
  await AdMob.showBanner({
    adId,
    adSize: BannerAdSize.MEDIUM_RECTANGLE,
    position: BannerAdPosition.CENTER,
    isTesting: isTesting(),
  });
}

export async function hideBanner(): Promise<void> {
  if (!isNative()) return;
  const { AdMob } = await import("@capacitor-community/admob");
  try { await AdMob.hideBanner(); } catch { /* no banner to hide */ }
}

export async function removeBanner(): Promise<void> {
  if (!isNative()) return;
  const { AdMob } = await import("@capacitor-community/admob");
  try { await AdMob.removeBanner(); } catch { /* no banner to remove */ }
}

// 사용자가 직접 클릭해서 시청하는 리워드 광고
export async function showRewardAd(): Promise<boolean> {
  if (!isNative()) return false;
  const adId = getRewardId();
  if (!adId) return false;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareRewardVideoAd({ adId, isTesting: isTesting() });
    const result = await AdMob.showRewardVideoAd();
    // 광고 닫힌 후 네이티브 UI 정리 시간 확보 (즉시 navigation 시 앱 종료 방지)
    await new Promise(resolve => setTimeout(resolve, 500));
    return !!result;
  } catch {
    return false;
  }
}
