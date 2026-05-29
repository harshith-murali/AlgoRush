import React from "react";
import Link from "next/link";
import { AuthBrandPanel } from "./auth-brand-panel";
import { AlgoRushLogo } from "../logo/algo-rush-logo";
import { ArrowLeft } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex bg-zinc-950 font-sans antialiased text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Brand Panel (Left side, only on desktop) */}
      <AuthBrandPanel />

      {/* Auth Card Area (Right side, always visible) */}
      <div className="relative flex w-full flex-col justify-between p-6 md:p-10 lg:w-1/2 bg-zinc-950">
        {/* Header navigation bar */}
        <header className="flex w-full items-center justify-between z-10">
          <div className="lg:hidden">
            <AlgoRushLogo className="h-5" />
          </div>
          <div className="hidden lg:block" />
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </header>

        {/* Content Centered container */}
        <main className="flex flex-1 items-center justify-center py-10 z-10">
          <div className="w-full max-w-[400px] flex flex-col items-center">
            {children}
          </div>
        </main>

        {/* Footer info line */}
        <footer className="text-center text-[10px] text-zinc-600 z-10">
          &copy; {new Date().getFullYear()} Algo-Rush. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
