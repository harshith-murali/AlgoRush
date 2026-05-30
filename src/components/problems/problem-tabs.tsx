"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Clock3, FileText, Send } from "lucide-react";
import type React from "react";

export type ProblemInfoTab = "description" | "editorial" | "solutions" | "submissions";

const tabs: Array<{
  value: ProblemInfoTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "description", label: "Description", icon: BookOpen },
  { value: "editorial", label: "Editorial", icon: FileText },
  { value: "solutions", label: "Solutions", icon: Send },
  { value: "submissions", label: "Submissions", icon: Clock3 },
];

interface ProblemTabsProps {
  activeTab: ProblemInfoTab;
  onChange: (tab: ProblemInfoTab) => void;
}

export function ProblemTabs({ activeTab, onChange }: ProblemTabsProps) {
  return (
    <div className="border-b border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-1 overflow-x-auto rounded-md border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900/40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors",
              active
                ? "bg-zinc-950 text-white shadow-sm dark:bg-amber-500 dark:text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
