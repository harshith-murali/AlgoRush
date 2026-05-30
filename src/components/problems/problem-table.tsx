"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Difficulty } from "@/generated/prisma";
import { DIFFICULTY_STYLES } from "@/lib/problems/utils";
import type { ProblemListItem } from "@/types/problem";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortField = "id" | "title" | "difficulty" | "acceptanceRate";
type SortDir = "asc" | "desc";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  [Difficulty.EASY]: 0,
  [Difficulty.MEDIUM]: 1,
  [Difficulty.HARD]: 2,
};

interface ProblemTableProps {
  problems: ProblemListItem[];
}

export function ProblemTable({ problems }: ProblemTableProps) {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "ALL">("ALL");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        String(p.id).includes(q);
      const matchDiff = diffFilter === "ALL" || p.difficulty === diffFilter;
      return matchSearch && matchDiff;
    });
  }, [problems, search, diffFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "id":
          cmp = a.id - b.id;
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "difficulty":
          cmp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
          break;
        case "acceptanceRate":
          cmp = (a.acceptanceRate ?? -1) - (b.acceptanceRate ?? -1);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-zinc-400" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-amber-500" />
    ) : (
      <ArrowDown className="h-3 w-3 text-amber-500" />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, tags, or ID..."
            className="w-full pl-10 pr-4 py-2.5 font-mono text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as const).map(
            (d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiffFilter(d)}
                className={`font-mono text-[10px] font-bold uppercase px-3 py-2 rounded-lg border transition-colors ${
                  diffFilter === d
                    ? "bg-amber-500 border-amber-500 text-zinc-950"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-amber-500/40"
                }`}
              >
                {d === "ALL" ? "All" : d}
              </button>
            )
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              <th className="py-3 px-4 w-16">
                <button type="button" onClick={() => handleSort("id")} className="inline-flex items-center gap-1 hover:text-amber-500">
                  # <SortIcon field="id" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button type="button" onClick={() => handleSort("title")} className="inline-flex items-center gap-1 hover:text-amber-500">
                  Title <SortIcon field="title" />
                </button>
              </th>
              <th className="py-3 px-4 w-28">
                <button type="button" onClick={() => handleSort("difficulty")} className="inline-flex items-center gap-1 hover:text-amber-500">
                  Diff <SortIcon field="difficulty" />
                </button>
              </th>
              <th className="py-3 px-4 hidden md:table-cell">Tags</th>
              <th className="py-3 px-4 w-24 text-center">
                <button type="button" onClick={() => handleSort("acceptanceRate")} className="inline-flex items-center gap-1 mx-auto hover:text-amber-500">
                  Acc <SortIcon field="acceptanceRate" />
                </button>
              </th>
              <th className="py-3 px-4 w-20 text-center hidden sm:table-cell">Likes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <tr
                key={p.id}
                className={`border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-amber-500/[0.03] transition-colors ${
                  idx % 2 === 1 ? "bg-zinc-50/30 dark:bg-zinc-900/10" : ""
                }`}
              >
                <td className="py-3.5 px-4 font-mono text-[10px] text-zinc-400">
                  {String(p.id).padStart(3, "0")}
                </td>
                <td className="py-3.5 px-4">
                  <Link
                    href={`/problems/${p.id}`}
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="font-mono text-[8px] uppercase px-1.5 py-0.5 rounded border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                  {p.acceptanceRate !== null ? `${p.acceptanceRate}%` : "—"}
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-[11px] text-zinc-500 hidden sm:table-cell">
                  {p.likes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="py-16 text-center font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            No problems match your filters
          </div>
        )}
      </div>

      <p className="font-mono text-[10px] text-zinc-400 text-right">
        Showing {sorted.length} of {problems.length} problems
      </p>
    </div>
  );
}
