import type { Metadata } from "next";

import { MarketingPageLayout } from "@genius-sports/gs-marketing-ui";

import "./globals.css";

export const metadata: Metadata = {
  title: "Genius Sports | Audience Intelligence",
  description: "Audience Intelligence tool for Genius Sports and WPP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MarketingPageLayout className="min-h-screen bg-white text-black">{children}</MarketingPageLayout>
      </body>
    </html>
  );
}
