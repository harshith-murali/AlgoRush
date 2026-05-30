"use client";

import React from "react";
import { Flame, Zap, Code, ShieldCheck, Calendar, Target } from "lucide-react";

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
  const tier = data.xp > 500 ? "Grandmaster" : data.xp > 200 ? "Expert" : "Beginner";

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: 3 quick-stat pills */}
      <div className="grid grid-cols-3 gap-3">
        {/* Current Streak */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col items-center gap-1 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-1">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
            {data.streak.current}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 leading-tight">
            Day Streak
          </span>
        </div>

        {/* Longest Streak */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col items-center gap-1 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 mb-1">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
            {data.streak.longest}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 leading-tight">
            Best Streak
          </span>
        </div>

        {/* Active Days */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col items-center gap-1 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 mb-1">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
            {data.activeDays}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 leading-tight">
            Active Days
          </span>
        </div>
      </div>

      {/* Row 2: XP + Tier card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Experience</p>
            <p className="text-base font-black text-zinc-900 dark:text-zinc-50">{data.xp} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{tier}</span>
        </div>
      </div>

      {/* Row 3: DSA Breakdown */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <Code className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Problems Solved</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">{data.solved.total}</span>
            <span className="text-sm text-zinc-400 dark:text-zinc-500"> / {data.totalProblems.total}</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div
            style={{ width: `${totalRatio}%` }}
            className="h-full bg-gradient-to-r from-violet-500 to-amber-500 rounded-full transition-all duration-700"
          />
        </div>

        {/* Difficulty breakdown */}
        <div className="flex flex-col gap-2.5">
          {/* Easy */}
          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-bold text-emerald-500">Easy</span>
            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${easyRatio}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              />
            </div>
            <span className="w-12 text-right text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
              {data.solved.easy}/{data.totalProblems.easy}
            </span>
          </div>

          {/* Medium */}
          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-bold text-amber-500">Med</span>
            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${mediumRatio}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
              />
            </div>
            <span className="w-12 text-right text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
              {data.solved.medium}/{data.totalProblems.medium}
            </span>
          </div>

          {/* Hard */}
          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-bold text-red-500">Hard</span>
            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${hardRatio}%` }}
                className="h-full bg-red-500 rounded-full transition-all duration-700"
              />
            </div>
            <span className="w-12 text-right text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
              {data.solved.hard}/{data.totalProblems.hard}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
