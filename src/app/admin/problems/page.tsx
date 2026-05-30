import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Difficulty } from "@/generated/prisma";
import { FolderKanban, Plus, Code, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Problems - Algo-Rush Control Shell",
};

export default async function ManageProblemsPage() {
  // Query all practice problems from PostgreSQL
  const programs = await prisma.program.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case Difficulty.MEDIUM:
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case Difficulty.HARD:
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-amber-500" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            01-01 // Practice Challenges Registry
          </h3>
        </div>
        <Link
          href="/admin/problems/create"
          className="font-mono text-[10px] font-bold uppercase tracking-tight bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-md select-none"
        >
          <Plus className="h-3.5 w-3.5" /> Register New Problem
        </Link>
      </div>

      {/* Program Table */}
      <div className="overflow-x-auto w-full">
        {programs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg font-mono text-[10px] text-zinc-400">
            NO CHALLENGES REGISTERED IN DATABASE. CLICK ABOVE TO ADD YOUR FIRST PROBLEM.
          </div>
        ) : (
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-900 font-mono text-[10px] text-zinc-500 uppercase font-bold select-none">
                <th className="py-2.5 px-3 w-16">ID</th>
                <th className="py-2.5 px-3">Challenge Title</th>
                <th className="py-2.5 px-3 w-28">Difficulty</th>
                <th className="py-2.5 px-3">Tags</th>
                <th className="py-2.5 px-3 w-28 text-center">Submissions</th>
                <th className="py-2.5 px-3 w-32">Created At</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-755 dark:text-zinc-350">
              {programs.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-150 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-3 font-mono text-[10px] text-zinc-400">
                    #0{p.id}
                  </td>
                  {/* Title */}
                  <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-amber-500 transition-colors">
                    {p.title}
                  </td>
                  {/* Difficulty */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${getDifficultyColor(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  {/* Tags */}
                  <td className="py-3 px-3 flex flex-wrap gap-1 items-center max-w-[280px]">
                    {p.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[8px] font-bold uppercase bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 px-1.5 py-0.2 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  {/* Submissions count */}
                  <td className="py-3 px-3 font-mono text-[10px] text-center text-zinc-800 dark:text-zinc-300">
                    {p.totalSubmissions}
                  </td>
                  {/* Date Created */}
                  <td className="py-3 px-3 font-mono text-[10px] text-zinc-450">
                    {p.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
