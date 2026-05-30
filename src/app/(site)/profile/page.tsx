"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreakStats } from "@/components/profile/streak-stats";
import { SolveCalendar } from "@/components/profile/solve-calendar";
import { SolvedProblemsList } from "@/components/profile/solved-problems-list";
import { User, Terminal } from "lucide-react";

interface ProgressData {
  xp: number;
  streak: {
    current: number;
    longest: number;
  };
  solved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  totalProblems: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  activeDays: number;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tzOffset] = useState(() => new Date().getTimezoneOffset());
  const [todayStr] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        const res = await fetch(`/api/me/progress?tzOffset=${tzOffset}&today=${todayStr}`);
        if (!res.ok) throw new Error("Failed to fetch progress statistics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading progress statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [tzOffset, todayStr]);

  return (
    <div className="flex flex-col gap-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {/* Profile Header Panel */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {isLoaded && user ? (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "User profile"} 
                className="h-16 w-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                <User className="h-8 w-8" />
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Terminal className="h-4 w-4 text-amber-500" />
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-500">
                  // Developer Summary
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {isLoaded && user ? user.fullName || user.username || "AlgoRush Explorer" : "AlgoRush Coder"}
              </h1>
              {isLoaded && user?.primaryEmailAddress && (
                <p className="mt-1 font-mono text-[11px] text-zinc-450 uppercase tracking-wider">
                  Registry: {user.primaryEmailAddress.emailAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-12 flex flex-col items-center justify-center min-h-[300px] gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-450 uppercase tracking-widest">Compiling performance profile...</span>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-6">
          {/* Dynamic Stats Row */}
          <StreakStats data={data} />

          {/* Activity Heatmap Calendar */}
          <SolveCalendar tzOffset={tzOffset} />

          {/* Solved Problems Registry */}
          <SolvedProblemsList />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 p-12 text-center text-zinc-500 font-mono text-xs uppercase">
          Failed to assemble progress dashboard.
        </div>
      )}
    </div>
  );
}
