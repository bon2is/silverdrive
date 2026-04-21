import { Capacitor } from "@capacitor/core";

// Google 공식 테스트 광고 단위 ID (개발/테스트 환경 전용)
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_REWARD_ID = "ca-app-pub-3940256099942544/5354046379";

// 실제 광고 단위 ID (AdMob ID는 APK에 포함되는 공개 값)
const PROD_BANNER_ID = "ca-app-pub-7999144867236526/1385353605";
const PROD_REWARD_ID = "ca-app-pub-7999144867236526/4626607924";

const isNative  = () => Capacitor.isNativePlatform();
const isTesting = () => process.env.NODE_ENV !== "production";

function getBannerId(): string {
  return isTesting() ? TEST_BANNER_ID : PROD_BANNER_ID;
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
  await AdMob.showBanner({
    adId,
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: isTesting(),
  });
}

export async function showCenterBanner(): Promise<void> {
  if (!isNative()) return;
  const adId = getBannerId();
  if (!adId) return;
  const { AdMob, BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
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
  await AdMob.hideBanner();
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
    return !!result;
  } catch {
    return false;
  }
}
