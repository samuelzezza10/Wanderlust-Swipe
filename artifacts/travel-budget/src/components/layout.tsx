import { Show } from "@clerk/react";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { CookieBanner } from "./cookie-banner";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative pb-16 md:pb-0">
      <Show when="signed-in">
        <DesktopNav />
      </Show>
      
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto md:px-8">
        {children}
      </main>
      
      <Show when="signed-in">
        <MobileNav />
      </Show>
      
      <CookieBanner />
    </div>
  );
}
