import type { ReactNode } from "react";

import { MarketingPageLayout } from "@genius-sports/gs-marketing-ui";

import { Header } from "@/components/layout/Header";

type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <MarketingPageLayout className="min-h-screen bg-white text-black">
      <Header />
      <div className="grid min-h-[calc(100vh-76px)] grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white">{sidebar}</aside>
        <main className="overflow-x-auto p-6">{children}</main>
      </div>
    </MarketingPageLayout>
  );
}
