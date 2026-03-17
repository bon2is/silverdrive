import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

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
    "운전면허 갱� 연습", "노인 운전면허", "적성검사 자가진단",
    "실버드라이브", "운전 인지능력", "고령자 운전 테스트",
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
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "실버드라이브" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "실버드라이브 - 운전면허 갱신 인지능력검사 무료 연습",
    description: "75세 이상 면허 갱신 대상자를 위한 무료 자가진단 연습 서비스",
    images: ["/opengraph-image.png"],
  },
  alternates: { canonical: BASE_URL },
};

export const viewport: Viewport = {
  themeColor: "#f5c518",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="antialiased">
        <PwaRegister />
        {children}

        {/* Auto Ads (앵커·전면광고) 비활성화 — adsbygoogle.js 로드 전에 실행 */}
        {adsenseClient && (
          <Script src="/ads-config.js" strategy="beforeInteractive" />
        )}

        {/* AdSense 스크립트 — layout에서 1회만 로드 */}
        {adsenseClient && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
