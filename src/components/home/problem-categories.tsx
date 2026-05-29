import React from "react";
import { Layers, Type, Link2, GitFork, Network, Zap, RotateCcw, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProblemCategories() {
  const categories = [
    {
      title: "Arrays",
      icon: Layers,
      problemsCount: 142,
      difficulty: "Easy to Hard",
      focus: "Memory Contiguity & Pointers",
      color: "text-amber-500 bg-amber-500/[0.06] border-amber-500/20",
    },
    {
      title: "Strings",
      icon: Type,
      problemsCount: 98,
      difficulty: "Easy to Med",
      focus: "Pattern Matching & Parsing",
      color: "text-orange-500 bg-orange-500/[0.06] border-orange-500/20",
    },
    {
      title: "Linked Lists",
      icon: Link2,
      problemsCount: 54,
      difficulty: "Med to Hard",
      focus: "Reference Manipulation",
      color: "text-amber-500 bg-amber-500/[0.06] border-amber-500/20",
    },
    {
      title: "Trees",
      icon: GitFork,
      problemsCount: 120,
      difficulty: "Med to Hard",
      focus: "Hierarchical Recursion",
      color: "text-orange-500 bg-orange-500/[0.06] border-orange-500/20",
    },
    {
      title: "Graphs",
      icon: Network,
      problemsCount: 110,
      difficulty: "Med to Hard",
      focus: "Traversal & Topological Sort",
      color: "text-amber-500 bg-amber-500/[0.06] border-amber-500/20",
    },
    {
      title: "Dynamic Programming",
      icon: Zap,
      problemsCount: 165,
      difficulty: "Med to Expert",
      focus: "Overlapping Subproblems",
      color: "text-orange-500 bg-orange-500/[0.06] border-orange-500/20",
    },
    {
      title: "Backtracking",
      icon: RotateCcw,
      problemsCount: 48,
      difficulty: "Med to Hard",
      focus: "State Space Search & Pruning",
      color: "text-amber-500 bg-amber-500/[0.06] border-amber-500/20",
    },
    {
      title: "Binary Search",
      icon: Search,
      problemsCount: 65,
      difficulty: "Easy to Hard",
      focus: "Space Reduction Logarithms",
      color: "text-orange-500 bg-orange-500/[0.06] border-orange-500/20",
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans leading-tight">
            Curated Problem Categories
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-medium">
            Isolate specific data structures and cognitive paradigms. Master the conceptual frameworks interviewer committees look for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={`/problems?category=${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-900 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] dark:shadow-none"
              >
                <div>
                  {/* Icon and problems count header */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cat.color} group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-450 dark:text-zinc-550">
                      {cat.problemsCount} problems
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-sm font-bold text-zinc-850 dark:text-zinc-200 font-sans tracking-tight uppercase group-hover:text-amber-500 transition-colors">
                    {cat.title}
                  </h3>

                  {/* Focus area */}
                  <p className="mt-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-500/90 tracking-tight uppercase">
                    {cat.focus}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                  <span>{cat.difficulty}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-450 dark:text-zinc-650 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
