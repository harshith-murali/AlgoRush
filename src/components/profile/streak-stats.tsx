"use client";

import React from "react";
import { Flame, Trophy, Award, Zap, Code, ShieldCheck } from "lucide-react";

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

interface StreakStatsProps {
  data: ProgressData;
}

export function StreakStats({ data }: StreakStatsProps) {
  const easyRatio = data.totalProblems.easy > 0 ? (data.solved.easy / data.totalProblems.easy) * 100 : 0;
  const mediumRatio = data.totalProblems.medium > 0 ? (data.solved.medium / data.totalProblems.medium) * 100 : 0;
  const hardRatio = data.totalProblems.hard > 0 ? (data.solved.hard / data.totalProblems.hard) * 100 : 0;
  const totalRatio = data.totalProblems.total > 0 ? (data.solved.total / data.totalProblems.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Core Gamification Summary */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between min-h-[180px] shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">
              Active Streak
            </span>
            <h3 className="text-2xl font-black font-sans tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
              {data.streak.current} Day{data.streak.current !== 1 ? "s" : ""}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/10">
            <Flame className="h-5 w-5 fill-orange-500/20" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-between text-xs font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Longest Streak</span>
            <span className="text-zinc-700 dark:text-zinc-350 font-bold">{data.streak.longest} Day{data.streak.longest !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Active Days</span>
            <span className="text-zinc-700 dark:text-zinc-350 font-bold">{data.activeDays} Day{data.activeDays !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* 2. Platform XP Metrics */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between min-h-[180px] shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
              Experience Level
            </span>
            <h3 className="text-2xl font-black font-sans tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
              {data.xp} XP
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
            <Zap className="h-5 w-5 fill-amber-500/20" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-between text-xs font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Coder Tier</span>
            <span className="text-zinc-750 dark:text-zinc-350 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>{data.xp > 500 ? "Grandmaster" : data.xp > 200 ? "Expert" : "Beginner"}</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Solved Ratio</span>
            <span className="text-zinc-700 dark:text-zinc-350 font-bold">{Math.round(totalRatio)}%</span>
          </div>
        </div>
      </div>

      {/* 3. DSA Target Breakdown */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between min-h-[180px] shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="font-mono text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
              DSA Challenges
            </span>
            <h3 className="text-lg font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
              {data.solved.total} / {data.totalProblems.total} Solved
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/10">
            <Code className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Difficulty Bars */}
        <div className="flex flex-col gap-2.5 mt-2">
          {/* Easy */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-emerald-500">Easy</span>
              <span className="text-zinc-400 dark:text-zinc-550">{data.solved.easy} / {data.totalProblems.easy}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                style={{ width: `${easyRatio}%` }} 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              />
            </div>
          </div>

          {/* Medium */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-amber-500">Medium</span>
              <span className="text-zinc-400 dark:text-zinc-550">{data.solved.medium} / {data.totalProblems.medium}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                style={{ width: `${mediumRatio}%` }} 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              />
            </div>
          </div>

          {/* Hard */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-red-500">Hard</span>
              <span className="text-zinc-400 dark:text-zinc-550">{data.solved.hard} / {data.totalProblems.hard}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                style={{ width: `${hardRatio}%` }} 
                className="h-full bg-red-500 rounded-full transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
