import React from "react";
import Link from "next/link";
import { AuthBrandPanel } from "./auth-brand-panel";
import { ArrowLeft } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-[#09090b]/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[560px] relative">
        {/* Subtle glowing mask behind the split card */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/5 blur-[50px] pointer-events-none select-none" />

        {/* 1. Left Side: Brand Panel */}
        <AuthBrandPanel />

        {/* 2. Right Side: Auth Form Workspace Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-white dark:bg-[#09090b]/80 relative z-10 transition-colors duration-300">
          
          {/* Header navigation bar */}
          <header className="flex w-full items-center justify-between z-10 font-mono text-[9px] uppercase tracking-wide border-b border-zinc-200 dark:border-zinc-900 pb-3 mb-4 select-none">
            <span className="font-bold text-zinc-550 dark:text-zinc-500">// ALGORUSH_SECURE_ONBOARD</span>
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-zinc-650 dark:text-zinc-400 hover:text-amber-500 transition-colors"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </Link>
          </header>

          {/* Form Content Wrapper */}
          <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 z-10 w-full">
            <div className="w-full max-w-[360px] flex flex-col items-center">
              {children}
            </div>
          </main>

          {/* Footer info line */}
          <footer className="text-center font-mono text-[8px] text-zinc-550 dark:text-zinc-600 z-10 uppercase tracking-widest border-t border-zinc-200 dark:border-zinc-900/50 pt-3 select-none">
            &copy; {new Date().getFullYear()} Algo-Rush. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
