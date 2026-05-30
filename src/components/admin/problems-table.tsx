"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Difficulty } from "@/generated/prisma";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash2,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProblemRow {
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  totalSubmissions: number;
  totalAccepted: number;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string;
  } | null;
}

type SortField = "id" | "title" | "difficulty" | "totalSubmissions" | "createdAt";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  [Difficulty.EASY]: 0,
  [Difficulty.MEDIUM]: 1,
  [Difficulty.HARD]: 2,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function difficultyBadge(diff: Difficulty) {
  const map: Record<Difficulty, string> = {
    [Difficulty.EASY]: "text-emerald-500 border-emerald-500/30 bg-emerald-500/8",
    [Difficulty.MEDIUM]: "text-amber-500 border-amber-500/30 bg-amber-500/8",
    [Difficulty.HARD]: "text-red-500 border-red-500/30 bg-red-500/8",
  };
  return map[diff] ?? "";
}

function creatorName(user: ProblemRow["user"]) {
  if (!user) return "—";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.username || user.email;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ProblemsTable({ problems }: { problems: ProblemRow[] }) {
  const router = useRouter();

  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "ALL">("ALL");
  const [tagFilter, setTagFilter] = useState("");

  // ── Sort state ──
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ── Pagination state ──
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── All unique tags for filter dropdown ──
  const allTags = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [problems]);

  // ── Filter ──
  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        creatorName(p.user).toLowerCase().includes(q) ||
        String(p.id).includes(q);

      const matchDiff = diffFilter === "ALL" || p.difficulty === diffFilter;
      const matchTag = !tagFilter || p.tags.includes(tagFilter);

      return matchSearch && matchDiff && matchTag;
    });
  }, [problems, search, diffFilter, tagFilter]);

  // ── Sort ──
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
        case "totalSubmissions":
          cmp = a.totalSubmissions - b.totalSubmissions;
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-zinc-500" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-amber-500" />
    ) : (
      <ArrowDown className="h-3 w-3 text-amber-500" />
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDiffFilter("ALL");
    setTagFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || diffFilter !== "ALL" || tagFilter;

  const handleDelete = async (problem: ProblemRow) => {
    const confirmed = window.confirm(
      `Delete "${problem.title}"?\n\nThis will permanently remove the problem and all related test cases, solutions, and submissions.`
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(problem.id);

    try {
      const res = await fetch(`/api/problems/${problem.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete problem");
      }

      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete problem");
    } finally {
      setDeletingId(null);
    }
  };

  const acceptanceRate = (p: ProblemRow) =>
    p.totalSubmissions > 0
      ? Math.round((p.totalAccepted / p.totalSubmissions) * 100)
      : null;

  return (
    <div className="flex flex-col gap-4">
      {deleteError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 font-mono text-[10px] text-red-600 dark:text-red-400">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <input
            id="problems-search"
            type="text"
            placeholder="Search by title, tag, author, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 font-mono text-[11px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all"
          />
        </div>

        {/* Difficulty filter */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
          <select
            id="difficulty-filter"
            value={diffFilter}
            onChange={(e) => { setDiffFilter(e.target.value as Difficulty | "ALL"); setPage(1); }}
            className="pl-7 pr-8 py-2 font-mono text-[11px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all appearance-none cursor-pointer"
          >
            <option value="ALL">All Difficulties</option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.MEDIUM}>Medium</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>
        </div>

        {/* Tag filter */}
        <div className="relative">
          <select
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
            className="pl-3 pr-8 py-2 font-mono text-[11px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 hover:text-red-500 transition-colors px-2 py-2 rounded border border-transparent hover:border-red-500/20 hover:bg-red-500/5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}

        {/* Result count */}
        <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap ml-auto">
          {filtered.length} / {problems.length} results
        </span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto w-full rounded-xl border border-zinc-200 dark:border-zinc-800/80">
        {paginated.length === 0 ? (
          <div className="text-center py-16 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            No problems match the current filters
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 font-mono text-[9px] text-zinc-500 uppercase tracking-widest select-none">
                {/* ID */}
                <th className="py-3 px-4 w-16">
                  <button
                    type="button"
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                  >
                    ID <SortIcon field="id" />
                  </button>
                </th>
                {/* Title */}
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                  >
                    Challenge Title <SortIcon field="title" />
                  </button>
                </th>
                {/* Difficulty */}
                <th className="py-3 px-4 w-28">
                  <button
                    type="button"
                    onClick={() => handleSort("difficulty")}
                    className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                  >
                    Difficulty <SortIcon field="difficulty" />
                  </button>
                </th>
                {/* Tags */}
                <th className="py-3 px-4">Tags</th>
                {/* Created By */}
                <th className="py-3 px-4 w-36">Created By</th>
                {/* Submissions */}
                <th className="py-3 px-4 w-28 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort("totalSubmissions")}
                    className="flex items-center gap-1 mx-auto hover:text-amber-500 transition-colors"
                  >
                    Submissions <SortIcon field="totalSubmissions" />
                  </button>
                </th>
                {/* Date */}
                <th className="py-3 px-4 w-32">
                  <button
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                  >
                    Created <SortIcon field="createdAt" />
                  </button>
                </th>
                {/* Actions */}
                <th className="py-3 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((p, idx) => {
                const rate = acceptanceRate(p);
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-amber-500/[0.02] dark:hover:bg-amber-500/[0.03] transition-colors group ${
                      idx % 2 === 0 ? "" : "bg-zinc-50/30 dark:bg-zinc-900/10"
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-zinc-400 group-hover:text-amber-500/70 transition-colors">
                      #{String(p.id).padStart(3, "0")}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/problems/${p.id}/edit`}
                        className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      >
                        {p.title}
                      </Link>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${difficultyBadge(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {p.tags.slice(0, 4).map((tag, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setTagFilter(tag === tagFilter ? "" : tag); setPage(1); }}
                            className={`font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              tagFilter === tag
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                                : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-amber-500/30 hover:text-amber-500"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                        {p.tags.length > 4 && (
                          <span className="font-mono text-[8px] text-zinc-400 py-0.5">+{p.tags.length - 4}</span>
                        )}
                      </div>
                    </td>

                    {/* Created By */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10px] text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[130px]">
                          {creatorName(p.user)}
                        </span>
                        {p.user?.email && (
                          <span className="font-mono text-[9px] text-zinc-400 truncate max-w-[130px]">
                            {p.user.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Submissions + acceptance rate */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                          {p.totalSubmissions.toLocaleString()}
                        </span>
                        {rate !== null && (
                          <span className={`font-mono text-[9px] ${rate >= 50 ? "text-emerald-500" : "text-red-400"}`}>
                            {rate}% acc
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-zinc-400">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <Link
                          href={`/admin/problems/${p.id}/edit`}
                          title="Edit problem"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-amber-500 hover:border-amber-500 hover:text-white text-zinc-500 transition-all duration-200 group/edit"
                        >
                          <Pencil className="h-3 w-3 transition-transform group-hover/edit:scale-110" />
                        </Link>
                        <button
                          type="button"
                          title="Delete problem"
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-500 hover:border-red-500 hover:text-white text-zinc-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/delete"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 transition-transform group-hover/delete:scale-110" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Page size selector */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
            <span>Rows per page:</span>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Page info */}
          <span className="font-mono text-[10px] text-zinc-400">
            Page {safePage} of {totalPages} &nbsp;·&nbsp; {sorted.length} problems
          </span>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {[
              { icon: ChevronsLeft, action: () => setPage(1), disabled: safePage === 1, label: "First" },
              { icon: ChevronLeft, action: () => setPage((p) => Math.max(1, p - 1)), disabled: safePage === 1, label: "Prev" },
              { icon: ChevronRight, action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: safePage === totalPages, label: "Next" },
              { icon: ChevronsRight, action: () => setPage(totalPages), disabled: safePage === totalPages, label: "Last" },
            ].map(({ icon: Icon, action, disabled, label }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                disabled={disabled}
                aria-label={label}
                className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-amber-500 hover:border-amber-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-50 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-all duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
