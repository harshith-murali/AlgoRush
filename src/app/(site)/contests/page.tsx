import React from "react";
import { Trophy, Clock } from "lucide-react";

export const metadata = {
  title: "Contests — AlgoRush",
  description: "Participate in competitive programming contests on AlgoRush.",
};

export default function ContestsPage() {
  return (
    <div className="flex flex-col gap-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-500">
            // Arena Battles
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Coding Contests
        </h1>
        <p className="mt-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider max-w-2xl">
          Compete in real-time, rank up on global boards, and test your engineering limits.
        </p>
      </div>

      {/* Coming Soon Panel */}
      <div className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-sm min-h-[350px]">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 dark:bg-amber-500/10 blur-xl animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-amber-500">
            <Trophy className="h-8 w-8" />
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 select-none shadow-sm mb-4">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Coming Soon</span>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          Contest Arena Under Development
        </h2>
        <p className="text-xs font-mono text-zinc-550 dark:text-zinc-400 max-w-md uppercase tracking-wider leading-relaxed">
          Our global matchmaker, algorithmic rating mechanics, and interactive leaderboard system are being assembled. Get ready to battle soon!
        </p>
      </div>
    </div>
  );
}
