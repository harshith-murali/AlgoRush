import React from "react";
import { AlgoRushLogo } from "@/components/logo/algo-rush-logo";
import { Terminal, Award, Zap, Code2 } from "lucide-react";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-zinc-950 p-10 lg:flex lg:w-1/2 border-r border-zinc-900">
      {/* Background visual accents */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-600/5 blur-[100px]" />

      {/* Brand Header */}
      <div className="relative z-10">
        <AlgoRushLogo />
        <div className="mt-8 select-none">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans leading-tight">
            Sharpen DSA.<br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Ship faster.</span>
          </h1>
        </div>
      </div>

      {/* Decorative Interactive Mock terminal surface */}
      <div className="relative z-10 my-8 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 font-mono text-xs text-zinc-400 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-zinc-800/80 pb-3 mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] text-zinc-500">algo-rush --session=arena</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-zinc-500">// Compiling problem set: "Subarray Sum Equals K"...</p>
          <p className="text-zinc-300">$ algorush run --solution=optimal.py</p>
          <p className="text-amber-500/90">&gt; Executing 100 test cases...</p>
          <p className="text-emerald-500 font-semibold">&gt; SUCCESS: 100/100 Passed. Runtime: 14ms (Beats 98.7% users)</p>
          <p className="text-zinc-500 mt-2">// Next up: ranked match vs. Competitor #1489</p>
        </div>
      </div>

      {/* Core Selling Points */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-500">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Curated problem tracks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">Skip the noise. Hand-crafted patterns designed to trigger structural pattern recognition fast.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-500">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Contest-level practice</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">High-fidelity interview simulation with real timers, ranked arenas, and instant feedback.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-500">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Progress that compounds</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">Detailed performance analysis highlighting cognitive blindspots and execution metrics.</p>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 border-t border-zinc-900 pt-5">
        <p className="text-xs text-zinc-500">
          Practice like interviews are tomorrow.
        </p>
      </div>
    </div>
  );
}
