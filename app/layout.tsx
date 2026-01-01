import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아프지마 (afzma) - AI 의료 안내",
  description: "증상을 입력하면 어느 병원에 가야 할지 알려주는 AI 의료 안내 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body>
        <main className="layout-main">{children}</main>
        <footer className="disclaimer-footer">
          이 결과는 AI의 조언이며 실제 의사의 진단과 다를 수 있습니다.
          응급 상황 시 즉시 119를 호출하세요.
        </footer>
      </body>
    </html>
  );
}
