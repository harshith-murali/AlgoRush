"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StreakStats } from "./streak-stats";
import { SolveCalendar } from "./solve-calendar";
import { SolvedProblemsList } from "./solved-problems-list";
import { Flame, Trophy, Award, Target, User } from "lucide-react";

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

interface ProfileProgressPanelProps {
  trigger: React.ReactNode;
}

export function ProfileProgressPanel({ trigger }: ProfileProgressPanelProps) {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tzOffset] = useState(() => new Date().getTimezoneOffset());
  const [todayStr] = useState(() => new Date().toISOString().split("T")[0]);

  const fetchData = async () => {
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
  };

  return (
    <Sheet onOpenChange={(open) => { if (open) fetchData(); }}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl md:max-w-2xl border-l border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-0 text-zinc-900 dark:text-zinc-100 overflow-y-auto scrollbar-thin"
      >
        <SheetHeader className="p-6 border-b border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center gap-4">
            {isLoaded && user ? (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "User profile"} 
                className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                <User className="h-6 w-6" />
              </div>
            )}
            
            <div>
              <span className="font-mono text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                Developer Profile
              </span>
              <SheetTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                {isLoaded && user ? user.fullName || user.username || "AlgoRush Explorer" : "AlgoRush Coder"}
              </SheetTitle>
              {isLoaded && user?.primaryEmailAddress && (
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                  {user.primaryEmailAddress.emailAddress}
                </span>
              )}
            </div>
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 min-h-[300px] gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="font-mono text-xs text-zinc-450 uppercase tracking-widest">Compiling performance profile...</span>
          </div>
        ) : data ? (
          <div className="p-6 flex flex-col gap-6">
            {/* Stats Dashboard Row */}
            <StreakStats data={data} />

            {/* Contribution Calendar Row */}
            <SolveCalendar tzOffset={tzOffset} />

            {/* Solved Problems Registry */}
            <SolvedProblemsList />
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs uppercase">
            Failed to assemble progress dashboard.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
