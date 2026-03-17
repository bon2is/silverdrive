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

export const metadata: Metadata = {
  title: "실버드라이브 - 고령자 운전 적성검사 연습",
  description:
    "75세 이상 고령 운전자를 위한 인지능력 자가진단 연습 서비스. 실제 검사와 유사한 반응 속도, 표지판 식별, 위험 지각 테스트를 제공합니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "실버드라이브",
  },
  formatDetection: { telephone: false },
  icons: { apple: "/icons/icon-192x192.svg" },
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
