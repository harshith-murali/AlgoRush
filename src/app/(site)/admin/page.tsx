import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ShieldCheck, Users, Code, Cpu, Award, Settings, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard - Algo-Rush Control Shell",
};

export default async function AdminDashboardPage() {
  // Query live telemetry metrics from Postgres
  const totalUsers = await prisma.user.count();
  const totalPrograms = await prisma.program.count();
  const totalSubmissions = await prisma.submission.count();
  const totalContests = await prisma.contest.count();

  const stats = [
    { label: "REGISTERED_USERS", count: totalUsers, icon: Users, color: "text-emerald-500" },
    { label: "PROBLEMS_IN_DATABASE", count: totalPrograms, icon: Code, color: "text-amber-500" },
    { label: "TOTAL_EXEC_SUBMISSIONS", count: totalSubmissions, icon: Cpu, color: "text-indigo-500" },
    { label: "ACTIVE_COMPETITIVE_CONTESTS", count: totalContests, icon: Award, color: "text-red-500" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 font-mono flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                {s.label}
              </span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {s.count}
              </span>
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded mt-2 overflow-hidden">
                <div className="bg-zinc-300 dark:bg-zinc-800 h-full w-[45%]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Actions & Core Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Administrative Shell Functions */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-150 dark:border-zinc-900 pb-2">
            <Settings className="h-4 w-4 text-amber-500" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-850 dark:text-zinc-250">
              CONSOLE_OPERATIONS_MENU
            </h3>
          </div>

          <div className="flex flex-col gap-3 font-mono text-[11px]">
            <Link
              href="/admin/problems/create"
              className="p-3 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 rounded-md flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-850 dark:text-zinc-350">
                [ADD_NEW_PROBLEM] &gt; Register new coding challenge with sandbox verification suite.
              </span>
              <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/problems"
              className="p-3 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 rounded-md flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-850 dark:text-zinc-350">
                [MANAGE_PROBLEMS] &gt; View and update practice problem lists, test cases, and difficulty indices.
              </span>
              <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/users"
              className="p-3 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 rounded-md flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-850 dark:text-zinc-350">
                [USERS_CONTROL] &gt; Inspect developer profiles, adjust user authentication roles, and update streaks.
              </span>
              <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/analytics"
              className="p-3 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 rounded-md flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-850 dark:text-zinc-350">
                [TELEMETRY_ANALYTICS] &gt; View runtime execution success rates, compiler distributions, and platform stats.
              </span>
              <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Console logs terminal simulation */}
        <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 dark:border-zinc-900 rounded-lg p-5 font-mono text-[10px] text-zinc-400 flex flex-col gap-2 min-h-[300px]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-zinc-500 text-xs select-none">
            <span>TERMINAL_OUTPUT // SYSTEM_SECURITY_DAEMON</span>
            <span className="text-[9px] text-emerald-500 tracking-wider font-bold blink">ONLINE</span>
          </div>
          <p className="text-zinc-500">[LOG_INITTING] system admin control shell authenticated...</p>
          <p className="text-zinc-500">[DB_DAEMON] postgres container: leetcode_db health: ok</p>
          <p className="text-zinc-500">[SANDBOX] judge0 ce API connection status: connected (rapidapi)</p>
          <p className="text-emerald-500/80">[SECURE_SHELL] edge security layer: active</p>
          <p className="text-zinc-500">[TELEMETRY] users logged: {totalUsers} / active streaks synced</p>
          <p className="text-zinc-550 dark:text-zinc-600 mt-auto">[SYSTEM] listening for administrative transactions...</p>
        </div>
      </div>
    </div>
  );
}
