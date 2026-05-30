"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Terminal, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolvedProblem {
  id: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  solvedAt: string;
}

export function SolvedProblemsList() {
  const [solved, setSolved] = useState<SolvedProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSolved() {
      try {
        const res = await fetch("/api/me/solved-problems");
        if (!res.ok) throw new Error("Failed to fetch solved problems");
        const data = await res.json();
        setSolved(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchSolved();
  }, []);

  const difficultyColors = {
    EASY: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    HARD: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-450 uppercase tracking-widest">Loading solved problems...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 text-center text-red-500 min-h-[150px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Info className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wide">Error loading solved problems</span>
        </div>
      </div>
    );
  }

  if (solved.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-950/10 p-12 text-center flex flex-col items-center justify-center min-h-[220px]">
        <Terminal className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mb-4" />
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase font-mono tracking-tight mb-1">
          No Solves Recorded
        </h3>
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider max-w-sm">
          Head over to the problems arena and submit an accepted solution to list your achievements here!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="h-4.5 w-4.5 text-amber-500" />
        <h2 className="text-sm font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
          Solved Problems Registry
        </h2>
      </div>

      <div className="divide-y divide-zinc-150 dark:divide-zinc-900">
        {solved.map((sp) => (
          <Link
            key={sp.id}
            href={`/problems/${sp.id}`}
            className="flex items-center justify-between py-3.5 group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 px-2 -mx-2 rounded-xl transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 group-hover:text-amber-500 transition-colors">
                  {sp.title}
                </span>
                <span className={cn(
                  "text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border self-start sm:self-auto",
                  difficultyColors[sp.difficulty]
                )}>
                  {sp.difficulty}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                {new Date(sp.solvedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-650 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
