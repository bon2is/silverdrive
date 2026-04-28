import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { JsonLd } from "@/components/JsonLd";
import { AdMobInit } from "@/components/AdMobInit";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const BASE_URL = "https://silverdrive.andxo.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "실버드라이브 - 75세 운전면허 갱신 인지능력검사 무료 연습",
    template: "%s | 실버드라이브",
  },
  description:
    "75세 운전면허 갱신 걱정되시나요? 실제 적성검사와 동일한 기억력·주의력·반응속도·표지판·위험지각 5가지 검사를 무료로 연습하세요. 부모님께 보내드리세요.",
  keywords: [
    "75세 운전면허 갱신", "고령 운전자 적성검사", "인지능력검사 연습",
    "운전면허 갱신 연습", "노인 운전면허", "적성검사 자가진단",
    "실버드라이브", "운전 인지능력", "고령자 운전 테스트",
    "75세 적성검사", "운전면허 갱신 테스트", "고령자 인지검사",
    "운전 적성검사 연습", "면허 갱신 준비", "노인 인지능력 검사",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "실버드라이브",
  },
  formatDetection: { telephone: false },
  icons: { apple: "/icons/icon-192x192.svg" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "실버드라이브",
    title: "실버드라이브 - 75세 운전면허 갱신 인지능력검사 무료 연습",
    description:
      "실제 적성검사와 동일한 5가지 인지능력 검사를 무료로 연습하세요. 부모님께 보내드리세요.",
    images: [{ url: "/share-image.png", width: 1200, height: 630, alt: "실버드라이브" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "실버드라이브 - 운전면허 갱신 인지능력검사 무료 연습",
    description: "75세 이상 면허 갱신 대상자를 위한 무료 자가진단 연습 서비스",
    images: ["/share-image.png"],
  },
  alternates: { canonical: BASE_URL },
  // 검색엔진 인증 메타태그 — 각 Search Console에서 발급받은 코드를 환경변수에 입력
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f5c518",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="antialiased">
        <PwaRegister />
        <JsonLd />
        <AdMobInit />
        <Analytics />
        {children}

        {/* Google Analytics 4 — NEXT_PUBLIC_GA_ID 없으면 비로드, SPA 라우트도 추적 */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

        {/* AdSense 스크립트는 광고가 있는 페이지(AdBanner)에서만 개별 로드 */}
        {/* Kakao SDK는 ShareButton 컴포넌트에서 afterInteractive로 직접 로드 */}
      </body>
    </html>
  );
}
