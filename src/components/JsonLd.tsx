// JSON-LD 구조화 데이터 컴포넌트
// dangerouslySetInnerHTML 사용: 모든 데이터가 하드코딩된 정적 상수이며
// 사용자 입력이 전혀 포함되지 않으므로 XSS 위험 없음. (JSON-LD 표준 삽입 방식)

const BASE_URL = "https://silverdrive.andxo.com";

// 정적 JSON-LD 문자열 — 빌드 타임 상수
const WEB_APP_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "실버드라이브",
  url: BASE_URL,
  description:
    "75세 이상 운전면허 갱신 대상자를 위한 인지능력검사(적성검사) 무료 연습 서비스. 기억력·주의력·반응속도·표지판 식별·위험 지각 5가지 검사를 실제 시험과 동일한 방식으로 연습할 수 있습니다.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  inLanguage: "ko-KR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  audience: {
    "@type": "Audience",
    audienceType: "고령 운전자, 75세 이상 운전면허 갱신 대상자",
  },
  featureList: [
    "기억력 검사", "주의력 검사 (선 잇기)",
    "신호 반응 검사", "교통 표지판 식별 검사", "위험 지각 검사",
  ],
});

const FAQ_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "75세 운전면허 갱신 적성검사란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "만 75세 이상 운전자는 운전면허를 갱신할 때 인지능력 적성검사를 받아야 합니다. 기억력, 주의력, 반응속도, 교통 표지판 식별, 위험 지각 등 5가지 항목을 검사합니다. 실버드라이브에서 실제 시험과 동일한 방식으로 무료 연습이 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "실버드라이브 검사는 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 실버드라이브의 모든 검사는 완전 무료입니다. 회원가입 없이 바로 이용하실 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 검사 항목이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기억력 검사, 주의력 검사(선 잇기), 신호 반응 검사, 교통 표지판 식별 검사, 위험 지각 검사 등 5가지 항목이 있습니다. 실제 도로교통공단 적성검사와 동일한 구성입니다.",
      },
    },
    {
      "@type": "Question",
      name: "스마트폰에서도 이용할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 스마트폰·태블릿·PC 모든 기기에서 이용 가능합니다. 어르신들을 위해 글자 크기와 버튼을 크게 설계하였습니다.",
      },
    },
  ],
});

const WEBSITE_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "실버드라이브",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export function JsonLd() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger -- 정적 하드코딩 데이터, XSS 위험 없음 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEB_APP_LD }} />
      {/* eslint-disable-next-line react/no-danger -- 정적 하드코딩 데이터, XSS 위험 없음 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_LD }} />
      {/* eslint-disable-next-line react/no-danger -- 정적 하드코딩 데이터, XSS 위험 없음 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_LD }} />
    </>
  );
}
