import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FolderKanban, Plus, LayoutGrid } from "lucide-react";
import { ProblemsTable } from "@/components/admin/problems-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Problems — Algo-Rush Control Shell",
};

export default async function ManageProblemsPage() {
  // Fetch all problems with their creator's info
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      difficulty: true,
      tags: true,
      totalSubmissions: true,
      totalAccepted: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
    },
  });

  // Aggregate stats for the header strip
  const totalEasy = programs.filter((p) => p.difficulty === "EASY").length;
  const totalMedium = programs.filter((p) => p.difficulty === "MEDIUM").length;
  const totalHard = programs.filter((p) => p.difficulty === "HARD").length;
  const totalSubmissions = programs.reduce((s, p) => s + p.totalSubmissions, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page header ── */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-amber-500" />
              <h1 className="font-mono text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100">
                // Practice Challenges Registry
              </h1>
            </div>
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider ml-6">
              Manage, filter and edit all registered coding challenges
            </p>
          </div>

          {/* Register button */}
          <Link
            href="/admin/problems/create"
            className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-tight bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md shadow-amber-500/20 select-none whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            Register New Problem
          </Link>
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Problems", value: programs.length, color: "text-zinc-800 dark:text-zinc-100" },
            { label: "Easy", value: totalEasy, color: "text-emerald-500" },
            { label: "Medium", value: totalMedium, color: "text-amber-500" },
            { label: "Hard", value: totalHard, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">{s.label}</span>
              <span className={`font-mono text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <LayoutGrid className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Problem Index
          </span>
          <span className="ml-auto font-mono text-[9px] text-zinc-400">
            {totalSubmissions.toLocaleString()} total submissions
          </span>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            No challenges registered yet.{" "}
            <Link href="/admin/problems/create" className="text-amber-500 hover:underline">
              Create your first problem →
            </Link>
          </div>
        ) : (
          <ProblemsTable problems={programs} />
        )}
      </div>
    </div>
  );
}
