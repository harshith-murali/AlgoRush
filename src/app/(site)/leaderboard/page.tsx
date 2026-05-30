import React from "react";
import { Users, Clock } from "lucide-react";

export const metadata = {
  title: "Leaderboard — AlgoRush",
  description: "View global rankings and top performers on AlgoRush.",
};

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-amber-500" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-500">
            // Global Standings
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Rankings Leaderboard
        </h1>
        <p className="mt-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider max-w-2xl">
          Top-tier programmers, solve ratios, streak achievements, and total challenge metrics.
        </p>
      </div>

      {/* Coming Soon Panel */}
      <div className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-sm min-h-[350px]">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 dark:bg-amber-500/10 blur-xl animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-amber-500">
            <Users className="h-8 w-8" />
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 select-none shadow-sm mb-4">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Coming Soon</span>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          Leaderboards Calculating
        </h2>
        <p className="text-xs font-mono text-zinc-550 dark:text-zinc-400 max-w-md uppercase tracking-wider leading-relaxed">
          The rankings engine is being calibrated to aggregate Elo points, challenge runtimes, and streaks. Check back soon to secure your place!
        </p>
      </div>
    </div>
  );
}
