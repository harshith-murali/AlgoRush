"use client";

import { useEffect, useState } from "react";
import { Difficulty } from "@/generated/prisma";
import { ProblemCard, DifficultyFilter } from "@/components/problems/problem-card";
import { ProblemTable } from "@/components/problems/problem-table";
import type { ProblemListItem, ProblemsListResponse } from "@/types/problem";
import { AlertCircle, LayoutGrid, List, Loader2, Terminal } from "lucide-react";

type ViewMode = "table" | "grid";

export function ProblemsListClient() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("table");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "ALL">("ALL");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/problems", { cache: "no-store" });
        const data = (await res.json()) as ProblemsListResponse & { error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to load problems");
        if (!cancelled) setProblems(data.problems);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load problems");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const gridProblems =
    diffFilter === "ALL"
      ? problems
      : problems.filter((p) => p.difficulty === diffFilter);

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === Difficulty.EASY).length,
    medium: problems.filter((p) => p.difficulty === Difficulty.MEDIUM).length,
    hard: problems.filter((p) => p.difficulty === Difficulty.HARD).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
          Loading problem set...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-xl border border-red-500/20 bg-red-500/5">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="font-mono text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <Terminal className="h-8 w-8 text-zinc-400" />
        <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
          No problems published yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-zinc-900 dark:text-zinc-100" },
          { label: "Easy", value: stats.easy, color: "text-emerald-500" },
          { label: "Medium", value: stats.medium, color: "text-amber-500" },
          { label: "Hard", value: stats.hard, color: "text-red-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
              {s.label}
            </span>
            <p className={`font-mono text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {view === "grid" && <DifficultyFilter value={diffFilter} onChange={setDiffFilter} />}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase px-3 py-2 rounded-lg border transition-colors ${
              view === "table"
                ? "bg-amber-500 border-amber-500 text-zinc-950"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase px-3 py-2 rounded-lg border transition-colors ${
              view === "grid"
                ? "bg-amber-500 border-amber-500 text-zinc-950"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </button>
        </div>
      </div>

      {view === "table" ? (
        <ProblemTable problems={problems} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {gridProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
