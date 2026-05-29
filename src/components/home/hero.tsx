import React from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignUpButton, Show } from "@clerk/nextjs";
import { Terminal, ArrowRight, Play, Trophy } from "lucide-react";

export async function Hero() {
  const user = await currentUser();

  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Premium ambient dotted patterns: prominent in light, highly restrained in dark */}
      <div className="absolute inset-0 opacity-[0.5] dark:opacity-[0.12] bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
        {/* Ranked Live status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs font-semibold font-mono text-zinc-600 dark:text-zinc-400 mb-6 shadow-sm select-none">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>Contest Arena: 1,489 Engineers Online</span>
        </div>

        {/* Big Premium Header */}
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-zinc-900 dark:text-zinc-100 leading-[1.1] font-sans">
          The Competitive Sandbox for<br />
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            Elite Software Engineers.
          </span>
        </h1>

        {/* Tagline */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-medium leading-relaxed">
          Master data structures, trace execution logic, and isolate edge-cases on a lightning-fast LeetCode clone designed for speed, ranked battles, and deep cognitive retention.
        </p>

        {/* Dynamic CTA Area based on Auth State */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              href="/problems"
              className="group flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold font-mono text-zinc-950 hover:bg-amber-400 transition-all select-none shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer"
            >
              <Terminal className="h-4 w-4" />
              <span>Enter Practice Arena</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="group flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold font-mono text-zinc-950 hover:bg-amber-400 transition-all select-none shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer">
                <span>Start Training (Free)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </SignUpButton>
          )}

          <Link
            href="/contests"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 px-6 py-3.5 text-sm font-bold font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all select-none cursor-pointer"
          >
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Join Active Contests</span>
          </Link>
        </div>

        {/* Terminal/Code mockup */}
        <div className="relative mt-16 sm:mt-20 mx-auto max-w-4xl rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 p-1 sm:p-2 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-900 bg-zinc-100/50 dark:bg-zinc-900/60 p-4 font-mono text-xs text-left text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/80 dark:bg-red-500/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 dark:bg-yellow-500/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/80 dark:bg-green-500/40" />
                <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase">optimal_solution.py</span>
              </div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-500">Python 3.12</div>
            </div>
            <div className="space-y-1 overflow-x-auto text-[11px] sm:text-xs">
              <p><span className="text-pink-600 dark:text-pink-400">def</span> <span className="text-blue-600 dark:text-blue-400">subarraySum</span>(nums: list[int], k: int) -&gt; int:</p>
              <p className="pl-4">count, curr_sum = <span className="text-amber-600 dark:text-amber-500">0</span>, <span className="text-amber-600 dark:text-amber-500">0</span></p>
              <p className="pl-4">prefix_sums = &#123;<span className="text-amber-600 dark:text-amber-500">0</span>: <span className="text-amber-600 dark:text-amber-500">1</span>&#125;</p>
              <p className="pl-4">for num in nums:</p>
              <p className="pl-8">curr_sum += num</p>
              <p className="pl-8">if curr_sum - k in prefix_sums:</p>
              <p className="pl-12">count += prefix_sums[curr_sum - k]</p>
              <p className="pl-8">prefix_sums[curr_sum] = prefix_sums.get(curr_sum, <span className="text-amber-600 dark:text-amber-500">0</span>) + <span className="text-amber-600 dark:text-amber-500">1</span></p>
              <p className="pl-4"><span className="text-pink-600 dark:text-pink-400">return</span> count</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
