import React from "react";
import Link from "next/link";
import { AuthBrandPanel } from "./auth-brand-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-5xl border border-zinc-200 dark:border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40 flex flex-col md:flex-row min-h-[560px] relative bg-white dark:bg-[#09090b]">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/5 blur-[50px] pointer-events-none select-none" />

        {/* Left: Brand Panel */}
        <AuthBrandPanel />

        {/* Right: Form Panel */}
        <div className="w-full md:w-1/2 min-w-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-white dark:bg-[#09090b] relative z-10 transition-colors duration-300">

          {/* Top nav bar */}
          <header className="flex w-full items-center justify-between z-10 font-mono text-[9px] uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4 select-none">
            <span className="font-bold text-zinc-400 dark:text-zinc-500">// ALGORUSH_SECURE_ONBOARD</span>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/"
                className="group flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </Link>
            </div>
          </header>

          {/* Form content */}
          <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 z-10 w-full min-w-0">
            <div className="w-full min-w-0 max-w-full flex flex-col items-stretch">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center font-mono text-[8px] text-zinc-400 dark:text-zinc-600 z-10 uppercase tracking-widest border-t border-zinc-100 dark:border-zinc-900/50 pt-3 select-none">
            &copy; {new Date().getFullYear()} Algo-Rush. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
