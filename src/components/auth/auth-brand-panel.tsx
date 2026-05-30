import React from "react";
import { AlgoRushLogo } from "@/components/logo/algo-rush-logo";
import { Award, Zap, Code2 } from "lucide-react";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden md:flex w-full md:w-1/2 flex-col justify-between overflow-hidden bg-zinc-100 dark:bg-[#09090b] p-8 lg:p-10 border-r border-zinc-200 dark:border-zinc-900/80 select-none transition-colors duration-300">
      {/* Composed subtle background details */}
      <div className="absolute inset-0 opacity-30 dark:opacity-15 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[80px]" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-600/10 dark:bg-amber-600/5 blur-[80px]" />

      {/* 1. Brand Logo & Headline */}
      <div className="relative z-10">
        <AlgoRushLogo />
        <div className="mt-6">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans leading-tight">
            Sharpen DSA.<br />
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>
          <p className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-500 tracking-wider mt-2">
            // DEVELOPER_ASSERTIONS_ONLINE
          </p>
        </div>
      </div>

      {/* 2. Interactive Mock Terminal */}
      <div className="relative z-10 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/40 p-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 shadow-xl backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-900 pb-2.5 mb-2.5">
          <div className="h-2 w-2 rounded-full bg-red-500/60" />
          <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
          <div className="h-2 w-2 rounded-full bg-green-500/60" />
          <span className="ml-1 text-[9px] text-zinc-500">algo-rush--session=arena</span>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500">// Compiling problem set: &quot;Subarray Sum Equals K&quot;...</p>
          <p className="text-zinc-700 dark:text-zinc-300">$ algorush run --solution=optimal.py</p>
          <p className="text-amber-600 dark:text-amber-500/80">&gt; Executing 100 test cases...</p>
          <p className="text-emerald-600 dark:text-emerald-500 font-bold">&gt; SUCCESS: 100/100 Passed. Runtime: 14ms (Beats 98.7% users)</p>
          <p className="text-zinc-500 mt-1">// Next up: ranked match vs. Competitor #1489</p>
        </div>
      </div>

      {/* 3. Rebalanced Value Highlights */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-amber-600 dark:text-amber-500">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono uppercase tracking-tight">Curated problem tracks</h3>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5">Skip the noise. Hand-crafted patterns designed to trigger structural pattern recognition fast.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-amber-600 dark:text-amber-500">
            <Award className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono uppercase tracking-tight">Contest-level practice</h3>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5">High-fidelity interview simulation with real timers, ranked arenas, and instant feedback.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-amber-600 dark:text-amber-500">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono uppercase tracking-tight">Progress that compounds</h3>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5">Detailed performance analysis highlighting cognitive blindspots and execution metrics.</p>
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="relative z-10 border-t border-zinc-200 dark:border-zinc-900/60 pt-4 font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
        Practice like interviews are tomorrow.
      </div>
    </div>
  );
}
