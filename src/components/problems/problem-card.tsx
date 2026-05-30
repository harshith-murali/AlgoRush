import { Difficulty } from "@/generated/prisma";
import { DIFFICULTY_STYLES } from "@/lib/problems/utils";
import type { ProblemListItem } from "@/types/problem";
import Link from "next/link";
import { ArrowRight, ThumbsUp } from "lucide-react";

interface ProblemCardProps {
  problem: ProblemListItem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.id}`}
      className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-[10px] text-zinc-400">
              #{String(problem.id).padStart(3, "0")}
            </span>
            <span
              className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[problem.difficulty]}`}
            >
              {problem.difficulty}
            </span>
          </div>
          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
            {problem.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center gap-4 font-mono text-[10px] text-zinc-500">
        <span>
          {problem.acceptanceRate !== null ? `${problem.acceptanceRate}% acc` : "— acc"}
        </span>
        <span>{problem.totalSubmissions.toLocaleString()} subs</span>
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          {problem.likes}
        </span>
      </div>
    </Link>
  );
}

interface DifficultyFilterProps {
  value: Difficulty | "ALL";
  onChange: (value: Difficulty | "ALL") => void;
}

export function DifficultyFilter({ value, onChange }: DifficultyFilterProps) {
  const options: Array<{ label: string; value: Difficulty | "ALL" }> = [
    { label: "All", value: "ALL" },
    { label: "Easy", value: Difficulty.EASY },
    { label: "Medium", value: Difficulty.MEDIUM },
    { label: "Hard", value: Difficulty.HARD },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`font-mono text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-colors ${
            value === opt.value
              ? "bg-amber-500 border-amber-500 text-zinc-950"
              : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-amber-500/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
